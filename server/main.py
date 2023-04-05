from server import app
from server.dao import user_maintenance, category_maintenance, budget, home as home_refarance, deposit
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

# 予算の取得
@app.route('/budget_select', methods=['POST'])
def budget_select():
  rd = json.loads(request.data)
  print('=============AAAAAAA========')
  print(rd['user'])
  budget_month = budget.select_sum_month(rd['year'], rd['month'], rd['user'])
  
  return {'budget': budget_month}

# 予算管理
@app.route('/budget_insert', methods=['POST'])
def budget_insert():
  rd = json.loads(request.data)
  budget.insert_budget(rd['forms'])

  table_data = budget.select_budget(rd['forms'][0]['year'], rd['forms'][0]['month'])

  return {'data': table_data}

@app.route('/budget_inherit', methods=['POST'])
def budget_inherit():
  rd = json.loads(request.data)
  budget.inherit_budget(rd['year'], rd['month'])

  table_data = budget.select_budget(rd['year'], rd['month'])

  return {'data': table_data}

@app.route('/budget_init', methods=['POST'])
def budget_init():
  rd = json.loads(request.data)
  budget_list = budget.select_budget(rd['year'], rd['month'])
  sum_list = budget.select_sum(rd['year'], rd['month'])
  # category_list = category_maintenance.select_mf()
  # user_list = user_maintenance.select_mf()

  # return {'budget': budget_list, 'sum': sum_list, 'category': category_list, 'user': user_list}
  return {'budget': budget_list, 'sum': sum_list}

# メイン画面（ホーム）
@app.route('/home', methods=['POST'])
def home():
  rd = json.loads(request.data)
  budget = home_refarance.select_home(rd['year'], rd['month'])

  return {'budget': budget, 'sum': '0', 'category': '0', 'user': '0'}

# 入金入力
@app.route('/deposit_insert', methods=['POST'])
def deposit_insert():
  rd = json.loads(request.data)
  deposit.insert_deposit(rd['year'], rd['month'], rd['date'], rd['category'], rd['user'], rd['amount'])
  # table_data = deposit.select_deposit(rd['year'], rd['month'], rd['user'])

  # return {'data': table_data}
  return {'insert': 'done'}