# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask,jsonify
import json
from RecommendationEngine.RE_debug import Recommend
# Flask constructor takes the name of
# current module (__name__) as argument.
app = Flask(__name__)

# The route() function of the Flask class is a decorator,
# which tells the application which URL should call
# the associated function.

r = Recommend(0.2)


@app.route('/')
# ‘/’ URL is bound with hello_world() function.
def hello_world():
    return 'Hello World'


@app.route('/<userId>')
def recommendUser(userId):
    response = jsonify(r.recommend(userId))
    # Enable Access-Control-Allow-Origin
    response.headers.add("Access-Control-Allow-Origin", "*")
    
    return response


@app.route('/getThreshhold')
def getMin_threshhold():
    return str(r.min_threshold)


@app.route('/setThreshhold/<val>')
def setMin_threshhold(val):
    r.min_threshold = val
    return str(getMin_threshhold())


# main driver function
if __name__ == '__main__':

    # run() method of Flask class runs the application
    # on the local development server.
    app.run()
