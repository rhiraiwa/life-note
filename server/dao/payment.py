import mysql.connector
import json
import server.dao.db_connection as db
import os
import shutil

# 現在時間取得SQL
date = 'DATE_FORMAT(CURRENT_DATE(), \'%Y%m%d\')'
time = 'TIME_FORMAT(CURRENT_TIME(), \'%H%i%s\')'

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
      if detail["middleClass"] == None:
        insert_query += f'        NULL, '
      else:
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

def edit_payment(shop, amount, advance_paid_flag, advance_paid_amount, advance_paid_user, note, key):

  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    insert_query  = f'UPDATE PAYMENT '
    insert_query += f'SET    shop_name = \'{shop}\', '
    insert_query += f'       amount = {amount}, '
    insert_query += f'       advances_paid_flag = \'{advance_paid_flag}\', '
    insert_query += f'       advances_paid_amount = {advance_paid_amount}, '
    insert_query += f'       advances_paid_user_cd = \'{advance_paid_user}\', '
    insert_query += f'       note = \'{note}\', '
    insert_query += f'       update_date = {date}, '
    insert_query += f'       update_time = {time} '
    insert_query += f'WHERE  CONCAT(year, month, date, payment_number) = \'{key}\';'

    cursor.execute(insert_query)
    conn.commit()                   #コミット

  except(mysql.connector.errors.ProgrammingError) as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断

def edit_detail(details, key):

  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    for detail in details:
      insert_query  = f'UPDATE  PAYMENT_DETAIL '
      insert_query += f'SET     large_class_cd = {detail["largeClass"]}, '
      insert_query += f'        middle_class_cd = {detail["middleClass"]}, '
      insert_query += f'        item_class = \'{detail["itemClass"]}\', '
      insert_query += f'        item_name = \'{detail["itemName"]}\', '
      insert_query += f'        unit_price = {detail["unitPrice"]}, '
      insert_query += f'        tax_rate = {detail["taxRate"]}, '
      insert_query += f'        discount = {detail["discount"]}, '
      insert_query += f'        item_count = {detail["itemCount"]}, '
      insert_query += f'        price = {detail["price"]}, '
      insert_query += f'        update_date = {date}, '
      insert_query += f'        update_time = {time} '
      insert_query += f'WHERE   CONCAT(year, month, date, payment_number) = \'{key}\''
      insert_query += f'  AND   detail_number = \'{detail["detailNumber"]}\''

      cursor.execute(insert_query)

    conn.commit()                   #コミット

  except(mysql.connector.errors.ProgrammingError) as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断

def select_detail(key):
  query  = f'SELECT    CAST(detail_number AS NCHAR), '
  query += f'          CAST(large_class_cd AS NCHAR), '
  query += f'          CAST(middle_class_cd AS NCHAR), '
  query += f'          CAST(item_class AS NCHAR), '
  query += f'          CAST(item_name AS NCHAR), '
  query += f'          CAST(unit_price AS NCHAR), '
  query += f'          CAST(discount AS NCHAR), '
  query += f'          CAST(tax_rate AS NCHAR), '
  query += f'          CAST(item_count AS NCHAR), '
  query += f'          CAST(price AS NCHAR) '
  query += f'FROM      PAYMENT_DETAIL '
  query += f'WHERE     CONCAT(year, month, date, payment_number) = \'{key}\' '
  result_row = []
  
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(query)           #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in rows:
      label_tuple = ('detailNumber', 'largeClass', 'middleClass', 'itemClass', 'itemName', 'unitPrice', 'discount', 'taxRate', 'itemCount', 'price')
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

def select_waon(year, month):
  query  = f'SELECT    date, '
  query += f'          CAST(advances_paid_amount AS NCHAR), '
  query += f'          name, '
  query += f'          CONCAT(year, month, date, payment_number) '
  query += f'FROM      PAYMENT '
  query += f'LEFT JOIN USER_MF '
  query += f'       ON advances_paid_user_cd = cd '
  query += f'WHERE     year = \'{year}\' '
  query += f'      AND month = \'{month}\' '
  query += f'      AND shop_name = \'チャージ\' '
  result_row = []
  
  try:
    conn = db.get_conn()            #ここでDBに接続
    cursor = conn.cursor()          #カーソルを取得
    cursor.execute(query)           #sql実行
    rows = cursor.fetchall()        #selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in rows:
      label_tuple = ('date', 'amount', 'user', 'key')
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