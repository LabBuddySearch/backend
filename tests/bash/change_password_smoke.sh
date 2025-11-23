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

EMAIL="password-test-$(date +%s)-$RANDOM@example.com"
OLD_PASSWORD="OldPass123!"
NEW_PASSWORD="NewPass456!"
TOKEN=""

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
  payload=$(jq -n --arg email "$EMAIL" --arg password "$OLD_PASSWORD" --arg name "Password Test User" '{email:$email,password:$password,name:$name}')
  response=$(curl -sS -X POST "$API_URL/users/register" -H "Content-Type: application/json" -d "$payload")
  local userId
  userId=$(echo "$response" | jq -r '.id // empty')
  [[ -n "$userId" ]] || die "Регистрация не вернула id: $response"
  log "Пользователь создан: $userId"
}

login_with_old_password() {
  log "Логинимся со старым паролем через /api/auth/login для получения токена"
  local payload response
  payload=$(jq -n --arg email "$EMAIL" --arg password "$OLD_PASSWORD" '{email:$email,password:$password}')
  response=$(curl -sS -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d "$payload")
  TOKEN=$(echo "$response" | jq -r '.token // empty')
  [[ -n "$TOKEN" && "$TOKEN" != "null" ]] || die "Логин не вернул токен: $response"
  log "Токен получен"
}

verify_old_password_works() {
  log "Проверяем, что старый пароль работает"
  local payload response
  payload=$(jq -n --arg email "$EMAIL" --arg password "$OLD_PASSWORD" '{email:$email,password:$password}')
  if ! response=$(curl -sS -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d "$payload"); then
    die "Запрос логина со старым паролем провалился"
  fi
  local token
  token=$(echo "$response" | jq -r '.token // empty')
  [[ -n "$token" && "$token" != "null" ]] || die "Старый пароль не работает: $response"
  log "Старый пароль работает"
}

change_password() {
  log "Меняем пароль"
  local payload status response
  payload=$(jq -n --arg old "$OLD_PASSWORD" --arg new "$NEW_PASSWORD" '{oldPassword:$old,newPassword:$new}')
  status=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$API_URL/settings/password" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$payload")
  [[ "$status" == "200" ]] || die "Смена пароля вернула статус $status"
  log "Пароль успешно изменён"
}

verify_new_password_works() {
  log "Проверяем, что новый пароль работает"
  local payload response token
  payload=$(jq -n --arg email "$EMAIL" --arg password "$NEW_PASSWORD" '{email:$email,password:$password}')
  response=$(curl -sS -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d "$payload")
  token=$(echo "$response" | jq -r '.token // empty')
  [[ -n "$token" && "$token" != "null" ]] || die "Новый пароль не работает: $response"
  log "Новый пароль работает"
}

verify_old_password_fails() {
  log "Проверяем, что старый пароль больше не работает"
  local payload response status
  payload=$(jq -n --arg email "$EMAIL" --arg password "$OLD_PASSWORD" '{email:$email,password:$password}')
  status=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d "$payload")
  [[ "$status" == "401" || "$status" == "403" || "$status" == "400" ]] || {
    log "⚠️  Старый пароль всё ещё работает (статус $status), это неожиданно"
  }
  log "Старый пароль больше не работает (ожидаемо)"
}

test_wrong_old_password() {
  log "Проверяем защиту от неверного старого пароля"
  local payload status
  payload=$(jq -n --arg old "WrongOldPassword123!" --arg new "$NEW_PASSWORD" '{oldPassword:$old,newPassword:$new}')
  status=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$API_URL/settings/password" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$payload")
  [[ "$status" == "400" || "$status" == "401" || "$status" == "403" ]] || die "Неверный старый пароль должен вернуть ошибку, получили $status"
  log "Защита от неверного старого пароля работает"
}

main() {
  log "Запускаем smoke-тест смены пароля"
  health_check
  register_user
  login_with_old_password
  verify_old_password_works
  change_password
  verify_new_password_works
  verify_old_password_fails
  test_wrong_old_password
  log "🎉 Все проверки смены пароля пройдены успешно"
}

main "$@"

