from flask import Flask, request
app = Flask(__name__)

@app.after_request
def after_request(response):
  allowed_origins = ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://192.168.2.52:3000']
  origin = request.headers.get('Origin')
  if origin in allowed_origins:
    response.headers.add('Access-Control-Allow-Origin', origin)
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Headers', 'Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response

import server.main