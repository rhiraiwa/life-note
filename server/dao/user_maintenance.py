import mysql.connector
import json
import server.dao.db_connection as db

date = "DATE_FORMAT(CURRENT_DATE(), '%Y%m%d')"
time = "TIME_FORMAT(CURRENT_TIME(), '%H%i%s')"
select_query = """
    SELECT cd, name
    FROM USER_MF
    WHERE delete_flag = 0
    ORDER BY CAST(cd AS SIGNED);
"""

def select_mf():
    return execute_query("")

def insert_mf(name):
    insert_query = f"""
        INSERT INTO USER_MF
        VALUES (
            (SELECT CASE
                WHEN MAX(cd) IS NULL
                THEN 0
                ELSE MAX(cd) + 1
            END
            FROM USER_MF TEMP),
            '{name}',
            {date},
            {time},
            {date},
            {time},
            0
        );
    """

    return execute_query(insert_query)

def edit_mf(cd, name):
    edit_query = f"""
        UPDATE USER_MF
        SET name = '{name}',
            update_date = {date},
            update_time = {time}
        WHERE cd = {cd};
    """

    return execute_query(edit_query)

def delete_mf(cd):
    delete_query = f"""
        UPDATE USER_MF
        SET delete_flag = 1,
            update_date = {date},
            update_time = {time}
        WHERE cd = {cd};
    """

    return execute_query(delete_query)

def execute_query(query):
    result_row = []

    try:
        conn = db.get_conn()
        cursor = conn.cursor()

        if query != "":
            cursor.execute(query)
            conn.commit()

        cursor.execute(select_query)
        rows = cursor.fetchall()

        for data_tuple in rows:
            label_tuple = ("cd", "name")
            row_dict = {label: data for data, label in zip(data_tuple, label_tuple)}
            result_row.append(row_dict)

    except mysql.connector.errors.ProgrammingError as e:
        print("エラーが発生しました")
        print(e)
    finally:
        if conn is not None:
            cursor.close()
            conn.close()

    output_json = json.dumps(result_row, ensure_ascii=False)
    return output_json
