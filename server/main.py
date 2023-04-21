from server import app
from server.dao import user_maintenance, category_maintenance, budget, home as home_refarance, deposit, payment, result, advances_paid
from server.model import camera
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

@app.route('/user_edit', methods=['POST'])
def user_edit():
  rd = json.loads(request.data)
  user_maintenance.edit_mf(rd['cd'], rd['name'])
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

@app.route('/category_edit', methods=['POST'])
def category_edit():
  rd = json.loads(request.data)
  category_maintenance.edit_mf(rd['cd'], rd['name'])
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
  budget_month = budget.select_sum_month(rd['year'], rd['month'], rd['user'])
  
  return {'budget': budget_month}

# 予算管理
@app.route('/budget_insert', methods=['POST'])
def budget_insert():
  rd = json.loads(request.data)
  budget.insert_budget(rd['forms'])

  init_json = budget.budget_init(rd['forms'][0]['year'], rd['forms'][0]['month'])

  return init_json

@app.route('/budget_count_previous_month', methods=['POST'])
def budget_count_previous_month():
  rd = json.loads(request.data)
  count = budget.count_previous_month_budget(rd['year'], rd['month'])

  if count == 0:
    return False
  
  return True

@app.route('/budget_inherit', methods=['POST'])
def budget_inherit():
  rd = json.loads(request.data)
  
  budget.inherit_budget(rd['year'], rd['month'])
  init_json = budget.budget_init(rd['year'], rd['month'])

  return init_json

@app.route('/budget_init', methods=['POST'])
def budget_init():
  rd = json.loads(request.data)
  init_json = budget.budget_init(rd['year'], rd['month'])

  return init_json

# メイン画面（ホーム）
@app.route('/home', methods=['POST'])
def home():
  rd = json.loads(request.data)
  refarance = home_refarance.select_home(rd['year'], rd['month'])
  data = home_refarance.select_data(rd['year'], rd['month'])

  return {'refarance': refarance, 'data': data}

# 入金入力
@app.route('/deposit_insert', methods=['POST'])
def deposit_insert():
  rd = json.loads(request.data)
  deposit.insert_deposit(rd['year'], rd['month'], rd['date'], rd['category'], rd['user'], rd['amount'])
  status = deposit.select_status(rd['year'], rd['month'], rd['user'])
  history = deposit.select_history(rd['year'], rd['month'], rd['user'])

  return {'status': status, 'history': history}

@app.route('/deposit_init', methods=['POST'])
def deposit_init():
  rd = json.loads(request.data)
  status = deposit.select_status(rd['year'], rd['month'], rd['user'])
  history = deposit.select_history(rd['year'], rd['month'], rd['user'])

  return {'status': status, 'history': history}

@app.route('/deposit_undo', methods=['POST'])
def deposit_undo():
  rd = json.loads(request.data)
  deposit.undo_deposit(rd['key'])
  status = deposit.select_status(rd['year'], rd['month'], rd['user'])
  history = deposit.select_history(rd['year'], rd['month'], rd['user'])

  return {'status': status, 'history': history}

# 支払入力
@app.route('/payment_insert', methods=['POST'])
def payment_insert():
  rd = json.loads(request.data)
  rd = rd['form']
  rd['advancePaidAmount'] = rd['advancePaidAmount'] if rd['advancePaidAmount'] != '' else 0
  payment.insert_payment(rd['year'], rd['month'], rd['date'], rd['category'], rd['shopName'], rd['amount'], rd['isAdvancePaid'], rd['advancePaidAmount'], rd['advancePaidUser'], rd['note'], rd['filename'])

  return {'payment_insert': 'done'}

# WAONカードチャージ
@app.route('/charge_history_insert', methods=['POST'])
def charge_history_insert():
  rd = json.loads(request.data)
  rd = rd['form']
  charge = rd['amount']
  payment.insert_payment(rd['year'], rd['month'], rd['date'], 999, 'WAONカードチャージ', 0, 1, rd['amount'], rd['user'], f'{charge}円', '')

  return {'payment_insert': 'done'}

# 実績照会画面
@app.route('/result_select', methods=['POST'])
def result_select():
  rd = json.loads(request.data)
  table_data = result.select_result(rd['year'], rd['month'])

  return {'data': table_data}

# 立替管理
@app.route('/advances_paid_select', methods=['POST'])
def advances_paid_select():
  rd = json.loads(request.data)
  table_data = advances_paid.select_advances_paid(rd['year'], rd['month'], rd['user'])

  return {'data': table_data}

@app.route('/advances_paid_flag_reset', methods=['POST'])
def advances_paid_flag_reset():
  rd = json.loads(request.data)
  table_data = advances_paid.reset_advances_paid_flag(rd['year'], rd['month'], rd['user'])

  return {'data': table_data}

# 画像処理
@app.route('/image_processing', methods=['POST'])
def image_processing():
  filename = camera.camera_main()

  return {'filename': filename}

@app.route('/image_web', methods=['POST'])
def image_web():
  rd = json.loads(request.data)
  # filename = camera.web(rd['filename'])
  camera.web(rd['filename'])

  # return {'filename': filename}
  return {'web': 'done'}