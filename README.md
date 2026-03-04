# Daily Frontend Tests

Статический сайт для ежедневных фронтенд-тестов. Тесты загружаются из JSON-файлов в репозитории, результаты сохраняются локально (localStorage).

## Запуск

```bash
npm install
npm run dev
```

Сборка:

```bash
npm run build
```

## Добавление теста

1. Создайте файл `public/tests/YYYY-MM-DD.json` (например, `public/tests/2026-03-05.json`).

2. Формат файла теста:

```json
{
  "id": "2026-03-05",
  "title": "Название теста",
  "date": "2026-03-05",
  "questions": [
    {
      "id": "q1",
      "prompt": "Текст вопроса?",
      "choices": [
        { "id": "a", "text": "Вариант A" },
        { "id": "b", "text": "Вариант B" }
      ],
      "answer": "b",
      "explain": "Краткое пояснение правильного ответа."
    }
  ]
}
```

3. Добавьте запись в `public/tests/index.json`:

```json
{
  "id": "2026-03-05",
  "title": "Название теста",
  "date": "2026-03-05",
  "path": "/tests/2026-03-05.json",
  "tags": ["vue", "js"]
}
```

Массив в `index.json` — реестр всех доступных тестов. Сортировка для отображения: по полю `date` (desc).

## Где хранятся результаты

Попытки прохождения сохраняются в **localStorage** под ключом `dft-attempts`.

Структура: массив объектов `Attempt` с полями `attemptId`, `testId`, `testDate`, `startedAt`, `finishedAt`, `answers`, `score`.

## TODO (будущее)

- [ ] Синхронизация попыток в облако (Supabase/Firebase)
- [ ] Скрытие `answer` до завершения через backend (проверка на сервере)
- [ ] GitHub Action: автогенерация `index.json` при пуше тестов
- [ ] Расширить типы вопросов (multiple choice, открытый ответ)
- [ ] Экспорт истории в JSON
