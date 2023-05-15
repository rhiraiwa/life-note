import mysql.connector
import json
import server.dao.db_connection as db

# 現在時間取得SQL
date = 'DATE_FORMAT(CURRENT_DATE(), \'%Y%m%d\')'
time = 'TIME_FORMAT(CURRENT_TIME(), \'%H%i%s\')'
select_query  = 'SELECT   cd, '
select_query += '         name '
select_query += 'FROM     LARGE_CLASS_MF '
select_query += 'WHERE    delete_flag = 0 '
select_query += 'ORDER BY CAST(cd AS SIGNED);'

def select_mf():
  output_json = base_process('')
  return output_json

def insert_mf(name):
  query  = f'INSERT INTO LARGE_CLASS_MF '
  query += f'VALUES ((SELECT CASE '
  query += f'                     WHEN MAX(cd) IS NULL '
  query += f'                     THEN 0 '
  query += f'                     ELSE MAX(cd) + 1  '
  query += f'                END '
  query += f'         FROM   LARGE_CLASS_MF TEMP), '
  query += f'        \'{name}\', '
  query += f'        {date}, '
  query += f'        {time}, '
  query += f'        {date}, '
  query += f'        {time}, '
  query += f'        0);'

  output_json = base_process(query)
  return output_json

def edit_mf(cd, name):
  query  = f'UPDATE LARGE_CLASS_MF '
  query += f'SET    name = \'{name}\', '
  query += f'       update_date = {date}, '
  query += f'       update_time = {time} '
  query += f'WHERE  cd = {cd};'

  output_json = base_process(query)
  return output_json

def delete_mf(cd):
  query  = f'UPDATE LARGE_CLASS_MF '
  query += f'SET    delete_flag = 1, '
  query += f'       update_date = {date}, '
  query += f'       update_time = {time} '
  query += f'WHERE  cd = {cd};'

  output_json = base_process(query)
  return output_json

def base_process(query):
  result_row = []
  
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得

    if query != '':
      cursor.execute(query)
      conn.commit()                 #コミット
    
    cursor.execute(select_query)    #sql実行
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

def select_middle_class():
  query = 'SELECT     A.cd, '
  query += '          A.name, '
  query += '          CASE WHEN B.cd IS NULL THEN \'\' ELSE B.cd END, '
  query += '          CASE WHEN B.name IS NULL THEN \'\' ELSE B.name END '
  query += 'FROM      large_class_mf A '
  query += 'LEFT JOIN middle_class_mf B '
  query += '       ON A.cd = B.large_class_cd '
  query += 'WHERE     A.delete_flag = 0 '
  query += '      AND (B.delete_flag = 0 OR B.delete_flag IS NULL)'
  query += 'ORDER BY  A.cd, B.cd;'
  result_row = []
  
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(query)
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in rows:
      label_tuple = ('large_class_cd', 'large_class_name', 'middle_class_cd', 'middle_class_name')
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

def insert_middle_class(large_class, name):
  query  = f'INSERT INTO MIDDLE_CLASS_MF '
  query += f'VALUES ({large_class}, '
  query += f'        (SELECT CASE '
  query += f'                     WHEN MAX(cd) IS NULL '
  query += f'                     THEN 0 '
  query += f'                     ELSE MAX(cd) + 1  '
  query += f'                END '
  query += f'         FROM   MIDDLE_CLASS_MF TEMP), '
  query += f'        \'{name}\', '
  query += f'        {date}, '
  query += f'        {time}, '
  query += f'        {date}, '
  query += f'        {time}, '
  query += f'        0);'

  output_json = base_process(query)
  return output_json