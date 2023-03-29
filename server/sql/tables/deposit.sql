DROP TABLE LIFE_NOTE.DEPOSIT;

CREATE TABLE LIFE_NOTE.DEPOSIT (
  year            VARCHAR(4)    NOT NULL,
  month           VARCHAR(2)    NOT NULL,
  date            VARCHAR(2)    NOT NULL,
  deposit_number  SMALLINT      NOT NULL,
  category_cd     SMALLINT      NOT NULL,
  user_cd         VARCHAR(15)   NOT NULL,
  amount          DECIMAL(9,0)  NOT NULL,
  insert_date     VARCHAR(8),
  insert_time     VARCHAR(6),
  update_date     VARCHAR(8),
  update_time     VARCHAR(6),
  delete_flag     TINYINT
);

ALTER TABLE LIFE_NOTE.DEPOSIT ADD PRIMARY KEY (year, month, date, deposit_number);