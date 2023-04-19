import mysql.connector
import json
import server.dao.db_connection as db

# 現在時間取得SQL
date = 'DATE_FORMAT(CURRENT_DATE(), \'%Y%m%d\')'
time = 'TIME_FORMAT(CURRENT_TIME(), \'%H%i%s\')'

def insert_budget(forms):
  delete_query = f'DELETE FROM BUDGET WHERE year = \'{forms[0]["year"]}\' and month = \'{forms[0]["month"]}\';'

  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(delete_query)
    for form in forms:
      insert_query = f'INSERT INTO BUDGET VALUES (\'{form["year"]}\', \'{form["month"]}\', \'{form["category"]}\', \'{form["user"]}\', \'{form["budget"]}\', {date}, {time}, {date}, {time});'
      cursor.execute(insert_query)
    conn.commit()                   #コミット

  except(mysql.connector.errors.ProgrammingError) as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断

def inherit_budget(year, month):
  if month == 1:
    base_year = year - 1
    base_month = 12
  else:
    base_year = year
    base_month = month - 1

  delete_query = f'DELETE FROM BUDGET WHERE year = \'{year}\' and month = \'{month}\';'
  insert_query = f'insert into budget select \'{year}\', \'{month}\', category_cd, user_cd, budget, {date}, {time}, {date}, {time} from budget where year = \'{base_year}\' and month = \'{base_month}\';'

  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(delete_query)
    cursor.execute(insert_query)
    conn.commit()                   #コミット

  except(mysql.connector.errors.ProgrammingError) as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断

def select_budget(year, month):
  query = 'SELECT C.name, U.name, CAST(B.budget AS NCHAR) FROM BUDGET B '
  query += 'LEFT JOIN category_mf C ON B.category_cd = C.cd '
  query += 'LEFT JOIN user_mf U ON B.user_cd = U.cd '
  query += f'WHERE B.year = \'{year}\' AND B.month = \'{month}\' '
  query += 'ORDER BY CAST(B.year AS SIGNED), '
  query += 'CAST(B.month AS SIGNED), '
  query += 'CAST(B.category_cd AS SIGNED), '
  query += 'CAST(B.user_cd AS SIGNED);'
  result_row = []
  
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(query)           #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in rows:
      label_tuple = ('category', 'user', 'budget')
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

def budget_init(year, month):
  query = 'SELECT C.name, U.name, CAST(B.budget AS NCHAR), '
  query += f'(select distinct count(*) from budget where year = \'{year}\' and month = \'{month}\' group by category_cd) '
  query += 'FROM BUDGET B '
  query += 'LEFT JOIN category_mf C ON B.category_cd = C.cd '
  query += 'LEFT JOIN user_mf U ON B.user_cd = U.cd '
  query += f'WHERE B.year = \'{year}\' AND B.month = \'{month}\' '
  query += 'ORDER BY CAST(B.year AS SIGNED), '
  query += 'CAST(B.month AS SIGNED), '
  query += 'CAST(B.category_cd AS SIGNED), '
  query += 'CAST(B.user_cd AS SIGNED);'
  result = []
  sum_query = f'select category_cd, name, CAST(sum(budget) AS NCHAR) from budget left join CATEGORY_MF on category_cd = cd where year = \'{year}\' and month = \'{month}\' group by category_cd;'
  sum_result= []
  
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(query)           #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in rows:
      label_tuple = ('category', 'user', 'budget', 'userCount')
      row_dict = {label:data for data, label in zip(data_tuple, label_tuple)} 
      result.append(row_dict)

    cursor.execute(sum_query)       #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in rows:
      label_tuple = ('category_cd', 'category_name',  'sum')
      row_dict = {label:data for data, label in zip(data_tuple, label_tuple)} 
      sum_result.append(row_dict)

  except(mysql.connector.errors.ProgrammingError) as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断

  result_json = json.dumps(result, ensure_ascii=False)
  result_sum_json = json.dumps(sum_result, ensure_ascii=False)
  return {'budget': result_json, 'sum': result_sum_json}

def select_sum_month(year, month, user):
  query = f'SELECT CAST(sum(budget) AS NCHAR) FROM BUDGET WHERE year = \'{year}\' AND month = \'{month}\' AND user_cd = \'{user}\';'
  
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(query)           #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

  except(mysql.connector.errors.ProgrammingError) as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断
      
  return rows[0][0]