import sys
from unittest import TestCase

sys.path.insert(1, '../Backend/')
from macro import ScanMacro

class TryTesting(TestCase):
    def test_always_passes(self):
        self.assertTrue(True)

    #def test_always_fails(self):
    #    self.assertTrue(False)
    
    def test_ScanMaliciousTest(self):
        json_result = ScanMacro("../Backend/Calculator.docm")
        
        self.assertTrue(json_result["code"] == 2)
        self.assertTrue(json_result["message"] == "Macros Detected")
        self.assertTrue(json_result["output"]["num_macros"] == "1")
        self.assertTrue(len(json_result["output"]["macro_1_flags"]) == 2)

        self.assertTrue(json_result["output"]["macro_1_flags"][0] == "Accessing internet functionality using Urlmon")
        self.assertTrue(json_result["output"]["macro_1_flags"][1] == "Code execution detected with \"C:\\Windows\\System32\\calc.exe\", being run!")

        self.assertTrue(json_result["output"]["macro_1_powershell"] == "Potential Powershell code not found")

        self.assertTrue(json_result["output"]["macro_1_urls"][0] == "https://media.npr.org/assets/img/2023/01/14/this-is-fine_custom-b7c50c845a78f5d7716475a92016d52655ba3115.jpg?s=1100&c=50&f=jpeg")
        self.assertTrue(len(json_result["output"]["macro_1_urls"]) == 1)

        self.assertTrue(len(json_result["output"]["macro_1_files"]) == 2)
        self.assertTrue(json_result["output"]["macro_1_files"][0] == "C:\\Windows\\System32\\calc.exe")
        self.assertTrue(json_result["output"]["macro_1_files"][1] == "C:\\Users\\powal\\Downloads\\emptyfolder\\thisisfine.jpg")

    def test_ScanSafeTest(self):
        json_result = ScanMacro("../Backend/Requirements.txt")
        self.assertTrue(json_result["code"] == 0)
        self.assertTrue(json_result["message"] == "Not a office document!")
    
    def test_ScanSafeOfficeTest(self):
        json_result = ScanMacro("../Backend/test.docx")
        self.assertTrue(json_result["code"] == 1)
        self.assertTrue(json_result["message"] == "No Macros Detected!")

    def test_ScanSafePythonTest(self):
        json_result = ScanMacro("../Backend/Server.py")
        self.assertTrue(json_result["code"] == 0)
        self.assertTrue(json_result["message"] == "Not a office document!")
      
