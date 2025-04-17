
# 🧠 Tabby GPT Backend

## 🚀 Установка (локально)
1. Скопируй `.env.example` в `.env` и вставь свой OpenAI API ключ
2. Установи зависимости: `npm install`
3. Запусти сервер: `npm start`

## ☁️ Деплой на Vercel
1. Создай новый проект в [vercel.com](https://vercel.com/)
2. Загрузи этот репозиторий или залей на GitHub
3. Укажи переменные окружения:
   - `OPENAI_API_KEY=your_api_key`
   - `AUTH_TOKEN=tabby_secret`
4. Деплой и копируй URL — вставь его в Figma-плагин

## 🛡 Защита
В плагин передаётся `token`, который должен совпадать с `AUTH_TOKEN`.
