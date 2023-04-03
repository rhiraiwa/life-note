from server import app
from server.dao import user_maintenance, category_maintenance
from flask import request, json

@app.route('/')
def index():
  return {'text': 'Hello World'}

# ユーザーマスタメンテナンス
@app.route('/user_select', methods=['POST'])
def user_select():
  table_data = user_maintenance.select_mf()

  return {'data': table_data}

@app.route('/user_insert', methods=['POST'])
def user_insert():
  rd = json.loads(request.data)
  user_maintenance.insert_mf(rd['username'])
  table_data = user_maintenance.select_mf()

  return {'data': table_data}

@app.route('/user_delete', methods=['POST'])
def user_delete():
  rd = json.loads(request.data)
  user_maintenance.delete_mf(rd['usercd'])
  table_data = user_maintenance.select_mf()

  return {'data': table_data}

# カテゴリマスタメンテナンス
@app.route('/category_select', methods=['POST'])
def category_select():
  table_data = category_maintenance.select_mf()

  return {'data': table_data}

@app.route('/category_insert', methods=['POST'])
def category_insert():
  rd = json.loads(request.data)
  category_maintenance.insert_mf(rd['categoryname'])
  table_data = category_maintenance.select_mf()

  return {'data': table_data}

@app.route('/category_delete', methods=['POST'])
def category_delete():
  rd = json.loads(request.data)
  category_maintenance.delete_mf(rd['categorycd'])
  table_data = category_maintenance.select_mf()

  return {'data': table_data}