DROP TABLE LIFE_NOTE.LARGE_CLASS_MF;

CREATE TABLE LIFE_NOTE.LARGE_CLASS_MF (
  cd            SMALLINT      NOT NULL,
  name          VARCHAR(20)   NOT NULL,
  insert_date   VARCHAR(8),
  insert_time   VARCHAR(6),
  update_date   VARCHAR(8),
  update_time   VARCHAR(6),
  delete_flag   TINYINT
);

ALTER TABLE LIFE_NOTE.LARGE_CLASS_MF ADD PRIMARY KEY (cd);