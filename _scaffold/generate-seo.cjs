#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const YEAR = new Date().getFullYear();

function resolveRegionCode(input) {
  if (!input) return 'KZ';
  const upper = input.toUpperCase();
  if (upper.length <= 3) return upper;
  const nameMap = { 'казахстан': 'KZ', 'узбекистан': 'UZ', 'азербайджан': 'AZ', 'кыргызстан': 'KG', 'таджикистан': 'TJ', 'беларусь': 'BY', 'украина': 'UA', 'россия': 'RU', 'молдова': 'MD' };
  return nameMap[input.toLowerCase()] || 'KZ';
}

const REGION_DATA = {
  KZ: { name: 'Казахстан', nameLower: 'казахстан', code: 'кз', currency: 'тенге', currencySymbol: '₸', bonus: '220 000 ₸', minDeposit: '1 000 ₸', mainBank: 'Kaspi' },
  UZ: { name: 'Узбекистан', nameLower: 'узбекистан', code: 'уз', currency: 'сум', currencySymbol: 'сум', bonus: '11 000 000 сум', minDeposit: '50 000 сум', mainBank: 'Uzcard' },
  AZ: { name: 'Азербайджан', nameLower: 'азербайджан', code: 'аз', currency: 'манат', currencySymbol: '₼', bonus: '550 ₼', minDeposit: '5 ₼', mainBank: 'Kapital Bank' },
  KG: { name: 'Кыргызстан', nameLower: 'кыргызстан', code: 'кг', currency: 'сом', currencySymbol: 'сом', bonus: '110 000 сом', minDeposit: '500 сом', mainBank: 'Оптима' },
  TJ: { name: 'Таджикистан', nameLower: 'таджикистан', code: 'тж', currency: 'сомони', currencySymbol: 'сомони', bonus: '11 000 сомони', minDeposit: '50 сомони', mainBank: 'Амонатбонк' },
  BY: { name: 'Беларусь', nameLower: 'беларусь', code: 'бай', currency: 'белорусский рубль', currencySymbol: 'Br', bonus: '550 Br', minDeposit: '5 Br', mainBank: 'Беларусбанк' },
  UA: { name: 'Украина', nameLower: 'украина', code: 'уа', currency: 'гривна', currencySymbol: '₴', bonus: '9 000 ₴', minDeposit: '100 ₴', mainBank: 'Приватбанк' },
  RU: { name: 'Россия', nameLower: 'россия', code: 'ру', currency: 'рубль', currencySymbol: '₽', bonus: '32 500 ₽', minDeposit: '100 ₽', mainBank: 'Сбербанк' },
  MD: { name: 'Молдова', nameLower: 'молдова', code: 'мд', currency: 'лей', currencySymbol: 'лей', bonus: '4 500 лей', minDeposit: '50 лей', mainBank: 'MAIB' },
};

const SLUG_TO_TYPE = {
  'index': 'index',
  'about': 'about',
  '404': '404',
  'registraciya': 'registration',
  'sozdat-akkaunt': 'registration',
  'nachalo-raboty': 'registration',
  'otkryt-schet': 'registration',
  'skachat': 'download',
  'prilozhenie': 'download',
  'mobile-app': 'download',
  'ustanovka': 'download',
  'casino': 'casino',
  'igrovye-avtomaty': 'casino',
  'onlajn-kazino': 'casino',
  'slots-i-igry': 'casino',
  'zerkalo': 'mirror',
  'dostup': 'mirror',
  'rabochij-sajt': 'mirror',
  'alternativnyj-vhod': 'mirror',
  'lichnyy-kabinet': 'account',
  'vhod': 'account',
  'moj-profil': 'account',
  'akkaunt': 'account',
  'bonus': 'bonus',
  'akcii': 'bonus',
  'podarki': 'bonus',
  'privetstvennye-bonusy': 'bonus',
  'partnerskaya-programma': 'affiliate',
  'zarabotok': 'affiliate',
  'affiliate': 'affiliate',
};

const PAGE_TYPE_LABELS = {
  index: 'Главная',
  registration: 'Регистрация',
  download: 'Скачивание',
  casino: 'Казино',
  mirror: 'Зеркало',
  account: 'Личный кабинет',
  bonus: 'Бонусы',
  affiliate: 'Партнёрка',
  about: 'О проекте',
  slot: 'Слот-обзор',
};

const SLOT_DATA = {
  'sugar-rush':              { name: 'Sugar Rush',              rtp: '96.50%', maxWin: '×5 000',   provider: 'Pragmatic Play' },
  'sweet-bonanza':           { name: 'Sweet Bonanza',           rtp: '96.48%', maxWin: '×21 175',  provider: 'Pragmatic Play' },
  'gates-of-olympus':        { name: 'Gates of Olympus',        rtp: '96.50%', maxWin: '×5 000',   provider: 'Pragmatic Play' },
  'dead-or-alive-2':         { name: 'Dead or Alive 2',         rtp: '96.82%', maxWin: '×111 111', provider: 'NetEnt' },
  'big-bass-bonanza':        { name: 'Big Bass Bonanza',        rtp: '96.71%', maxWin: '×2 100',   provider: 'Pragmatic Play' },
  'big-bass-splash':         { name: 'Big Bass Splash',         rtp: '96.71%', maxWin: '×2 100',   provider: 'Pragmatic Play' },
  'book-of-dead':            { name: 'Book of Dead',            rtp: '96.21%', maxWin: '×5 000',   provider: "Play'n GO" },
  'the-dog-house':           { name: 'The Dog House',           rtp: '96.51%', maxWin: '×6 750',   provider: 'Pragmatic Play' },
  'sugar-rush-1000':         { name: 'Sugar Rush 1000',         rtp: '96.53%', maxWin: '×25 000',  provider: 'Pragmatic Play' },
  'fruit-party':             { name: 'Fruit Party',             rtp: '96.47%', maxWin: '×5 000',   provider: 'Pragmatic Play' },
  'starlight-princess':      { name: 'Starlight Princess',      rtp: '96.50%', maxWin: '×5 000',   provider: 'Pragmatic Play' },
  'madame-destiny-megaways': { name: 'Madame Destiny Megaways', rtp: '96.56%', maxWin: '×5 000',   provider: 'Pragmatic Play' },
  'great-rhino-megaways':    { name: 'Great Rhino Megaways',    rtp: '96.58%', maxWin: '×20 000',  provider: 'Pragmatic Play' },
  'bananas-go-bahamas':      { name: 'Bananas go Bahamas',      rtp: '96.10%', maxWin: '×9 000',   provider: 'Novomatic' },
  'coin-strike':             { name: 'Coin Strike',             rtp: '96.00%', maxWin: '×2 580',   provider: 'SmartSoft' },
  'rocket-queen':            { name: 'Rocket Queen',            rtp: '96.20%', maxWin: '×10 000',  provider: '1Win Games' },
  'reactoonz-2':             { name: 'Reactoonz 2',             rtp: '96.20%', maxWin: '×5 083',   provider: "Play'n GO" },
};

function buildPageTemplates(brand, reg) {
  const R = reg || REGION_DATA['KZ'];
  return {
    index: {
      primaryKw: `${brand} ${R.nameLower}`,
      titles: [
        { f: 1, text: `${brand} ${R.name} — ставки на спорт и казино ${R.code.toUpperCase()} ${YEAR}` },
        { f: 2, text: `${brand} ${R.name}: ставки + казино с бонусом до ${R.bonus}` },
        { f: 3, text: `Обзор ${brand} ${R.name} — ставки, казино, бонусы в ${R.currency}` },
        { f: 4, text: `${brand} в ${R.name} — стоит ли? Честный обзор ${YEAR}` },
      ],
      descriptions: [
        `Обзор ${brand} для ${R.name}: ставки на КПЛ, казино, бонус до ${R.bonus}. Пополнение через ${R.mainBank} в ${R.currency}.`,
        `${brand} ${R.code.toUpperCase()} — личный обзор: 50+ видов спорта, 10 000+ слотов, счёт в ${R.currency}. Регистрация за 2 минуты.`,
        `Честный обзор ${brand} от жителя ${R.name}. Ставки на спорт, казино, бонусы. ${R.mainBank}, ${R.currency} — всё работает.`,
        `${brand} в ${R.name} ${YEAR}: как ставить, получить бонус и вывести на ${R.mainBank}. Обзор от реального игрока.`,
      ],
    },
    registration: {
      primaryKw: `${brand} регистрация`,
      titles: [
        { f: 1, text: `${brand} Регистрация — аккаунт в ${R.currency} за 2 минуты | ${YEAR}` },
        { f: 2, text: `Регистрация ${brand}: 4 способа + бонус на первый депозит` },
        { f: 3, text: `Создать аккаунт ${brand} ${R.name} — пошаговая инструкция` },
        { f: 4, text: `Как зарегистрироваться на ${brand}? Инструкция ${R.code.toUpperCase()} ${YEAR}` },
      ],
      descriptions: [
        `Как зарегистрироваться на ${brand} в ${R.name}. Счёт в ${R.currency}, бонус на старте. Пошаговая инструкция.`,
        `Регистрация ${brand} за 2 минуты — пошагово. Аккаунт в ${R.currency}, бонус на старте, верификация через ИИН.`,
        `Создай аккаунт ${brand} KZ: 4 способа регистрации, счёт в ${R.currency}. Бонус начисляется на первый депозит.`,
        `${brand} регистрация ${YEAR}: как открыть счёт в ${R.currency}, получить бонус и начать ставить из ${R.name}.`,
      ],
    },
    download: {
      primaryKw: `${brand} скачать`,
      titles: [
        { f: 1, text: `${brand} Скачать — приложение для Android и iOS | ${YEAR}` },
        { f: 2, text: `Приложение ${brand}: APK 40 МБ + установка за 1 минуту` },
        { f: 3, text: `Скачать ${brand} ${R.name} — APK для Android бесплатно` },
        { f: 4, text: `Где скачать ${brand}? Рабочая ссылка на APK ${YEAR}` },
      ],
      descriptions: [
        `Скачать ${brand} APK на Android бесплатно. Установка за минуту без Google Play. Работает в ${R.name}.`,
        `${brand} приложение для Android и iOS — скачать бесплатно. APK 40 МБ, ставки и казино с телефона.`,
        `Как скачать ${brand} в ${R.name}: APK для Android, инструкция для iPhone. Рабочая ссылка ${YEAR}.`,
        `Приложение ${brand} ${R.code.toUpperCase()} — скачать APK бесплатно. Ставки, казино, вывод на ${R.mainBank} прямо с телефона.`,
      ],
    },
    casino: {
      primaryKw: `${brand} казино`,
      titles: [
        { f: 1, text: `${brand} Казино — 10 000+ слотов с выводом в ${R.currency} | ${YEAR}` },
        { f: 2, text: `Казино ${brand}: слоты, рулетка, Aviator + 150 фриспинов` },
        { f: 3, text: `Играть в казино ${brand} ${R.name} — слоты и live-игры` },
        { f: 4, text: `Какие слоты есть на ${brand}? Обзор казино ${R.code.toUpperCase()} ${YEAR}` },
      ],
      descriptions: [
        `Казино ${brand} — 10 000+ слотов от Pragmatic Play, NetEnt, Evolution. Играй в ${R.currency} с бонусом и фриспинами.`,
        `${brand} казино ${YEAR}: обзор слотов, рулетки, Aviator. Вывод выигрыша на ${R.mainBank} Gold в ${R.currency}.`,
        `Онлайн-казино ${brand} для ${R.name}. Слоты, live-дилеры, краш-игры. Депозит от ${R.minDeposit} через ${R.mainBank}.`,
        `Казино ${brand} ${R.code.toUpperCase()} — честный обзор: слоты, провайдеры, RTP, бонусы. Играй в ${R.currency}, выводи на ${R.mainBank}.`,
      ],
    },
    mirror: {
      primaryKw: `${brand} зеркало`,
      titles: [
        { f: 1, text: `${brand} Зеркало — рабочий доступ без блокировки | ${YEAR}` },
        { f: 2, text: `Зеркало ${brand}: актуальная ссылка + обход блокировки ${R.code.toUpperCase()}` },
        { f: 3, text: `Доступ к ${brand} ${R.name} — зеркало, VPN, приложение` },
        { f: 4, text: `Как зайти на ${brand}? Рабочее зеркало для ${R.code.toUpperCase()} ${YEAR}` },
      ],
      descriptions: [
        `Рабочее зеркало ${brand} для ${R.name}. Обходи блокировку Kcell и Beeline — вход без VPN.`,
        `${brand} зеркало ${YEAR} — актуальная ссылка для входа из ${R.name}. Баланс и ставки сохраняются.`,
        `Как зайти на ${brand} если заблокирован. Зеркало, DNS, приложение — 3 способа для жителей ${R.name}.`,
        `Зеркало ${brand} KZ: рабочая ссылка на сегодня. Ставки, баланс, бонусы доступны через зеркало.`,
      ],
    },
    account: {
      primaryKw: `${brand} вход`,
      titles: [
        { f: 1, text: `${brand} Вход — личный кабинет и вывод средств | ${YEAR}` },
        { f: 2, text: `Личный кабинет ${brand}: вход, вывод, верификация ${R.code.toUpperCase()}` },
        { f: 3, text: `Вход в ${brand} ${R.name} — авторизация и настройки` },
        { f: 4, text: `Как войти в ${brand}? Личный кабинет для ${R.code.toUpperCase()} ${YEAR}` },
      ],
      descriptions: [
        `Вход в личный кабинет ${brand}. Управление ставками, вывод на ${R.mainBank}, верификация через ИИН.`,
        `${brand} личный кабинет — как войти, пополнить счёт и вывести деньги в ${R.currency} на ${R.mainBank} Gold.`,
        `Личный кабинет ${brand} KZ: авторизация, настройки профиля, история ставок, вывод средств.`,
        `Как войти в ${brand} из ${R.name}. Личный кабинет: вывод, верификация, двухфакторная защита.`,
      ],
    },
    bonus: {
      primaryKw: `${brand} бонус`,
      titles: [
        { f: 1, text: `${brand} Бонусы — приветственный пакет для ${R.code.toUpperCase()} | ${YEAR}` },
        { f: 2, text: `${brand} Бонус: до ${R.bonus} + 150 фриспинов новым игрокам` },
        { f: 3, text: `Получить бонус ${brand} ${R.name} — условия и отыгрыш` },
        { f: 4, text: `Какие бонусы даёт ${brand}? Полный гайд для ${R.code.toUpperCase()} ${YEAR}` },
      ],
      descriptions: [
        `Бонусы ${brand} для ${R.name}: до ${R.bonus} на спорт, 150 фриспинов на казино. Условия отыгрыша.`,
        `${brand} бонус ${YEAR}: приветственный пакет, промокод, фрибет. Как получить и отыграть бонус в KZ.`,
        `Все бонусы ${brand} ${R.code.toUpperCase()} — приветственный, за депозит, фриспины. Пошаговая активация, вейджер ×35.`,
        `Бонусная программа ${brand}: до ${R.bonus} на первый депозит. Условия, сроки, как не потерять бонус.`,
      ],
    },
    affiliate: {
      primaryKw: `${brand} партнёрская программа`,
      titles: [
        { f: 1, text: `${brand} Партнёрка — заработок на реферальной программе | ${YEAR}` },
        { f: 2, text: `Партнёрская программа ${brand}: до 40% RevShare + CPA` },
        { f: 3, text: `Заработать с ${brand} ${R.name} — партнёрская программа` },
        { f: 4, text: `Сколько платит ${brand}? Обзор партнёрки ${R.code.toUpperCase()} ${YEAR}` },
      ],
      descriptions: [
        `Партнёрская программа ${brand}: до 40% RevShare, CPA от $50. Как зарабатывать на рефералах из KZ.`,
        `${brand} партнёрка ${YEAR}: условия, комиссии, вывод. Обзор от действующего партнёра из ${R.name}.`,
        `Партнёрская программа ${brand} ${R.code.toUpperCase()} — до 40% от дохода. Как начать зарабатывать без вложений.`,
        `Заработок на ${brand}: партнёрская программа с RevShare и CPA. Реальные цифры и личный опыт.`,
      ],
    },
    about: {
      primaryKw: `${brand} обзор`,
      titles: [
        { f: 1, text: `О проекте — честный обзор ${brand} от жителя ${R.name} | ${YEAR}` },
        { f: 2, text: `О нас: обзор ${brand} от реального игрока из ${R.name}` },
        { f: 3, text: `Обзор ${brand} ${R.name} — кто автор и зачем этот сайт` },
        { f: 4, text: `Кто пишет обзоры ${brand}? Об авторе и проекте ${YEAR}` },
      ],
      descriptions: [
        `Кто стоит за обзором ${brand}. Реальный игрок из ${R.name} делится опытом: ставки, казино, вывод.`,
        `О проекте: честный обзор ${brand} от автора из ${R.name}. Без заказных текстов, только личный опыт.`,
        `Об авторе обзора ${brand} KZ: кто я, зачем этот сайт, как тестирую. Прозрачно о партнёрских ссылках.`,
        `${brand} обзор — о проекте. Автор из ${R.name}, ${YEAR} год. Опыт ставок, казино, вывод средств.`,
      ],
    },
  };
}

function buildSlotTemplates(brand, slotSlug, reg) {
  const R = reg || REGION_DATA['KZ'];
  const data = SLOT_DATA[slotSlug];
  if (!data) {
    return {
      primaryKw: `${slotSlug} слот`,
      titles: [
        { f: 2, text: `${slotSlug} — обзор слота на ${brand} | ${YEAR}` },
        { f: 1, text: `${slotSlug} слот — играть на ${brand} ${R.code.toUpperCase()} | ${YEAR}` },
        { f: 4, text: `Стоит ли играть в ${slotSlug}? Обзор ${YEAR}` },
        { f: 3, text: `Играть ${slotSlug} на ${brand} ${R.name} — обзор` },
      ],
      descriptions: [
        `Обзор слота ${slotSlug} на ${brand}. Играй в ${R.currency}, выводи на ${R.mainBank} Gold.`,
        `${slotSlug} — обзор слота на ${brand} KZ. Демо и реальная игра в ${R.currency}.`,
      ],
      slotInfo: null,
    };
  }

  const { name, rtp, maxWin, provider } = data;
  return {
    primaryKw: `${name} слот`,
    titles: [
      { f: 2, text: `${name} слот: RTP ${rtp}, максимум ${maxWin} | ${brand}` },
      { f: 1, text: `${name} — обзор слота и демо на ${brand} | ${YEAR}` },
      { f: 4, text: `Стоит ли играть в ${name}? Обзор слота ${YEAR}` },
      { f: 3, text: `Играть ${name} на ${brand} ${R.name} — обзор и RTP` },
    ],
    descriptions: [
      `Обзор слота ${name} на ${brand}: RTP ${rtp}, макс. выигрыш ${maxWin}. ${provider}. Играй в ${R.currency}.`,
      `${name} — обзор слота от ${provider}. RTP ${rtp}, множитель ${maxWin}. Демо и реальная игра на ${brand}.`,
      `Слот ${name} от ${provider} на ${brand} KZ. RTP ${rtp}, макс. ${maxWin}. Как играть и выигрывать.`,
      `${name} на ${brand}: RTP ${rtp}, бонусные раунды, волатильность. Честный обзор от жителя ${R.name} ${YEAR}.`,
    ],
    slotInfo: { name, rtp, maxWin, provider },
  };
}

function detectPageType(slug) {
  if (SLUG_TO_TYPE[slug]) return SLUG_TO_TYPE[slug];
  for (const [key, type] of Object.entries(SLUG_TO_TYPE)) {
    if (slug.includes(key) || key.includes(slug)) return type;
  }
  return null;
}

function pickVariant(variants, index) {
  return variants[index % variants.length];
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('');
    console.log('\x1b[1m=== Генератор SEO-мета по шаблону ===\x1b[0m');
    console.log('');
    console.log('Использование:');
    console.log('  node _scaffold/generate-seo.cjs <путь-к-проекту>');
    console.log('');
    console.log('Примеры:');
    console.log('  node _scaffold/generate-seo.cjs projects/1xbet/project_1');
    console.log('  node _scaffold/generate-seo.cjs projects/mostbet/project_1');
    console.log('');
    console.log('Читает project.config.json → генерирует seo-meta.json');
    console.log('с title и description для каждой страницы по формулам из PROJECT_REQUIREMENTS.');
    console.log('');
    console.log('Формулы title:');
    console.log('  1: {Primary KW} — {выгода} | {год}');
    console.log('  2: {Primary KW}: {конкретика + цифра}');
    console.log('  3: {Действие} {brand} {регион} — {дополнение}');
    console.log('  4: {Вопрос}? {brand} {год}');
    process.exit(1);
  }

  const projectPath = path.resolve(args[0]);
  const configPath = path.join(projectPath, 'project.config.json');

  if (!fs.existsSync(configPath)) {
    console.error(`\x1b[31m✗ Файл не найден: ${configPath}\x1b[0m`);
    process.exit(1);
  }

  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch (e) {
    console.error(`\x1b[31m✗ Ошибка парсинга JSON: ${e.message}\x1b[0m`);
    process.exit(1);
  }

  const brand = config.brand;
  if (!brand) {
    console.error('\x1b[31m✗ В конфиге отсутствует поле "brand"\x1b[0m');
    process.exit(1);
  }

  const pages = config.pages || [];
  const slotPages = config.slot_pages || [];

  console.log('');
  console.log('\x1b[1m=== Генератор SEO-мета ===\x1b[0m');
  console.log('');
  console.log(`  Проект:  \x1b[36m${projectPath}\x1b[0m`);
  console.log(`  Бренд:   \x1b[33m${brand}\x1b[0m`);
  console.log(`  Домен:   ${config.domain || '—'}`);
  console.log(`  Страниц: ${pages.length} основных + ${slotPages.length} слотовых`);
  console.log('');

  const regionCode = resolveRegionCode(config.region);
  const regionData = REGION_DATA[regionCode] || REGION_DATA['KZ'];
  const templates = buildPageTemplates(brand, regionData);
  const seoMeta = {};
  const formulaUsage = { 1: 0, 2: 0, 3: 0, 4: 0 };
  let variantIdx = 0;
  let warnings = [];
  let skipped = [];

  for (const slug of pages) {
    if (slug === '404') continue;

    const pageType = detectPageType(slug);
    if (!pageType) {
      skipped.push(slug);
      continue;
    }

    const tpl = templates[pageType];
    if (!tpl) {
      skipped.push(slug);
      continue;
    }

    const titleVariant = pickVariant(tpl.titles, variantIdx);
    const descVariant = pickVariant(tpl.descriptions, variantIdx);

    seoMeta[slug] = {
      title: titleVariant.text,
      description: descVariant,
      primary_keyword: tpl.primaryKw,
      title_formula: titleVariant.f,
      page_type: pageType,
    };

    formulaUsage[titleVariant.f]++;
    variantIdx++;
  }

  for (const slotSlug of slotPages) {
    const tpl = buildSlotTemplates(brand, slotSlug, regionData);
    const titleVariant = pickVariant(tpl.titles, variantIdx);
    const descVariant = pickVariant(tpl.descriptions, variantIdx);

    const entry = {
      title: titleVariant.text,
      description: descVariant,
      primary_keyword: tpl.primaryKw,
      title_formula: titleVariant.f,
      page_type: 'slot',
    };

    if (tpl.slotInfo) {
      entry.slot_info = tpl.slotInfo;
    }

    seoMeta[slotSlug] = entry;
    formulaUsage[titleVariant.f]++;
    variantIdx++;
  }

  const outputPath = path.join(projectPath, 'seo-meta.json');
  fs.writeFileSync(outputPath, JSON.stringify(seoMeta, null, 2), 'utf-8');

  console.log('\x1b[36m--- Сгенерированные мета-данные ---\x1b[0m');
  console.log('');

  for (const [slug, meta] of Object.entries(seoMeta)) {
    const tLen = meta.title.length;
    const dLen = meta.description.length;
    const tOk = tLen <= 60;
    const dOk = dLen >= 80 && dLen <= 160;
    const typeLabel = PAGE_TYPE_LABELS[meta.page_type] || meta.page_type;

    console.log(`  \x1b[1m/${slug}\x1b[0m  (${typeLabel}, формула ${meta.title_formula})`);
    console.log(`    title: ${meta.title}`);
    console.log(`    ${tOk ? '\x1b[32m' : '\x1b[33m'}       ${tLen} симв.${tOk ? ' ✓' : ' ⚠ >60'}\x1b[0m`);
    console.log(`    desc:  ${meta.description}`);
    console.log(`    ${dOk ? '\x1b[32m' : '\x1b[33m'}       ${dLen} симв.${dOk ? ' ✓' : dLen < 80 ? ' ⚠ <80' : ' ⚠ >160'}\x1b[0m`);
    console.log('');

    if (!tOk) warnings.push(`/${slug}: title ${tLen} симв. (лимит 60)`);
    if (!dOk) warnings.push(`/${slug}: description ${dLen} симв. (лимит 80-160)`);
  }

  console.log('\x1b[36m--- Распределение формул title ---\x1b[0m');
  console.log('');
  for (let i = 1; i <= 4; i++) {
    const count = formulaUsage[i];
    const bar = '█'.repeat(count) + '░'.repeat(Math.max(0, 5 - count));
    console.log(`  Формула ${i}: ${bar} ${count}`);
  }
  console.log('');

  const titles = Object.values(seoMeta).map(m => m.title);
  if (new Set(titles).size !== titles.length) {
    warnings.push('Найдены дубликаты в title!');
  }

  const descs = Object.values(seoMeta).map(m => m.description);
  if (new Set(descs).size !== descs.length) {
    warnings.push('Найдены дубликаты в description!');
  }

  if (skipped.length > 0) {
    warnings.push(`Пропущены страницы (неизвестный тип): ${skipped.join(', ')}`);
  }

  if (warnings.length > 0) {
    console.log('\x1b[33m--- Предупреждения ---\x1b[0m');
    console.log('');
    for (const w of warnings) {
      console.log(`  ⚠ ${w}`);
    }
    console.log('');
  }

  console.log(`\x1b[32m✓ Сохранено: ${outputPath}\x1b[0m`);
  console.log(`  ${Object.keys(seoMeta).length} страниц`);
  console.log('');
  console.log('  Следующий шаг: проверь title/description, при необходимости');
  console.log('  отредактируй seo-meta.json, затем вставь данные в код проекта.');
  console.log('');
}

main();
