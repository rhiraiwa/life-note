import mysql.connector
import json
import server.dao.db_connection as db

def select_home(year, month):

  query = f'SELECT CAST(sum(budget) AS NCHAR) FROM BUDGET WHERE year = \'{year}\' AND month = \'{month}\';'
  result_row = []
  
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(query)           #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    # ### ２つのリストを辞書へ変換
    # for data_tuple in rows:
    #   label_tuple = ('year', 'month', 'budget')
    #   row_dict = {label:data for data, label in zip(data_tuple, label_tuple)} 
    #   result_row.append(row_dict)

  except(mysql.connector.errors.ProgrammingError) as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断
  print("---------------------------------------------------")
  print(rows[0][0])
  # output_json = json.dumps(result_row, ensure_ascii=False)
  return rows[0][0]
