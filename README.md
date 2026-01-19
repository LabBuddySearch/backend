# 🎓 Labster — Tinder для домашних заданий

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Java](https://img.shields.io/badge/java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/spring--boot-3.1.4-green.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-15-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)

**Веб-приложение для поиска помощи с домашними заданиями и лабораторными работами**

[🚀 Быстрый старт](#-быстрый-старт) • [📖 API Документация](#-api-контракты) • [🏗️ Архитектура](#️-архитектура) • [📦 Установка](#-установка)

</div>

---

## 📋 Содержание

- [О проекте](#-о-проекте)
- [Основные возможности](#-основные-возможности)
- [Технологический стек](#-технологический-стек)
- [Быстрый старт](#-быстрый-старт)
- [Архитектура](#️-архитектура)
- [API Контракты](#-api-контракты)
- [Структура проекта](#-структура-проекта)
- [Установка и настройка](#-установка-и-настройка)
- [Разработка](#-разработка)

---

## 🎯 О проекте

**Labster** — это современное веб-приложение в формате Tinder для поиска помощи с домашними заданиями и лабораторными работами. Студенты могут создавать карточки с заданиями, просматривать ленту других пользователей, ставить лайки и находить единомышленников для совместной работы.

### 💡 Ключевые особенности

- 🔐 **Безопасная аутентификация** — JWT токены для защиты API
- 📝 **Карточки заданий** — создание, редактирование, фильтрация по тегам
- ❤️ **Система лайков** — простой и интуитивный интерфейс
- 📎 **Загрузка файлов** — поддержка вложений к карточкам (MinIO)
- 👤 **Профили пользователей** — настраиваемые профили с контактами
- 🔍 **Умная фильтрация** — поиск по типу, городу, университету, курсу
- 🐳 **Docker** — полная контейнеризация для простого развертывания

---

## ✨ Основные возможности

| Функционал | Описание |
|------------|----------|
| 👥 **Регистрация и авторизация** | Регистрация новых пользователей, вход с JWT аутентификацией |
| 📋 **Управление карточками** | Создание, просмотр, редактирование и удаление карточек заданий |
| 🔍 **Фильтрация карточек** | Поиск по типу работы, городу, университету и курсу |
| ❤️ **Лайки и избранное** | Лайк карточек, просмотр понравившихся карточек |
| 👤 **Профиль пользователя** | Просмотр и редактирование профиля, смена пароля |
| 📎 **Файлы** | Загрузка и скачивание файлов к карточкам |
| 🔐 **Настройки безопасности** | Смена пароля, обновление профиля, удаление аккаунта |

---

## 🛠 Технологический стек

### Backend
- **Java 17** — основной язык разработки
- **Spring Boot 3.1.4** — фреймворк для создания REST API
- **Spring Security** — безопасность и аутентификация
- **Spring Data JPA** — работа с базой данных
- **JWT (jjwt)** — токены для аутентификации
- **PostgreSQL 15** — реляционная база данных
- **MinIO** — объектное хранилище для файлов
- **Lombok** — упрощение boilerplate кода
- **Swagger/OpenAPI** — документация API

### Frontend
- **React 18.2.0** — библиотека для создания UI
- **TypeScript** — типизированный JavaScript
- **React Router 6.4.0** — маршрутизация
- **Webpack 5** — сборка проекта
- **Babel** — транспиляция кода

### Инфраструктура
- **Docker & Docker Compose** — контейнеризация
- **Nginx** — reverse proxy и статический сервер
- **PostgreSQL** — база данных
- **MinIO** — файловое хранилище

---

## 🚀 Быстрый старт

### Предварительные требования

- ✅ Docker и Docker Compose установлены
- ✅ Порты 80, 8080, 5432, 9000, 9001 свободны

### Запуск проекта

1. **Клонируйте репозиторий** (если применимо)

2. **Перейдите в директорию проекта**
   ```bash
   cd frontend
   ```

3. **Запустите приложение**
   ```bash
   ./docker-start.sh
   ```

   Или вручную:
   ```bash
   docker-compose up --build -d
   ```

4. **Дождитесь запуска всех сервисов** (~1-2 минуты)

5. **Откройте в браузере**
  - 🌐 **Фронтенд**: http://localhost
  - 🔧 **Backend API**: http://localhost:8080/api
  - 📚 **Swagger UI**: http://localhost:8080/swagger-ui.html (если настроен)

### 🛑 Остановка проекта

```bash
docker-compose down
```

Для полной очистки (включая данные):
```bash
docker-compose down -v
```

---

## 🏗️ Архитектура

### Общая схема

```
┌─────────────────────────────────────────────────────────┐
│                    Клиент (Браузер)                     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Nginx (Frontend + Reverse Proxy)           │
│  • Статические файлы (React)                            │
│  • Проксирование /api/* → Backend                       │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Spring Boot Backend (Java)                 │
│  • REST API                                             │
│  • JWT Authentication                                   │
│  • Business Logic                                       │
└──────┬──────────────────────────────┬───────────────────┘
       │                              │
       ▼                              ▼
┌──────────────┐              ┌──────────────┐
│  PostgreSQL  │              │    MinIO     │
│   (БД)       │              │  (Файлы)     │
└──────────────┘              └──────────────┘
```

### Структура Backend

```
src/main/java/org/example/
├── controller/          # REST контроллеры
│   ├── AuthController.java       # Авторизация
│   ├── UserController.java       # Пользователи
│   ├── CardController.java       # Карточки
│   ├── LikeController.java       # Лайки
│   └── SettingsController.java   # Настройки
├── service/             # Бизнес-логика
│   ├── AuthService.java
│   ├── UserService.java
│   ├── CardService.java
│   ├── LikeService.java
│   └── MinioService.java
├── repository/          # JPA репозитории
│   ├── UserRepository.java
│   ├── CardRepository.java
│   └── ...
├── model/entity/        # JPA сущности
│   ├── User.java
│   ├── Card.java
│   ├── Like.java
│   └── File.java
├── dto/                 # Data Transfer Objects
│   ├── AuthRequest.java
│   ├── UserRegisterDto.java
│   └── ...
└── config/              # Конфигурация
    ├── SecurityConfig.java
    └── MinioConfig.java
```

### Структура Frontend

```
src/
├── components/          # Переиспользуемые компоненты
│   ├── Card.tsx
│   ├── CardForm.tsx
│   ├── Button.tsx
│   └── ...
├── pages/              # Страницы приложения
│   ├── LoginPage.tsx
│   ├── HomePage.tsx
│   ├── MyCardsPage.tsx
│   └── SettingsPage.tsx
├── services/           # API сервисы
│   ├── authService.ts
│   ├── cardService.ts
│   ├── userService.ts
│   ├── likeService.ts
│   └── settingsService.ts
├── router/             # Маршрутизация
│   └── index.tsx
├── hooks/              # React хуки
│   └── useLocalStorage.ts
└── types/              # TypeScript типы
    ├── auth.ts
    ├── card.ts
    └── user.ts
```

---

## 📡 API Контракты

### 🔐 Аутентификация (`/api/auth`)

| Метод | Эндпоинт | Описание | Авторизация |
|-------|----------|----------|-------------|
| `POST` | `/api/auth/register` | Регистрация нового пользователя | ❌ |
| `POST` | `/api/auth/login` | Вход в систему (получение JWT) | ❌ |

#### Примеры запросов

**Регистрация**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "Иван Иванов",
  "study": "ИТМО",
  "city": "Санкт-Петербург",
  "course": 3
}
```

**Вход**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

---

### 👤 Пользователи (`/api/users`)

| Метод | Эндпоинт | Описание | Авторизация |
|-------|----------|----------|-------------|
| `POST` | `/api/users/register` | Регистрация пользователя | ❌ |
| `POST` | `/api/users/login` | Вход в систему | ❌ |
| `GET` | `/api/users/{id}` | Получить профиль пользователя | ✅ |
| `PUT` | `/api/users/{id}` | Обновить профиль пользователя | ✅ |
| `GET` | `/api/users/me` | Получить текущего пользователя | ✅ |

---

### 📋 Карточки (`/api/cards`)

| Метод | Эндпоинт | Описание | Авторизация |
|-------|----------|----------|-------------|
| `GET` | `/api/cards` | Получить все карточки | ❌ |
| `GET` | `/api/cards/filter` | Фильтровать карточки | ❌ |
| `POST` | `/api/cards/user` | Создать новую карточку | ✅ |
| `GET` | `/api/cards/user/{userId}` | Получить карточки пользователя | ❌ |
| `GET` | `/api/cards/user/{userId}/liked` | Получить понравившиеся карточки | ❌ |
| `PATCH` | `/api/cards/user` | Редактировать карточку | ✅ |
| `DELETE` | `/api/cards/user/{cardId}` | Удалить карточку | ✅ |
| `GET` | `/api/cards/download/{filename}` | Скачать файл | ❌ |

#### Параметры фильтрации

```
GET /api/cards/filter?type=проект&city=Санкт-Петербург&study=ИТМО&course=3
```

**Параметры:**
- `type` (опционально) — тип карточки
- `city` (опционально) — город
- `study` (опционально) — университет
- `course` (опционально) — курс

#### Пример создания карточки

```http
POST /api/cards/user
Content-Type: multipart/form-data
Authorization: Bearer {token}

authorId: {uuid}
type: проект
subject: Веб-разработка
title: Создание интернет-магазина
course: 3
description: Нужна помощь с React и Spring Boot
study: ИТМО
city: Санкт-Петербург
files: [файл1.pdf, файл2.zip]
```

---

### ❤️ Лайки (`/api/like`)

| Метод | Эндпоинт | Описание | Авторизация |
|-------|----------|----------|-------------|
| `POST` | `/api/like` | Поставить лайк карточке | ❌ |
| `DELETE` | `/api/like` | Убрать лайк с карточки | ❌ |

#### Пример запроса

```http
POST /api/like
Content-Type: application/json

{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "cardId": "123e4567-e89b-12d3-a456-426614174001"
}
```

---

### ⚙️ Настройки (`/api/settings`)

| Метод | Эндпоинт | Описание | Авторизация |
|-------|----------|----------|-------------|
| `GET` | `/api/settings/me` | Получить текущий профиль | ✅ |
| `PUT` | `/api/settings` | Обновить профиль | ✅ |
| `PUT` | `/api/settings/photo` | Обновить фото профиля | ✅ |
| `PUT` | `/api/settings/password` | Сменить пароль | ✅ |
| `DELETE` | `/api/settings/me` | Удалить аккаунт | ✅ |

#### Пример смены пароля

```http
PUT /api/settings/password
Content-Type: application/json
Authorization: Bearer {token}

{
  "oldPassword": "oldpass123",
  "newPassword": "newpass456"
}
```

---

## 📦 Структура проекта

```
project/
├── frontend/                    # React приложение
│   ├── src/
│   │   ├── components/         # UI компоненты
│   │   ├── pages/              # Страницы
│   │   ├── services/           # API клиенты
│   │   ├── router/             # Маршрутизация
│   │   └── types/              # TypeScript типы
│   ├── public/                 # Статические файлы
│   ├── Dockerfile              # Docker образ фронтенда
│   ├── nginx.conf              # Конфигурация Nginx
│   ├── docker-compose.yml      # Docker Compose конфигурация
│   └── package.json
│
└── backend/                    # Spring Boot приложение
    ├── src/main/java/
    │   └── org/example/
    │       ├── controller/     # REST контроллеры
    │       ├── service/        # Бизнес-логика
    │       ├── repository/     # JPA репозитории
    │       ├── model/          # Модели данных
    │       └── config/         # Конфигурация
    ├── src/main/resources/
    │   └── application.yml     # Настройки приложения
    ├── Dockerfile              # Docker образ бекенда
    └── build.gradle            # Зависимости Gradle
```

---

## 🛠 Установка и настройка

### Локальная разработка

#### Backend

1. **Убедитесь, что установлены:**
  - Java 17+
  - Gradle 8+
  - PostgreSQL 15+

2. **Настройте базу данных:**
   ```bash
   createdb labsterdb
   ```

3. **Настройте переменные окружения:**
   ```bash
   export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/labsterdb
   export SPRING_DATASOURCE_USERNAME=postgres
   export SPRING_DATASOURCE_PASSWORD=postgres
   ```

4. **Запустите приложение:**
   ```bash
   cd backend
   ./gradlew bootRun
   ```

#### Frontend

1. **Установите зависимости:**
   ```bash
   npm install
   ```

2. **Запустите dev сервер:**
   ```bash
   npm start
   ```

   Приложение будет доступно по адресу: http://localhost:3000

---

## 🔧 Конфигурация

### Переменные окружения Backend

| Переменная | Описание | Значение по умолчанию |
|------------|----------|----------------------|
| `SPRING_DATASOURCE_URL` | URL базы данных | `jdbc:postgresql://postgres:5432/labsterdb` |
| `SPRING_DATASOURCE_USERNAME` | Имя пользователя БД | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Пароль БД | `postgres` |
| `MINIO_URL` | URL MinIO сервера | `http://minio:9000` |
| `MINIO_ACCESS_KEY` | Access key MinIO | `minioadmin` |
| `MINIO_SECRET_KEY` | Secret key MinIO | `minioadmin123` |
| `MINIO_BUCKET_NAME` | Имя bucket | `uploads` |

### Порты сервисов

| Сервис | Порт | Описание |
|--------|------|----------|
| Frontend | 80 | Веб-интерфейс |
| Backend API | 8080 | REST API |
| PostgreSQL | 5432 | База данных |
| MinIO API | 9000 | Файловое хранилище |
| MinIO Console | 9001 | Веб-интерфейс MinIO |

---

## 👥 Разработка

### Полезные команды

#### Docker

```bash
# Просмотр логов
docker-compose logs -f                    # Все сервисы
docker-compose logs -f backend           # Только бекенд
docker-compose logs -f frontend          # Только фронтенд

# Перезапуск сервисов
docker-compose restart                    # Все сервисы
docker-compose restart backend           # Только бекенд

# Пересборка
docker-compose up --build -d backend     # Пересобрать бекенд
docker-compose up --build -d frontend    # Пересобрать фронтенд

# Остановка
docker-compose down                       # Остановить контейнеры
docker-compose down -v                    # Остановить и удалить volumes
```

#### Backend (локально)

```bash
# Сборка
./gradlew build

# Запуск
./gradlew bootRun

# Тесты
./gradlew test

# Очистка
./gradlew clean
```

#### Frontend (локально)

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm start

# Сборка production
npm run build

# Линтинг (если настроен)
npm run lint
```

---

## 📊 База данных

### Основные сущности

**User** (Пользователь)
- `id` (UUID) — уникальный идентификатор
- `email` (VARCHAR) — электронная почта (уникальная)
- `passwordHash` (VARCHAR) — хэш пароля
- `name` (VARCHAR) — имя пользователя
- `study` (VARCHAR) — университет
- `city` (VARCHAR) — город
- `course` (INTEGER) — курс
- `photoUrl` (TEXT) — URL фотографии
- `description` (TEXT) — описание профиля
- `socialLinks` (JSONB) — ссылки на соцсети
- `createdAt` (TIMESTAMP) — дата регистрации

**Card** (Карточка)
- `id` (UUID) — уникальный идентификатор
- `authorId` (FK → User) — автор карточки
- `title` (VARCHAR) — заголовок
- `description` (TEXT) — описание
- `type` (VARCHAR) — тип карточки
- `subject` (VARCHAR) — предмет
- `course` (INTEGER) — курс
- `study` (VARCHAR) — университет
- `city` (VARCHAR) — город
- `createdAt` (TIMESTAMP) — дата создания

**Like** (Лайк)
- `id` (UUID) — уникальный идентификатор
- `userId` (FK → User) — пользователь, поставивший лайк
- `cardId` (FK → Card) — карточка
- `createdAt` (TIMESTAMP) — дата лайка

**File** (Файл)
- `id` (UUID) — уникальный идентификатор
- `cardId` (FK → Card) — карточка
- `original` (VARCHAR) — оригинальное имя файла
- `storage` (VARCHAR) — имя файла в хранилище

---

## 🔐 Безопасность

- ✅ **JWT токены** для аутентификации
- ✅ **BCrypt** для хэширования паролей
- ✅ **Spring Security** для защиты эндпоинтов
- ✅ **CORS** настройка для безопасного взаимодействия
- ✅ **Валидация** входящих данных

---

## 📝 Лицензия

Этот проект создан в учебных целях.

---

## 👨‍💻 Авторы

Команда разработки проекта Labster

---

## 📞 Поддержка

Если у вас возникли вопросы или проблемы:

1. Проверьте логи: `docker-compose logs -f`
2. Убедитесь, что все порты свободны
3. Проверьте, что Docker запущен
4. Проверьте конфигурацию в `docker-compose.yml`

---

<div align="center">

**Сделано с ❤️ для студентов**

⭐ Если проект был полезен, поставьте звезду!

</div>
