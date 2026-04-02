#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY = path.join(ROOT, 'REGISTRY.md');
const PROJECTS_DIR = path.join(ROOT, 'projects');

const BRANDS = {
  '1xbet': {
    name: '1xBet',
    keywords: ['1xbet казахстан', '1хбет кз', '1xbet скачать', '1xbet регистрация'],
    slots: ['sugar-rush', 'sweet-bonanza', 'gates-of-olympus', 'dead-or-alive-2', 'big-bass-bonanza', 'book-of-dead', 'the-dog-house', 'sugar-rush-1000'],
  },
  'pinup': {
    name: 'Pin-Up',
    keywords: ['pin-up казахстан', 'пин ап кз', 'pin up casino', 'пинап слоты'],
    slots: ['sweet-bonanza', 'sugar-rush', 'gates-of-olympus', 'fruit-party', 'starlight-princess', 'madame-destiny-megaways', 'great-rhino-megaways'],
  },
  'mostbet': {
    name: 'Mostbet',
    keywords: ['mostbet казахстан', 'мостбет кз', 'mostbet скачать', 'мостбет авиатор'],
    slots: ['sweet-bonanza', 'gates-of-olympus', 'sugar-rush', 'fruit-party', 'big-bass-splash', 'reactoonz-2'],
  },
  '1win': {
    name: '1Win',
    keywords: ['1win казахстан', '1вин кз', '1win casino', '1win lucky jet'],
    slots: ['sweet-bonanza', 'gates-of-olympus', 'bananas-go-bahamas', 'coin-strike', 'rocket-queen'],
  },
  'melbet': {
    name: 'Melbet',
    keywords: ['melbet казахстан', 'мелбет кз', 'melbet ставки', 'мелбет скачать'],
    slots: ['sweet-bonanza', 'gates-of-olympus', 'sugar-rush'],
  },
};

const COLORS = [
  { id: 'navy-gold', base: '#0a1628', accent: '#f59e0b', secondary: '#10b981' },
  { id: 'dark-emerald', base: '#041f1e', accent: '#10b981', secondary: '#fbbf24' },
  { id: 'midnight-red', base: '#0c0f1a', accent: '#ef4444', secondary: '#f8fafc' },
  { id: 'charcoal-orange', base: '#1a1a2e', accent: '#f97316', secondary: '#38bdf8' },
  { id: 'deep-purple', base: '#1a0533', accent: '#a855f7', secondary: '#ec4899' },
  { id: 'slate-cyan', base: '#0f172a', accent: '#06b6d4', secondary: '#22c55e' },
  { id: 'obsidian-amber', base: '#111318', accent: '#f59e0b', secondary: '#84cc16' },
  { id: 'carbon-lime', base: '#18181b', accent: '#84cc16', secondary: '#22d3ee' },
  { id: 'abyss-coral', base: '#0a0e17', accent: '#fb7185', secondary: '#2dd4bf' },
  { id: 'iron-blue', base: '#111827', accent: '#3b82f6', secondary: '#fb923c' },
];

const FONTS = ['Inter', 'Manrope', 'Nunito Sans', 'Source Sans 3', 'PT Sans', 'DM Sans', 'Rubik', 'Plus Jakarta Sans'];
const STYLES = ['casual', 'analytical', 'enthusiast', 'skeptic'];
const VISUAL_STYLES = ['dark-premium', 'light-clean', 'sports-energy', 'brutalist', 'casino-glam', 'blog-personal'];
const CITIES = ['Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе', 'Тараз', 'Павлодар', 'Семей', 'Атырау', 'Костанай'];

const MALE_NAMES = ['Марат', 'Даулет', 'Ерлан', 'Нурсултан', 'Арман', 'Тимур', 'Руслан', 'Алибек', 'Бауыржан', 'Данияр', 'Азамат', 'Кайрат', 'Серик', 'Берик', 'Нуржан'];
const FEMALE_NAMES = ['Айгерим', 'Динара', 'Жанна', 'Мадина', 'Камила', 'Асель', 'Алия', 'Гульнара', 'Дана', 'Аружан'];
const SURNAMES = ['Тулегенов', 'Касымов', 'Нурланов', 'Ахметов', 'Бекмуратов', 'Сагындыков', 'Жумабаев', 'Оспанов', 'Сулейменов', 'Мухамедов', 'Байжанов', 'Калиев', 'Ибрагимов', 'Токаев', 'Абдуллаев'];
const FEMALE_SURNAMES = ['Тулегенова', 'Касымова', 'Нурланова', 'Ахметова', 'Бекмуратова', 'Сагындыкова', 'Жумабаева', 'Оспанова', 'Сулейменова', 'Калиева'];

const PAGE_SLUGS = {
  'registraciya': ['registraciya', 'sozdat-akkaunt', 'nachalo-raboty', 'otkryt-schet'],
  'skachat': ['skachat', 'prilozhenie', 'mobile-app', 'ustanovka'],
  'casino': ['casino', 'igrovye-avtomaty', 'onlajn-kazino', 'slots-i-igry'],
  'zerkalo': ['zerkalo', 'dostup', 'rabochij-sajt', 'alternativnyj-vhod'],
  'lichnyy-kabinet': ['lichnyy-kabinet', 'vhod', 'moj-profil', 'akkaunt'],
  'bonus': ['bonus', 'akcii', 'podarki', 'privetstvennye-bonusy'],
  'partnerskaya': ['partnerskaya-programma', 'zarabotok', 'affiliate'],
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function getUsedFromRegistry() {
  const used = { colors: [], fonts: [], authors: [], cities: [], presets: [] };
  if (!fs.existsSync(REGISTRY)) return used;
  const content = fs.readFileSync(REGISTRY, 'utf-8');
  for (const line of content.split('\n')) {
    if (line.startsWith('| ') && !line.startsWith('| #') && !line.startsWith('|---')) {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length >= 12) {
        if (cells[5]) used.colors.push(cells[5]);
        if (cells[6]) used.fonts.push(cells[6]);
        if (cells[9]) used.authors.push(cells[9]);
        if (cells[10]) used.cities.push(cells[10]);
      }
    }
    const presetMatch = line.match(/\[ \]\s+(\d+)\s+—/);
    if (presetMatch) used.presets.push(parseInt(presetMatch[1]));
  }
  return used;
}

function getNextProjectNum(brandKey) {
  const brandDir = path.join(PROJECTS_DIR, brandKey);
  if (!fs.existsSync(brandDir)) return 1;
  const dirs = fs.readdirSync(brandDir).filter(d => d.startsWith('project_'));
  const nums = dirs.map(d => parseInt(d.replace('project_', ''))).filter(n => !isNaN(n));
  return nums.length > 0 ? Math.max(...nums) + 1 : 1;
}

function generateConfig(brandKey) {
  const brand = BRANDS[brandKey];
  const used = getUsedFromRegistry();
  const projectNum = getNextProjectNum(brandKey);

  const availableColors = COLORS.filter(c => !used.colors.includes(c.id));
  const color = availableColors.length > 0 ? pick(availableColors) : pick(COLORS);

  const availableFonts = FONTS.filter(f => !used.fonts.includes(f));
  const font = availableFonts.length > 0 ? pick(availableFonts) : pick(FONTS);

  const isFemale = Math.random() > 0.7;
  const firstName = isFemale ? pick(FEMALE_NAMES) : pick(MALE_NAMES);
  const surname = isFemale ? pick(FEMALE_SURNAMES) : pick(SURNAMES);
  const authorName = `${firstName} ${surname}`;

  const availableCities = CITIES.filter(c => !used.cities.includes(c));
  const city = availableCities.length > 0 ? pick(availableCities) : pick(CITIES);

  const age = 25 + Math.floor(Math.random() * 16);
  const experience = 3 + Math.floor(Math.random() * 8);
  const style = pick(STYLES);

  const numPages = 4 + Math.floor(Math.random() * 3);
  const pageTypes = Object.keys(PAGE_SLUGS);
  const selectedPageTypes = pickN(pageTypes, numPages);
  const pages = ['index', ...selectedPageTypes.map(pt => pick(PAGE_SLUGS[pt])), 'about'];

  const numSlots = 2 + Math.floor(Math.random() * 2);
  const slots = pickN(brand.slots, numSlots);

  const freePresets = [];
  for (let i = 1; i <= 15; i++) {
    if (!used.presets.includes(i)) freePresets.push(i);
  }
  const preset = freePresets.length > 0 ? freePresets[0] : null;

  const domainPrefixes = [
    `${brandKey}-obzor`, `${brandKey}-kz-guide`, `${brandKey}-stavki`,
    `${brandKey}-kazahstan`, `${brandKey}-kz`, `${brandKey}-bonus`,
    `review-${brandKey}`, `${brandKey}-info`, `guide-${brandKey}`,
  ];
  const domainSuffixes = ['.kz', '.com', '.info', '.site'];
  const domain = pick(domainPrefixes) + pick(domainSuffixes);

  const config = {
    brand: brand.name,
    region: 'Казахстан',
    language: 'ru',
    currency: 'KZT',
    domain,
    affiliate_url: `https://example.com/ref/${brandKey}-${projectNum}`,
    color_preset: color.id,
    visual_style: pick(VISUAL_STYLES),
    preset_number: preset,
    font,
    logo_type: pick(['A', 'B', 'C', 'D', 'E', 'F']),
    author: {
      name: authorName,
      city,
      age,
      experience_years: experience,
      job_title: pick(['Автор обзоров, специалист по ставкам', 'Обзорщик букмекеров, аналитик', 'Автор обзоров казино и ставок', 'Эксперт по беттингу']),
      bio_style: style,
    },
    pages,
    slot_pages: slots,
    sections_order: 'shuffle',
    seo: {
      primary_keyword: brand.keywords[0],
      secondary_keywords: brand.keywords.slice(1),
      geo_target: 'KZ',
    },
    noindex: true,
  };

  return { config, projectNum, brandKey };
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(r => rl.question(q, r));

async function main() {
  console.log('');
  console.log('\x1b[1m=== Генератор project.config.json ===\x1b[0m');
  console.log('');

  const brandKeys = Object.keys(BRANDS);
  console.log('Доступные бренды:');
  brandKeys.forEach((k, i) => console.log(`  ${i + 1}. ${BRANDS[k].name} (${k})`));
  console.log('');

  const brandInput = await ask('Выбери бренд (номер или название): ');
  let brandKey;
  const num = parseInt(brandInput);
  if (num >= 1 && num <= brandKeys.length) {
    brandKey = brandKeys[num - 1];
  } else {
    brandKey = brandInput.toLowerCase().replace(/[-\s]/g, '');
    if (!BRANDS[brandKey]) {
      console.log('\x1b[31mБренд не найден\x1b[0m');
      rl.close();
      return;
    }
  }

  console.log('');
  console.log(`Бренд: \x1b[33m${BRANDS[brandKey].name}\x1b[0m`);
  console.log('Генерирую конфиг...');
  console.log('');

  const { config, projectNum } = generateConfig(brandKey);
  const projectPath = path.join(PROJECTS_DIR, brandKey, `project_${projectNum}`);

  console.log('\x1b[36m--- Сгенерированный конфиг ---\x1b[0m');
  console.log('');
  console.log(`  Домен:    ${config.domain}`);
  console.log(`  Стиль:    \x1b[35m${config.visual_style}\x1b[0m`);
  console.log(`  Цвет:     ${config.color_preset}`);
  console.log(`  Шрифт:    ${config.font}`);
  console.log(`  Лого:     тип ${config.logo_type}`);
  console.log(`  Пресет:   #${config.preset_number}`);
  console.log(`  Автор:    ${config.author.name}, ${config.author.city}, ${config.author.age} лет, ${config.author.bio_style}`);
  console.log(`  Страницы: ${config.pages.join(', ')}`);
  console.log(`  Слоты:    ${config.slot_pages.join(', ')}`);
  console.log(`  Путь:     ${projectPath}`);
  console.log('');

  const confirm = await ask('Сохранить? (y/n): ');
  if (confirm.toLowerCase() !== 'y') {
    console.log('Отменено.');
    rl.close();
    return;
  }

  fs.mkdirSync(projectPath, { recursive: true });
  fs.writeFileSync(path.join(projectPath, 'project.config.json'), JSON.stringify(config, null, 2));

  console.log('');
  console.log(`\x1b[32m✓ Конфиг сохранён: ${projectPath}/project.config.json\x1b[0m`);
  console.log('');
  console.log('Следующий шаг:');
  console.log(`  Скинь картинки слотов: ${config.slot_pages.join(', ')}`);
  console.log(`  Затем запусти генерацию проекта`);

  rl.close();
}

main();
