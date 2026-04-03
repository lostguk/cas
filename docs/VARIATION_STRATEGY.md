# Стратегия вариативности между проектами

> Каждый проект должен быть визуально, структурно и кодово уникален.
> Этот документ описывает ВСЕ точки вариации.

---

## 1. CSS и цветовая тема

### Именование переменных

Каждый проект использует **разные имена** CSS-переменных. Не просто разные значения, а разные имена.

| Проект | Переменные | Пример |
|---|---|---|
| 1 | `--color-base-*`, `--color-accent-*`, `--color-secondary-*` | base=navy, accent=gold |
| 2 | `--color-dark-*`, `--color-primary-*`, `--color-highlight-*` | dark=purple, primary=violet |
| 3 | `--color-bg-*`, `--color-brand-*`, `--color-pop-*` | bg=charcoal, brand=orange |
| 4 | `--color-deep-*`, `--color-main-*`, `--color-alt-*` | deep=slate, main=cyan |
| 5 | `--color-surface-*`, `--color-cta-*`, `--color-info-*` | surface=obsidian, cta=amber |

### Значения цветов — 10 пресетов

| # | Пресет | Основа | Акцент | Допцвет |
|---|---|---|---|---|
| 1 | navy-gold | #0a1628 | #f59e0b | #10b981 |
| 2 | dark-emerald | #041f1e | #10b981 | #fbbf24 |
| 3 | midnight-red | #0c0f1a | #ef4444 | #f8fafc |
| 4 | charcoal-orange | #1a1a2e | #f97316 | #38bdf8 |
| 5 | deep-purple | #1a0533 | #a855f7 | #ec4899 |
| 6 | slate-cyan | #0f172a | #06b6d4 | #22c55e |
| 7 | obsidian-amber | #111318 | #f59e0b | #84cc16 |
| 8 | carbon-lime | #18181b | #84cc16 | #22d3ee |
| 9 | abyss-coral | #0a0e17 | #fb7185 | #2dd4bf |
| 10 | iron-blue | #111827 | #3b82f6 | #fb923c |

### Шрифты (чередовать)

| Шрифт | Стиль | Google Fonts URL |
|---|---|---|
| Inter | Нейтральный, технологичный | `family=Inter:wght@400;500;600;700;800` |
| Manrope | Геометрический, современный | `family=Manrope:wght@400;500;600;700;800` |
| Nunito Sans | Мягкий, дружелюбный | `family=Nunito+Sans:wght@400;500;600;700;800` |
| Source Sans 3 | Чистый, корпоративный | `family=Source+Sans+3:wght@400;500;600;700;800` |
| PT Sans | Классический, читаемый | `family=PT+Sans:wght@400;700` |
| DM Sans | Строгий, минималистичный | `family=DM+Sans:wght@400;500;600;700` |
| Rubik | Округлый, энергичный | `family=Rubik:wght@400;500;600;700;800` |
| Plus Jakarta Sans | Элегантный, лёгкий | `family=Plus+Jakarta+Sans:wght@400;500;600;700;800` |

---

## 2. Визуальные стилистики (6 штук)

Стилистика определяет весь визуальный язык проекта: фон, формы, тени, типографику, ощущение. Меняются не просто цвета — меняется **vibe** сайта.

Поле в конфиге: `visual_style`.

---

### Стиль A. Dark Premium

Тёмный, технологичный, с эффектами стекла. Основной стиль для ставок и казино.

| Элемент | CSS-правила |
|---|---|
| **body** | `bg-{base}-950 text-slate-200` |
| **Карточки** | `bg-white/[0.03] border border-white/[0.06] rounded-2xl backdrop-blur-sm` |
| **Кнопки primary** | `bg-gradient-to-r from-{accent}-500 to-{accent}-600 text-white rounded-xl shadow-lg shadow-{accent}-500/20` |
| **Кнопки secondary** | `bg-white/10 text-white border border-white/10 rounded-xl` |
| **Секции** | `py-16 lg:py-20`, чередование обычных и `bg-{base}-900/50` |
| **Заголовки** | `text-white font-bold`, подзаголовки `text-slate-400` |
| **Hover** | `hover:bg-white/[0.05] hover:border-{accent}-500/20 transition-all duration-300` |
| **Эффекты** | Radial gradients, backdrop-blur на header, animate-pulse на бейджах |

**Подходящие цвета:** navy-gold, midnight-red, deep-purple, slate-cyan, obsidian-amber, abyss-coral, iron-blue
**Подходящие шрифты:** Inter, Manrope, DM Sans, Plus Jakarta Sans

---

### Стиль B. Light Clean

Светлый, минималистичный, много воздуха. Как Apple или Stripe.

| Элемент | CSS-правила |
|---|---|
| **body** | `bg-white text-gray-800` (или `bg-gray-50`) |
| **Карточки** | `bg-white border border-gray-200 rounded-xl shadow-sm` |
| **Кнопки primary** | `bg-{accent}-600 text-white rounded-lg hover:bg-{accent}-700` (без градиента) |
| **Кнопки secondary** | `bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200` |
| **Секции** | `py-16 lg:py-24`, фоны: белый и `bg-gray-50` чередование |
| **Заголовки** | `text-gray-900 font-semibold`, подзаголовки `text-gray-500` |
| **Hover** | `hover:shadow-md hover:border-{accent}-200 transition-all duration-200` |
| **Эффекты** | Минимум — тонкие тени, плавные переходы. Без blur, без градиентов |

**global.css отличие:** `body { background: white; color: #1f2937; }`, `::selection { background: {accent}; color: white; }`

**Подходящие цвета:** Акцент яркий на нейтральном фоне — любой пресет, но base-цвет НЕ используется для фона (фон белый)
**Подходящие шрифты:** Inter, DM Sans, Source Sans 3, Plus Jakarta Sans

---

### Стиль C. Sports Energy

Яркий, динамичный, энергичный. Скошенные блоки, крупная типографика, ощущение движения.

| Элемент | CSS-правила |
|---|---|
| **body** | `bg-{base}-950 text-white` |
| **Карточки** | `bg-{base}-800 border-l-4 border-{accent}-500 rounded-lg` (левый бордер акцентный) |
| **Кнопки primary** | `bg-{accent}-500 text-white rounded-lg text-lg font-bold uppercase tracking-wider hover:scale-105 transition-transform` |
| **Кнопки secondary** | `border-2 border-{accent}-500 text-{accent}-400 rounded-lg uppercase tracking-wider` |
| **Секции** | `py-20 lg:py-28`, некоторые со `skew`: `transform: skewY(-2deg)` + inner `skewY(2deg)` |
| **Заголовки** | `text-4xl lg:text-6xl font-extrabold uppercase tracking-tight` |
| **Hover** | `hover:scale-[1.02] hover:shadow-xl transition-transform duration-200` |
| **Эффекты** | clip-path на hero, skew секций, scale анимации, яркие gradient borders |

**Особенности:**
- Hero: полноэкранный с clip-path снизу (`polygon(0 0, 100% 0, 100% 85%, 0 100%)`)
- Разделители между секциями: SVG-волны или диагональные линии
- Числа/статистики: очень крупные (`text-6xl font-black`)

**Подходящие цвета:** midnight-red, charcoal-orange, iron-blue, abyss-coral
**Подходящие шрифты:** Rubik, Manrope, Inter (bold weights)

---

### Стиль D. Brutalist

Грубый, сырой, контрастный. Никаких скруглений, жирные бордеры, mono-акценты.

| Элемент | CSS-правила |
|---|---|
| **body** | `bg-black text-white` (или `bg-white text-black` — два под-варианта) |
| **Карточки** | `border-2 border-white rounded-none p-8` (или `border-black` на светлом) |
| **Кнопки primary** | `bg-{accent}-500 text-black rounded-none px-8 py-4 font-mono uppercase font-bold border-2 border-{accent}-500` |
| **Кнопки secondary** | `bg-transparent border-2 border-white text-white rounded-none font-mono uppercase` |
| **Секции** | `py-16 lg:py-24`, без фоновых различий — один цвет |
| **Заголовки** | `text-5xl lg:text-7xl font-black uppercase tracking-tighter` |
| **Hover** | `hover:bg-{accent}-500 hover:text-black transition-colors duration-100` (резкий, не плавный) |
| **Эффекты** | Никаких — без теней, без blur, без градиентов. Только бордеры и типографика |

**Особенности:**
- Шрифт для акцентов: mono (JetBrains Mono, Space Mono, IBM Plex Mono)
- Заголовки: uppercase + letter-spacing отрицательный
- Таблицы: жирные бордеры, без zebra-striping
- Минимум изображений — акцент на тексте

**Подходящие цвета:** midnight-red (чёрный+красный), carbon-lime (чёрный+лайм), iron-blue
**Подходящие шрифты:** Space Mono + Inter, JetBrains Mono + Rubik, IBM Plex Mono + DM Sans

---

### Стиль E. Casino Glam

Роскошный, чёрный с золотом, текстурный. Ощущение VIP-клуба.

| Элемент | CSS-правила |
|---|---|
| **body** | `bg-black text-gray-200` + subtle noise texture через `background-image` |
| **Карточки** | `bg-gradient-to-b from-gray-900 to-black border border-{accent}-500/20 rounded-2xl shadow-inner` |
| **Кнопки primary** | `bg-gradient-to-r from-{accent}-400 via-{accent}-500 to-{accent}-600 text-black font-bold rounded-xl border border-{accent}-400/50 shadow-lg shadow-{accent}-500/30` |
| **Кнопки secondary** | `bg-transparent border border-{accent}-500/40 text-{accent}-400 rounded-xl` |
| **Секции** | `py-20 lg:py-28`, разделители: `h-px bg-gradient-to-r from-transparent via-{accent}-500/30 to-transparent` |
| **Заголовки** | `font-serif text-{accent}-400` (serif шрифт!), подзаголовки `text-gray-400 italic` |
| **Hover** | `hover:border-{accent}-400/40 hover:shadow-{accent}-500/10 transition-all duration-500` |
| **Эффекты** | Золотые градиенты, декоративные разделители, inner shadows, subtle noise bg |

**Особенности:**
- Два шрифта: serif для заголовков (Playfair Display / Cormorant Garamond) + sans для текста
- Декоративные элементы: тонкие золотые линии, diamond-разделители
- Фоновая текстура: `background-image: url("data:image/svg+xml,...")` noise pattern
- Изображения с золотым overlay

**Подходящие цвета:** navy-gold, obsidian-amber (золото обязательно)
**Подходящие шрифты:** Playfair Display + Inter, Cormorant Garamond + DM Sans

---

### Стиль F. Blog Personal

Как личный блог — тёплый, простой, читаемый. Medium/Substack-вайб.

| Элемент | CSS-правила |
|---|---|
| **body** | `bg-stone-50 text-stone-800` (тёплый кремовый фон) |
| **Карточки** | Минимальные или без них. Если есть: `bg-white rounded-lg p-6` без бордеров, с `shadow-sm` |
| **Кнопки primary** | `bg-stone-800 text-white rounded-full px-6 py-3 hover:bg-stone-700` (простые, без градиентов) |
| **Кнопки secondary** | `text-stone-600 underline hover:text-stone-900` (просто ссылка с подчёркиванием) |
| **Секции** | `py-12 lg:py-16`, одноколоночный layout `max-w-2xl mx-auto` (узкий!) |
| **Заголовки** | `text-stone-900 font-semibold` (не bold, не extrabold), подзаголовки `text-stone-500` |
| **Hover** | Минимальный — underline или лёгкое изменение цвета |
| **Эффекты** | Никаких. Чистая типографика. |

**Особенности:**
- Layout: `max-w-2xl` вместо `max-w-7xl` — узкая колонка контента
- Hero: компактный, без фонового изображения, просто текст + CTA
- Автор с аватаркой виден на каждой странице (не только в ArticleMeta)
- Больше текста, меньше карточек и сеток
- Секции не разделены фоном — одна плавная страница
- Изображения: в одну колонку с текстом, с подписями

**Подходящие цвета:** Акцент мягкий — любой приглушённый. Фон всегда тёплый (stone/warm-gray)
**Подходящие шрифты:** Source Serif 4 + Source Sans 3, Lora + Inter, Merriweather + Nunito Sans

---

### Совместимость стилей и цветов

| Стиль | Фон | Совместимые пресеты |
|---|---|---|
| Dark Premium | Тёмный | Все 10 |
| Light Clean | Белый/серый | Все 10 (акцент на кнопках) |
| Sports Energy | Тёмный | midnight-red, charcoal-orange, iron-blue, abyss-coral |
| Brutalist | Чёрный или белый | midnight-red, carbon-lime, iron-blue |
| Casino Glam | Чёрный | navy-gold, obsidian-amber |
| Blog Personal | Тёплый кремовый | Все (приглушённые) |

---

## 3. HTML-структура — вариации вёрстки

### Header — 4 варианта

**Вариант A (референс):** Fixed, backdrop-blur, текстовый лого, inline навигация, CTA справа.
```
[Logo] [Link Link Link Link] [CTA Button] [Burger]
```

**Вариант B:** Fixed, с разделительной линией, лого по центру на mobile.
```
[Logo]                    [Link Link Link]              [CTA] [Burger]
─────────────────────────────────────────────────────────────────────
```

**Вариант C:** Навигация под логотипом (2 строки на desktop).
```
[Logo]                                                      [CTA]
[Link] [Link] [Link] [Link] [Link]
```

**Вариант D:** Минималистичный, без видимой навигации на desktop (только бургер).
```
[Logo]                                          [CTA] [Burger]
```

### Hero — 10 вариантов (с полным кодом)

Каждый вариант принципиально отличается раскладкой, высотой, расположением элементов. В коде используются плейсхолдеры: `{base}`, `{accent}`, `{secondary}` для цветов, `{affiliateLink}` для партнёрской ссылки.

---

#### Вариант A. Центрированный классический

```
┌──────────────────────────────────────────────┐
│              [фоновое изображение]            │
│                                              │
│                  [ бейдж ]                    │
│            H1 заголовок по центру            │
│              подзаголовок текст              │
│          [ CTA primary ] [ CTA secondary ]   │
│                                              │
│          stat1      stat2      stat3         │
└──────────────────────────────────────────────┘
```

**Отличия:** самый типичный, высота средняя (py-16 lg:py-28), всё центрировано, фон — изображение с overlay.

```astro
---
import CTAButton from '../ui/CTAButton.astro';

const affiliateLink = '{affiliateLink}';
const stats = [
  { value: '50+', label: 'видов спорта' },
  { value: '1 000 ₸', label: 'мин. депозит' },
  { value: '100%', label: 'на первый депозит' },
];
---
<section class="relative overflow-hidden py-16 sm:py-20 lg:py-28">
  <div class="absolute inset-0 bg-gradient-to-b from-{base}-800 via-{base}-950 to-{base}-900"></div>
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-{accent}-500)_0%,_transparent_60%)] opacity-[0.08]"></div>
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-{accent}-500/10 border border-{accent}-500/20 text-{accent}-400 text-sm font-medium mb-6">
      <span class="w-2 h-2 rounded-full bg-{accent}-400 animate-pulse"></span>
      Текст бейджа
    </div>
    <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] mb-6">
      Заголовок H1
    </h1>
    <p class="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8">Подзаголовок</p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <CTAButton href={affiliateLink} size="lg" external>CTA Primary</CTAButton>
      <CTAButton href="/registraciya" variant="secondary" size="lg">CTA Secondary</CTAButton>
    </div>
    <div class="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-14">
      {stats.map((s) => (
        <div class="text-center">
          <div class="text-2xl sm:text-3xl font-extrabold text-{accent}-400">{s.value}</div>
          <div class="text-xs sm:text-sm text-slate-400 mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

#### Вариант B. Двухколоночный (текст + визуальный блок)

```
┌──────────────────────────────────────────────┐
│  бейдж                                       │
│  H1 заголовок          ┌──────────────────┐  │
│  подзаголовок          │  градиентная     │  │
│                        │  карточка со     │  │
│  [CTA] [CTA]           │  статистиками   │  │
│                        └──────────────────┘  │
│                                              │
│  ──── stat1 ──── stat2 ──── stat3 ──── (mob) │
└──────────────────────────────────────────────┘
```

**Отличия:** ассиметричная раскладка, визуальный блок справа с градиентом и статистиками внутри, на мобильном — стек.

```astro
---
import CTAButton from '../ui/CTAButton.astro';

const affiliateLink = '{affiliateLink}';
const stats = [
  { value: '40+', label: 'видов спорта' },
  { value: '1 000₸', label: 'минимальная ставка' },
  { value: '24/7', label: 'лайв-события' },
];
---
<section class="relative overflow-hidden py-16 sm:py-20 lg:py-28">
  <div class="absolute inset-0 bg-gradient-to-br from-{base}-800 via-{base}-950 to-{base}-900"></div>
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,var(--color-{accent}-500)_0%,transparent_60%)] opacity-[0.08]"></div>
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-{accent}-500/10 border border-{accent}-500/20 text-{accent}-400 text-sm font-medium mb-6">
          Текст бейджа
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] mb-6">
          Заголовок H1
        </h1>
        <p class="text-lg text-slate-300 mb-8 max-w-xl">Подзаголовок</p>
        <div class="flex flex-col sm:flex-row gap-4">
          <CTAButton href={affiliateLink} size="lg" external>CTA Primary</CTAButton>
          <CTAButton href="/registraciya" variant="secondary" size="lg">CTA Secondary</CTAButton>
        </div>
      </div>
      <div class="hidden lg:block">
        <div class="relative">
          <div class="w-full aspect-square rounded-3xl bg-gradient-to-br from-{accent}-500/10 via-{base}-800 to-{secondary}-500/10 border border-white/5 flex items-center justify-center">
            <div class="grid grid-cols-1 gap-5 w-full max-w-xs">
              {stats.map((s) => (
                <div class="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06] text-center">
                  <div class="text-2xl font-bold text-{accent}-400">{s.value}</div>
                  <div class="text-sm text-slate-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div class="absolute -top-4 -right-4 w-24 h-24 bg-{accent}-500/10 rounded-full blur-2xl"></div>
          <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-{secondary}-500/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-6 mt-14 pt-10 border-t border-white/5 lg:hidden">
      {stats.map((s) => (
        <div class="text-center">
          <div class="text-xl font-bold text-{accent}-400">{s.value}</div>
          <div class="text-xs text-slate-400 mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

#### Вариант C. Полноэкранный кинематографический

```
┌──────────────────────────────────────────────┐
│                                              │
│         [фоновое изображение на весь]         │
│                                              │
│                                              │
│                                              │
│  ░░░░░░░░░░░░░░ градиент снизу ░░░░░░░░░░░  │
│  H1 заголовок                                │
│  подзаголовок                                │
│  [ CTA primary ]   [ CTA secondary ]         │
└──────────────────────────────────────────────┘
```

**Отличия:** min-h-[80vh], текст прижат к низу, фоновое изображение доминирует, кинематографический эффект.

```astro
---
import CTAButton from '../ui/CTAButton.astro';

const affiliateLink = '{affiliateLink}';
---
<section class="relative min-h-[80vh] flex items-end overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-b from-{base}-800 via-{base}-900 to-{base}-950"></div>
  <div class="absolute inset-0 bg-gradient-to-t from-{base}-950 via-{base}-950/80 to-transparent"></div>
  <div class="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
    <div class="max-w-3xl">
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-4">
        Заголовок H1
      </h1>
      <p class="text-xl text-slate-200 mb-8 max-w-2xl">Подзаголовок</p>
      <div class="flex flex-col sm:flex-row gap-4">
        <CTAButton href={affiliateLink} size="lg" external>CTA Primary</CTAButton>
        <CTAButton href="/registraciya" variant="secondary" size="lg">CTA Secondary</CTAButton>
      </div>
    </div>
  </div>
</section>
```

---

#### Вариант D. Минималистичный компактный

```
┌──────────────────────────────────────────────┐
│                                              │
│            H1 заголовок (крупный)            │
│            одна строка описания              │
│               [ CTA кнопка ]                 │
│                                              │
└──────────────────────────────────────────────┘
```

**Отличия:** минимум элементов, без фонового изображения, без бейджа, без статистик, 1 кнопка. Чистый градиентный фон. Высота ~40vh.

```astro
---
import CTAButton from '../ui/CTAButton.astro';

const affiliateLink = '{affiliateLink}';
---
<section class="relative overflow-hidden py-20 lg:py-32">
  <div class="absolute inset-0 bg-gradient-to-br from-{base}-900 to-{base}-950"></div>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-{accent}-500/5 rounded-full blur-3xl"></div>
  <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h1 class="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6">
      Заголовок H1
    </h1>
    <p class="text-xl text-slate-400 mb-10">Одна строка описания</p>
    <CTAButton href={affiliateLink} size="lg" external>CTA единственная кнопка</CTAButton>
  </div>
</section>
```

---

#### Вариант E. Карточный (Hero внутри карточки)

```
┌──────────────────────────────────────────────┐
│                                              │
│    ┌──────────────────────────────────────┐   │
│    │  бейдж                               │   │
│    │  H1 заголовок                        │   │
│    │  подзаголовок                        │   │
│    │  [CTA]  [CTA]                        │   │
│    │                                      │   │
│    │  stat1    stat2    stat3             │   │
│    └──────────────────────────────────────┘   │
│                                              │
└──────────────────────────────────────────────┘
```

**Отличия:** весь контент внутри прозрачной карточки с backdrop-blur и бордером. Карточка центрирована с отступами. Создаёт эффект «парящего» блока.

```astro
---
import CTAButton from '../ui/CTAButton.astro';

const affiliateLink = '{affiliateLink}';
const stats = [
  { value: '35+', label: 'видов спорта' },
  { value: 'KZT', label: 'счёт в тенге' },
  { value: '10K+', label: 'игр в казино' },
];
---
<section class="relative overflow-hidden py-12 sm:py-16 lg:py-24">
  <div class="absolute inset-0 bg-{base}-950"></div>
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-{accent}-500)_0%,transparent_50%)] opacity-[0.06]"></div>
  <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 sm:p-12 lg:p-16 text-center shadow-2xl shadow-{accent}-500/5">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-{accent}-500/10 text-{accent}-400 text-sm font-medium mb-6">
        Текст бейджа
      </div>
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-5">
        Заголовок H1
      </h1>
      <p class="text-lg text-slate-300 max-w-2xl mx-auto mb-8">Подзаголовок</p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <CTAButton href={affiliateLink} size="lg" external>CTA Primary</CTAButton>
        <CTAButton href="/registraciya" variant="secondary" size="lg">CTA Secondary</CTAButton>
      </div>
      <div class="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
        {stats.map((s) => (
          <div>
            <div class="text-2xl font-bold text-{accent}-400">{s.value}</div>
            <div class="text-xs text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

---

#### Вариант F. Горизонтальный лента-стиль

```
┌──────────────────────────────────────────────┐
│  H1 заголовок (слева)      [ CTA ] (справа)  │
│  короткое описание                           │
├──────────────────────────────────────────────┤
│  stat1  │  stat2  │  stat3  │  stat4         │
└──────────────────────────────────────────────┘
```

**Отличия:** компактный, «ленточный» — H1 и CTA в одну строку на desktop. Под ним — отдельная полоса со статистиками. Минимальная высота.

```astro
---
import CTAButton from '../ui/CTAButton.astro';

const affiliateLink = '{affiliateLink}';
const stats = [
  { value: '50+', label: 'виды спорта' },
  { value: '10K+', label: 'матчей/месяц' },
  { value: 'KZT', label: 'без конвертации' },
  { value: '24/7', label: 'live-ставки' },
];
---
<section class="relative overflow-hidden">
  <div class="bg-gradient-to-r from-{base}-900 via-{base}-950 to-{base}-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div class="max-w-2xl">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-3">
            Заголовок H1
          </h1>
          <p class="text-lg text-slate-400">Короткое описание в одну-две строки</p>
        </div>
        <div class="shrink-0">
          <CTAButton href={affiliateLink} size="lg" external>CTA Primary</CTAButton>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-{base}-900/50 border-t border-b border-white/5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div class="flex items-center gap-3">
            <div class="text-2xl font-bold text-{accent}-400">{s.value}</div>
            <div class="text-sm text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

---

#### Вариант G. Со «всплывающими» карточками

```
┌──────────────────────────────────────────────┐
│                                              │
│            бейдж                             │
│            H1 заголовок                      │
│            подзаголовок                      │
│            [CTA]  [CTA]                      │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │  Ставки  │ │  Казино  │ │  Бонусы  │     │
│  │  40+ вид │ │  5K+ игр │ │  220K ₸  │     │
│  └──────────┘ └──────────┘ └──────────┘     │
└──────────────────────────────────────────────┘
  ↑ карточки выступают за край секции (negative margin)
```

**Отличия:** 3 мини-карточки внизу Hero выступают за границу секции (negative margin-bottom), перекрывая следующую секцию. Создаёт визуальную глубину.

```astro
---
import CTAButton from '../ui/CTAButton.astro';

const affiliateLink = '{affiliateLink}';
const cards = [
  { icon: '⚽', title: 'Ставки на спорт', text: '40+ видов спорта', href: '/casino' },
  { icon: '🎰', title: 'Онлайн-казино', text: '5 000+ игр', href: '/casino' },
  { icon: '🎁', title: 'Бонус на старте', text: 'до 220 000 ₸', href: '/bonus' },
];
---
<section class="relative overflow-visible pb-24 lg:pb-32">
  <div class="absolute inset-0 bg-gradient-to-b from-{base}-800 via-{base}-950 to-{base}-950"></div>
  <div class="relative pt-16 sm:pt-20 lg:pt-28 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-{accent}-500/10 border border-{accent}-500/20 text-{accent}-400 text-sm font-medium mb-6">
        Текст бейджа
      </div>
      <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] mb-6">
        Заголовок H1
      </h1>
      <p class="text-lg text-slate-300 max-w-2xl mx-auto mb-8">Подзаголовок</p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <CTAButton href={affiliateLink} size="lg" external>CTA Primary</CTAButton>
        <CTAButton href="/registraciya" variant="secondary" size="lg">CTA Secondary</CTAButton>
      </div>
    </div>
  </div>
  <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mb-16">
    <div class="grid sm:grid-cols-3 gap-4">
      {cards.map((c) => (
        <a href={c.href} class="group p-6 rounded-2xl bg-{base}-900 border border-white/[0.08] hover:border-{accent}-500/30 transition-all duration-300 text-center shadow-xl">
          <span class="text-3xl block mb-3">{c.icon}</span>
          <div class="font-semibold text-white mb-1">{c.title}</div>
          <div class="text-sm text-{accent}-400">{c.text}</div>
        </a>
      ))}
    </div>
  </div>
</section>
```

---

#### Вариант H. Градиентный split (50/50)

```
┌─────────────────────┬────────────────────────┐
│                     │                        │
│   H1 заголовок      │   [фоновое изобр.]     │
│   подзаголовок      │                        │
│                     │                        │
│   [CTA]  [CTA]      │                        │
│                     │                        │
│   stat1  stat2      │                        │
│                     │                        │
└─────────────────────┴────────────────────────┘
      ↑ градиент              ↑ фото с clip-path
```

**Отличия:** экран разделён пополам — левая часть с текстом на градиентном фоне, правая — фоновое изображение. Диагональный разделитель через clip-path.

```astro
---
import CTAButton from '../ui/CTAButton.astro';

const affiliateLink = '{affiliateLink}';
const stats = [
  { value: '50+', label: 'видов спорта' },
  { value: 'KZT', label: 'без конвертации' },
];
---
<section class="relative overflow-hidden min-h-[70vh] flex items-center">
  <div class="absolute inset-0 bg-gradient-to-br from-{base}-900 to-{base}-950"></div>
  <div class="absolute right-0 top-0 w-1/2 h-full hidden lg:block" style="clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%)">
    <div class="w-full h-full bg-gradient-to-br from-{accent}-500/10 to-{base}-900"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-{base}-950 to-transparent"></div>
  </div>
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
    <div class="max-w-xl">
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-6">
        Заголовок H1
      </h1>
      <p class="text-lg text-slate-300 mb-8">Подзаголовок с описанием</p>
      <div class="flex flex-col sm:flex-row gap-4 mb-10">
        <CTAButton href={affiliateLink} size="lg" external>CTA Primary</CTAButton>
        <CTAButton href="/registraciya" variant="secondary" size="lg">CTA Secondary</CTAButton>
      </div>
      <div class="flex gap-8">
        {stats.map((s) => (
          <div>
            <div class="text-3xl font-bold text-{accent}-400">{s.value}</div>
            <div class="text-sm text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

---

#### Вариант I. Бейдж-центричный (бонус в фокусе)

```
┌──────────────────────────────────────────────┐
│                                              │
│              ┌────────────────┐              │
│              │  220 000 ₸     │              │
│              │  приветственный │              │
│              │  бонус         │              │
│              └────────────────┘              │
│                                              │
│            H1 заголовок (небольшой)          │
│            подзаголовок                      │
│            [CTA]  [CTA]                      │
│                                              │
└──────────────────────────────────────────────┘
```

**Отличия:** в центре внимания — крупная сумма бонуса в стилизованном блоке. H1 и описание под ним, меньшим шрифтом. Идеально для казино-тематики.

```astro
---
import CTAButton from '../ui/CTAButton.astro';

const affiliateLink = '{affiliateLink}';
---
<section class="relative overflow-hidden py-16 sm:py-20 lg:py-28">
  <div class="absolute inset-0 bg-gradient-to-b from-{base}-800 via-{base}-950 to-{base}-900"></div>
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,var(--color-{accent}-500)_0%,transparent_40%)] opacity-[0.1]"></div>
  <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div class="inline-block mb-8">
      <div class="relative px-10 py-8 rounded-3xl bg-gradient-to-br from-{accent}-500/15 to-{accent}-600/5 border border-{accent}-500/20 shadow-2xl shadow-{accent}-500/10">
        <div class="text-sm text-{accent}-400 font-medium mb-2">Приветственный бонус</div>
        <div class="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight">220 000 ₸</div>
        <div class="text-sm text-slate-400 mt-2">+ 150 фриспинов</div>
      </div>
    </div>
    <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
      Заголовок H1
    </h1>
    <p class="text-lg text-slate-400 max-w-xl mx-auto mb-8">Подзаголовок</p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <CTAButton href={affiliateLink} size="lg" external>CTA Primary</CTAButton>
      <CTAButton href="/registraciya" variant="secondary" size="lg">CTA Secondary</CTAButton>
    </div>
  </div>
</section>
```

---

#### Вариант J. Двухуровневый (stacked)

```
┌──────────────────────────────────────────────┐
│         [фоновое изображение]                │
│                                              │
│         H1 заголовок                         │
│         подзаголовок                         │
│                                              │
├──────────────────────────────────────────────┤
│  ┌────────┐  ┌────────┐  ┌────────┐  [CTA]  │  ← этот блок заходит на верхний
│  │ stat1  │  │ stat2  │  │ stat3  │         │     через negative margin
│  └────────┘  └────────┘  └────────┘         │
└──────────────────────────────────────────────┘
```

**Отличия:** два визуально разделённых уровня. Верхний — фоновое изображение + заголовок. Нижний — карточки статистик + CTA — «всплывает» поверх (negative margin-top). Создаёт глубину и слоистость.

```astro
---
import CTAButton from '../ui/CTAButton.astro';

const affiliateLink = '{affiliateLink}';
const stats = [
  { value: '50+', label: 'видов спорта' },
  { value: '10K+', label: 'игр в казино' },
  { value: 'KZT', label: 'счёт в тенге' },
];
---
<section class="relative">
  <div class="relative overflow-hidden pb-24 lg:pb-32">
    <div class="absolute inset-0 bg-gradient-to-b from-{base}-800 via-{base}-900 to-{base}-950"></div>
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-{accent}-500)_0%,_transparent_50%)] opacity-[0.06]"></div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-28 text-center">
      <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] mb-5">
        Заголовок H1
      </h1>
      <p class="text-xl text-slate-300 max-w-2xl mx-auto">Подзаголовок</p>
    </div>
  </div>
  <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 lg:-mt-20">
    <div class="bg-{base}-900/90 backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6 lg:p-8 shadow-2xl">
      <div class="flex flex-col lg:flex-row items-center gap-8">
        <div class="grid grid-cols-3 gap-6 flex-1">
          {stats.map((s) => (
            <div class="text-center lg:text-left">
              <div class="text-2xl sm:text-3xl font-extrabold text-{accent}-400">{s.value}</div>
              <div class="text-sm text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        <div class="shrink-0">
          <CTAButton href={affiliateLink} size="lg" external>CTA Primary</CTAButton>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Логотип — 6 вариантов

Логотип — критически важный элемент для уникальности. Текстовый лого на каждом сайте — подозрительный паттерн. Нужно чередовать типы.

**A. Текстовый (CSS-стилизация):**
Стилизованный `<span>` с акцентными цветами. Самый простой, но однообразный при массовом использовании.
```html
<span class="text-xl font-bold text-white">1x<span class="text-{accent}-400">Bet</span></span>
```

**B. SVG inline (геометрический):**
Простой SVG-значок + текст рядом. Значок — абстрактная геометрическая фигура (круг, ромб, молния, щит) в цветах проекта. Не фотореалистичный — простые формы не палятся как AI.
```html
<a href="/" class="flex items-center gap-2">
  <svg class="w-8 h-8" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="currentColor" class="text-{accent}-500"/>
    <path d="M10 16l6-8 6 8-6 8z" fill="currentColor" class="text-{base}-950"/>
  </svg>
  <span class="font-bold text-white">1xBet <span class="text-{accent}-400">KZ</span></span>
</a>
```

**C. SVG inline (буква в фигуре):**
Первая буква или аббревиатура бренда внутри стилизованного фона (круг, скруглённый квадрат, шестиугольник).
```html
<a href="/" class="flex items-center gap-2.5">
  <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-{accent}-500 to-{accent}-600 flex items-center justify-center text-white font-extrabold text-sm">1x</div>
  <span class="font-semibold text-white">Bet KZ</span>
</a>
```

**D. SVG-логотип (внешний или inline):**
Логотип создаётся как inline SVG или подключается из `public/logo.svg`. Простой: геометрическая форма + текст.
```html
<a href="/" class="flex items-center gap-2">
  <img src="/logo.svg" alt="1xBet KZ" width="120" height="36" />
</a>
```

**E. CSS-art (градиент + форма):**
Чистый CSS — без SVG и изображений. Фигура через `clip-path`, градиент, рамка.
```html
<a href="/" class="flex items-center gap-2">
  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-{accent}-400 to-{secondary}-500 rotate-12 shadow-lg shadow-{accent}-500/20"></div>
  <span class="font-bold text-lg text-white -ml-0.5">1xBet</span>
</a>
```

**F. Emoji/символ + текст:**
Тематический Unicode-символ как «иконка». Выглядит как дизайнерское решение.
```html
<a href="/" class="flex items-center gap-1.5">
  <span class="text-xl">⚡</span>
  <span class="font-extrabold text-white">1x<span class="text-{accent}-400">Bet</span></span>
</a>
```

#### Распределение по проектам

| Проект | Тип лого | Описание |
|---|---|---|
| 1 | A или C | Текстовый или буква в фигуре |
| 2 | B | SVG-значок (ромб) + текст |
| 3 | D | Картинка из Canva |
| 4 | E | CSS-art (градиентный квадрат) |
| 5 | C | Буква в скруглённом квадрате |
| 6 | B | SVG-значок (молния) + текст |
| 7 | D | Картинка из Figma |
| 8 | F | Emoji + текст |

**Правило:** один тип лого не должен использоваться более чем на 2-3 проектах подряд. Чередовать.

---

### Карточки — 6 вариантов

**A (референс):** `bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6`
**B:** `bg-gradient-to-br from-{accent}-500/5 rounded-xl p-5 border-l-2 border-{accent}-500`
**C:** `bg-{base}-800 rounded-lg p-6 shadow-xl shadow-{accent}-500/5` (без бордера)
**D:** `border border-white/10 rounded-3xl p-8 backdrop-blur-sm` (glass)
**E:** `bg-white/[0.02] rounded-none border-b border-white/5 p-6` (flat, без скруглений)
**F:** `ring-1 ring-white/10 rounded-2xl p-6 hover:ring-{accent}-500/30` (ring вместо border)

### CTA-кнопки — 5 вариантов

**A (референс):** Градиент `from-{accent}-500 to-{accent}-600`, text-white, shadow.
**B:** Однотонная `bg-{accent}-500`, hover: `bg-{accent}-600`, без shadow.
**C:** Outline с заливкой на hover: `border-2 border-{accent}-500 bg-transparent hover:bg-{accent}-500`.
**D:** Pill с тенью: `rounded-full bg-{accent}-500 shadow-2xl shadow-{accent}-500/30`.
**E:** Градиент accent→secondary: `bg-gradient-to-r from-{accent}-500 to-{secondary}-500`.

### Сетки секций

**A (референс):** `grid sm:grid-cols-2 lg:grid-cols-3 gap-6`
**B:** `grid grid-cols-1 md:grid-cols-2 gap-8` (2 колонки max)
**C:** `grid grid-cols-2 md:grid-cols-4 gap-4` (4 колонки)
**D:** `flex flex-wrap gap-4 justify-center` (flex вместо grid)
**E:** `space-y-4` (одна колонка, вертикальный список)

### Footer — 3 варианта

**A (референс):** 4 колонки (лого + 3 группы ссылок).
**B:** 3 колонки + верхняя градиентная линия `h-px bg-gradient-to-r from-transparent via-{accent}-500/50 to-transparent`.
**C:** 2 колонки: слева лого+описание+ссылки, справа дисклеймер.

### FAQ — 3 варианта

**A (референс):** `<details>` с chevron, border на каждом.
**B:** Пронумерованные вопросы (`01.`, `02.`), без аккордеона — всё раскрыто.
**C:** Tabs/карточки — вопросы как кнопки, ответ появляется при клике (JS toggle).

### Шаги инструкций — 4 варианта

**A (референс):** Нумерованные карточки в столбик (number circle + text).
**B:** Timeline с вертикальной линией слева.
**C:** Горизонтальные steps-карточки в grid (на desktop).
**D:** Accordion-шаги (каждый шаг раскрывается).

---

## 4. Порядок секций на главной

Обязательные: Hero (всегда первый), Overview (всегда второй), FAQ (предпоследний), CTA (всегда последний).
Необязательные перемешиваются.

| Проект | Порядок (после Hero+Overview) |
|---|---|
| 1 | Sports → Advantages → Payments → Bonus → Slots → FAQ → CTA |
| 2 | Slots → Advantages → Bonus → Payments → FAQ → CTA |
| 3 | Advantages → Sports → Bonus → Live → FAQ → CTA |
| 4 | Bonus → Sports → Payments → Advantages → App → FAQ → CTA |
| 5 | Testimonials → Advantages → Slots → Payments → FAQ → CTA |

---

## 5. Набор страниц

Каждый проект выбирает РАЗНЫЙ набор из пула. Обязательные: index, about, 404.

| Проект | Основные (4-7) | Слоты (0-4) |
|---|---|---|
| 1 | registraciya, skachat, casino, zerkalo, bonus | sugar-rush, sweet-bonanza |
| 2 | registraciya, casino, bonus, lichnyy-kabinet | gates-of-olympus, big-bass-bonanza, book-of-dead |
| 3 | registraciya, skachat, zerkalo, partnerskaya | sugar-rush-1000, dead-or-alive-2 |
| 4 | registraciya, casino, bonus, skachat, lichnyy-kabinet | sweet-bonanza, the-dog-house |
| 5 | registraciya, casino, zerkalo, bonus | — (без слотовых страниц) |

---

## 6. URL-slugs страниц

URL страниц варьируются между проектами. Это важно — одинаковые URL на десятках сайтов = паттерн сети.

| Тема страницы | Варианты slug |
|---|---|
| Регистрация | `/registraciya`, `/sozdat-akkaunt`, `/nachalo-raboty`, `/otkryt-schet` |
| Скачивание | `/skachat`, `/prilozhenie`, `/mobile-app`, `/ustanovka` |
| Казино | `/casino`, `/igrovye-avtomaty`, `/onlajn-kazino`, `/slots-i-igry` |
| Зеркало | `/zerkalo`, `/dostup`, `/rabochij-sajt`, `/alternativnyj-vhod` |
| Личный кабинет | `/lichnyy-kabinet`, `/vhod`, `/moj-profil`, `/akkaunt` |
| Бонусы | `/bonus`, `/akcii`, `/podarki`, `/privetstvennye-bonusy` |
| Партнёрка | `/partnerskaya-programma`, `/zarabotok`, `/affiliate` |

Агент выбирает slug для каждой страницы случайно. Набор slug не должен повторяться между проектами целиком.

---

## 7. Контентная вариативность

### Стиль автора (из конфига)

| bio_style | Описание | Особенности текста |
|---|---|---|
| `casual` | Разговорный, расслабленный | Много разговорных оборотов, короткие абзацы |
| `analytical` | Структурированный, с данными | Числа, таблицы, сравнения, длинные абзацы |
| `enthusiast` | Эмоциональный, увлечённый | Восклицания, личные истории, субъективные оценки |
| `skeptic` | Осторожный, критичный | Много минусов, предупреждений, оговорок |

### Структура повествования на подстраницах

| Проект | Начало обзора | Порядок блоков |
|---|---|---|
| 1 | Личная история регистрации | Инструкция → Бонусы → Минусы → FAQ |
| 2 | Сравнение с конкурентами | Плюсы/минусы → Инструкция → Таблица → FAQ |
| 3 | Проблема (блокировка) и решение | Проблема → Решение → Детали → Предупреждения |
| 4 | Цифры и факты | Статистика → Инструкция → Сравнение → Советы |
| 5 | Вопрос-ответ формат | Вопрос → Ответ → Вопрос → Ответ → CTA |

### FAQ — разные темы

Каждый проект задаёт РАЗНЫЕ вопросы. Пул вопросов по категориям:

**Регистрация:** Какой минимальный возраст? / Можно ли без паспорта? / Сколько аккаунтов? / Нужен ли промокод?
**Оплата:** Минимальный депозит? / Комиссия Kaspi? / Можно ли USDT? / Как быстрее вывести?
**Приложение:** Почему нет в Google Play? / Как обновить APK? / Работает ли на Huawei?
**Блокировки:** Почему блокируют? / Как зайти без VPN? / Что такое зеркало?
**Бонусы:** Как отыграть? / Можно ли снять бонус? / Есть ли фрибет? / Что такое вейджер?
**Спорт:** Есть ли КПЛ? / Можно ли ставить на Барыс? / Как работает live? / Что такое Cash Out?

---

## 8. Визуальные микродетали

Для каждого проекта менять:

| Элемент | Варианты |
|---|---|
| Скругление карточек | `rounded-lg` / `rounded-xl` / `rounded-2xl` / `rounded-3xl` |
| Скругление кнопок | `rounded-lg` / `rounded-xl` / `rounded-full` |
| Прозрачность фона карточек | `bg-white/[0.02]` / `bg-white/[0.03]` / `bg-white/[0.05]` |
| Бордер карточек | `border-white/[0.05]` / `border-white/[0.08]` / `border-white/10` |
| Тень CTA | `shadow-lg` / `shadow-xl` / `shadow-2xl` / без тени |
| Padding секций | `py-14 lg:py-18` / `py-16 lg:py-20` / `py-20 lg:py-28` |
| Max-width контента | `max-w-3xl` / `max-w-4xl` / `max-w-5xl` |
| Анимация hover | `transition-all duration-200` / `duration-300` / `duration-500` |
| Аватар автора | Инициалы в круге / SVG-иконка / gradient circle |
| Числа в Hero | 3 stat / 4 stat / 2 stat с иконками |
| Разделитель в ArticleMeta | `\|` / `·` / `—` / без разделителя |

---

## 9. Изображения → заглушки

Растровые изображения НЕ генерируются. Вместо них — HTML/CSS-заглушки с описанием содержимого.

### Что создаётся качественно (НЕ заглушки)

- **SVG-иконки** — тематические inline SVG с уникальными путями для каждой секции
- **CSS-градиенты** — уникальные фоны hero и декоративных секций
- **Favicon.svg** — уникальный для каждого проекта
- **CSS-паттерны** — radial-gradient, текстуры

### Вариативность заглушек

Заглушки стилизуются под визуальный стиль проекта:
- **Dark Premium:** градиент от accent к base, полупрозрачные бордеры
- **Light Clean:** белый фон, серые бордеры, тонкая тень
- **Sports Energy:** accent бордер слева, тёмный фон
- **Brutalist:** border-2, без скруглений, контрастный
- **Casino Glam:** золотые акценты, inner shadow
- **Blog Personal:** минимальный, stone-оттенки

---

## 10. Готовые пресеты вариаций

Чтобы агент не выбирал одинаковые комбинации, используются готовые пронумерованные пресеты. Агент берёт номер пресета и получает полный набор дизайн-решений.

| # | Стиль | Цвет | Шрифт | Hero | Лого | Card | CTA | Header | Footer | FAQ | Steps |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Dark Premium | navy-gold | Inter | A | C | A | A | A | A | A | A |
| 2 | Sports Energy | midnight-red | Manrope | B | B | B | E | B | B | A | B |
| 3 | Light Clean | slate-cyan | DM Sans | D | F | C | C | A | A | C | A |
| 4 | Brutalist | carbon-lime | Rubik | G | E | F | B | D | B | A | C |
| 5 | Casino Glam | navy-gold | Playfair+Inter | E | C | A | A | A | B | A | A |
| 6 | Blog Personal | obsidian-amber | Lora+Source Sans | F | A | A | A | B | C | B | B |
| 7 | Dark Premium | dark-emerald | Source Sans 3 | H | B | B | E | A | C | B | D |
| 8 | Sports Energy | charcoal-orange | Rubik | C | E | B | B | B | A | A | C |
| 9 | Light Clean | abyss-coral | Plus Jakarta | I | A | C | C | A | A | C | A |
| 10 | Brutalist | iron-blue | Space Mono+Inter | J | E | F | B | D | B | A | C |
| 11 | Casino Glam | obsidian-amber | Cormorant+DM Sans | A | C | A | A | A | B | A | B |
| 12 | Blog Personal | deep-purple | Merriweather+Nunito | D | A | A | A | C | C | B | A |
| 13 | Dark Premium | deep-purple | Plus Jakarta | B | B | D | D | B | A | C | B |
| 14 | Sports Energy | abyss-coral | Manrope | G | B | B | E | B | B | A | D |
| 15 | Brutalist | midnight-red | JetBrains Mono+Inter | J | E | F | B | D | A | A | C |

**Правило:** не использовать один пресет дважды. При создании проекта выбирается следующий свободный пресет из таблицы. Если все 15 использованы — создаётся новый уникальный набор.

---

## 11. Чеклист уникальности (проверка перед деплоем)

- [ ] **Визуальная стилистика** не повторяется 3+ раза подряд (чередовать A-F)
- [ ] CSS-переменные имеют уникальные имена (не как у других проектов)
- [ ] Шрифт отличается от ближайших проектов
- [ ] Цветовая схема не повторяется
- [ ] **Тип логотипа** отличается от ближайших проектов (текст/SVG/картинка/CSS-art)
- [ ] Favicon стилистически связан с логотипом
- [ ] Стиль карточек отличается (скругление, бордер, тень)
- [ ] Hero-блок имеет другую компоновку
- [ ] Порядок секций на главной отличается
- [ ] Набор страниц отличается
- [ ] URL-slugs страниц не совпадают целиком с другими проектами
- [ ] FAQ-вопросы полностью другие
- [ ] Имя и город автора уникальны
- [ ] Тексты не пересекаются с другими проектами
- [ ] SVG-иконки уникальные, тематические, качественные
- [ ] Заглушки стилизованы под визуальный стиль проекта
- [ ] Нет `import { Image }` или файлов в `src/assets/images/`
- [ ] **Формат контента** отличается от ближайших проектов

---

## 12. Форматы контента (content_format)

Формат контента определяет **всю концепцию** сайта: тон текстов, структуру страниц, наличие/отсутствие автора, стиль CTA и FAQ. Это отдельная ось вариативности наравне с visual_style и color_preset.

Поле в конфиге: `content_format`.

---

### Формат A. Авторский блог

Личный обзорный сайт от имени конкретного человека. Персона-автор с историей, городом, фото.

| Элемент | Правила |
|---|---|
| **Тон** | 1-е лицо: «я проверял», «мне понравилось», «лично закинул 5000 тенге» |
| **Автор** | Обязательный. Страница /about с полной биографией. ArticleMeta на каждой подстранице |
| **H1/H2** | Личные, субъективные: «Мой опыт с...», «Что нравится и что бесит» |
| **CTA** | Рекомендательные: «Забрать бонус на старте», «Попробовать самому» |
| **FAQ** | Разговорный тон ответов, от первого лица |
| **Дисклеймер** | Краткий, в /about: «партнёрские ссылки, 21+» |
| **Запрещено** | Корпоративный язык, «мы предлагаем», «платформа обеспечивает» |

**Пример текста:**
> Скачал APK, весит мегабайт 40 — нормально. На Samsung A54 встало без проблем. Знакомый на Huawei тоже проверял — работает, хотя жаловался что тормозит.

**Совместимые bio_style:** casual, analytical, enthusiast, skeptic

---

### Формат B. Корпоративная платформа

Сайт выглядит как официальный ресурс компании. Профессиональный тон от «мы».

| Элемент | Правила |
|---|---|
| **Тон** | От компании: «мы предлагаем», «наши клиенты», «на платформе доступно» |
| **Автор** | НЕТ персоны-автора. Нет ArticleMeta с именем. Нет /about с биографией |
| **Страница /about** | «О платформе» вместо «Об авторе». История компании, лицензия, ответственная игра |
| **H1/H2** | Официальные: «Почему выбирают 1xBet», «Преимущества платформы», с эмодзи допустимо |
| **CTA** | Продающие: «Регистрация», «Получить бонус», «Начать игру» |
| **FAQ** | Профессиональный тон, 3-е лицо |
| **Промокод** | Может быть центральным элементом (повторяется в hero, CTA, footer) |
| **Бейджи/цифры** | 25M+ игроков, 1000+ событий, 99.9% — крупные, по всему сайту |
| **Крипто-секция** | Отдельная секция про Bitcoin, USDT, Ethereum |
| **Запрещено** | «Я», личные истории, субъективные оценки, «лично мне не зашло» |

**Пример текста:**
> Более 1 000 спортивных событий ежедневно, Live Casino с живыми дилерами, мобильное приложение и щедрые бонусы — всё это на одной платформе для казахстанских игроков.

---

### Формат C. Информационный портал

Энциклопедический стиль. Глубокие SEO-тексты, максимум информации.

| Элемент | Правила |
|---|---|
| **Тон** | 3-е лицо: «букмекерская контора предлагает», «платформа обеспечивает», «пользователи отмечают» |
| **Автор** | Нет персоны. Есть «редакция» или «команда аналитиков» |
| **Страница /about** | «О редакции», «О портале» |
| **H1/H2** | Информационные: «Обзор БК 1xBet», «Способы финансовых операций», «Информация о лицензировании» |
| **CTA** | Нейтральные: «Перейти на официальный сайт», «Узнать подробнее» |
| **FAQ** | Длинные подробные ответы, энциклопедический стиль |
| **Объём текста** | Увеличенный: главная 1500-2000 слов, подстраницы 800-1200 |
| **Запрещено** | Разговорный тон, «ну», «короче», эмоциональные оценки |

**Пример текста:**
> Букмекерская контора 1xBet заслуженно считается одним из глобальных лидеров индустрии беттинга, предлагая пользователям глубокую линию на десятки спортивных дисциплин и современные технологические решения для ставок.

---

### Формат D. Обзорный сайт с дисклеймерами

Позиция стороннего наблюдателя. Юридически безопасные формулировки.

| Элемент | Правила |
|---|---|
| **Тон** | Дистанцированный: «по данным из открытых источников», «согласно отзывам пользователей», «по информации из обзоров» |
| **Автор** | Нет персоны. «Информационный портал», «редакция» |
| **Дисклеймеры** | После КАЖДОГО информационного блока: «Мы не проводим регистрацию», «Для актуальной информации обращайтесь на официальный сайт» |
| **Страница /about** | Дисклеймер: «НЕ является официальным сайтом, НЕ является зеркалом, НЕ проводит финансовые операции» |
| **H1/H2** | Осторожные: «Информация о процедуре регистрации», «Обзор бонусной программы (по данным обзоров)» |
| **CTA** | Мягкие: «Посетить официальный сайт», «Узнать актуальные условия» |
| **Иконки** | 💡 для полезной информации, ⚠️ для предупреждений |
| **Запрещено** | Прямые утверждения от своего имени, гарантии, «мы предлагаем», «лучший» |

**Пример текста:**
> Согласно данным из открытых источников, букмекерская контора 1xBet предлагает пользователям несколько способов создания игрового аккаунта. По отзывам клиентов, процесс регистрации включает следующие этапы...
>
> 💡 Важная информация: Для получения актуальных инструкций рекомендуется посетить официальный сайт. Мы не проводим регистрацию пользователей.

---

### Формат E. Лендинг-витрина

Минимум текста, максимум визуала. Карточки, бейджи, CTA на каждом экране.

| Элемент | Правила |
|---|---|
| **Тон** | Маркетинговый, короткий: «Начать играть», «Сделать ставку», «Скачать APK» |
| **Автор** | НЕТ. Сайт как продуктовая страница |
| **H1/H2** | Короткие, с глаголами: «Ставки на любой вид спорта», «Четыре шага до первой ставки» |
| **CTA** | МНОГО. Каждая секция заканчивается CTA-кнопкой. 2-3 CTA на экране допустимо |
| **Карточки** | Основа контента. Спорт — карточки видов. Казино — карточки игр. Бонусы — карточки акций |
| **Текст** | Минимум. 1-2 предложения на секцию + карточки. Главная: 600-900 слов |
| **Подстраницы** | Тоже карточно-визуальные, 300-500 слов |
| **Шаги** | Step-by-step flow с номерами (1→2→3→4) как основной паттерн |
| **Запрещено** | Длинные абзацы (>3 предложений), аналитические рассуждения, «с другой стороны» |

**Пример секции:**
> ## Четыре шага до первой ставки
> **1. Регистрация** — Нажмите «Регистрация», введите данные. Меньше минуты.
> **2. Верификация** — Загрузите документ. Обычно 30 минут.
> **3. Пополнение** — Карта, кошелёк или крипта. Деньги мгновенно.
> **4. Ставка** — Выберите событие, нажмите коэффициент. Вы в игре.

---

### Формат F. Гайд/Туториал

Обучающий ресурс. Как сделать X, пошаговые инструкции, справочник.

| Элемент | Правила |
|---|---|
| **Тон** | Обучающий, нейтральный: «чтобы зарегистрироваться, выполните...», «на этом шаге нужно...» |
| **Автор** | Опционален. Если есть — «гайд-мейкер», не игрок |
| **H1/H2** | Инструкционные: «Как зарегистрироваться на 1xBet — пошагово», «Инструкция: вывод средств на Kaspi» |
| **CTA** | Утилитарные: «Перейти к регистрации», «Скачать приложение» |
| **Контент** | Нумерованные шаги, таблицы, чеклисты, «внимание», «совет» блоки |
| **FAQ** | Технический: конкретные вопросы и чёткие ответы без воды |
| **Запрещено** | Личные мнения, эмоции, «мне понравилось», оценочные суждения |

**Пример текста:**
> **Шаг 3. Подтверждение номера телефона**
> После заполнения формы на указанный номер придёт SMS с 6-значным кодом. Введите его в поле подтверждения. Код действителен 5 минут. Если SMS не пришло — нажмите «Отправить повторно» (доступно через 60 секунд).

---

### Формат G. Агрегатор/сравнение

Аналитический ресурс со сравнительными таблицами и рейтингами.

| Элемент | Правила |
|---|---|
| **Тон** | Аналитический, беспристрастный: «по совокупности параметров», «исходя из данных» |
| **Автор** | «Аналитическая команда», «редакция» |
| **H1/H2** | Сравнительные: «1xBet vs Mostbet: сравнение для KZ», «Рейтинг бонусов 2026» |
| **Таблицы** | Основа контента. Сравнительные таблицы с оценками по параметрам |
| **Рейтинги** | Числовые оценки: 4.5/5, звёзды, прогресс-бары |
| **CTA** | Аналитические: «Сравнить условия», «Посмотреть рейтинг» |
| **Плюсы/минусы** | Структурированные блоки + / − по каждому параметру |
| **Запрещено** | Явная предвзятость, «лучший», «однозначно рекомендую» (без доказательств) |

**Пример текста:**
> | Параметр | 1xBet | Mostbet | Pin-Up |
> |---|---|---|---|
> | Мин. депозит | 1 000 ₸ | 500 ₸ | 500 ₸ |
> | Виды спорта | 50+ | 40+ | 30+ |
> | Оценка KZ | 4.5/5 | 4.2/5 | 4.0/5 |

---

### Совместимость форматов и визуальных стилей

| Формат | Лучшие визуальные стили |
|---|---|
| A: Авторский блог | Blog Personal, Dark Premium, Light Clean |
| B: Корпоративная платформа | Dark Premium, Casino Glam |
| C: Информационный портал | Dark Premium, Light Clean |
| D: Обзорный с дисклеймерами | Light Clean, Blog Personal |
| E: Лендинг-витрина | Sports Energy, Dark Premium, Brutalist |
| F: Гайд/Туториал | Light Clean, Blog Personal |
| G: Агрегатор/сравнение | Light Clean, Dark Premium |

### Распределение по проектам

Не использовать один формат на двух соседних проектах. Чередовать максимально. Рекомендуемая ротация для первых 8 проектов: B → E → D → A → C → F → G → B
