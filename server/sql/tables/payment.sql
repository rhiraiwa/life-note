DROP TABLE LIFE_NOTE.PAYMENT;

CREATE TABLE LIFE_NOTE.PAYMENT (
  year                   VARCHAR(4)    NOT NULL,
  month                  VARCHAR(2)    NOT NULL,
  date                   VARCHAR(2)    NOT NULL,
  payment_number         SMALLINT      NOT NULL,
  shop_name              VARCHAR(50),
  amount                 DECIMAL(9,0)  NOT NULL,
  advances_paid_flag     TINYINT,
  advances_paid_amount   DECIMAL(9,0),
  advances_paid_user_cd  VARCHAR(15),
  refund_flag            TINYINT,
  note                   NVARCHAR(100),
  insert_date            VARCHAR(8),
  insert_time            VARCHAR(6),
  update_date            VARCHAR(8),
  update_time            VARCHAR(6),
  delete_flag            TINYINT
);

ALTER TABLE LIFE_NOTE.PAYMENT ADD PRIMARY KEY (year, month, date, payment_number);