-- Архимаг кода · схема для PostgreSQL (несколько инстансов)
-- Применяется автоматически при запуске с DATABASE_URL.

CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  author      TEXT    NOT NULL,
  role        TEXT    NOT NULL CHECK(role IN ('родитель','ученик','выпускник','наставник')),
  course      TEXT    NOT NULL,
  rating      INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  text        TEXT    NOT NULL,
  likes       INTEGER NOT NULL DEFAULT 0,
  status      TEXT    NOT NULL DEFAULT 'published',
  created_at  TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_course  ON reviews(course);

CREATE TABLE IF NOT EXISTS leads (
  id          SERIAL PRIMARY KEY,
  parent      TEXT    NOT NULL,
  child       TEXT    NOT NULL,
  age         INTEGER NOT NULL CHECK(age BETWEEN 6 AND 18),
  course      TEXT    NOT NULL,
  contact     TEXT    NOT NULL,
  created_at  TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
