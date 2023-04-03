from server import app
from server.dao import user_maintenance, category_maintenance, budget
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

# カテゴリとユーザーの一覧取得
@app.route('/category_and_user_select', methods=['POST'])
def category_and_user_select():
  category_list = category_maintenance.select_mf()
  user_list = user_maintenance.select_mf()
  
  return {'category': category_list, 'user': user_list}

# 予算管理
@app.route('/budget_insert', methods=['POST'])
def budget_insert():
  rd = json.loads(request.data)
  budget.insert_budget(rd['forms'])

  table_data = budget.select_budget(rd['forms'][0]['year'], rd['forms'][0]['month'])

  return {'data': table_data}

@app.route('/budget_init', methods=['POST'])
def budget_init():
  rd = json.loads(request.data)
  budget_list = budget.select_budget(rd['year'], rd['month'])
  category_list = category_maintenance.select_mf()
  user_list = user_maintenance.select_mf()

  return {'budget': budget_list, 'category': category_list, 'user': user_list}