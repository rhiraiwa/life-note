import mysql.connector
import json
import server.dao.db_connection as db
import os
import shutil

# 現在時間取得SQL
date = 'DATE_FORMAT(CURRENT_DATE(), \'%Y%m%d\')'
time = 'TIME_FORMAT(CURRENT_TIME(), \'%H%i%s\')'
# temp_path = 'client/public/receipt/temp/'
# preview_path = 'client/public/receipt/preview/'

def insert_payment(year, month, today, shop, amount, advance_paid_flag, advance_paid_amount, advance_paid_user, note):
  count_query  = f'SELECT CASE '
  count_query += f'            WHEN MAX(payment_number) IS NULL '
  count_query += f'            THEN 0 '
  count_query += f'            ELSE MAX(payment_number) + 1 '
  count_query += f'       END '
  count_query += f'FROM        PAYMENT '
  count_query += f'WHERE       year = {year} '
  count_query += f'        AND month = {month} '
  count_query += f'        AND date = {today};'

  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(count_query)
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納
    insert_query  = f'INSERT INTO PAYMENT '
    insert_query += f'VALUES (\'{year}\', '
    insert_query += f'        \'{month}\', '
    insert_query += f'        \'{today}\', '
    insert_query += f'        {rows[0][0]}, '
    insert_query += f'        \'{shop}\', '
    insert_query += f'        {amount}, '
    insert_query += f'        \'{advance_paid_flag}\', '
    insert_query += f'        {advance_paid_amount}, '
    insert_query += f'        \'{advance_paid_user}\', '
    insert_query += f'        0, '
    insert_query += f'        \'{note}\', '
    insert_query += f'        {date}, '
    insert_query += f'        {time}, '
    insert_query += f'        {date}, '
    insert_query += f'        {time}, '
    insert_query += f'        0);'

    #画像保存
    # store_path = f'client/public/receipt/stored/{year}{month}{today}{rows[0][0]}/'
    
    # if os.path.exists(store_path):  # 必要かどうか分からない（修正処理が実装されれば必要か）
    #   shutil.rmtree(store_path)

    # if filename != '':
    #   os.mkdir(store_path)
    #   os.replace(preview_path + filename, store_path + filename)
    #   os.remove(temp_path + filename)

    cursor.execute(insert_query)
    conn.commit()                   #コミット

  except(mysql.connector.errors.ProgrammingError) as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断
  
  return rows[0][0]

def insert_detail(year, month, today, payment_no, details):

  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    for detail in details:
      insert_query  = f'INSERT INTO PAYMENT_DETAIL '
      insert_query += f'VALUES (\'{year}\', '
      insert_query += f'        \'{month}\', '
      insert_query += f'        \'{today}\', '
      insert_query += f'        {payment_no}, '
      insert_query += f'        {detail["detailNumber"]}, '
      insert_query += f'        {detail["largeClass"]}, '
      insert_query += f'        {detail["middleClass"]}, '
      insert_query += f'        \'{detail["itemClass"]}\', '
      insert_query += f'        \'{detail["itemName"]}\', '
      insert_query += f'        {detail["unitPrice"]}, '
      insert_query += f'        {detail["taxRate"]}, '
      insert_query += f'        {detail["discount"]}, '
      insert_query += f'        {detail["itemCount"]}, '
      insert_query += f'        {detail["price"]}, '
      insert_query += f'        {date}, '
      insert_query += f'        {time}, '
      insert_query += f'        {date}, '
      insert_query += f'        {time}, '
      insert_query += f'        0);'

      cursor.execute(insert_query)

    conn.commit()                   #コミット

  except(mysql.connector.errors.ProgrammingError) as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断