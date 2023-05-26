from server import app
from server.dao import user_maintenance, category_maintenance, budget, home as home_refarance, deposit, payment, result, advances_paid
from server.model import camera
from flask import request, json
import subprocess

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
  table_data = user_maintenance.insert_mf(rd['username'])

  return {'data': table_data}

@app.route('/user_edit', methods=['POST'])
def user_edit():
  rd = json.loads(request.data)
  table_data = user_maintenance.edit_mf(rd['cd'], rd['name'])

  return {'data': table_data}

@app.route('/user_delete', methods=['POST'])
def user_delete():
  rd = json.loads(request.data)
  table_data = user_maintenance.delete_mf(rd['usercd'])

  return {'data': table_data}

# カテゴリマスタメンテナンス
@app.route('/middle_class_select', methods=['POST'])
def middle_class_select():
  table_data = category_maintenance.select_middle_class()

  return {'data': table_data}

@app.route('/middle_class_insert', methods=['POST'])
def middle_class_insert():
  rd = json.loads(request.data)
  table_data = category_maintenance.insert_middle_class(rd['largeClassCd'], rd['middleClassName'])
  
  return {'data': table_data}

@app.route('/middle_class_edit', methods=['POST'])
def middle_class_edit():
  rd = json.loads(request.data)
  table_data = category_maintenance.edit_middle_class(rd['cd'], rd['name'])

  return {'data': table_data}

@app.route('/middle_class_delete', methods=['POST'])
def middle_class_delete():
  rd = json.loads(request.data)
  table_data = category_maintenance.delete_middle_class(rd['cd'])

  return {'data': table_data}

@app.route('/category_select', methods=['POST'])
def category_select():
  table_data = category_maintenance.select_mf()

  return {'data': table_data}

@app.route('/category_insert', methods=['POST'])
def category_insert():
  rd = json.loads(request.data)
  table_data = category_maintenance.insert_mf(rd['categoryname'])

  return {'data': table_data}

@app.route('/category_edit', methods=['POST'])
def category_edit():
  rd = json.loads(request.data)
  table_data = category_maintenance.edit_mf(rd['cd'], rd['name'])

  return {'data': table_data}

@app.route('/category_delete', methods=['POST'])
def category_delete():
  rd = json.loads(request.data)
  table_data = category_maintenance.delete_mf(rd['cd'])

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

@app.route('/home_undo', methods=['POST'])
def home_undo():
  rd = json.loads(request.data)
  home_refarance.undo_home(rd['key'])

  return {'home_undo': 'done'}

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
  header = rd['header']
  sum = rd['sum']
  detail = rd['detail']
  header['advancePaidAmount'] = header['advancePaidAmount'] if header['advancePaidAmount'] != '' else 0
  no = payment.insert_payment(header['year'], header['month'], header['date'], header['shopName'], sum, header['isAdvancePaid'], header['advancePaidAmount'], header['advancePaidUser'], header['note'])
  payment.insert_detail(header['year'], header['month'], header['date'], no, detail)

  return {'payment_insert': 'done'}

@app.route('/payment_edit', methods=['POST'])
def payment_edit():
  rd = json.loads(request.data)
  header = rd['header']
  sum = rd['sum']
  key = rd['key']
  detail = rd['detail']
  header['advancePaidAmount'] = header['advancePaidAmount'] if header['advancePaidAmount'] != '' else 0
  no = payment.edit_payment(header['shopName'], sum, header['isAdvancePaid'], header['advancePaidAmount'], header['advancePaidUser'], header['note'], key)
  payment.edit_detail(detail, key)

  return {'payment_insert': 'done'}

# 明細照会（簡易）
@app.route('/detail_select', methods=['POST'])
def detail_select():
  rd = json.loads(request.data)
  table_data = payment.select_detail(rd['key'])

  return {'detail': table_data}

# WAONカードチャージ
@app.route('/charge_history_insert', methods=['POST'])
def charge_history_insert():
  rd = json.loads(request.data)
  rd = rd['form']
  charge = rd['amount']
  payment.insert_payment(rd['year'], rd['month'], rd['date'], f'チャージ', 0, 1, rd['amount'], rd['user'], f'\\{charge}')
  table_data = payment.select_waon(rd['year'], rd['month'])
  
  return {'data': table_data}

# WAONチャージ履歴取得
@app.route('/charge_history_select', methods=['POST'])
def charge_history_select():
  rd = json.loads(request.data)
  table_data = payment.select_waon(rd['year'], rd['month'])
  
  return {'data': table_data}

# WAONチャージ履歴取得
@app.route('/charge_history_delete', methods=['POST'])
def charge_history_delete():
  rd = json.loads(request.data)
  home_refarance.undo_home(rd['key'])
  table_data = payment.select_waon(rd['year'], rd['month'])
  
  return {'data': table_data}

# 実績照会画面
@app.route('/result_select', methods=['POST'])
def result_select():
  rd = json.loads(request.data)
  table_data = result.select_result(rd['year'], rd['month'])

  return {'data': table_data}

# 実績照会画面明細取得
@app.route('/detail_result_select', methods=['POST'])
def detail_result_select():
  rd = json.loads(request.data)
  table_data = result.select_detail_result(rd['year'], rd['month'], rd['large_class_cd'], rd['middle_class_cd'])

  return {'data': table_data}

# グラフデータ取得
@app.route('/chart_select', methods=['POST'])
def pie_chart_select():
  rd = json.loads(request.data)
  pie_chart_data = result.select_pie_chart(rd['year'], rd['month'], rd['large_class_cd'])
  line_chart_data = result.select_line_chart(rd['year'], rd['month'], rd['large_class_cd'])

  return {'pie': pie_chart_data, 'line': line_chart_data}

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

@app.route('/refund_flag_handle', methods=['POST'])
def refund_flag_handle():
  rd = json.loads(request.data)
  table_data = advances_paid.change_refund_flag(rd['year'], rd['month'], rd['user'], rd['key'], rd['flag'])

  return {'data': table_data}

@app.route('/calc', methods=['POST'])
def exeCalc():
  subprocess.Popen(['start', r'C:\Windows\WinSxS\\amd64_microsoft-windows-calc_31bf3856ad364e35_10.0.19041.1_none_5faf0ebeba197e78\\calc.exe'], shell=True)

  return {'calculator': 'open'}