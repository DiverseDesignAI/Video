1) Пропал backdrop blur на экране Cards
На сцене с картой / frozen card / card controls у блока с кнопками Details / Freeze / Settings местами теряется эффект стеклянной панели.

Что должно быть:
- панель под кнопками должна выглядеть как glassmorphism container;
- нужен background blur / backdrop blur за плашкой;
- фон за ней должен слегка размываться, а не просто затемняться;
- должен остаться мягкий бордер и аккуратная полупрозрачность.
Что сказать Codex:
Restore the backdrop blur / glass effect behind the card action panel. The container with Details / Freeze / Settings must not look like a flat dark block. It should preserve the original frosted glass look from the design.

2) Градиенты выглядят пережатыми / “8-bit”
Это очень заметно на тёмно-фиолетовых фонах и glow-областях. Видно banding, местами ощущение дешёвого градиента и рябь.

Проблема:
- недостаточная глубина цвета;
- слишком жёсткая компрессия;
- отсутствие лёгкого grain/dither;
- возможно, слишком резкие glow-слои и тени.
Что надо исправить:
- сделать градиенты гладкими, плотными, сочными;
- убрать banding;
- добавить очень лёгкий fine grain / dither поверх фона, чтобы скрыть ступени;
- не использовать слишком “грязные” тени;
- glow должен быть мягкий, а не шумный.
Что сказать Codex:
The gradients currently show visible banding and look compressed / 8-bit. Rebuild all background gradients so they appear smooth, rich and premium. Add subtle grain or dithering to prevent banding. Glows and shadows must be soft and clean, not noisy or posterized.

3) Тени и свечения местами рябят
Сейчас некоторые тени выглядят как будто “грязные” или как будто изображение пережато.

Нужно:
- более чистые и мягкие тени;
- меньше “грязного” блюра;
- аккуратный glow без цифрового шума;
- сохранить премиальный dark-tech вид.
Что сказать Codex:
Clean up all shadows and glows. They should feel smooth and refined, not grainy, noisy or flickering. Avoid dirty blur artifacts and over-processed bloom.

4) Темп можно ускорить
Сейчас ролик уже понятнее, но его можно сделать чуть динамичнее. Некоторые блоки можно показывать быстрее без потери смысла.

Рекомендация:
- сократить общую длительность;
- убрать лишние паузы;
- чуть быстрее делать переходы между разделами;
- не “зависать” слишком долго на простых экранах.
Оптимально:
- общая длина: 55–70 секунд, а не затянутая;
- каждая основная сцена: 3–5 секунд;
- простые промежуточные экраны: 2–3 секунды.
Что сказать Codex:
Increase the pacing slightly. The walkthrough should feel more confident and fluid. Reduce dead time, shorten pauses, and move faster through simple scenes while preserving readability.

5) Не надо каждый раз сильно приближать телефон
Сейчас motion language местами повторяется: почти каждый блок снова пытается “приблизить” телефон. Из-за этого пропадает ритм и видео начинает ощущаться однообразным.

Лучше сделать разнообразнее:
- где-то оставить телефон статично;
- где-то лёгкий push-in;
- где-то боковой сдвиг;
- где-то акцент не камерой, а UI-анимацией внутри телефона;
- не в каждой сцене делать одинаковый dramatic zoom.
Что сказать Codex:
Avoid repeating the same camera push-in in every section. Vary the motion language: some scenes can stay mostly static, some can use a slight zoom, some a lateral drift, and some should focus on internal UI animation instead of moving the whole phone.

6) Движение местами всё ещё не до конца плавное
В целом уже лучше, но кое-где анимация всё ещё ощущается чуть дёрганой или не совсем естественной.

Что исправить:
- убрать резкие старты/остановки;
- привести все easing-кривые к одной логике;
- сделать переходы более мягкими;
- элементы должны двигаться с ощущением “product film”, а не просто слайд-шоу.
Что сказать Codex:
Smooth out all motion. Some transitions still feel abrupt or slightly jerky. Use consistent easing, softer acceleration/deceleration, and make every movement feel intentional and premium.

Дополнение в ТЗ для Codex
Ниже можешь прямо отправить почти как готовый блок:
V5 Revision Notes — Visual Polish and Motion Fixes
The current V5 walkthrough is structurally good, but it still needs visual polish and motion refinement.
1. Restore glass blur on card controls
On the Cards section, the action panel behind Details / Freeze / Settings has lost the original frosted glass look.

Fix:
- restore the backdrop blur / background blur;
- keep the semi-transparent glass panel appearance;
- preserve the subtle border and layered depth;
- do not let the panel look like a flat dark rectangle.
2. Fix gradient banding / low-quality gradients
The dark indigo-violet gradients currently look compressed and slightly posterized. Some areas feel “8-bit”.

Fix:
- rebuild all background gradients so they look smooth, rich and premium;
- remove visible banding;
- add a very subtle grain / dither layer to break gradient stepping;
- keep the gradients deep, elegant and clean.
Important:
The background must look luxurious and cinematic, not noisy or compressed.
3. Refine shadows and glow
Some glows and shadows feel too rough, noisy, or visually unstable.

Fix:
- use softer and cleaner shadows;
- reduce dirty blur artifacts;
- make glows subtle and controlled;
- avoid harsh bloom or over-sharpened light edges.
4. Slightly increase pacing
The video should move a little faster overall.

Fix:
- reduce unnecessary pauses;
- shorten idle holds on simple scenes;
- keep scene timing tighter while preserving readability.
Target:
A more confident, fluid pacing. The full video should feel concise and premium.
5. Reduce repetitive camera zooms
The phone does not need to push in on every section.

Fix:
- vary scene motion;
- combine static hero shots, subtle zooms, lateral movement, and internal UI motion;
- let some scenes breathe without moving the device too much.
Goal:
More variation and a more editorial motion style.
6. Improve motion smoothness
Some transitions still feel slightly jerky or too mechanical.

Fix:
- make easing curves more consistent;
- smooth out scene transitions;
- soften starts and stops;
- ensure all movement feels intentional and premium.
7. Preserve original UI fidelity
Do not simplify or flatten the original design language.

Important:
- maintain the original dark fintech aesthetic;
- preserve blur, glow hierarchy, depth, spacing, and clean UI rendering;
- backgrounds must remain smooth and premium.
8. Rendering quality requirements
The video quality should be improved so gradients and light effects look clean.

Render guidance:
- export in high quality at 2560×1440, 60 fps;
- use higher bitrate for final export;
- avoid compression artifacts in gradients;
- if possible, render from a higher-quality master before delivery.