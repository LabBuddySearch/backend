# Стадия сборки
FROM node:18-alpine AS build

WORKDIR /app

# Копируем package файлы
COPY package*.json ./

# Устанавливаем зависимости
# Используем npm install вместо npm ci, чтобы работало и без package-lock.json
RUN npm install

# Копируем исходный код
COPY . .

# Собираем приложение для production
RUN npm run build

# Стадия production с nginx
FROM nginx:alpine

# Копируем собранное приложение
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

