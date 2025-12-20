#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:8080/api}"

log() {
  printf '[%s] %s\n' "$(date '+%H:%M:%S')" "$*"
}

die() {
  echo "❌ $*" >&2
  exit 1
}

require_bin() {
  command -v "$1" >/dev/null 2>&1 || die "Команда '$1' недоступна, установите её и повторите запуск"
}

require_bin curl
require_bin jq

EMAIL="file-upload-$(date +%s)-$RANDOM@example.com"
PASSWORD="FilePass123!"
NAME="File Upload Test"
CITY="FileCity"
STUDY="FileStudy"
USER_ID=""
CARD_ID=""
TOKEN=""

# Создаём временный файл для теста
TEMP_FILE=$(mktemp)
echo "Test file content $(date)" > "$TEMP_FILE"
TEMP_FILE_NAME="test_file_$(date +%s).txt"

cleanup() {
  rm -f "$TEMP_FILE"
  if [[ -n "$CARD_ID" ]]; then
    log "Удаляем тестовую карточку"
    curl -s -X DELETE "$API_URL/cards/user/$CARD_ID" >/dev/null || true
  fi
}
trap cleanup EXIT

health_check() {
  log "Проверяем доступность API"
  local response
  if ! response=$(curl -sS "$API_URL/public/ping"); then
    die "Сервис не отвечает на /public/ping"
  fi
  [[ "$response" == "pong" ]] || die "Ожидали 'pong', получили '$response'"
  log "Здоровье API подтверждено"
}

register_user() {
  log "Регистрируем пользователя $EMAIL"
  local payload response
  payload=$(jq -n --arg email "$EMAIL" --arg password "$PASSWORD" --arg name "$NAME" --arg city "$CITY" --arg study "$STUDY" '{email:$email,password:$password,name:$name,city:$city,study:$study}')
  response=$(curl -sS -X POST "$API_URL/users/register" -H "Content-Type: application/json" -d "$payload")
  USER_ID=$(echo "$response" | jq -r '.id // empty')
  [[ -n "$USER_ID" ]] || die "Регистрация не вернула id: $response"
  log "Пользователь создан: $USER_ID"
}

get_auth_token() {
  log "Получаем токен для авторизованных запросов"
  local payload response
  payload=$(jq -n --arg email "$EMAIL" --arg password "$PASSWORD" '{email:$email,password:$password}')
  response=$(curl -sS -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d "$payload")
  TOKEN=$(echo "$response" | jq -r '.token // empty')
  [[ -n "$TOKEN" && "$TOKEN" != "null" ]] || die "Логин не вернул токен: $response"
  log "Токен получен"
}

create_card_with_file() {
  log "Создаём карточку с файлом"
  local response
  response=$(curl -sS -X POST "$API_URL/cards/user" \
    -H "Authorization: Bearer $TOKEN" \
    -F "authorId=$USER_ID" \
    -F "type=Лабораторная" \
    -F "subject=Тест" \
    -F "title=Card with File $(date +%s)" \
    -F "description=Test card with file upload" \
    -F "city=$CITY" \
    -F "study=$STUDY" \
    -F "course=1" \
    -F "files=@$TEMP_FILE;filename=$TEMP_FILE_NAME")
  
  CARD_ID=$(echo "$response" | jq -r '.id // empty')
  [[ -n "$CARD_ID" ]] || die "Создание карточки не вернуло id: $response"
  
  local authorName
  authorName=$(echo "$response" | jq -r '.authorName // empty')
  [[ "$authorName" == "$NAME" ]] || die "authorName не совпадает: ожидали '$NAME', получили '$authorName'"
  
  log "Карточка создана: $CARD_ID, authorName=$authorName"
}

verify_card_has_author_name() {
  log "Проверяем, что карточка содержит authorName"
  local response authorName
  response=$(curl -sS "$API_URL/cards/$CARD_ID" 2>/dev/null || curl -sS "$API_URL/cards" | jq --arg id "$CARD_ID" '.[] | select(.id == $id)')
  authorName=$(echo "$response" | jq -r '.authorName // empty')
  [[ -n "$authorName" ]] || die "Карточка не содержит authorName: $response"
  [[ "$authorName" == "$NAME" ]] || die "authorName неверный: ожидали '$NAME', получили '$authorName'"
  log "authorName подтверждён: $authorName"
}

create_card_without_file() {
  log "Создаём карточку без файла (проверка обратной совместимости)"
  local response cardId
  response=$(curl -sS -X POST "$API_URL/cards/user" \
    -H "Authorization: Bearer $TOKEN" \
    -F "authorId=$USER_ID" \
    -F "type=Практическая" \
    -F "subject=Математика" \
    -F "title=Card without File $(date +%s)" \
    -F "city=$CITY" \
    -F "study=$STUDY" \
    -F "course=2")
  
  cardId=$(echo "$response" | jq -r '.id // empty')
  [[ -n "$cardId" ]] || die "Создание карточки без файла не вернуло id: $response"
  
  local authorName
  authorName=$(echo "$response" | jq -r '.authorName // empty')
  [[ "$authorName" == "$NAME" ]] || die "authorName не совпадает в карточке без файла"
  
  log "Карточка без файла создана: $cardId"
  
  # Удаляем тестовую карточку
  curl -s -X DELETE "$API_URL/cards/user/$cardId" >/dev/null || true
}

main() {
  log "Запускаем smoke-тест загрузки файлов и authorName"
  health_check
  register_user
  get_auth_token
  create_card_with_file
  verify_card_has_author_name
  create_card_without_file
  log "🎉 Все проверки загрузки файлов и authorName пройдены"
}

main "$@"

