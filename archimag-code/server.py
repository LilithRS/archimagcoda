#!/usr/bin/env python3
"""
Архимаг кода — статический сайт + REST API + админ-авторизация.

Локально (без переменных): SQLite, админка открыта без пароля.
Продакшен: DATABASE_URL=postgresql://...  → PostgreSQL + обязательный вход.

    python3 server.py [порт]      # порт также берётся из $PORT (Render/Railway/Fly)

Зависимости: только stdlib для SQLite; для PostgreSQL — requirements.txt.
"""
from __future__ import annotations

import base64
import csv
import hashlib
import hmac
import io
import json
import mimetypes
import os
import re
import secrets
import sys
import threading
import time
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, unquote, urlparse

from database import COURSES, ROLES, Store

ROOT = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------- конфигурация
STORE = Store()
AUTH_REQUIRED = bool(os.environ.get("DATABASE_URL")) or os.environ.get("REQUIRE_AUTH", "0") == "1"
ADMIN_USER = os.environ.get("ADMIN_USER", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")
if AUTH_REQUIRED and not ADMIN_PASSWORD:
    ADMIN_PASSWORD = secrets.token_urlsafe(14)
    print("⚠  ADMIN_PASSWORD не задан. Сгенерирован одноразовый пароль:", ADMIN_PASSWORD, flush=True)
SESSION_SECRET = os.environ.get("SESSION_SECRET", "")
if AUTH_REQUIRED and not SESSION_SECRET:
    SESSION_SECRET = secrets.token_hex(32)
    print("⚠  SESSION_SECRET не задан: сессии не будут общими между инстансами. "
          "Задайте одинаковый SESSION_SECRET на всех инстансах.", flush=True)
SESSION_TTL = int(os.environ.get("SESSION_TTL", 60 * 60 * 12))
COOKIE_NAME = "archimag_session"

RATE_LIMIT = 6
RATE_WINDOW = 60
_rate: dict[str, list[float]] = {}
_rate_lock = threading.Lock()
CONTROL_CHARS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f]")


def clean(value, max_len=600):
    return CONTROL_CHARS.sub("", str(value or "")).strip()[:max_len]


def check_rate(key, limit=RATE_LIMIT):
    with _rate_lock:
        t = time.time()
        hits = [x for x in _rate.get(key, []) if t - x < RATE_WINDOW]
        if len(hits) >= limit:
            _rate[key] = hits
            return False
        hits.append(t)
        _rate[key] = hits
        return True


# ---------------------------------------------------------------- сессии (stateless)
def _sign(payload):
    return hmac.new(SESSION_SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()


def _make_token():
    data = json.dumps({"u": ADMIN_USER, "exp": int(time.time()) + SESSION_TTL},
                      separators=(",", ":")).encode()
    payload = base64.urlsafe_b64encode(data).decode().rstrip("=")
    return payload + "." + _sign(payload)


def _token_valid(token):
    if not token or not SESSION_SECRET:
        return False
    try:
        payload, sig = token.split(".", 1)
        if not hmac.compare_digest(sig, _sign(payload)):
            return False
        raw = base64.urlsafe_b64decode(payload + "=" * (-len(payload) % 4))
        data = json.loads(raw)
        return data.get("u") == ADMIN_USER and data.get("exp", 0) > time.time()
    except Exception:
        return False


class Handler(BaseHTTPRequestHandler):
    server_version = "ArchimagCode/2.0"

    # ---------------------------------------------------------------- helpers
    def _send(self, code, payload, ctype="application/json; charset=utf-8",
              headers=None, body=True):
        if isinstance(payload, str):
            data = payload.encode("utf-8")
        elif isinstance(payload, bytes):
            data = payload
        else:
            data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        for k, v in (headers or {}).items():
            self.send_header(k, v)
        self.end_headers()
        if body:
            self.wfile.write(data)

    def _error(self, code, message):
        self._send(code, {"error": message})

    def _json_body(self):
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0 or length > 20_000:
            return {}
        try:
            return json.loads(self.rfile.read(length).decode("utf-8"))
        except Exception:
            return {}

    def _cookie(self):
        try:
            jar = SimpleCookie()
            jar.load(self.headers.get("Cookie", ""))
            morsel = jar.get(COOKIE_NAME)
            return morsel.value if morsel else None
        except Exception:
            return None

    def _is_admin(self):
        return (not AUTH_REQUIRED) or _token_valid(self._cookie())

    def _guard(self):
        if self._is_admin():
            return True
        self._error(401, "Требуется вход в админку")
        return False

    def _cookie_header(self, token, max_age=SESSION_TTL):
        secure = os.environ.get("COOKIE_SECURE") == "1" or \
                 self.headers.get("X-Forwarded-Proto", "").split(",")[0].strip() == "https"
        parts = [f"{COOKIE_NAME}={token}", "Path=/", "HttpOnly", "SameSite=Lax",
                 f"Max-Age={max_age}"]
        if secure:
            parts.append("Secure")
        return "; ".join(parts)

    # ---------------------------------------------------------------- verbs
    def do_OPTIONS(self):
        self._send(204, b"", body=False)

    def do_HEAD(self):
        self._handle(body=False)

    def do_GET(self):
        self._handle(body=True)

    def do_POST(self):
        self._handle(body=True)

    def do_DELETE(self):
        self._handle(body=True)

    # ---------------------------------------------------------------- router
    def _handle(self, body=True):
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        query = parse_qs(parsed.query)
        if path.startswith("/api/"):
            try:
                return self._api(self.command, path, query, body)
            except Exception as exc:
                return self._error(500, f"Внутренняя ошибка: {exc}")
        rel = path.lstrip("/") or "index.html"
        if rel.endswith("/"):
            rel += "index.html"
        full = os.path.normpath(os.path.join(ROOT, rel))
        if (os.path.commonpath([ROOT, full]) != ROOT
                or os.path.basename(full).startswith(".")
                or full.endswith(".db")):
            return self._error(403, "Доступ запрещён")
        if not os.path.isfile(full):
            return self._error(404, "Страница не найдена")
        ctype = mimetypes.guess_type(full)[0] or "application/octet-stream"
        if ctype.startswith("text/") or ctype in ("application/javascript", "application/json"):
            ctype += "; charset=utf-8"
        with open(full, "rb") as f:
            self._send(200, f.read(), ctype, body=body)

    def _api(self, method, path, query, body):
        # ---------- состояние и авторизация ----------
        if method == "GET" and path == "/api/health":
            h = STORE.health()
            h.update({"auth_required": AUTH_REQUIRED, "session": self._is_admin(),
                      "file": "data/reviews.db" if STORE.backend == "sqlite" else "PostgreSQL"})
            return self._send(200, h, body=body)

        if method == "GET" and path == "/api/admin/session":
            return self._send(200, {"authenticated": self._is_admin(),
                                   "auth_required": AUTH_REQUIRED,
                                   "engine": STORE.backend}, body=body)

        if method == "POST" and path == "/api/admin/login":
            if not check_rate("login:" + self.client_address[0], 5):
                return self._error(429, "Слишком много попыток входа. Подождите минуту.")
            d = self._json_body()
            user_ok = hmac.compare_digest(clean(d.get("username"), 60), ADMIN_USER)
            pass_ok = hmac.compare_digest(str(d.get("password") or ""), ADMIN_PASSWORD)
            if not AUTH_REQUIRED or (user_ok and pass_ok and ADMIN_PASSWORD):
                return self._send(200, {"ok": True, "authenticated": True},
                                  headers={"Set-Cookie": self._cookie_header(_make_token())}, body=body)
            return self._error(401, "Неверный логин или пароль")

        if method == "POST" and path == "/api/admin/logout":
            return self._send(200, {"ok": True},
                              headers={"Set-Cookie": self._cookie_header("", 0)}, body=body)

        # ---------- публичное чтение ----------
        if method == "GET" and path == "/api/reviews":
            items = STORE.reviews((query.get("course") or [""])[0],
                                  clean((query.get("q") or [""])[0], 80),
                                  (query.get("sort") or ["new"])[0])
            return self._send(200, {"items": items, "total": len(items),
                                   "engine": STORE.backend}, body=body)

        if method == "GET" and path == "/api/stats":
            return self._send(200, STORE.stats(), body=body)

        # ---------- защищённое чтение (контакты и выгрузка) ----------
        if method == "GET" and path == "/api/leads":
            if not self._guard():
                return
            items = STORE.leads()
            return self._send(200, {"items": items, "total": len(items),
                                   "engine": STORE.backend}, body=body)

        if method == "GET" and path == "/api/export.csv":
            if not self._guard():
                return
            rows = STORE.all_reviews()
            buf = io.StringIO()
            buf.write("\ufeff")
            w = csv.writer(buf, delimiter=";")
            w.writerow(["id", "created_at", "author", "role", "course", "rating",
                        "text", "likes", "status"])
            for r in rows:
                w.writerow([r["id"], r["created_at"], r["author"], r["role"], r["course"],
                            r["rating"], r["text"], r["likes"], r["status"]])
            return self._send(200, buf.getvalue().encode("utf-8"), "text/csv; charset=utf-8",
                              {"Content-Disposition": 'attachment; filename="archimag-reviews.csv"'},
                              body=body)

        # ---------- публичные формы ----------
        if method == "POST" and path == "/api/reviews":
            if not check_rate("post:" + self.client_address[0]):
                return self._error(429, "Слишком много отзывов. Подождите минуту.")
            d = self._json_body()
            if clean(d.get("website")):
                return self._error(400, "Отклонено антиспам-фильтром.")
            author = clean(d.get("author"), 60)
            role = clean(d.get("role"), 20)
            course = clean(d.get("course"), 80)
            text = clean(d.get("text"), 600)
            try:
                rating = int(d.get("rating"))
            except (TypeError, ValueError):
                rating = 0
            if len(author) < 2:
                return self._error(400, "Укажите имя (минимум 2 символа).")
            if role not in ROLES:
                return self._error(400, "Выберите, кто оставляет отзыв.")
            if course not in COURSES:
                return self._error(400, "Выберите курс из списка.")
            if not 1 <= rating <= 5:
                return self._error(400, "Поставьте оценку от 1 до 5.")
            if len(text) < 10:
                return self._error(400, "Напишите отзыв чуть подробнее (минимум 10 символов).")
            if not d.get("consent"):
                return self._error(400, "Нужно согласие на публикацию отзыва.")
            item = STORE.add_review(author, role, course, rating, text)
            return self._send(201, {"item": item, "message": "Отзыв опубликован"}, body=body)

        m = re.fullmatch(r"/api/reviews/(\d+)/like", path)
        if method == "POST" and m:
            item = STORE.like_review(int(m.group(1)))
            if not item:
                return self._error(404, "Отзыв не найден")
            return self._send(200, {"item": item}, body=body)

        if method == "POST" and path == "/api/leads":
            if not check_rate("post:" + self.client_address[0]):
                return self._error(429, "Слишком много заявок. Подождите минуту.")
            d = self._json_body()
            if clean(d.get("website")):
                return self._error(400, "Отклонено антиспам-фильтром.")
            parent = clean(d.get("parent"), 60)
            child = clean(d.get("child"), 60)
            course = clean(d.get("course"), 80)
            contact = clean(d.get("contact"), 100)
            try:
                age = int(d.get("age"))
            except (TypeError, ValueError):
                age = 0
            if len(parent) < 2 or len(child) < 2:
                return self._error(400, "Укажите имена родителя и ребёнка.")
            if not 6 <= age <= 18:
                return self._error(400, "Возраст должен быть от 6 до 18 лет.")
            if course not in COURSES:
                return self._error(400, "Выберите курс из списка.")
            if len(contact) < 5:
                return self._error(400, "Укажите e-mail или телефон для связи.")
            item = STORE.add_lead(parent, child, age, course, contact)
            return self._send(201, {"item": item, "message": "Заявка сохранена"}, body=body)

        # ---------- защищённые изменения ----------
        m = re.fullmatch(r"/api/reviews/(\d+)", path)
        if method == "DELETE" and m:
            if not self._guard():
                return
            STORE.delete_review(int(m.group(1)))
            return self._send(200, {"ok": True}, body=body)

        m = re.fullmatch(r"/api/leads/(\d+)", path)
        if method == "DELETE" and m:
            if not self._guard():
                return
            STORE.delete_lead(int(m.group(1)))
            return self._send(200, {"ok": True}, body=body)

        return self._error(404, "Метод не найден")

    def log_message(self, fmt, *args):
        sys.stderr.write("[%s] %s\n" % (self.log_date_time_string(), fmt % args))


if __name__ == "__main__":
    try:
        STORE.init()
    except Exception as exc:
        sys.exit(f"Не удалось инициализировать базу данных ({STORE.backend}): {exc}")
    port = int(sys.argv[1]) if len(sys.argv) > 1 else int(os.environ.get("PORT", 8001))
    server = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    server.daemon_threads = True
    print(f"Архимаг кода: http://0.0.0.0:{port} | БД: {STORE.backend} | "
          f"авторизация: {'включена' if AUTH_REQUIRED else 'отключена (локальный режим)'}",
          flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
