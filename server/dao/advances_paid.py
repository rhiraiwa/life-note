import mysql.connector
import json
import server.dao.db_connection as db

# 現在時間取得SQL
date = 'DATE_FORMAT(CURRENT_DATE(), \'%Y%m%d\')'
time = 'TIME_FORMAT(CURRENT_TIME(), \'%H%i%s\')'

def select_advances_paid(year, month, user):
  query = f'select name, CAST(advances_paid_amount AS NCHAR), shop_name, concat(year, \'/\', month, \'/\', date) '
  query += f'from payment left join CATEGORY_MF on category_cd = cd '
  query += f'where year = \'{year}\' and month = \'{month}\' and advances_paid_user_cd = \'{user}\' and advances_paid_flag = 1 '
  query += f'ORDER BY CAST(date AS SIGNED);'
  result_row = []
  
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(query)           #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in rows:
      label_tuple = ('category', 'amount', 'shop_name', 'payment_date')
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
  update_query = f'UPDATE PAYMENT SET advances_paid_flag = 0 , update_date = \'{date}\', update_time = \'{time}\' WHERE year = \'{year}\' AND month = \'{month}\' AND advances_paid_user_cd = \'{user}\';'
  
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(update_query)    #sql実行
    conn.commit()                   #コミット

  except(mysql.connector.errors.ProgrammingError) as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断