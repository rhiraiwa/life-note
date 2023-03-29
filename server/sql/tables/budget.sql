DROP TABLE LIFE_NOTE.BUDGET;

CREATE TABLE LIFE_NOTE.BUDGET (
  year          VARCHAR(4)    NOT NULL,
  month         VARCHAR(2)    NOT NULL,
  category_cd   SMALLINT      NOT NULL,
  user_cd       VARCHAR(15)   NOT NULL,
  budeget       DECIMAL(9,0)  NOT NULL,
  insert_date   VARCHAR(8),
  insert_time   VARCHAR(6),
  update_date   VARCHAR(8),
  update_time   VARCHAR(6)
);

ALTER TABLE LIFE_NOTE.BUDGET ADD PRIMARY KEY (year, month, category_cd, user_cd);