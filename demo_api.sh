#!/bin/bash

API_URL="http://localhost:8080/api"

echo "=== Регистрация нового пользователя ==="
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex","email":"alex@example.com","password":"12345"}' | jq

echo -e "\n=== Логин пользователя и сохранение токена ==="
TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"12345"}' | jq -r '.token')

echo "Сохранённый токен:"
echo $TOKEN

echo -e "\n=== Получение данных пользователя с токеном ==="
curl -s -X GET "$API_URL/users/me" \
  -H "Authorization: Bearer $TOKEN"
echo

