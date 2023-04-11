import mysql.connector
import json
import server.dao.db_connection as db

# 現在時間取得SQL
date = 'DATE_FORMAT(CURRENT_DATE(), \'%Y%m%d\')'
time = 'TIME_FORMAT(CURRENT_TIME(), \'%H%i%s\')'

def insert_payment(year, month, today, category, shop, amount, advance_paid_flag, advance_paid_amount, advance_paid_user, note):
  count_query = f'select count(*) from PAYMENT where year = {year} and month = {month} and date = {today};'

  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(count_query)
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納
    insert_query = f'INSERT INTO PAYMENT VALUES (\'{year}\',\'{month}\',\'{today}\',{rows[0][0]}, \'{category}\', \'{shop}\', {amount}, \'{advance_paid_flag}\', {advance_paid_amount}, \'{advance_paid_user}\', \'{note}\', {date}, {time}, {date}, {time}, 0);'
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