from server import app, db_access as db
from flask import request, json

@app.route('/')
def index():
  return {'text': 'Hello World'}

@app.route('/user_select', methods=['POST'])
def user_select():
  table_data = db.select_mf('USER_MF')

  return {'data': table_data}

@app.route('/user_insert', methods=['POST'])
def user_insert():
  rd = json.loads(request.data)
  db.insert_mf('USER_MF', rd['username'])
  table_data = db.select_mf('USER_MF')

  return {'data': table_data}

@app.route('/user_delete', methods=['POST'])
def user_delete():
  rd = json.loads(request.data)
  db.delete_mf('USER_MF', rd['usercd'])
  table_data = db.select_mf('USER_MF')

  return {'data': table_data}