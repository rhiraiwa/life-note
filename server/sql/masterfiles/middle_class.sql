DROP TABLE LIFE_NOTE.MIDDLE_CLASS_MF;

CREATE TABLE LIFE_NOTE.MIDDLE_CLASS_MF (
  large_class_cd  SMALLINT      NOT NULL,
  cd              SMALLINT      NOT NULL,
  name            VARCHAR(20),
  insert_date     VARCHAR(8),
  insert_time     VARCHAR(6),
  update_date     VARCHAR(8),
  update_time     VARCHAR(6),
  delete_flag     TINYINT
);

ALTER TABLE LIFE_NOTE.MIDDLE_CLASS_MF ADD PRIMARY KEY (cd);