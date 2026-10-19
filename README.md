# Video / YUVIO

Рабочий репозиторий для анимаций и монтажа. Исходники и инструкции хранятся здесь. `node_modules`, кэши и временные видео не коммитятся.

## Что выбрать

| Инструмент | Как устроен | Применение к YUVIO |
|---|---|---|
| Remotion | React, анимация по номеру кадра | Точная анимация интерфейса, чисел, карточек, переходов |
| HyperFrames | HTML/CSS, seekable-анимация | Промосцены, типографика, композиции из веб-элементов |
| Editly | JSON-список клипов и слоёв | Сборка готовых сцен, изображений, музыки и переходов |

## Remotion

В `examples/remotion`: `npm ci`, затем `npx remotion studio src/index.tsx` для предпросмотра.
Для экспорта: `npx remotion render src/index.tsx YuvioDemo out/demo.mp4`.
В коде движение задаётся через `useCurrentFrame`, `interpolate`, `spring`, а не таймеры реального времени.
Скил для запроса: `$remotion-create` или `$remotion-best-practices`.

## HyperFrames

В `examples/hyperframes`: `npm ci`, затем `npx hyperframes --help`.
Рабочий цикл: `npx hyperframes lint`, `npx hyperframes check`, `npx hyperframes preview`.
Параметры экспорта уточняются через `npx hyperframes render --help` у установленной версии.
Элементы используют `data-start`, `data-duration`, `data-track-index`; движение должно поддерживать переход к любому моменту времени.
Пример намеренно статический: это основа композиции, не готовая анимация.
Скил для запроса: `$hyperframes`.

## Editly

Нужны FFmpeg и ffprobe в PATH, а также совместимые нативные зависимости canvas/headless-gl.
В `examples/editly`: `npm ci`, `npx editly --help`, затем `npx editly demo.json --fast` для черновика.
Для полного качества: `npx editly demo.json`.
При проблемах сборки на Windows используйте поддерживаемый Node и Linux-окружение с зависимостями headless-gl/canvas.
Скил для запроса: `$editly-video` — наш собственный, не официальный скил mifi.

## Как ставить задачу

«Используй Remotion. Сделай 15-секундную анимацию YUVIO из Figma, 1080×1920, 30 fps. Покажи баланс, перевод и подтверждение. Исходники сохрани в этом репозитории».

Для сравнения движков можно повторить один сценарий каждым из них. Установка CLI ещё не подтверждает успешный экспорт MP4: для этого отдельно проверяются браузер, FFmpeg и результат рендера.

## Хранение и рендер

Скилы устанавливаются в Codex локально — GitHub не заменяет каталог скилов. Временные зависимости могут существовать локально. Долговременные исходники — в этом репозитории. Для рендера без нагрузки на компьютер можно настроить GitHub Actions. Такое облачное выполнение здесь пока не настроено. Артефакты Actions имеют срок хранения; для длительного хранения готовых MP4 подходят Releases или отдельно выбранное хранилище.

## Официальные источники

- https://github.com/remotion-dev/remotion
- https://www.remotion.dev/docs/ai/skills
- https://github.com/mifi/editly
- https://github.com/heygen-com/hyperframes

Remotion использует собственную лицензию; перед коммерческой работой применимость условий проверяется отдельно.
