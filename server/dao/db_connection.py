import mysql.connector

#DB接続情報
def get_conn():
  conn = mysql.connector.connect(
    host = '127.0.0.1',      #localhostでもOK
    user = 'writer',
    passwd = 'writer00',
    db = 'LIFE_NOTE'
  )
  return conn