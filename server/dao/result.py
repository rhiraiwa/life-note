import mysql.connector
import json
import server.dao.db_connection as db

def select_result(year, month):
  query  = f'SELECT   name, '
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
      label_tuple = ('category', 'budget', 'payment')
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