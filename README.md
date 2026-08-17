# Портфолио — Константин Емяшев

Два тёмных резюме, переключаются друг на друга:
- `ai.html` — AI / LLM Engineer (открывается по умолчанию)
- `unity.html` — Unity Developer
- `index.html` — редирект на ai.html

## Как опубликовать на GitHub Pages (без терминала, ~2 минуты)

1. Зайди на https://github.com/new
2. **Repository name:** `kioflex12.github.io` (ровно так, с твоим ником)
3. Public → **Create repository**
4. На странице репозитория: **Add file → Upload files**
5. Перетащи сюда `ai.html`, `unity.html`, `index.html` и папку `img`
6. **Commit changes**
7. Через ~1 минуту сайт живой: **https://kioflex12.github.io**

Переключатель в шапке ведёт с AI-резюме на Unity и обратно.

## Через терминал (если удобнее команды)

```bash
git init
git add .
git commit -m "portfolio"
git branch -M main
git remote add origin https://github.com/kioflex12/kioflex12.github.io.git
git push -u origin main
```
