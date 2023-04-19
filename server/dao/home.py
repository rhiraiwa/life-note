import mysql.connector
import json
import server.dao.db_connection as db

def select_home(year, month):
  
  query = 'SELECT '
  query += f'(SELECT CAST(SUM(budget) AS NCHAR) FROM BUDGET WHERE year = \'{year}\' AND month = \'{month}\') budget, '
  query += f'(SELECT CAST(SUM(amount) AS NCHAR) FROM DEPOSIT WHERE year = \'{year}\' AND month = \'{month}\') deposit, '
  query += f'(SELECT CAST(SUM(amount) AS NCHAR) FROM PAYMENT WHERE year = \'{year}\' AND month = \'{month}\') payment, '
  query += f'count(*) FROM PAYMENT WHERE year = \'{year}\' AND month = \'{month}\' AND advances_paid_flag = 1;'
  result_row = []
  
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(query)           #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in rows:
      label_tuple = ('budget', 'deposit', 'payment', 'advances_paid')
      row_dict = {label:data for data, label in zip(data_tuple, label_tuple)} 
      result_row.append(row_dict)

  except(mysql.connector.errors.ProgrammingError) as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断

  output_json = json.dumps(result_row, ensure_ascii=False)
  return output_json

def select_data(year, month):
  
  query = f'SELECT year, month, date, name, shop_name, CAST(amount AS NCHAR) FROM PAYMENT LEFT JOIN CATEGORY_MF ON category_cd = cd WHERE year = \'{year}\' AND month = \'{month}\' AND category_cd != 999 ORDER BY CAST(date AS SIGNED);;'
  result_row = []
  
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(query)           #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in rows:
      label_tuple = ('year', 'month', 'date', 'category', 'shop_name', 'amount')
      row_dict = {label:data for data, label in zip(data_tuple, label_tuple)} 
      result_row.append(row_dict)

  except(mysql.connector.errors.ProgrammingError) as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断

  output_json = json.dumps(result_row, ensure_ascii=False)
  return output_json