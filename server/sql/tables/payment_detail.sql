DROP TABLE LIFE_NOTE.PAYMENT_DETAIL;

CREATE TABLE LIFE_NOTE.PAYMENT_DETAIL (
  year                   VARCHAR(4)    NOT NULL,
  month                  VARCHAR(2)    NOT NULL,
  date                   VARCHAR(2)    NOT NULL,
  payment_number         SMALLINT      NOT NULL,
  detail_number          SMALLINT      NOT NULL,
  large_class_cd         SMALLINT      NOT NULL,
  middle_class_cd        SMALLINT,
  item_class             VARCHAR(50),
  item_name              VARCHAR(50),
  unit_price             DECIMAL(9,0)  NOT NULL,
  tax_rate               SMALLINT,
  discount               DECIMAL(9,0),
  item_count             SMALLINT      NOT NULL,
  price                  DECIMAL(9,0)  NOT NULL,
  insert_date            VARCHAR(8),
  insert_time            VARCHAR(6),
  update_date            VARCHAR(8),
  update_time            VARCHAR(6),
  delete_flag            TINYINT
);

ALTER TABLE LIFE_NOTE.PAYMENT_DETAIL ADD PRIMARY KEY (year, month, date, payment_number, detail_number);