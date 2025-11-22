#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:8080/api}"
LIKES_USER_ID="${LIKES_USER_ID:-}" # можно передать через окружение
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

CARD_ID=""
AUTHOR_ID=""
LIKER_ID=""
CITY="LikeCity"
STUDY="LikeStudy"
cleanup_enabled="true"

register_user() {
  local email=$1
  local name=$2
  local payload response
  payload=$(jq -n \
    --arg email "$email" \
    --arg password "LikeSmoke123!" \
    --arg name "$name" \
    --arg city "$CITY" \
    --arg study "$STUDY" \
    '{email:$email,password:$password,name:$name,city:$city,study:$study}')
  response=$(curl -sS -X POST "$API_URL/users/register" -H "Content-Type: application/json" -d "$payload")
  local userId
  userId=$(echo "$response" | jq -r '.id // empty')
  [[ -n "$userId" && "$userId" != "null" ]] || die "Регистрация пользователя $email не вернула id: $response"
  echo "$userId"
}

health_check() {
  log "Проверяем доступность API"
  local body
  body=$(curl -sS "$API_URL/public/ping")
  [[ "$body" == "pong" ]] || die "/api/public/ping вернул '$body'"
}

create_card() {
  local card_title=${1:-"Like Smoke"}
  local desc=${2:-"Smoke like"}
  log "Создаём карточку для проверки лайков"
  local payload response
  payload=$(jq -n \
    --arg id "$AUTHOR_ID" \
    --arg title "$card_title" \
    --arg desc "$desc" \
    '{authorId:$id,title:$title,type:"Лабораторная",subject:"Тест",city:"LikeCity",study:"LikeStudy",course:1,description:$desc}')
  response=$(curl -sS -X POST "$API_URL/cards/user" -H "Content-Type: application/json" -d "$payload")
  CARD_ID=$(echo "$response" | jq -r '.id // empty')
  [[ -n "$CARD_ID" ]] || die "Создание карточки не вернуло id: $response"
  log "Карточка создана: $CARD_ID, author=$AUTHOR_ID"
}

resolve_user_id() {
  if [[ -n "$LIKES_USER_ID" ]]; then
    log "Используем userId из переменной LIKES_USER_ID=$LIKES_USER_ID"
  else
    LIKES_USER_ID="$LIKER_ID"
    log "Используем созданного пользователя для лайков: $LIKES_USER_ID"
  fi
}

like_card() {
  log "Отправляем лайк"
  local payload status
  payload=$(jq -n --arg user "$LIKES_USER_ID" --arg card "$CARD_ID" '{userId:$user,cardId:$card}')
  status=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/like" -H "Content-Type: application/json" -d "$payload")
  [[ "$status" == "200" ]] || die "POST /api/like вернул $status"
}

unlike_card() {
  log "Отправляем дизлайк"
  local payload status
  payload=$(jq -n --arg user "$LIKES_USER_ID" --arg card "$CARD_ID" '{userId:$user,cardId:$card}')
  status=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$API_URL/like" -H "Content-Type: application/json" -d "$payload")
  [[ "$status" == "204" ]] || die "DELETE /api/like вернул $status"
}

cleanup_card() {
  if [[ "$cleanup_enabled" != "true" || -z "$CARD_ID" ]]; then
    return
  fi
  log "Удаляем тестовую карточку"
  curl -s -o /dev/null -w "%{http_code}" -X DELETE "$API_URL/cards/user/$CARD_ID" >/dev/null || true
}

persist_sample() {
  if [[ "$KEEP_DATA" != "true" ]]; then
    return
  fi
  cleanup_enabled="false"
  CARD_ID=""
  log "Создаём дополнительную карточку и лайк для демонстрации"
  create_card "Like Smoke Persist" "Persisted like sample"
  resolve_user_id
  like_card
  log "Оставили карточку $CARD_ID и лайк пользователя $LIKES_USER_ID в базе"
}

main() {
  trap cleanup_card EXIT
  log "Старт smoke-теста лайков"
  health_check
  AUTHOR_ID=$(register_user "card-author-$(date +%s)@example.com" "Card Author")
  LIKER_ID=$(register_user "card-liker-$(date +%s)-$RANDOM@example.com" "Card Liker")
  create_card
  resolve_user_id
  like_card
  unlike_card
  persist_sample
  log "🎉 Smoke для лайков завершён"
}

main "$@"
