#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:8080/api}"

log() {
  printf '[%s] %s\n' "$(date '+%H:%M:%S')" "$*"
}

log "=== STARTING FULL BACKEND SMOKE TEST ==="

# Генерируем уникальные данные для каждого запуска
UNIQ=$(date +%s)
export API_EMAIL="smoke-$UNIQ@example.com"
export API_USER="smoke-user-$UNIQ"

# Запуск отдельных smoke-тестов
log "1️⃣  Проверка карточек"
bash tests/bash/cards_smoke.sh

log "2️⃣  Проверка смены пароля"
bash tests/bash/change_password_smoke.sh

log "3️⃣  Проверка лайков"
bash tests/bash/likes_smoke.sh

log "🎉 FULL SMOKE TEST COMPLETED SUCCESSFULLY"
