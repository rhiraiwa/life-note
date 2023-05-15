import mysql.connector
import json
import server.dao.db_connection as db

# 現在時間取得SQL
date = 'DATE_FORMAT(CURRENT_DATE(), \'%Y%m%d\')'
time = 'TIME_FORMAT(CURRENT_TIME(), \'%H%i%s\')'

def select_advances_paid(year, month, user):
  query =  f'SELECT    CONCAT(year, month, date, payment_number), '
  query += f'          name, '
  query += f'          CAST(advances_paid_amount AS NCHAR), '
  query += f'          shop_name, '
  query += f'          concat(year, \'/\', month, \'/\', date), '
  query += f'          refund_flag '
  query += f'FROM      PAYMENT '
  query += f'LEFT JOIN LARGE_CLASS_MF '
  query += f'       ON category_cd = cd '
  query += f'WHERE     year = \'{year}\' '
  query += f'      AND month = \'{month}\' '
  query += f'      AND advances_paid_user_cd = \'{user}\' '
  query += f'      AND advances_paid_flag = 1 '
  query += f'ORDER BY  CAST(date AS SIGNED);'
  result_row = []
  
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(query)           #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in rows:
      label_tuple = ('key', 'category', 'amount', 'shop_name', 'payment_date', 'refund_flag')
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

def reset_advances_paid_flag(year, month, user):
  update_query  = f'UPDATE PAYMENT '
  update_query += f'SET    refund_flag = 1, '
  update_query += f'       update_date = {date}, '
  update_query += f'       update_time = {time} '
  update_query += f'WHERE  year = \'{year}\' '
  update_query += f'   AND month = \'{month}\' '
  update_query += f'   AND advances_paid_flag = 1 '
  update_query += f'   AND advances_paid_user_cd = \'{user}\';'

  query =  f'SELECT    CONCAT(year, month, date, payment_number), '
  query += f'          name, '
  query += f'          CAST(advances_paid_amount AS NCHAR), '
  query += f'          shop_name, '
  query += f'          concat(year, \'/\', month, \'/\', date), '
  query += f'          refund_flag '
  query += f'FROM      PAYMENT '
  query += f'LEFT JOIN LARGE_CLASS_MF '
  query += f'       ON category_cd = cd '
  query += f'WHERE     year = \'{year}\' '
  query += f'      AND month = \'{month}\' '
  query += f'      AND advances_paid_user_cd = \'{user}\' '
  query += f'      AND advances_paid_flag = 1 '
  query += f'ORDER BY  CAST(date AS SIGNED);'
  result_row = []
  
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(update_query)    #sql実行
    conn.commit()                   #コミット
    
    cursor.execute(query)           #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in rows:
      label_tuple = ('key', 'category', 'amount', 'shop_name', 'payment_date', 'refund_flag')
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

def change_refund_flag(year, month, user, key, flag):
  flag_change_query = f'UPDATE PAYMENT SET refund_flag = {flag} WHERE CONCAT(year, month, date, payment_number) = \'{key}\';'

  query =  f'SELECT    CONCAT(year, month, date, payment_number), '
  query += f'          name, '
  query += f'          CAST(advances_paid_amount AS NCHAR), '
  query += f'          shop_name, '
  query += f'          concat(year, \'/\', month, \'/\', date), '
  query += f'          refund_flag '
  query += f'FROM      PAYMENT '
  query += f'LEFT JOIN LARGE_CLASS_MF '
  query += f'       ON category_cd = cd '
  query += f'WHERE     year = \'{year}\' '
  query += f'      AND month = \'{month}\' '
  query += f'      AND advances_paid_user_cd = \'{user}\' '
  query += f'      AND advances_paid_flag = 1 '
  query += f'ORDER BY  CAST(date AS SIGNED);'
  result_row = []
  
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(flag_change_query)    #sql実行
    conn.commit()                   #コミット
    
    cursor.execute(query)           #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in rows:
      label_tuple = ('key', 'category', 'amount', 'shop_name', 'payment_date', 'refund_flag')
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