# Плейсхолдеры scaffold-шаблона

При копировании scaffold в новый проект, агент заменяет эти плейсхолдеры на реальные значения из project.config.json.

| Плейсхолдер | Откуда брать | Пример |
|---|---|---|
| `{{PROJECT_NAME}}` | package.json name (уникальный) | `mostbet-kz-obzor` |
| `{{DOMAIN}}` | config.domain | `mostbet-kz.com` |
| `{{BRAND}}` | config.brand | `Mostbet` |
| `{{SITE_NAME}}` | Генерируется: "{brand} Казахстан — {тип}" | `Mostbet Казахстан — ставки и казино` |
| `{{AUTHOR_NAME}}` | config.author.name | `Азамат Сулейменов` |
| `{{AUTHOR_INITIALS}}` | Первые буквы имени и фамилии | `АС` |
| `{{FONT_NAME}}` | Из выбранного шрифта | `Manrope` |
| `{{FONT_URL}}` | Google Fonts URL часть | `Manrope:wght@400;500;600;700;800` |
| `{{COLOR_BASE}}` | Имя base-переменной из VARIATION_STRATEGY | `deep` |
| `{{COLOR_ACCENT}}` | Имя accent-переменной | `main` |
| `{{COLOR_SECONDARY}}` | Имя secondary-переменной | `alt` |
| `{{HEX_BASE_950}}` | Самый тёмный base | `#070a12` |
| `{{HEX_BASE_900}}` | Основной base | `#0c0f1a` |
| `{{HEX_BASE_800}}` | Lighter base | `#161b2e` |
| `{{HEX_BASE_700}}` | Lightest base | `#1f2744` |
| `{{HEX_ACCENT_600}}` | Darker accent | `#dc2626` |
| `{{HEX_ACCENT_500}}` | Main accent | `#ef4444` |
| `{{HEX_ACCENT_400}}` | Lighter accent | `#f87171` |
| `{{HEX_ACCENT_300}}` | Lightest accent | `#fca5a5` |
| `{{HEX_SECONDARY_500}}` | Main secondary | `#10b981` |
| `{{HEX_SECONDARY_400}}` | Lighter secondary | `#34d399` |
| `{{FAVICON_TEXT}}` | Аббревиатура для favicon | `1x` |
| `{{AFFILIATE_LINK}}` | config.affiliate_url | `https://ref...` |

## Файлы которые НЕ нужно менять после замены плейсхолдеров
- .htaccess (одинаковый для всех)
- tsconfig.json (одинаковый)
- .gitignore (одинаковый)

## Файлы которые агент ДОПИСЫВАЕТ после замены
- Header.astro — создаётся с нуля (вариант лого, навигация, стиль)
- Footer.astro — создаётся с нуля (вариант, ссылки, описание)
- CTAButton.astro — создаётся с нуля (вариант стиля кнопок)
- Card.astro — создаётся с нуля (вариант стиля карточек)
- Все sections/* — создаются с нуля (уникальный контент)
- Все pages/* (кроме 404) — создаются с нуля
