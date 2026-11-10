#!/usr/bin/env python3
"""
Архимаг кода · слой данных.

По умолчанию: SQLite (локальный запуск, ноль зависимостей).
Если задана переменная DATABASE_URL: PostgreSQL (несколько инстансов, продакшен).

    DATABASE_URL=postgresql://user:pass@host/db?sslmode=require python3 server.py

Для PostgreSQL нужен драйвер: pip install "psycopg[binary]>=3.2"
"""
from __future__ import annotations

import os
import sqlite3
from datetime import datetime, timedelta

ROOT = os.path.dirname(os.path.abspath(__file__))
SCHEMA_SQLITE = os.path.join(ROOT, "schema.sql")
SCHEMA_PG = os.path.join(ROOT, "schema_postgres.sql")

COURSES = [
    "Первые чары: Scratch",
    "Python: заклинания и алгоритмы",
    "Веб-магия: HTML / CSS / JS",
    "Создатель игр: Godot",
    "ИИ и нейрочары",
    "Олимпиадная магия: C++",
]
ROLES = ("родитель", "ученик", "выпускник", "наставник")

SEED_REVIEWS = [
    ("Анна М.", "родитель", COURSES[0], 5,
     "Сын пришёл с первого урока и два часа рассказывал, как «оживил» кота в Scratch. Даже бабушке показал проект по видеосвязи. Впервые вижу, чтобы домашка вызывала такой восторг.", 24, 1),
    ("Мила, 11 лет", "ученик", COURSES[1], 5,
     "Написала программу, которая загадывает загадки про единорогов. Наставник показал, как сделать её сложнее, и теперь в неё играет весь класс!", 18, 2),
    ("Игорь П.", "родитель", COURSES[2], 5,
     "Дочь собрала сайт-портфолио про свой аквариум. Очень круто, что занятия не по учебнику, а сразу про настоящий проект и видимый результат.", 31, 4),
    ("Кирилл, 14 лет", "ученик", COURSES[3], 5,
     "Сделал свою первую игру с драконом за полтора месяца. Когда друг прошёл уровень, я чуть не взорвался от гордости.", 42, 7),
    ("Екатерина Л.", "родитель", COURSES[5], 5,
     "Готовились к олимпиаде, в итоге приз на региональном этапе. Отдельное спасибо за терпение: объясняют до тех пор, пока реально не станет понятно.", 15, 11),
    ("София, 13 лет", "ученик", COURSES[4], 5,
     "Учили нейросеть отличать котов от драконов. Получалось не сразу, но было очень интересно разбираться, почему она ошибается.", 26, 14),
    ("Дмитрий К.", "родитель", COURSES[0], 4,
     "Нравится, что группы маленькие и ребёнка реально слышат. Хотелось бы чуть больше домашних заданий, но это скорее плюс — не перегружают.", 9, 19),
    ("Алина, 16 лет", "выпускник", COURSES[5], 5,
     "Пришла на Scratch в десять, закончила C++ и поступила в профильный класс. Архимаг — место, где не боялись моих «а что, если...».", 27, 25),
]
SEED_LEADS = [
    ("Мария", "Тимур", 9, COURSES[0], "maria@example.com", 1),
    ("Олег", "Варя", 12, COURSES[1], "+7 900 000-00-00", 3),
    ("Наталья", "Артём", 15, COURSES[3], "nat@example.com", 6),
]


def now_str():
    return datetime.now().strftime("%Y-%m-%d %H:%M")


class Store:
    """Единый API к данным. backend = 'sqlite' | 'postgresql'."""

    def __init__(self, url=None):
        self.url = url or os.environ.get("DATABASE_URL")
        self.backend = "postgresql" if self.url else "sqlite"
        self.psycopg = None
        if self.backend == "postgresql":
            try:
                import psycopg
                from psycopg.rows import dict_row
            except ImportError as exc:
                raise RuntimeError(
                    'Для PostgreSQL установите драйвер: pip install "psycopg[binary]>=3.2"'
                ) from exc
            self.psycopg = psycopg
            self.dict_row = dict_row
        else:
            self.path = os.path.join(ROOT, "data", "reviews.db")

    # ---------- низкоуровневые операции ----------
    def connect(self):
        if self.backend == "postgresql":
            return self.psycopg.connect(self.url, row_factory=self.dict_row)
        conn = sqlite3.connect(self.path, timeout=10)
        conn.row_factory = sqlite3.Row
        return conn

    def _sql(self, sql):
        """SQLite '?' -> psycopg '%s'."""
        return sql.replace("?", "%s") if self.backend == "postgresql" else sql

    def fetch(self, sql, args=()):
        conn = self.connect()
        try:
            cur = conn.execute(self._sql(sql), args)
            if not cur.description:
                return []
            return [dict(r) for r in cur.fetchall()]
        finally:
            conn.close()

    def execute(self, sql, args=()):
        conn = self.connect()
        try:
            conn.execute(self._sql(sql), args)
            conn.commit()
        finally:
            conn.close()

    def insert(self, sql, args=()):
        """sql для PostgreSQL должен заканчиваться на RETURNING id."""
        conn = self.connect()
        try:
            cur = conn.execute(self._sql(sql), args)
            if self.backend == "postgresql":
                row = cur.fetchone()
                new_id = int(list(row.values())[0] if isinstance(row, dict) else row[0])
            else:
                new_id = cur.lastrowid
            conn.commit()
            return new_id
        finally:
            conn.close()

    # ---------- инициализация ----------
    def init(self):
        if self.backend == "sqlite":
            os.makedirs(os.path.dirname(self.path), exist_ok=True)
            conn = self.connect()
            try:
                conn.executescript(open(SCHEMA_SQLITE, encoding="utf-8").read())
                conn.commit()
            finally:
                conn.close()
            self._seed_sqlite()
        else:
            ddl = open(SCHEMA_PG, encoding="utf-8").read()
            statements = [s.strip() for s in ddl.split(";")
                          if s.strip() and not all(l.strip().startswith("--") or not l.strip()
                                                   for l in s.strip().splitlines())]
            conn = self.connect()
            try:
                for stmt in statements:
                    conn.execute(stmt)
                conn.commit()
            finally:
                conn.close()
            self._seed_pg()

    def _seed_sqlite(self):
        if self.fetch("SELECT COUNT(*) AS n FROM reviews")[0]["n"]:
            return
        for author, role, course, rating, text, likes, days in SEED_REVIEWS:
            self.execute(
                "INSERT INTO reviews(author,role,course,rating,text,likes,status,created_at)"
                " VALUES(?,?,?,?,?,?,'published',?)",
                (author, role, course, rating, text, likes,
                 (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d %H:%M")))
        self._seed_leads()

    def _seed_pg(self):
        """Advisory lock защищает от двойного сидирования при одновременном старте инстансов."""
        conn = self.connect()
        try:
            conn.execute("SELECT pg_advisory_xact_lock(727361)")
            cur = conn.execute("SELECT COUNT(*) AS n FROM reviews")
            count = cur.fetchone()["n"]
            if not count:
                for author, role, course, rating, text, likes, days in SEED_REVIEWS:
                    conn.execute(
                        "INSERT INTO reviews(author,role,course,rating,text,likes,status,created_at)"
                        " VALUES(%s,%s,%s,%s,%s,%s,'published',%s)",
                        (author, role, course, rating, text, likes,
                         (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d %H:%M")))
                for parent, child, age, course, contact, days in SEED_LEADS:
                    conn.execute(
                        "INSERT INTO leads(parent,child,age,course,contact,created_at)"
                        " VALUES(%s,%s,%s,%s,%s,%s)",
                        (parent, child, age, course, contact,
                         (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d %H:%M")))
            conn.commit()
        finally:
            conn.close()

    def _seed_leads(self):
        if self.fetch("SELECT COUNT(*) AS n FROM leads")[0]["n"]:
            return
        for parent, child, age, course, contact, days in SEED_LEADS:
            self.execute(
                "INSERT INTO leads(parent,child,age,course,contact,created_at) VALUES(?,?,?,?,?,?)",
                (parent, child, age, course, contact,
                 (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d %H:%M")))

    # ---------- отзывы ----------
    def reviews(self, course="", q="", sort="new"):
        sql = "SELECT * FROM reviews WHERE status='published'"
        args = []
        if course and course in COURSES:
            sql += " AND course=?"
            args.append(course)
        if q:
            sql += " AND (lower(author) LIKE ? OR lower(text) LIKE ? OR lower(course) LIKE ?)"
            args += [f"%{q.lower()}%"] * 3
        order = {"new": "id DESC", "rating": "rating DESC, id DESC",
                 "likes": "likes DESC, id DESC"}
        sql += " ORDER BY " + order.get(sort, "id DESC")
        return self.fetch(sql, args)

    def add_review(self, author, role, course, rating, text):
        base = ("INSERT INTO reviews(author,role,course,rating,text,likes,status,created_at)"
                " VALUES(?,?,?,?,?,0,'published',?)")
        sql = base.replace("?", "%s") + " RETURNING id" if self.backend == "postgresql" else base
        rid = self.insert(sql, (author, role, course, rating, text, now_str()))
        return self.fetch("SELECT * FROM reviews WHERE id=?", (rid,))[0]

    def like_review(self, rid):
        self.execute("UPDATE reviews SET likes=likes+1 WHERE id=?", (rid,))
        rows = self.fetch("SELECT * FROM reviews WHERE id=?", (rid,))
        return rows[0] if rows else None

    def delete_review(self, rid):
        self.execute("DELETE FROM reviews WHERE id=?", (rid,))

    def all_reviews(self):
        return self.fetch("SELECT * FROM reviews ORDER BY id DESC")

    # ---------- заявки ----------
    def leads(self):
        return self.fetch("SELECT * FROM leads ORDER BY id DESC")

    def add_lead(self, parent, child, age, course, contact):
        base = "INSERT INTO leads(parent,child,age,course,contact,created_at) VALUES(?,?,?,?,?,?)"
        sql = base.replace("?", "%s") + " RETURNING id" if self.backend == "postgresql" else base
        lid = self.insert(sql, (parent, child, age, course, contact, now_str()))
        return self.fetch("SELECT * FROM leads WHERE id=?", (lid,))[0]

    def delete_lead(self, lid):
        self.execute("DELETE FROM leads WHERE id=?", (lid,))

    # ---------- аналитика ----------
    def stats(self):
        row = self.fetch("SELECT COUNT(*) AS n, AVG(rating) AS avg FROM reviews")[0]
        avg_raw = row.get("avg") or 0
        by_course = self.fetch(
            "SELECT course, COUNT(*) AS n, AVG(rating) AS avg FROM reviews"
            " GROUP BY course ORDER BY n DESC")
        by_rating = self.fetch(
            "SELECT rating, COUNT(*) AS n FROM reviews GROUP BY rating ORDER BY rating DESC")
        leads = self.fetch("SELECT COUNT(*) AS n FROM leads")[0]["n"]
        return {
            "total": int(row["n"]),
            "avg": round(float(avg_raw), 2),
            "by_course": [{"course": r["course"], "n": int(r["n"]),
                           "avg": round(float(r["avg"] or 0), 1)} for r in by_course],
            "by_rating": [{"rating": int(r["rating"]), "n": int(r["n"])} for r in by_rating],
            "leads": int(leads),
            "courses": COURSES,
        }

    def health(self):
        n = self.fetch("SELECT COUNT(*) AS n FROM reviews")[0]["n"]
        return {"ok": True, "engine": self.backend, "reviews": int(n)}
