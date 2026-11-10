#!/usr/bin/env bash
# Архимаг кода — запуск на macOS / Linux
# Можно передать другой порт: ./start.sh 8080
cd "$(dirname "$0")" || exit 1
PORT="${1:-8001}"

if command -v python3 >/dev/null 2>&1; then PY=python3
elif command -v python >/dev/null 2>&1; then PY=python
else
  echo "Python 3 не найден. Установите: https://www.python.org/downloads/ (macOS) или через пакетный менеджер (Linux)."
  exit 1
fi

# Открываем браузер через 2 секунды, когда сервер уже поднялся
(
  sleep 2
  if command -v open >/dev/null 2>&1; then open "http://localhost:$PORT/" >/dev/null 2>&1
  elif command -v xdg-open >/dev/null 2>&1; then xdg-open "http://localhost:$PORT/" >/dev/null 2>&1
  fi
) &

echo "============================================================"
echo "  Архимаг кода: http://localhost:$PORT/"
echo "  Остановить сервер: Ctrl+C"
echo "============================================================"
echo
exec "$PY" server.py "$PORT"
