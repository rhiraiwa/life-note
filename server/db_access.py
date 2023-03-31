
import mysql.connector
import json

#DB接続情報
def conn_db():
  conn = mysql.connector.connect(
    host = '127.0.0.1',      #localhostでもOK
    user = 'writer',
    passwd = 'writer00',
    db = 'LIFE_NOTE'
  )
  return conn

def insert_mf(table, name):
  count_query = f'select count(*) from {table};'
  date = 'DATE_FORMAT(CURRENT_DATE(), \'%Y%m%d\')'
  time = 'TIME_FORMAT(CURRENT_TIME(), \'%H%i%s\')'

  try:
    conn = conn_db()                #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(count_query)
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納
    insert_query = f'INSERT INTO {table} VALUES ({rows[0][0]}, \'{name}\', {date}, {time}, {date}, {time}, 0);'
    print(insert_query)
    cursor.execute(insert_query)
    conn.commit()                   #コミット

  except(mysql.connector.errors.ProgrammingError) as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断

def select_mf(table):

  query = f'SELECT cd, name FROM {table} ORDER BY CAST(cd AS SIGNED);'
  result_row = []
  
  try:
    conn = conn_db()                #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(query)           #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in rows:
      label_tuple = ('cd', 'name')
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