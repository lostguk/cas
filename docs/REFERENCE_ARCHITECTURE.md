# Архитектура референсного проекта

> Полная документация кодовой базы. Читай этот файл вместо изучения файлов референса.
> Референсный проект: `/Users/lostguk/Herd/cas_new/cas_new_kz/`

---

## Технический стек

| Пакет | Версия | Назначение |
|---|---|---|
| `astro` | ^6.1.1 | SSG-фреймворк |
| `@astrojs/sitemap` | ^3.7.2 | Автогенерация sitemap |
| `@tailwindcss/vite` | ^4.2.2 | Tailwind через Vite |
| `tailwindcss` | ^4.2.2 | Утилитарный CSS |

---

## astro.config.mjs

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://DOMAIN',
  vite: {
    plugins: [tailwindcss()],
    build: { cssMinify: true },
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
```

---

## Структура файлов

```
src/
├── assets/images/          # Изображения (уникальные имена для каждого проекта)
├── components/
│   ├── ui/                 # Переиспользуемые UI
│   │   ├── CTAButton.astro
│   │   ├── Card.astro
│   │   └── SectionHeading.astro
│   ├── sections/           # Секции главной (набор определяется конфигом)
│   │   ├── HeroSection.astro
│   │   ├── OverviewSection.astro
│   │   ├── ...             # + Sports, Advantages, Payments, Bonus, Slots, Live, App, FAQ, CTA и др.
│   │   └── CTASection.astro
│   ├── Header.astro
│   ├── Footer.astro
│   ├── SEOHead.astro
│   ├── Breadcrumbs.astro
│   └── ArticleMeta.astro
├── layouts/
│   └── BaseLayout.astro
├── pages/                  # Набор и URL-slugs определяются конфигом (варьируются!)
│   ├── index.astro         # Обязательные
│   ├── about.astro
│   ├── 404.astro
│   └── {slug}.astro        # 4-7 основных + 0-4 слотовых (уникальные slug для каждого проекта)
└── styles/
    └── global.css
```

---

## Компоненты — API и паттерны

### global.css

Базовая структура Tailwind 4 с кастомной темой:

```css
@import "tailwindcss";

@theme {
  --color-{name}-{shade}: #hex;
  --font-sans: 'FontName', system-ui, -apple-system, sans-serif;
}

@layer base {
  html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
  body { background-color: var(--color-{base}-950); color: #e2e8f0; font-family: var(--font-sans); line-height: 1.7; }
  ::selection { background-color: var(--color-{accent}-500); color: ...; }
}
```

Именование цветов в референсе: `navy-*`, `gold-*`, `emerald-*`.
В новых проектах имена переменных **уникальны для каждого проекта** — см. VARIATION_STRATEGY.md (5+ вариантов: base/accent/secondary, dark/primary/highlight, bg/brand/pop и т.д.).

---

### BaseLayout.astro

**Props:**
```ts
interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
  schema?: object;
  publishDate?: string;
  updateDate?: string;
}
```

**Логика:**
1. Принимает `publishDate` и `updateDate` для Article schema
2. Создаёт `authorSchema` с данными автора
3. Если `publishDate` есть — генерирует Article schema с `headline`, `description`, `datePublished`, `dateModified`, `author`, `publisher`
4. Мержит `seoProps.schema` с `articleSchema` (может быть массив)
5. HTML: `<html lang="ru">`, body с `min-h-screen flex flex-col`, main с `flex-1 pt-16 lg:pt-18`

---

### SEOHead.astro

**Props:**
```ts
interface Props {
  title: string;
  description: string;
  canonical?: string;       // default: Astro.url.href
  ogImage?: string;         // default: '/og-default.png'
  noindex?: boolean;        // default: true (для закрытия от индексации)
  type?: 'website' | 'article';
  schema?: object;
}
```

**Генерирует:**
- `<meta charset>`, viewport, theme-color
- `<title>` — добавляет ` | siteName` если его нет
- `<meta description>`, `<link canonical>`
- robots (noindex/index)
- Open Graph: og:type, og:title, og:description, og:url, og:site_name, og:image, og:locale (ru_KZ)
- Twitter Card: summary_large_image
- Гео-мета: geo.region KZ, geo.placename Kazakhstan, content-language ru
- Favicon SVG
- Google Fonts: preload + async через media="print" onload
- Schema.org JSON-LD (массив или одиночный)

---

### Header.astro

**Структура:**
- `navLinks` — массив `{ href, label }` (4-6 ссылок)
- `affiliateLink` — партнёрская ссылка
- Fixed header: `fixed top-0 left-0 right-0 z-50 bg-{base}-950/90 backdrop-blur-xl border-b border-white/5`
- **Логотип** — тип из VARIATION_STRATEGY.md (текст / SVG / изображение / CSS-art / emoji). Повторяется в Header, Footer, мобильном меню. При типе D (изображение) — `<Image>` с `loading="eager"`, width 120-140px.
- Навигация: desktop (lg:flex) с hover-эффектами, активная ссылка подсвечивается
- CTA-кнопка: скрытая на mobile `hidden sm:inline-flex`, градиентная
- Мобильное меню: бургер-кнопка, `<div id="mobile-menu" class="hidden">`
- JS: toggle hidden класса при клике на бургер

**Паттерн активной ссылки:**
```astro
class:list={[
  'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
  currentPath === link.href || (link.href !== '/' && currentPath.startsWith(link.href))
    ? 'text-{accent}-400 bg-{accent}-500/10'
    : 'text-slate-300 hover:text-white hover:bg-white/5'
]}
```

---

### Footer.astro

**Структура:**
- `sections` — массив `{ title, links: [{ href, label }] }` (3 группы)
- Layout: `grid grid-cols-2 md:grid-cols-4 gap-8`
- Первая колонка: лого + описание
- Остальные: заголовок + список ссылок
- Дисклеймер: 21+, ответственная игра, лицензия
- Копирайт: `currentYear`
- Фон: `bg-{base}-900 border-t border-white/5 mt-20`

---

### Breadcrumbs.astro

**Props:**
```ts
interface Props {
  items: { label: string; href?: string; }[];
}
```

**Генерирует:**
- Навигация `<nav aria-label="Навигация">`
- Список `<ol>` с разделителями-шевронами (SVG)
- Schema.org BreadcrumbList (JSON-LD `<script>`)
- Домен хардкодится в schema — нужно менять на конфиг

---

### ArticleMeta.astro

**Props:**
```ts
interface Props {
  publishDate: string;
  updateDate: string;
}
```

**Отображает:**
- Аватар автора (инициалы в цветном круге `bg-{accent}-500/20`)
- Имя автора (ссылка на /about)
- Дата публикации (формат: «15 января 2026»)
- Дата обновления
- Разделители `|`

**Форматирование дат:**
```ts
const months = ['января', 'февраля', ...];
const formatDate = (dateStr) => `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
```

---

### CTAButton.astro

**Props:**
```ts
interface Props {
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  external?: boolean;
  class?: string;
}
```

**Варианты:**
- `primary`: `bg-gradient-to-r from-{accent}-500 to-{accent}-600 text-white shadow-lg`
- `secondary`: `bg-white/10 text-white border border-white/10`
- `outline`: `border-2 border-{accent}-500/50 text-{accent}-400`

**Размеры:** sm `px-4 py-2`, md `px-6 py-3`, lg `px-8 py-4`

Если `external` — добавляет `target="_blank" rel="noopener noreferrer"`

---

### Card.astro

**Props:**
```ts
interface Props {
  class?: string;
  hover?: boolean; // default: true
}
```

**Стиль:** `bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 lg:p-8`
С hover: `hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300`

---

### SectionHeading.astro

**Props:**
```ts
interface Props {
  tag?: 'h2' | 'h3';
  align?: 'left' | 'center';
  class?: string;
}
```

**Стиль заголовка:** `text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight`
Поддерживает `<slot name="subtitle" />` для подзаголовка.

---

## Секции главной страницы — паттерны

### HeroSection

- Секция: `relative overflow-hidden py-16 sm:py-20 lg:py-28`
- Фон: CSS-градиент `from-{base}-800 via-{base}-950 to-{base}-900` + радиальный градиент акцентного цвета
- Опционально: фоновое изображение с `opacity-20 mix-blend-lighten loading="eager"`
- Бейдж: `inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-{accent}-500/10 border border-{accent}-500/20`
- H1: `text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.1]`
- 2 CTA-кнопки: primary (affiliate, external) + secondary (внутренняя ссылка)
- 3 статистики: grid grid-cols-3, число в `text-{accent}-400` + подпись в `text-slate-400`

### OverviewSection

- Секция: `py-16 lg:py-20`
- Контейнер: `max-w-7xl` → внутри `max-w-4xl`
- SectionHeading по центру
- 2-3 абзаца текста `text-slate-300 leading-relaxed`
- Информационный блок-дисклеймер: `bg-{accent}-500/5 border border-{accent}-500/10 rounded-xl p-4`

### SportsSection

- Секция: `relative py-16 lg:py-20 overflow-hidden`
- Фоновое изображение (опционально): `opacity-[0.07]` + gradient overlay
- 4 карточки спорта в `grid sm:grid-cols-2 gap-6`
- Каждая карточка: Card с иконкой (SVG inline), заголовком, текстом
- Иконки: `w-12 h-12 rounded-xl bg-{accent}-500/10 text-{accent}-400`

### AdvantagesSection

- 6 карточек в `grid sm:grid-cols-2 lg:grid-cols-3 gap-6`
- Каждая: `p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]` с hover
- Иконка: `w-12 h-12 rounded-xl bg-{accent}-500/10`
- Заголовок + текст

### PaymentsSection

- Фон: `bg-{base}-900/50`
- 3 карточки метода (Card) в `grid md:grid-cols-3`
- Таблица: `<table>` с thead/tbody, hover на строках
- Колонки: Метод | Пополнение | Вывод | Минимум

### BonusSection

- 2 колонки: изображение (lg:col-span-2) + карточки бонусов (lg:col-span-3)
- Карточки: `bg-gradient-to-br from-{accent}-500/5` с выделенной суммой `text-{accent}-400/30`
- CTA внизу по центру

### SlotsSection

- Фон: `bg-{base}-900/50`
- 3 карточки слотов в `grid md:grid-cols-3`
- Каждая: изображение сверху (aspect-[16/10]) + провайдер + название + описание + RTP/MaxWin + CTA (outline)

### LiveSection

- 2 колонки: текст слева + изображение справа (`grid lg:grid-cols-2 gap-12 items-center`)
- SectionHeading с `align="left"`
- Список фич с галочками (SVG)
- Дополнительный абзац текста

### FAQSection

- `max-w-3xl mx-auto`
- `<details>` элементы с кастомным стилем
- Каждый: `group rounded-xl border border-white/[0.06] bg-white/[0.02]`
- Summary: flex, с chevron иконкой `group-open:rotate-180`
- Schema: FAQPage JSON-LD

### CTASection

- Обёртка: `rounded-3xl bg-gradient-to-br from-{accent}-500/10 via-{base}-800 to-{secondary}-500/5`
- Радиальный градиент фоном
- H2, подзаголовок, 2 CTA-кнопки по центру

---

## Страницы — паттерн подстраницы

Все подстраницы (кроме index и 404) следуют шаблону:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Breadcrumbs from '../components/Breadcrumbs.astro';
import ArticleMeta from '../components/ArticleMeta.astro';
import CTAButton from '../components/ui/CTAButton.astro';
import Card from '../components/ui/Card.astro';

const affiliateLink = '...';

// Данные для страницы (шаги, таблицы, карточки)
const steps = [...];
const tableRows = [...];

// Schema.org для страницы
const schema = { '@context': 'https://schema.org', '@type': '...', ... };
---

<BaseLayout
  title="..."
  description="..."
  schema={schema}
  publishDate="2026-XX-XX"
  updateDate="2026-XX-XX"
>
  <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: '...' }]} />
  <ArticleMeta publishDate="..." updateDate="..." />

  <section class="py-12 lg:py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Заголовок + CTA -->
      <div class="text-center mb-12">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">...</h1>
        <p class="text-lg text-slate-300 max-w-2xl mx-auto">...</p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <CTAButton href={affiliateLink} size="lg" external>...</CTAButton>
          <CTAButton href="/..." variant="secondary" size="lg">...</CTAButton>
        </div>
      </div>

      <!-- Контентные блоки с H2 -->
      <div class="space-y-6 text-slate-300">
        <h2 class="text-2xl font-bold text-white">...</h2>
        <p>...</p>
      </div>

      <!-- Шаги / карточки / таблицы -->
      ...

      <!-- Финальный CTA -->
      <div class="mt-16 text-center p-8 rounded-2xl bg-gradient-to-br from-{accent}-500/10 via-{base}-800 to-{secondary}-500/5 border border-{accent}-500/10">
        <h2 class="text-2xl font-bold text-white mb-3">...</h2>
        <p class="text-slate-300 mb-6">...</p>
        <CTAButton href={affiliateLink} size="lg" external>...</CTAButton>
      </div>
    </div>
  </section>
</BaseLayout>
```

---

## Типы страниц и их Schema

| Тип | Schema | Пример |
|---|---|---|
| Главная | `WebSite` + `SearchAction` | index.astro |
| Инструкция | `HowTo` + `HowToStep` | registraciya, skachat |
| Информационная | `Article` (через BaseLayout) | zerkalo, lichnyy-kabinet, bonus |
| Обзор слота | `Review` + `Game` | sugar-rush, gates-of-olympus |
| О проекте | `AboutPage` + `Person` | about |
| 404 | нет schema, noindex=true | 404 |

---

## Статические файлы (public/)

### .htaccess
Полная серверная оптимизация Apache:
- HTTPS redirect (301)
- Remove trailing slash
- Remove www
- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, HSTS)
- GZIP (mod_deflate) для текста, JS, CSS, SVG, шрифтов
- Кеширование (mod_expires): HTML 0s, CSS/JS/img/fonts 1 год
- Cache-Control: HTML no-cache, остальное immutable
- ETag отключён
- Блок скрытых файлов
- Options -Indexes
- ErrorDocument 404 /404.html

### robots.txt
```
User-agent: *
Disallow: /    # При noindex: true
# Allow: /     # При запуске

Sitemap: https://DOMAIN/sitemap-index.xml
```

### favicon.svg
SVG 32×32, стилистически связанный с логотипом проекта:
- Для текстового лого (A/F): квадрат с `rx="6"`, base-цвет фона, аббревиатура accent-цветом
- Для SVG-значка (B): та же геометрическая фигура, уменьшенная до 32×32
- Для буквы в фигуре (C): тот же скруглённый квадрат с буквой
- Для картинки (D): упрощённая версия лого как SVG или 32×32 PNG-favicon через `<link rel="icon" type="image/png">`
- Для CSS-art (E): градиентный квадрат с формой

---

## Изображения — стратегия

Каждый проект ОБЯЗАН содержать уникальные изображения. Имена файлов, стили, композиции — всё должно отличаться от проекта к проекту.

### Категории изображений

| Категория | Кол-во | Где используются | Источник |
|---|---|---|---|
| Фоновые (hero, спорт) | 2-3 | Фон секций на главной (opacity 5-25%) | AI-генерация |
| Контентные (бонусы, казино, live, app) | 3-4 | Секции на главной, в 2-колоночных блоках | AI-генерация |
| Подстраничные | 3-5 | Заголовочные блоки подстраниц | AI-генерация |
| Слотовые | по кол-ву slot-страниц | Карточки слотов на главной + подстраницы | Тематические AI-изображения |
| OG-image | 1 | Соцсети (также в public/) | AI-генерация |
| **Итого** | **13-18** | | |

### Правила именования файлов

**Имена файлов уникальны для каждого проекта.** Не копировать структуру именования между проектами.

Варианты подходов к именам:
- Описательные: `stadium-night-view.png`, `phone-betting-app.png`
- Короткие: `bg-hero.png`, `img-bonus.png`, `pic-casino.png`
- Нумерованные: `visual-01.png`, `visual-02.png`
- Тематические: `arena-lights.png`, `gold-chest.png`, `roulette-top.png`

Агент выбирает схему именования случайно для каждого проекта.

### Правила для подстраниц

Минимум 3-4 подстраницы должны иметь изображение в заголовочном блоке. Приоритет:
1. Страницы-инструкции (регистрация, скачивание) — обязательно
2. Казино-страница — обязательно
3. Бонусы — желательно
4. Остальные — по ситуации

### Правила для слотов

Каждая слот-страница и каждая карточка слота в секции Slots на главной ОБЯЗАНА иметь **свою уникальную** картинку. Одна картинка на нескольких слотах — ЗАПРЕЩЕНО.

**Источник изображений слотов — пользователь предоставляет вручную.**

Перед генерацией проекта пользователь скидывает в чат реальные скриншоты/картинки для каждого слота, который будет в проекте. Агент копирует их в `src/assets/images/` и использует в коде.

**ЕСЛИ пользователь не предоставил картинки слотов при запросе на генерацию — агент ОБЯЗАН попросить их ПЕРЕД началом работы.** Не генерировать проект без слотовых картинок.

Формат запроса:
> Для проекта нужны картинки следующих слотов: [список]. Скиньте изображения для каждого слота, и я начну генерацию.

### Генерация AI-изображений

Используется GenerateImage. Промпты адаптируются под цветовую схему проекта.

**Принципы промптов:**
- Указывать hex-цвет фона из палитры проекта (`#{base-color}`)
- Всегда: `no text, no logos, no watermarks, no UI elements`
- Фоновые: `very dark edges, cinematic lighting, shallow depth of field`
- Предметные: `professional product photography, studio lighting`
- Атмосферные: `editorial photography style, high-end magazine quality`
- Указывать соотношение сторон (16:9, 4:3, 3:4)

**Шаблоны промптов по типам:**

Фон hero:
> Professional editorial photograph of [спортивная/казино сцена], dramatic [accent-color] spotlights, dark atmosphere #{base-color}, cinematic wide angle, no text no logos no watermarks, 16:9

Контентная (бонусы/казино/live):
> Professional product/food photography of [предмет по теме секции] on dark surface, [accent-color] lighting accents, dark background #{base-color}, no text no logos no watermarks, [ratio]

Подстраничная:
> [Абстрактная/предметная] illustration/photography of [тема страницы], [accent-color] glow, dark background #{base-color}, no text no logos no watermarks, 16:9

Слотовая (тематическая):
> Professional [product/food/landscape] photography of [предметы по теме слота] on dark surface, [accent-color] lighting, dark moody atmosphere, no text no logos no watermarks, 16:9

Агент подставляет конкретные значения из конфига проекта — цвета, тему, предметы.

### Использование в Astro — паттерны

Все изображения в `src/assets/images/`. Импорт через Astro `<Image>` с уникальными именами.

**Паттерн: фоновое изображение**
```astro
import { Image } from 'astro:assets';
import heroBackground from '../../assets/images/{уникальное-имя}.png';

<div class="relative overflow-hidden">
  <Image src={heroBackground} alt="Описание на русском" width={1400} height={700}
    class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-lighten"
    loading="eager" format="webp" quality={60} />
  <div class="absolute inset-0 bg-gradient-to-b from-{base}-950 via-{base}-950/90 to-{base}-950"></div>
  <div class="relative">...</div>
</div>
```

**Паттерн: контентное изображение**
```astro
import contentImg from '../../assets/images/{уникальное-имя}.png';

<Image src={contentImg} alt="Описание на русском" width={600} height={450}
  class="rounded-2xl border border-white/[0.06] shadow-2xl" format="webp" quality={80} />
```

**Паттерн: изображение слота (в карточке и на подстранице)**
```astro
import slotImg from '../../assets/images/{уникальное-имя}.png';

<div class="aspect-[16/10] overflow-hidden rounded-t-2xl">
  <Image src={slotImg} alt="Описание слота на русском" width={800} height={500}
    class="w-full h-full object-cover" format="webp" quality={80} />
</div>
```

**Паттерн: заголовочное изображение подстраницы**
```astro
import pageImg from '../assets/images/{уникальное-имя}.png';

<div class="mt-10 rounded-2xl overflow-hidden border border-white/[0.06]">
  <Image src={pageImg} alt="Описание на русском" width={900} height={450}
    class="w-full" format="webp" quality={80} />
</div>
```

### Общие правила

- `loading="eager"` ТОЛЬКО для hero-баннера на главной
- Остальные — lazy (по умолчанию)
- Фоновые: `quality={60}`, контентные: `quality={75-80}`
- Все `alt` на русском, описательные, содержат ключевые слова
- Каждый `alt` уникален в рамках страницы
- Каждый слот — своя уникальная картинка (одна на нескольких слотах — запрещено)
- Имена файлов уникальны между проектами (не копировать naming-схему)

---

## Минимум текста на главной — требования

Главная страница должна содержать **10-12 секций** с существенным объёмом текста.

### Требования к объёму текста по секциям

| Секция | Объём текста | Что должно быть |
|---|---|---|
| Hero | 30-40 слов подзаголовок | H1, подзаголовок (1-2 предложения), 2 CTA, 3 статистики |
| Overview | 3 абзаца, 150-200 слов | Личный обзор + дисклеймер. Без воды. |
| Sports | 4 карточки по 2 предл. + 1 вводный абзац | 100-130 слов. Факты, не описания. |
| Advantages | 6 карточек по 2 предл. | 100-130 слов. Плюс + минус в каждой. |
| Payments | 3 карточки по 1-2 предл. + таблица | 80-100 слов + таблица (таблица не считается). |
| Bonus | 3 карточки по 1-2 предл. | 80-100 слов. Цифры, не вода. |
| Slots | 3 карточки по 2 предл. | 80-100 слов. RTP, ссылки. |
| Live | 1-2 абзаца + список 4 фич | 80-100 слов. |
| App | 1-2 абзаца | 60-80 слов. |
| FAQ | 6-7 вопросов по 2-3 предл. ответ | 200-250 слов. Без воды. |
| CTA | H2 + 1 предложение | 15-25 слов. |

**Итого на главной: 1000-1400 слов.** НЕ больше.

3000 слов — переспам. Google и AI-детекторы палят длинные однородные тексты. Лучше 1200 качественных слов, чем 3000 с водой.

**Правило: меньше текста = лучше.** Каждое предложение должно содержать факт, цифру или личное мнение. Если предложение можно убрать без потери смысла — убирай.

---

## Ключевые паттерны для повторения

1. **Все цвета через CSS-переменные** — легко менять тему
2. **Один affiliate link** — хардкодится в каждом компоненте, который его использует
3. **Schema.org** — в каждом компоненте/странице, где применимо, через `<script type="application/ld+json">`
4. **Домен хардкодится** — в Breadcrumbs, BaseLayout, SEOHead
5. **Автор хардкодится** — в ArticleMeta, BaseLayout, about.astro
6. **Нет центрального конфига (site.ts)** — домен, affiliate-ссылка, имя автора хардкодятся прямо в компонентах
7. **SVG-иконки inline** — передаются как строки в массивах данных, рендерятся через `<Fragment set:html={icon} />`
8. **Изображения** — импорт из `src/assets/images/`, Astro `<Image>` компонент с format="webp" и quality
9. **13-18 изображений на проект** — все уникальные, имена файлов не повторяются между проектами
