import mysql.connector
import json
import server.dao.db_connection as db

def select_result(year, month):
  query = f'select name, budget, payment '
  query += f'from (select category_cd, CAST(sum(budget) AS NCHAR) budget from budget where year = \'{year}\' and month = \'{month}\' group by category_cd) A '
  query += f'left join (select category_cd, CAST(sum(amount) AS NCHAR) payment from payment where year = \'{year}\' and month = \'{month}\' group by category_cd) B '
  query += f'on A.category_cd = B.category_cd '
  query += f'left join CATEGORY_MF on A.category_cd = cd;'
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