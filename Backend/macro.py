import oledump
import sys
import optparse
import json

from io import StringIO 

#provides oledump options
options = optparse.Values()
options.__dict__.update({'man': False, 'select': '', 'dump': False, 'hexdump': False, 'asciidump': False, 'asciidumprle': False, 
           'strings': False, 'headtail': False, 'vbadecompress': False, 'vbadecompressskipattributes': False, 
           'vbadecompresscorrupt': False, 'raw': False, 'translate': '', 'extract': False, 'info': False, 
           'plugins': '', 'pluginoptions': '', 'plugindir': '', 'quiet': False, 'yara': None, 'decoders': '', 
           'decoderoptions': '', 'decoderdir': '', 'yarastrings': False, 'metadata': False, 'calc': False, 
           'decompress': False, 'verbose': False, 'cut': '', 'extra': '', 'storages': False, 
           'find': '', 'jsonoutput': False, 'unuseddata': False, 'password': 'infected'})

#code from stackoverflow to capture stdout of function
class Capturing(list):
    def __enter__(self):
        self._stdout = sys.stdout
        sys.stdout = self._stringio = StringIO()
        return self
    def __exit__(self, *args):
        self.extend(self._stringio.getvalue().splitlines())
        del self._stringio   
        sys.stdout = self._stdout

def ScanMacro(filename):
    #macro json object returned to backend
    macro_json = {}

    #initial parsing of file and checks for streams
    with Capturing() as output:
        oledump.OLEDump(filename, options)
    #print(output)
    
    #checks if is a macro file
    if "is not a valid OLE file." in output[0]:
        print("Not a office document!")
        response = {"code":0, "message": "Not a office document!"}
        return response
    else:
        macros = []

        #looks for Macros and saves the stream number if found 
        for stream_num in range(len(output)):
            split = output[stream_num].split(" ")
            if len(split) > 3 and split[2] == "M":
                macros.append(stream_num)

        #exits if no macros found
        if len(macros) == 0:
            print("No Macros Detected!")
            response = {"code":1, "message": "No Macros Detected!"}
            return response

        macro_json["num_macros"] = str(len(macros))

        print("Number of Macros: " + str(len(macros)))
        print("-------------------------------------")

        #iterates through streams with Macros and outputs its contents
        for macro in range(len(macros)):
            #utilizes OLEDump function again but with updated options to parse specific streams
            options.__dict__.update({'select': str(macros[macro]), 'vbadecompress': True})
            with Capturing() as output:
                oledump.OLEDump(filename, options)
            print("Macro number " + str(macro + 1) + ":")
            print("-------------------------------------")

            output[0] = output[0][2:-1].replace('\\n', '\n').replace('\\\'', '\'')

            macro_json["macros_" + str(macro + 1)+ "_content"] = output[0]

            print(output[0])
            print("-------------------------------------")

            #Basic checks for macro safety - detect for program execution, file download, WinAPI calls
            output_lines = output[0].split("\n")

            files = []
            urls = []
            powershell = False
            macro_flags = []

            for line in output_lines:
                line = line.replace("\\\\", "\\")
                #detects win32 api
                if "kernel32" in line or "advapi32" in line:
                    macro_flags.append("Win32 API calls detected")
                    print(line)
                    print("Win32 API calls detected")
                    print("-------------------------------------")

                #detects Urlmon library reference
                if "urlmon" in line:
                    macro_flags.append("Accessing internet functionality using Urlmon")
                    print("Accessing internet functionality using Urlmon")
                    print("-------------------------------------")

                #detects in wscript
                if "wscript.shell" in line.lower():
                    macro_flags.append("Code execution via WScript detected")
                    print("Code execution via WScript detected")
                    print("-------------------------------------")

                #detects VBA script Shell command
                line_split = line.lstrip().split(" ")
                if line_split[0] == "Shell":
                    macro_flags.append("Code execution detected with " + line_split[1] + " being run!")
                    print("Code execution detected with " + line_split[1] + " being run!")
                    print("-------------------------------------")

                line_split = line.replace("\'", "\"").split("\"")
                for section in line_split:
                    #checks for links
                    if "http://" in section or "https://" in section:
                        urls.append(section)
                    #checks for files referenced
                    if "C:\\" in section or "c:\\" in section:
                        files.append(section)
                    if "powershell" in section:
                        powershell = True
                
            print(urls)
            print(files)
            print(powershell)
            print(macro_flags)
            
            macro_json['macro_' + str(macro + 1) +  '_urls'] = urls
            macro_json['macro_' + str(macro + 1) +  '_files'] = files
            macro_json['macro_' + str(macro + 1) +  '_flags'] = macro_flags

            if powershell:
                macro_json['macro_' + str(macro + 1) +  '_powershell'] = "Potential Powershell code executed"
                print("Potential Powershell code executed")
                print("-------------------------------------")
            else:
                macro_json['macro_' + str(macro + 1) +  '_powershell'] = "Potential Powershell code not found"
            
            if len(files) > 0:
                print("Files:")
                print("-------------------------------------")
                for file in files:
                    print(file)
                print()
            
            if len(urls) > 0:
                print("URLS:")
                print("-------------------------------------")
                for url in urls:
                    print(url)
                print()
            response = {"code": 2, "message": "Macros Detected", "output":macro_json}
            return response

if __name__ == '__main__':
    filename = sys.argv[1]
    ScanMacro(filename)
            