"""Only allows document upload without any dynamodb functionality"""
from flask_forms import *
from flask import Flask, render_template, request, redirect, url_for
from functools import wraps
from flask import session
from create_database import *
from flask_bootstrap import Bootstrap5
app = Flask(__name__) 

bootstrap = Bootstrap5(app)


@app.route("/")
def index():
    return render_template('homepage.html') 

@app.route("/homepage")
def home_page():
    return render_template('homepage.html') 

@app.route('/logout')
def log_out():
    session.pop('logged_in', None)
    session.pop('username', None)
    session.pop('admin', None)
    session.pop('organization', None)
    return redirect(url_for('home_page'))


@app.route('/fileupload', methods = ['POST'])   
def file_uploaded():   
    if request.method == 'POST':   
        f = request.files['file'] 
        f.save(f.filename)   
        return render_template("give_macros.html", name = f.filename)   
  
if __name__=='__main__': 
   app.secret_key = 'your secret key'
   app.run(port=8080, debug=True) 