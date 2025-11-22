#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:8080/api}"
KEEP_DATA="${KEEP_DATA:-true}"

log() {
  printf '[%s] %s\n' "$(date '+%H:%M:%S')" "$*"
}

die() {
  echo "❌ $*" >&2
  exit 1
}

require_bin() {
  command -v "$1" >/dev/null 2>&1 || die "Требуется команда '$1'. Установите её и повторите."
}

require_bin curl
require_bin jq

TITLE="Card Smoke $(date +%s)"
UPDATED_TITLE="Card Smoke Updated $(date +%s)"
PERSIST_TITLE="Card Smoke Persist $(date +%s)"
CARD_ID=""
AUTHOR_ID=""
CITY="SmokeCity"
STUDY="SmokeStudy"
USER_EMAIL="card-smoke-$(date +%s)@example.com"
USER_PASSWORD="CardSmoke123!"
USER_NAME="Card Smoke User"

register_user() {
  log "Создаём пользователя для карточек"
  local payload response
  payload=$(jq -n \
    --arg email "$USER_EMAIL" \
    --arg password "$USER_PASSWORD" \
    --arg name "$USER_NAME" \
    --arg city "$CITY" \
    --arg study "$STUDY" \
    '{email:$email,password:$password,name:$name,city:$city,study:$study}')
  response=$(curl -sS -X POST "$API_URL/users/register" -H "Content-Type: application/json" -d "$payload")
  AUTHOR_ID=$(echo "$response" | jq -r '.id // empty')
  [[ -n "$AUTHOR_ID" && "$AUTHOR_ID" != "null" ]] || die "Регистрация пользователя не вернула id: $response"
  log "Пользователь создан: $AUTHOR_ID"
}

health_check() {
  log "Проверяем доступность API"
  local body
  body=$(curl -sS "$API_URL/public/ping")
  [[ "$body" == "pong" ]] || {
    echo "❌ /api/public/ping вернул '$body'" >&2
    exit 1
  }
}

count_cards() {
  curl -sS "$API_URL/cards" | jq 'length'
}

create_card() {
  log "Создаём карточку"
  local payload response
  local card_title=${1:-$TITLE}
  local description=${2:-"Auto smoke card"}
  payload=$(jq -n \
    --arg id "$AUTHOR_ID" \
    --arg title "$card_title" \
    --arg city "$CITY" \
    --arg study "$STUDY" \
    --arg desc "$description" \
    '{authorId:$id,title:$title,type:"Лабораторная",subject:"Математика",description:$desc,city:$city,study:$study,course:3}')
  response=$(curl -sS -X POST "$API_URL/cards/user" -H "Content-Type: application/json" -d "$payload")
  CARD_ID=$(echo "$response" | jq -r '.id // empty')
  [[ -n "$CARD_ID" ]] || die "Создание не вернуло id: $response"
  log "Карточка создана: $CARD_ID"
}

assert_card_present() {
  local where=$1
  log "Проверяем карточку в $where"
  local response
  response=$(curl -sS "$2")
  echo "$response" | jq -e --arg id "$CARD_ID" 'map(.id == $id) | any' >/dev/null || {
    echo "❌ Карточка $CARD_ID не найдена в $where" >&2
    exit 1
  }
}

list_assertions() {
  assert_card_present "/api/cards" "$API_URL/cards"
  assert_card_present "/api/cards/filter?city=$CITY" "$API_URL/cards/filter?city=$CITY"
  [[ -n "$AUTHOR_ID" && "$AUTHOR_ID" != "null" ]] && assert_card_present "/api/cards/user/$AUTHOR_ID" "$API_URL/cards/user/$AUTHOR_ID"
}

update_card() {
  log "Обновляем карточку"
  local payload response
  payload=$(jq -n --arg id "$CARD_ID" --arg title "$UPDATED_TITLE" '{id:$id,title:$title}')
  response=$(curl -sS -X PATCH "$API_URL/cards/user" -H "Content-Type: application/json" -d "$payload")
  local newTitle
  newTitle=$(echo "$response" | jq -r '.title // empty')
  [[ "$newTitle" == "$UPDATED_TITLE" ]] || die "Название не обновилось: $response"
}

delete_card() {
  log "Удаляем карточку"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$API_URL/cards/user/$CARD_ID")
  [[ "$code" == "204" ]] || die "DELETE вернул $code"
}

assert_deleted() {
  log "Убеждаемся, что карточка удалена"
  local response
  response=$(curl -sS "$API_URL/cards")
  ! echo "$response" | jq -e --arg id "$CARD_ID" 'map(.id == $id) | any' >/dev/null
}

main() {
  log "Запускаем smoke-проверку карточек"
  local before after
  health_check
  before=$(count_cards)
  register_user
  create_card
  list_assertions
  update_card
  delete_card
  assert_deleted
  CARD_ID=""
  if [[ "$KEEP_DATA" == "true" ]]; then
    log "Создаём дополнительную карточку и оставляем её в базе"
    create_card "$PERSIST_TITLE" "Persisted smoke card"
    log "Оставили карточку $CARD_ID (author $AUTHOR_ID) для проверки данных"
    # Не удаляем
  fi
  after=$(count_cards)
  log "Карточек до: $before, после: $after"
  log "🎉 Smoke-проверка карточек завершена успешно"
}

main "$@"
