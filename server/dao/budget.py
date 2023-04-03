import mysql.connector
import json
import server.dao.db_connection as db

# 現在時間取得SQL
date = 'DATE_FORMAT(CURRENT_DATE(), \'%Y%m%d\')'
time = 'TIME_FORMAT(CURRENT_TIME(), \'%H%i%s\')'

def insert_budget(forms):
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
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

  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    insert_query = f'insert into budget select \'{year}\', \'{month}\', category_cd, user_cd, budget, {date}, {time}, {date}, {time} from budget where year = \'{base_year}\' and month = \'{base_month}\';'
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
  query = 'select C.name, U.name, CAST(B.budget AS NCHAR) from budget B '
  query += 'left join category_mf C on B.category_cd = C.cd '
  query += 'left join user_mf U on B.user_cd = U.cd '
  query += f'where B.year = \'{year}\' and B.month = \'{month}\' '
  query += 'order by CAST(B.year AS SIGNED), '
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

# def delete_mf(cd):

#   query = f'UPDATE CATEGORY_MF SET delete_flag = 1, update_date = {date}, update_time = {time} WHERE cd = {cd};'

#   try:
#     conn = db.get_conn()            #ここでDBに接続
#     cursor = conn.cursor()          #カーソルを取得
#     cursor.execute(query)
#     conn.commit()                   #コミット

#   except(mysql.connector.errors.ProgrammingError) as e:
#     print('エラーが発生しました')
#     print(e)
#   finally:
#     if conn != None:
#       cursor.close()              # カーソルを終了
#       conn.close()                # DB切断