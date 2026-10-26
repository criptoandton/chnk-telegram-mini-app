# CHNK — Telegram Gifts Market (Mini App)

Telegram Mini App: магазин подарков, продажа каналов, внутренний баланс в TON,
реферальная программа и задания. Репозиторий в **гибридном виде**:

```
dist/   — рабочая собранная версия (работает сразу, ничего не нужно ставить)
src/    — чистые исходники (React + Vite), из них собирается новая версия
```

## Быстрый старт

### Вариант 1 — просто посмотреть

Открой `dist/index.html` через локальный сервер:

```bash
cd dist
python3 -m http.server 8080
```

### Вариант 2 — править и пересобирать

```bash
npm install
cp .env.example .env.local   # вписать свои ключи
npm run dev                  # разработка
npm run build                # сборка в dist/
```

## Подключение к Telegram

1. **@BotFather** → `/newbot` → получи токен.
2. `/newapp` → выбери бота → задай URL приложения (например `https://<твой-домен>/`).
3. В коде приложения укажи `https://t.me/<твой-бот>` в настройках.
4. Открой Mini App из бота — приложение получит `initDataUnsafe.user`.

## Что где лежит

| Путь | Что это |
|---|---|
| `src/i18n/ru.json`, `src/i18n/en.json` | 135 текстов приложения, ru/en |
| `src/lib/constants.js` | комиссии, лимиты, вознаграждения, ссылки, ID заданий |
| `src/lib/supabase.js` | клиент Supabase |
| `src/lib/api.js` | все запросы к базе (баланс, транзакции, рефералы, задания) |
| `src/lib/telegram.js` | обёртка над Telegram WebApp SDK |
| `src/lib/i18n.js` | функция перевода `t('key')` с подстановкой `{переменных}` |
| `src/hooks/useApp.js` | хуки: пользователь, язык, баланс |
| `src/pages/` | экраны: Shop, Profile, Referrals, Tasks, Settings |
| `src/components/` | Nav, Card, GiftCard |
| `dist/` | собранный рабочий билд |

## Таблицы Supabase

Проект: `cudysqvyvrxkxryjfvnx.supabase.co`

| Таблица | Назначение |
|---|---|
| `telegram_profiles` | профили пользователей |
| `balances` | внутренний баланс TON |
| `transactions` | история операций |
| `purchases` | покупки подарков |
| `referral_accounts` | реферальные коды |
| `referrals` | приглашения и начисленные бонусы |
| `task_claims` | закрытые задания |
| `channel_listings` | каналы, выставленные на продажу |
| `channel_submissions` | заявки на добавление канала |
| `banner_purchases` | купленные баннеры профиля |
| `activity_history` | журнал активности |

## Безопасность (важно)

Anon-ключ Supabase виден в браузере — это нормально для Supabase, **но безопасность
держит RLS**. Проверь в Supabase → Table Editor → RLS Policies, что:

- `balances` — пользователь читает и пишет только свою строку (`telegram_user_id = auth.uid()`-эквивалент);
- `transactions` — только свои записи;
- `referrals` — нельзя вписать себе произвольный `reward_amount`;
- `task_claims` — нельзя начислить себе награду без проверки задания.

Пока RLS не настроен — любой может из консоли браузера изменить свой баланс.

Дополнительно: `initData` Telegram нужно валидировать на сервере, иначе клиент
может подделать `telegram_user_id`. В текущей версии проверка на клиенте.

## Как поменять что-то своё

- **Текст** → `src/i18n/ru.json` и `en.json`, ключи совпадают.
- **Комиссию/лимиты/награды** → `src/lib/constants.js`.
- **Логику баланса** → `src/lib/api.js` → `applyDelta()`.
- **Цвета и отступы** → `src/styles.css` (CSS-переменные в `:root`).
- **Экраны** → `src/pages/`, маршрутизация — в `src/App.jsx`.

## Лицензия

MIT
