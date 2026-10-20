# Video / YUVIO

Текущая версия: **V7 Final — 68 секунд, 2560×1440, 60 FPS, H.264 29,9 Мбит/с**. Финальный экспорт от 20 октября включает фирменный курсор, актуальные состояния Card из Figma и увеличенную типографику.

[Скачать MP4](https://media.githubusercontent.com/media/DiverseDesignAI/Video/main/deliverables/yuvio-walkthrough-v7.mp4) · [10-bit HEVC](https://media.githubusercontent.com/media/DiverseDesignAI/Video/main/deliverables/yuvio-walkthrough-v7-10bit.mp4) · [Описание изменений](tests/yuvio-motion-10s/REVISION-7.md) · [Проверка экспорта](tests/yuvio-motion-10s/v7-export-validation.json)

Видео V7 хранятся через Git LFS. Для обычного скачивания используйте ссылки выше.

[Последние правки и проверка финального рендера](tests/yuvio-motion-10s/V7-CURSOR-UPDATE.md).

Рабочий репозиторий для анимаций и монтажа. Исходники и инструкции хранятся здесь. `node_modules`, кэши и временные видео не коммитятся.

## Что выбрать

| Инструмент | Как устроен | Применение к YUVIO |
|---|---|---|
| Remotion | React, анимация по номеру кадра | Точная анимация интерфейса, чисел, карточек, переходов |
| HyperFrames | HTML/CSS, seekable-анимация | Промосцены, типографика, композиции из веб-элементов |
| Editly | JSON-список клипов и слоёв | Сборка готовых сцен, изображений, музыки и переходов |

## Remotion

В `examples/remotion`: `npm install`, затем `npx remotion studio src/index.tsx` для предпросмотра.
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

## Проверка установки (19 октября 2026)

- Скилы: 12 Remotion, 10 основных HyperFrames и пользовательский editly-video установлены в Codex. Доступны со следующего сообщения.
- HyperFrames 0.8.175: CLI запускается, пример проходит lint без замечаний. Экспорт MP4 не проверен.
- Editly 0.14.2: пакет получен, но запуск на Windows / Node 24 блокируется нативными модулями canvas/gl. Для сборки не хватает C++ Build Tools; готового gl-бинарника для этого окружения нет. Рабочий рендер не подтверждён.
- FFmpeg/ffprobe не найдены в PATH.

- Remotion 4.0.536: установлен; CLI запускается, стартовый пример успешно собирается в веб-композицию. Экспорт MP4 пока не проверен.

