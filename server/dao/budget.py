import mysql.connector
import json
import server.dao.db_connection as db

# 現在時間取得SQL
date = 'DATE_FORMAT(CURRENT_DATE(), \'%Y%m%d\')'
time = 'TIME_FORMAT(CURRENT_TIME(), \'%H%i%s\')'

def insert_budget(forms):
  delete_query  = f'DELETE FROM BUDGET'
  delete_query += f'WHERE       year = \'{forms[0]["year"]}\' '
  delete_query += f'        AND month = \'{forms[0]["month"]}\';'

  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(delete_query)
    for form in forms:
      insert_query  = f'INSERT INTO BUDGET '
      insert_query += f'VALUES      (\'{form["year"]}\', '
      insert_query += f'             \'{form["month"]}\', '
      insert_query += f'             \'{form["category"]}\', '
      insert_query += f'             \'{form["user"]}\', '
      insert_query += f'             \'{form["budget"]}\', '
      insert_query += f'             {date}, '
      insert_query += f'             {time}, '
      insert_query += f'             {date}, '
      insert_query += f'             {time});'

      cursor.execute(insert_query)
    conn.commit()                   #コミット

  except(mysql.connector.errors.ProgrammingError) as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断

def count_previous_month_budget(year, month):
  if month == 1:
    base_year = year - 1
    base_month = 12
  else:
    base_year = year
    base_month = month - 1

  count_query  = f'SELECT COUNT(*) FROM BUDGET '
  count_query += f'WHERE  year = \'{base_year}\' '
  count_query += f'   AND month = \'{base_month}\';'

  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(count_query)
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

  except(mysql.connector.errors.ProgrammingError) as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断
  
  return rows[0][0]

def inherit_budget(year, month):
  if month == 1:
    base_year = year - 1
    base_month = 12
  else:
    base_year = year
    base_month = month - 1

  delete_query  = f'DELETE FROM BUDGET '
  delete_query += f'WHERE       year = \'{year}\' '
  delete_query += f'        AND month = \'{month}\';'
  
  insert_query  = f'INSERT INTO BUDGET '
  insert_query += f'     SELECT \'{year}\', '
  insert_query += f'            \'{month}\', '
  insert_query += f'            category_cd, '
  insert_query += f'            user_cd, budget, '
  insert_query += f'            {date}, '
  insert_query += f'            {time}, '
  insert_query += f'            {date}, '
  insert_query += f'            {time} '
  insert_query += f'       FROM BUDGET '
  insert_query += f'      WHERE year = \'{base_year}\' '
  insert_query += f'        AND month = \'{base_month}\';'

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
  query  = f'SELECT    C.name, '
  query += f'          U.name, '
  query += f'          CAST(B.budget AS NCHAR) '
  query += f'FROM      BUDGET B '
  query += f'LEFT JOIN category_mf C'
  query += f'       ON B.category_cd = C.cd '
  query += f'LEFT JOIN user_mf U '
  query += f'       ON B.user_cd = U.cd '
  query += f'WHERE     B.year = \'{year}\' '
  query += f'      AND B.month = \'{month}\' '
  query += f'ORDER BY  CAST(B.year AS SIGNED), '
  query += f'          CAST(B.month AS SIGNED), '
  query += f'          CAST(B.category_cd AS SIGNED), '
  query += f'          CAST(B.user_cd AS SIGNED);'
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
  query  = f'SELECT    C.name, '
  query += f'          U.name, '
  query += f'          CAST(B.budget AS NCHAR), '
  query += f'          (SELECT   distinct COUNT(*) FROM BUDGET '
  query += f'           WHERE    year = \'{year}\' '
  query += f'                AND month = \'{month}\' '
  query += f'           GROUP BY category_cd) '
  query += f'FROM      BUDGET B '
  query += f'LEFT JOIN category_mf C'
  query += f'       ON B.category_cd = C.cd '
  query += f'LEFT JOIN user_mf U '
  query += f'       ON B.user_cd = U.cd '
  query += f'WHERE     B.year = \'{year}\' '
  query += f'      AND B.month = \'{month}\' '
  query += f'ORDER BY  CAST(B.year AS SIGNED), '
  query += f'          CAST(B.month AS SIGNED), '
  query += f'          CAST(B.category_cd AS SIGNED), '
  query += f'          CAST(B.user_cd AS SIGNED);'
  result = []

  sum_query  = f'SELECT    category_cd,'
  sum_query += f'          name, '
  sum_query += f'          CAST(sum(budget) AS NCHAR)'
  sum_query += f'FROM      BUDGET '
  sum_query += f'LEFT JOIN CATEGORY_MF '
  sum_query += f'       ON category_cd = cd '
  sum_query += f'WHERE     year = \'{year}\' '
  sum_query += f'      AND month = \'{month}\' '
  sum_query += f'GROUPBY   category_cd;'
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
  query  = f'SELECT CAST(sum(budget) AS NCHAR) '
  query += f'FROM   BUDGET '
  query += f'WHERE  year = \'{year}\' '
  query += f'   AND month = \'{month}\' '
  query += f'   AND user_cd = \'{user}\';'
  
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