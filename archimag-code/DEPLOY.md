# Бесплатный деплой «Архимага кода»

Короткий ответ: **Render (бесплатный Web Service) + Neon (бесплатный PostgreSQL)**. Сайт будет доступен по адресу вида `https://archimag-code.onrender.com`, отзывы — в общей базе, админка — под паролем. Платить ничего не нужно, но у бесплатных планов есть описанные ниже ограничения.

## Почему именно такая связка

Сайту нужен **постоянно работающий Python-процесс** (`server.py` раздаёт HTML/CSS/JS и REST API). Поэтому GitHub Pages, Netlify и «статический» Vercel не подойдут: они отдают только файлы и не запускают бэкенд. Для совсем простого варианта без базы подойдёт `index-standalone.html` на статическом хостинге, но отзывы тогда будут жить только в браузере.

| Платформа | Что даёт бесплатно | Подводный камень |
| --- | --- | --- |
| **Render** (Web Service) | 750 часов инстанса в месяц, бесплатный HTTPS-домен, автодеплой из GitHub | Засыпает через 15 минут без трафика, пробуждение занимает около минуты; локальные файлы при редеплое теряются |
| **Render Postgres** | 1 ГБ, одна база | **Истекает через 30 дней** (+14 дней на апгрейд, затем удаление) — поэтому для постоянной БД берём Neon |
| **Neon** (PostgreSQL) | Бессрочный Free без карты: 100 проектов, 1 ГБ на проект, 100 CU-часов на проект в месяц, 10 веток, 5 ГБ трафика | Вычисления уходят в ноль через 5 минут простоя; при исчерпании лимита — пауза до нового периода; окно восстановления 6 часов |
| Supabase | 2 проекта по 500 МБ, без срока | Проект засыпает после недели неактивности, автоматических бэкапов нет |
| Railway | Trial: $5 кредита на 30 дней | Постоянного бесплатного плана нет; условия Free-плана в 2026 году расходятся у разных источников |
| PythonAnywhere | 1 веб-приложение на поддомене, 512 МБ | Исходящий интернет только по whitelist → внешняя PostgreSQL (Neon/Supabase) с free-аккаунта недоступна; собственный PostgreSQL только на платном плане; нужен WSGI-адаптер |
| Oracle Cloud Always Free | ARM VM: 2 OCPU на тенанси, 200 ГБ блочного хранилища, 10 ТБ исходящего трафика в месяц, бессрочно | Сложнее в настройке; требуется карта, ARM-образ, свободная ёмкость в регионе, firewall/Docker/systemd |

Условия проверены по официальным страницам: [Render Free](https://render.com/docs/free), [Render FAQ](https://render.com/docs/faq), [Neon Free limits](https://neon.com/faqs/free-plan-limits-and-quotas), [Neon pricing](https://neon.com/pricing), [Oracle Always Free](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm), [PythonAnywhere allowlist](https://help.pythonanywhere.com/pages/403ForbiddenError/), [PythonAnywhere Postgres](https://help.pythonanywhere.com/pages/Postgres/). Обзоры по [Supabase](https://costbench.com/software/database-as-a-service/supabase/free-plan/), [Railway](https://encore.dev/articles/render-vs-railway), [PythonAnywhere](https://whichdevtool.com/tools/pythonanywhere/) и [Oracle ARM в 2026](https://jellywatch.app/blog/jellyfin-oracle-cloud-free-tier-arm-setup-2026/) — для контекста, перед оплатой сверяйтесь с официальными тарифами.

## Пошагово: Render + Neon

### 1. Подготовьте репозиторий

Залить папку `archimag-code` на GitHub (можно без `data/`, `preview/` и `.env`). Важно, чтобы в корне репозитория лежали: `server.py`, `database.py`, `requirements.txt`, `schema.sql`, `schema_postgres.sql`, `index.html`, `styles.css`, `app.js`, `assets/`.

`.env` и `data/reviews.db` в git не добавляйте — они уже в `.gitignore` и `.dockerignore`.

### 2. Создайте базу в Neon

1. Зарегистрируйтесь на [neon.tech](https://neon.com), создайте проект (Free, без карты).
2. Скопируйте строку подключения вида `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`.
3. **`sslmode=require` обязателен.**

Таблицы и 8 демо-отзывов сервер создаст сам при первом запуске.

### 3. Создайте Web Service в Render

1. New → **Web Service** → подключите GitHub-репозиторий.
2. Runtime: **Python 3**. Build Command: `pip install -r requirements.txt`. Start Command: `python3 server.py`.
3. Plan: **Free**. (Можно вместо ручной настройки импортировать `render.yaml` через Blueprint, но секреты всё равно задаются вручную.)
4. В **Environment** добавьте переменные:

| Переменная | Значение |
| --- | --- |
| `DATABASE_URL` | строка подключения из Neon |
| `ADMIN_USER` | `admin` (или свой логин) |
| `ADMIN_PASSWORD` | длинный случайный пароль |
| `SESSION_SECRET` | длинная случайная строка; **одинаковая на всех инстансах** |
| `COOKIE_SECURE` | `1` |

`PORT` Render выставит сам — `server.py` читает его из окружения. `REQUIRE_AUTH` задавать не нужно: при наличии `DATABASE_URL` авторизация включается автоматически.

### 4. Проверьте

- Откройте `https://<имя>.onrender.com/api/health` — должно быть `"engine": "postgresql"`, `"auth_required": true`.
- Откройте сам сайт: отзывы приходят из PostgreSQL, лента обновляется раз в 5 секунд.
- Переключатель **«База данных»** попросит логин и пароль. После входа доступны таблицы, удаление и экспорт CSV; кнопка «Выйти» завершает сессию.
- Если сервис «спал», первый запрос может занять около минуты — это норма для free-плана.

## Важно для нескольких инстансов

- Сессия — **stateless**: подписанная HMAC-cookie с `HttpOnly`, `SameSite=Lax`, `Secure`. Состояние на сервере не хранится, поэтому любой инстанс примет любую сессию, если у всех одинаковый `SESSION_SECRET`.
- При старте каждого инстанса выполняется `CREATE TABLE IF NOT EXISTS`; сидирование защищено `pg_advisory_xact_lock`, чтобы параллельный старт не создал двойные демо-отзывы.
- Лимит частоты запросов сейчас в памяти процесса — на нескольких инстансах он считается отдельно. Для строгой защиты вынесите его в Redis.
- Статику раздаёт каждый инстанс независимо; общие данные — только в PostgreSQL. Локальные файлы free-инстанса Render не сохраняются — ещё одна причина держать БД снаружи.
- Экспорт CSV делайте регулярно: у бесплатного Neon короткое окно восстановления, у Supabase нет автоматических бэкапов.

## Альтернатива без «засыпания»

Oracle Cloud Always Free VPS: поднимаете Ubuntu ARM, ставите PostgreSQL и `psycopg`, запускаете `python3 server.py` под `systemd`, наружу выпускаете через Nginx + бесплатный HTTPS-сертификат. Сайт не засыпает, но нужно больше ручной настройки: официальная документация сейчас указывает **2 OCPU суммарно на тенанси**, 200 ГБ диска и 10 ТБ исходящего трафика в месяц.

## Локальная проверка перед деплоем

```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
DATABASE_URL='postgresql://user:pass@localhost:5432/archimag' \
ADMIN_PASSWORD='secret' SESSION_SECRET='long-random-string' \
.venv/bin/python server.py 8001
```

Откройте `http://localhost:8001/`. Проект проверен на PostgreSQL 17 + psycopg 3: создание отзыва, лайк, удаление, заявки, CSV-экспорт и вход в админку.
