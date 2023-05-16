import mysql.connector
import json
import server.dao.db_connection as db

def select_home(year, month):
  
  query  = f'SELECT '
  query += f'      (SELECT CAST(SUM(budget) AS NCHAR) FROM BUDGET WHERE year = \'{year}\' AND month = \'{month}\') budget, '
  query += f'      (SELECT CAST(SUM(amount) AS NCHAR) FROM DEPOSIT WHERE year = \'{year}\' AND month = \'{month}\') deposit, '
  query += f'      (SELECT CAST(SUM(amount) AS NCHAR) FROM PAYMENT WHERE year = \'{year}\' AND month = \'{month}\') payment, '
  query += f'      COUNT(*) '
  query += f'FROM  PAYMENT '
  query += f'WHERE year = \'{year}\' '
  query += f'  AND month = \'{month}\' '
  query += f'  AND advances_paid_flag = 1 '
  query += f'  AND refund_flag = 0;'
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
  
  query  = f'SELECT    CONCAT(year, month, date, payment_number), '
  query += f'          year, '
  query += f'          month, '
  query += f'          date, '
  # query += f'          category_cd, '
  # query += f'          name, '
  query += f'          shop_name, '
  query += f'          CAST(amount AS NCHAR) '
  query += f'FROM      PAYMENT '
  # query += f'LEFT JOIN LARGE_CLASS_MF '
  # query += f'       ON category_cd = cd '
  query += f'WHERE     year = \'{year}\' '
  query += f'      AND month = \'{month}\' '
  query += f'ORDER BY  CAST(date AS SIGNED);'
  result_row = []
  
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(query)           #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in rows:
      # label_tuple = ('key', 'year', 'month', 'date', 'category_cd', 'category_name', 'shop_name', 'amount')
      label_tuple = ('key', 'year', 'month', 'date', 'shop_name', 'amount')
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

def undo_home(key):
  query = f'DELETE FROM PAYMENT WHERE CONCAT(year, month, date, payment_number) = \'{key}\';'

  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(query)
    conn.commit()                   #コミット

  except(mysql.connector.errors.ProgrammingError) as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断