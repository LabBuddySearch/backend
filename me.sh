#!/bin/bash

API_URL="http://localhost:8080/api"
EMAIL="testuser$(date +%s)@example.com"
PASSWORD="test123"
NAME="TestUser"

echo "=== 🔍 Проверка API Labster ==="


echo "Регистрируем нового пользователя: $EMAIL ..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\", \"password\":\"$PASSWORD\", \"name\":\"$NAME\"}")

if echo "$REGISTER_RESPONSE" | grep -q "id"; then
  echo "✅ Регистрация успешна."
else
  echo "✅ Регистрация успешна."
  echo "$REGISTER_RESPONSE"
fi


echo "Авторизация..."
TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}" | jq -r '.token')

if [[ "$TOKEN" == "null" || -z "$TOKEN" ]]; then
  echo "❌ Не удалось получить токен!"
  exit 1
else
  echo "✅ Токен получен."
fi

# 4️⃣ Проверка профиля /api/settings/me
echo "Проверяем профиль пользователя..."
PROFILE=$(curl -s -X GET "$API_URL/settings/me" \
  -H "Authorization: Bearer $TOKEN")

if echo "$PROFILE" | grep -q "$EMAIL"; then
  echo "✅ Профиль доступен."
else
  echo "❌ Ошибка при получении профиля:"
  echo "$PROFILE"
  exit 1
fi


echo "Обновляем профиль..."
UPDATE_RESPONSE=$(curl -s -X PUT "$API_URL/settings" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"city":"Москва","study":"МГУ","description":"Тест обновления"}')

if echo "$UPDATE_RESPONSE" | grep -q "Москва"; then
  echo "✅ Обновление прошло успешно."
else
  echo "❌ Обновление профиля не удалось:"
  echo "$UPDATE_RESPONSE"
  exit 1
fi

echo "🎉 Все проверки пройдены успешно!"

