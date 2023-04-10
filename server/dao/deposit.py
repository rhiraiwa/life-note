import mysql.connector
import json
import server.dao.db_connection as db

# 現在時間取得SQL
date = 'DATE_FORMAT(CURRENT_DATE(), \'%Y%m%d\')'
time = 'TIME_FORMAT(CURRENT_TIME(), \'%H%i%s\')'

def insert_deposit(year, month, today, category, user, amount):
  count_query = f'select count(*) from DEPOSIT where year = {year} and month = {month};'

  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(count_query)
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納
    insert_query = f'INSERT INTO DEPOSIT VALUES (\'{year}\',\'{month}\',\'{today}\',{rows[0][0]}, \'{category}\', \'{user}\', {amount}, {date}, {time}, {date}, {time}, 0);'
    cursor.execute(insert_query)
    conn.commit()                   #コミット

  except(mysql.connector.errors.ProgrammingError) as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断

def select_status(year, month, user):
  query = f'SELECT category_cd, name, '
  query += f'CAST((SELECT budget FROM BUDGET WHERE user_cd = \'{user}\' AND BUDGET.category_cd = DEPOSIT.category_cd AND year = \'{year}\' AND month = \'{month}\') AS NCHAR) budget, '
  query += f'CAST(SUM(amount) AS NCHAR) FROM DEPOSIT '
  query += f'LEFT JOIN CATEGORY_MF ON category_cd = cd '
  query += f'WHERE user_cd = \'{user}\' AND year = \'{year}\' AND month = \'{month}\' '
  query += f'GROUP BY category_cd ORDER BY category_cd;'
  result_row = []

  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(query)           #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in rows:
      label_tuple = ('category_cd', 'category_name', 'budget', 'deposit')
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

def select_history(year, month, user):
  query = f'SELECT category_cd, name, CAST(amount AS NCHAR), DEPOSIT.insert_date, DEPOSIT.insert_time FROM DEPOSIT '
  query += f'LEFT JOIN CATEGORY_MF ON category_cd = cd '
  query += f'WHERE user_cd = \'{user}\' AND year = \'{year}\' AND month = \'{month}\' '
  query += f'ORDER BY DEPOSIT.insert_date, DEPOSIT.insert_time;'
  result_row = []

  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(query)           #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in rows:
      label_tuple = ('category_cd', 'category_name', 'deposit', 'insert_date', 'insert_time')
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