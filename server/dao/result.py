import mysql.connector
import json
import server.dao.db_connection as db

def select_result(year, month):
  query  = f'SELECT   cd, '
  query += f'         name, '
  query += f'         budget, '
  query += f'         payment '
  query += f'FROM     (select   category_cd, '
  query += f'                   CAST(sum(budget) AS NCHAR) budget '
  query += f'          from     BUDGET '
  query += f'          where    year = \'{year}\' '
  query += f'             and   month = \'{month}\''
  query += f'          group by category_cd) A '
  query += f'LEFT JOIN (select   large_class_cd, '
  query += f'                    CAST(sum(price) AS NCHAR) payment '
  query += f'           from     PAYMENT_DETAIL '
  query += f'           where    year = \'{year}\' '
  query += f'                and month = \'{month}\' '
  query += f'           group by large_class_cd) B '
  query += f'       ON A.category_cd = B.large_class_cd '
  query += f'LEFT JOIN LARGE_CLASS_MF'
  query += f'       ON A.category_cd = cd;'
  result_row = []
  
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(query)           #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in rows:
      label_tuple = ('categoryCd', 'category', 'budget', 'payment')
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

def select_pie_chart(year, month, large_class_cd):
  query  = f'SELECT    middle_class_cd, '
  query += f'          name, '
  query += f'          cast(sum(price) AS NCHAR) '
  query += f'FROM      PAYMENT_DETAIL A '
  query += f'LEFT JOIN MIDDLE_CLASS_MF B '
  query += f'       ON middle_class_cd = cd '
  query += f'WHERE     A.large_class_cd = {large_class_cd}'
  query += f'      AND year = \'{year}\' '
  query += f'      AND month = \'{month}\' '
  query += f'GROUP BY  A.middle_class_cd '
  query += f'ORDER BY  A.middle_class_cd; '
  result_row = []
  
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(query)           #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in rows:
      label_tuple = ('middleClassCd', 'middleClassName', 'sum')
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