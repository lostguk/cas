#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const YEAR = new Date().getFullYear();

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

const BRANDS = {
  '1xBet': {
    type: 'ставки + казино',
    accent: 'широкая линия, live-ставки, мобильное приложение, крипто, 1xGames',
    sports: ['Футбол (КПЛ, АПЛ, Ла Лига)', 'Хоккей (НХЛ, КХЛ, «Барыс»)', 'Теннис (ATP, WTA)', 'Баскетбол (НБА, Евролига)', 'Киберспорт (CS2, Dota 2)', 'Бокс и MMA'],
    crashGames: ['Aviator', 'JetX', 'Crazy Time', 'Lightning Roulette'],
    exclusive: '1xGames (Crash, Crystal, Dice, Plinko)',
    providers: ['Pragmatic Play', 'NetEnt', "Play'n GO", 'Evolution', 'Microgaming'],
    bonusAmount: '220 000 ₸',
    bonusFreespins: '150 фриспинов',
    wager: '×5 на спорт / ×35 на казино',
    minDeposit: '1 000 ₸',
    gamesCount: '10 000+',
    sportsCount: '50+',
    liveEvents: '1 000+',
  },
  'Pin-Up': {
    type: 'казино + ставки',
    accent: 'слоты, Aviator, рулетка, бонусы на депозит, визуально яркий',
    sports: ['Футбол (КПЛ, АПЛ)', 'Теннис', 'Баскетбол', 'Хоккей'],
    crashGames: ['Aviator', 'Lucky Jet', 'Spaceman', 'Speed Baccarat'],
    exclusive: null,
    providers: ['Pragmatic Play', 'Spribe', 'Evolution', "Play'n GO"],
    bonusAmount: '150 000 ₸',
    bonusFreespins: '250 фриспинов',
    wager: '×50 на казино',
    minDeposit: '500 ₸',
    gamesCount: '5 000+',
    sportsCount: '30+',
    liveEvents: '500+',
  },
  'Mostbet': {
    type: 'ставки + казино',
    accent: 'высокие коэффициенты, экспресс-бонусы, покер, Aviator',
    sports: ['Футбол (КПЛ, АПЛ, Бундеслига)', 'Теннис', 'Хоккей (КХЛ, НХЛ)', 'Баскетбол', 'Киберспорт'],
    crashGames: ['Aviator', 'Lucky Jet', 'JetX', 'Mines', 'Dice'],
    exclusive: null,
    providers: ['Pragmatic Play', 'Spribe', 'NetEnt', 'Evolution'],
    bonusAmount: '150 000 ₸',
    bonusFreespins: '250 фриспинов',
    wager: '×5 на спорт / ×60 на казино',
    minDeposit: '500 ₸',
    gamesCount: '8 000+',
    sportsCount: '40+',
    liveEvents: '800+',
  },
  '1Win': {
    type: 'казино + ставки',
    accent: 'Lucky Jet, краш-игры, быстрые выплаты, молодёжная аудитория',
    sports: ['Футбол', 'Теннис', 'Баскетбол', 'Киберспорт (CS2, Dota 2, Valorant)'],
    crashGames: ['Lucky Jet', 'Aviator', 'Mines', 'Speed Cash', 'Crash'],
    exclusive: '1Win Games (Rocket Queen, Speed Cash, Lucky Jet)',
    providers: ['Pragmatic Play', 'Spribe', 'SmartSoft Gaming', '1Win Games'],
    bonusAmount: '500%',
    bonusFreespins: '70 фриспинов',
    wager: '×50',
    minDeposit: '500 ₸',
    gamesCount: '12 000+',
    sportsCount: '35+',
    liveEvents: '600+',
  },
  'Melbet': {
    type: 'ставки (спорт-фокус)',
    accent: 'спорт, высокие коэффициенты, live-ставки, экспрессы',
    sports: ['Футбол (КПЛ, АПЛ, Серия А, Ла Лига)', 'Хоккей', 'Теннис', 'Баскетбол', 'Бокс', 'Киберспорт'],
    crashGames: ['Aviator'],
    exclusive: null,
    providers: ['Pragmatic Play', 'Evolution'],
    bonusAmount: '195 000 ₸',
    bonusFreespins: '30 фриспинов',
    wager: '×5 на спорт',
    minDeposit: '500 ₸',
    gamesCount: '3 000+',
    sportsCount: '40+',
    liveEvents: '700+',
  },
};

const SLUG_TO_TYPE = {
  'index': 'index', 'about': 'about', '404': '404',
  'registraciya': 'registration', 'sozdat-akkaunt': 'registration', 'nachalo-raboty': 'registration', 'otkryt-schet': 'registration',
  'skachat': 'download', 'prilozhenie': 'download', 'mobile-app': 'download', 'ustanovka': 'download',
  'casino': 'casino', 'igrovye-avtomaty': 'casino', 'onlajn-kazino': 'casino', 'slots-i-igry': 'casino',
  'zerkalo': 'mirror', 'dostup': 'mirror', 'rabochij-sajt': 'mirror', 'alternativnyj-vhod': 'mirror',
  'lichnyy-kabinet': 'account', 'vhod': 'account', 'moj-profil': 'account', 'akkaunt': 'account',
  'bonus': 'bonus', 'akcii': 'bonus', 'podarki': 'bonus', 'privetstvennye-bonusy': 'bonus',
  'partnerskaya-programma': 'affiliate', 'zarabotok': 'affiliate', 'affiliate': 'affiliate',
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

const CTA_BANK = {
  registration: ['Забрать бонус на старте', 'Открыть аккаунт за 2 минуты', 'Зарегистрироваться с бонусом', 'Создать профиль в KZT', 'Начать с приветственным пакетом', 'Получить фрибет на первый депозит'],
  casino: ['Играть с бонусом', 'Запустить слот бесплатно', 'Попробовать в демо-режиме', 'Открыть казино с бонусом', 'Крутить с фриспинами', 'Испытать удачу'],
  sports: ['Сделать первую ставку', 'Ставить на КПЛ', 'Получить фрибет', 'Начать со ставок на спорт'],
  app: ['Скачать APK бесплатно', 'Установить приложение', 'Загрузить на Android', 'Перейти на рабочее зеркало', 'Открыть через зеркало'],
  account: ['Войти в личный кабинет', 'Авторизоваться', 'Управлять ставками', 'Открыть личный кабинет'],
  final: ['Готовы попробовать?', 'Начните прямо сейчас', 'Ваш аккаунт ждёт', 'Пора действовать', 'Не откладывайте'],
};

const STYLE_NOTES = {
  casual: {
    tone: 'разговорный, расслабленный',
    paragraphs: 'короткие (2-3 предложения)',
    markers: 'много вставок «ну», «вот», «короче», незаконченные мысли, эмоциональные реплики',
    example: '«Скачал APK, весит мегабайт 40 — нормально. На Samsung A54 встало без проблем.»',
  },
  analytical: {
    tone: 'структурированный, с данными и цифрами',
    paragraphs: 'средние (4-5 предложений), с таблицами и сравнениями',
    markers: 'конкретные числа, проценты, сравнения, «по моим замерам», «если судить по статистике»',
    example: '«Маржа на КПЛ — 4.5-5%. На топ-матчи АПЛ — 3.2%. Это средний показатель для СНГ-конторы.»',
  },
  enthusiast: {
    tone: 'эмоциональный, увлечённый',
    paragraphs: 'средние, с личными историями',
    markers: 'восклицания (но не в каждом предложении), «это просто огонь», «честно — офигел», рекомендации друзьям',
    example: '«Поставил экспресс из 5 событий на КПЛ — зашёл! 15 000 тенге превратились в 120 тысяч!»',
  },
  skeptic: {
    tone: 'осторожный, критичный',
    paragraphs: 'средние, с оговорками и предупреждениями',
    markers: 'много минусов, «но не уверен», «время покажет», осторожные рекомендации «попробовать можно, но...»',
    example: '«Бонус выглядит щедро, но вейджер ×35 — это жёстко. Отыграть реально, но непросто.»',
  },
};

function parseFaqBank() {
  const faqPath = path.join(ROOT, 'docs', 'FAQ_BANK.md');
  if (!fs.existsSync(faqPath)) return {};
  const content = fs.readFileSync(faqPath, 'utf-8');
  const questions = {};
  let currentCategory = '';
  for (const line of content.split('\n')) {
    const catMatch = line.match(/^## (.+)/);
    if (catMatch) { currentCategory = catMatch[1].trim(); continue; }
    const qMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (qMatch) {
      questions[parseInt(qMatch[1])] = { text: qMatch[2].trim(), category: currentCategory };
    }
  }
  return questions;
}

function getUsedFaqNumbers() {
  const regPath = path.join(ROOT, 'docs', 'REGISTRY.md');
  if (!fs.existsSync(regPath)) return new Set();
  const content = fs.readFileSync(regPath, 'utf-8');
  const used = new Set();
  let inFaqSection = false;
  for (const line of content.split('\n')) {
    if (line.includes('Использованные FAQ-вопросы')) { inFaqSection = true; continue; }
    if (inFaqSection && line.startsWith('---')) break;
    if (inFaqSection && line.startsWith('|') && !line.startsWith('| Проект') && !line.startsWith('|---')) {
      const nums = line.match(/\d+/g);
      if (nums) nums.forEach(n => used.add(parseInt(n)));
    }
  }
  return used;
}

function selectFaqQuestions(allQuestions, usedNumbers, count) {
  const categories = {};
  for (const [num, q] of Object.entries(allQuestions)) {
    const n = parseInt(num);
    if (usedNumbers.has(n)) continue;
    if (!categories[q.category]) categories[q.category] = [];
    categories[q.category].push({ num: n, ...q });
  }

  const selected = [];
  const catKeys = Object.keys(categories);
  let catIdx = 0;
  while (selected.length < count && catKeys.length > 0) {
    const cat = catKeys[catIdx % catKeys.length];
    if (categories[cat].length > 0) {
      const idx = Math.floor(Math.random() * categories[cat].length);
      selected.push(categories[cat].splice(idx, 1)[0]);
      if (categories[cat].length === 0) {
        catKeys.splice(catIdx % catKeys.length, 1);
        if (catKeys.length === 0) break;
      }
    }
    catIdx++;
  }
  return selected.sort((a, b) => a.num - b.num);
}

function detectPageType(slug) {
  return SLUG_TO_TYPE[slug] || null;
}

function resolveSections(config) {
  const mandatory = ['Hero', 'Overview'];
  const closing = ['FAQ', 'CTA'];
  const optional = ['Sports', 'Advantages', 'Payments', 'Bonus', 'Slots', 'Live', 'App', 'Testimonials', 'Comparison', 'Stats'];

  if (Array.isArray(config.sections_order)) {
    return config.sections_order;
  }

  const middle = pickN(optional, 3 + Math.floor(Math.random() * 3));
  return [...mandatory, ...middle, ...closing];
}

function buildMainPageSkeleton(config, brand, sections, faqQuestions) {
  const b = config.brand;
  const style = config.author?.bio_style || 'casual';
  const sn = STYLE_NOTES[style];
  const pages = config.pages || [];
  const slotPages = config.slot_pages || [];
  const primaryKw = config.seo?.primary_keyword || `${b} казахстан`;
  const secondaryKws = config.seo?.secondary_keywords || [];

  const subpageSlugs = pages.filter(p => p !== 'index' && p !== '404' && p !== 'about');
  const usedCtas = new Set();

  function pickCta(category) {
    const pool = CTA_BANK[category] || CTA_BANK.registration;
    const available = pool.filter(c => !usedCtas.has(c));
    const chosen = available.length > 0 ? pick(available) : pick(pool);
    usedCtas.add(chosen);
    return chosen;
  }

  function linkTargets(n) {
    return pickN(subpageSlugs, Math.min(n, subpageSlugs.length)).map(s => `/${s}`);
  }

  const result = [];

  for (const section of sections) {
    switch (section) {
      case 'Hero':
        result.push({
          section: 'Hero',
          words: '30-40 (подзаголовок)',
          h1: `${b} Казахстан — ${brand.type} для игроков из KZ`,
          h1_note: 'НЕ дублировать title. Содержит primary keyword.',
          subtitle: `Личный обзор ${b} от игрока из ${config.author?.city || 'Казахстана'}. ${brand.sportsCount} видов спорта, ${brand.gamesCount} игр в казино, счёт в тенге.`,
          badge: pick([`Обновлено ${YEAR}`, 'Проверено лично', `Актуально на ${YEAR}`, `${brand.liveEvents} live-событий`]),
          stats: [
            { value: brand.sportsCount, label: 'видов спорта' },
            { value: brand.minDeposit, label: 'мин. депозит' },
            { value: '100%', label: 'на первый депозит' },
          ],
          cta_primary: { text: pickCta('registration'), href: 'affiliateLink', external: true },
          cta_secondary: { text: pickCta('sports'), href: linkTargets(1)[0] || '/about' },
          keywords: [primaryKw],
          style: `Тон: ${sn.tone}`,
        });
        break;

      case 'Overview':
        result.push({
          section: 'Overview',
          words: '150-200',
          h2: pick([
            `Мой опыт с ${b} — коротко и честно`,
            `Что такое ${b} и стоит ли тут играть`,
            `${b} в Казахстане: личный обзор`,
            `Коротко о ${b} для тех, кто в первый раз`,
          ]),
          paragraphs: [
            {
              plan: `Личное знакомство с платформой. Как узнал, сколько пользуюсь. Содержит primary keyword «${primaryKw}».`,
              keywords: [primaryKw],
              words: '50-70',
            },
            {
              plan: `Главные плюсы и один минус. Конкретные цифры: ${brand.gamesCount} игр, ${brand.sportsCount} видов спорта, депозит от ${brand.minDeposit}.`,
              keywords: [secondaryKws[0] || ''],
              words: '50-70',
            },
            {
              plan: 'Дисклеймер: партнёрские ссылки, 21+, ответственная игра. Тон — честный, не продающий.',
              keywords: [],
              words: '40-50',
            },
          ],
          internal_links: linkTargets(2),
          disclaimer: true,
          style: `Тон: ${sn.tone}. Абзацы: ${sn.paragraphs}. ${sn.markers}`,
        });
        break;

      case 'Sports':
        result.push({
          section: 'Sports',
          words: '100-130',
          h2: pick([
            `Ставки на спорт: что есть на ${b}`,
            'Спорт: от КПЛ до киберспорта',
            `Виды спорта для ставок на ${b}`,
            `Спортивные ставки — зачем ${b}`,
          ]),
          intro: `1 абзац (2-3 предложения). Общее впечатление о спортивной линии. Маржа 3-5%, ${brand.liveEvents} live-событий.`,
          cards: pickN(brand.sports, 4).map(sport => ({
            title: sport.split(' (')[0],
            description_hint: `2 предложения: специфика линии + один факт/цифру. Например: «КПЛ — до 150 рынков на топ-матчи. Маржа 4-5%.»`,
            icon_hint: sport.includes('Футбол') ? 'мяч' : sport.includes('Хоккей') ? 'шайба' : sport.includes('Теннис') ? 'ракетка' : sport.includes('Баскетбол') ? 'мяч баскетбольный' : sport.includes('Киберспорт') ? 'геймпад' : 'перчатка',
          })),
          keywords: ['ставки'],
          internal_links: [],
          style: `Тон: ${sn.tone}. Факты, не описания.`,
        });
        break;

      case 'Advantages':
        result.push({
          section: 'Advantages',
          words: '100-130',
          h2: pick([
            `Плюсы и минусы ${b} — без прикрас`,
            'Что нравится и что бесит',
            `${b}: за и против`,
            'Честная оценка: плюсы и минусы',
          ]),
          cards: [
            { title: 'Линия и коэффициенты', plus: `${brand.sportsCount} видов спорта, маржа 3-5%`, minus: 'На КПЛ роспись беднее, чем на АПЛ' },
            { title: 'Оплата в тенге', plus: 'Kaspi, Halyk, Jusan — без конвертации', minus: 'Kaspi иногда отклоняет платежи' },
            { title: 'Мобильное приложение', plus: 'APK ~40 МБ, работает стабильно', minus: 'Нет в Google Play, обновлять вручную' },
            { title: 'Казино и слоты', plus: `${brand.gamesCount} игр, ${brand.providers.join(', ')}`, minus: `Вейджер ${brand.wager} — жёстко` },
            { title: 'Бонусы', plus: `До ${brand.bonusAmount} + ${brand.bonusFreespins}`, minus: 'Условия отыгрыша не самые простые' },
            { title: 'Поддержка', plus: 'Чат 24/7 на русском', minus: 'Отвечают шаблонно, нужно настаивать' },
          ],
          note: 'Каждая карточка: заголовок + 2 предложения (плюс и минус). Честно, без идеализации.',
          keywords: [b],
          style: `Тон: ${sn.tone}.`,
        });
        break;

      case 'Payments':
        result.push({
          section: 'Payments',
          words: '80-100',
          h2: pick([
            'Пополнение и вывод: тенге, Kaspi, крипта',
            'Как закинуть и вывести деньги',
            `Платежи на ${b}: методы и сроки`,
            'Тенге без конвертации — как платить',
          ]),
          cards: [
            { method: 'Kaspi / Halyk / Jusan', hint: 'Карты и переводы казахстанских банков' },
            { method: 'Криптовалюта (USDT)', hint: 'TRC20, без комиссии платформы, 15-30 мин' },
            { method: 'Электронные кошельки', hint: 'QIWI, WebMoney — работает, но медленнее' },
          ],
          table: {
            columns: ['Метод', 'Пополнение', 'Вывод', 'Минимум'],
            rows: [
              ['Kaspi Gold', 'Мгновенно', '1-24 часа', brand.minDeposit],
              ['Halyk Homebank', '5-15 мин', '1-3 дня', brand.minDeposit],
              ['USDT (TRC20)', '15-30 мин', '15-30 мин', '~3 000 ₸'],
            ],
          },
          keywords: ['тенге'],
          style: `Тон: ${sn.tone}. Упомянуть личный опыт вывода.`,
        });
        break;

      case 'Bonus':
        result.push({
          section: 'Bonus',
          words: '80-100',
          h2: pick([
            `Бонусы ${b} — что дают на старте`,
            'Приветственный пакет: что получишь',
            `Бонус до ${brand.bonusAmount} — условия`,
            'Стартовый бонус — стоит ли брать',
          ]),
          cards: [
            { type: 'Спортивный бонус', value: `100% до ${brand.bonusAmount}`, condition: `Вейджер ${brand.wager}, 30 дней` },
            { type: 'Казино-бонус', value: brand.bonusFreespins, condition: `Вейджер ${brand.wager}, конкретные слоты` },
            { type: 'Фрибет', value: 'Бесплатная ставка', condition: 'При выполнении условий первого депозита' },
          ],
          keywords: ['бонус'],
          internal_links: pages.filter(p => detectPageType(p) === 'bonus').map(p => `/${p}`),
          style: `Тон: ${sn.tone}. Обязательно упомянуть сложность отыгрыша — честно.`,
        });
        break;

      case 'Slots': {
        const slotCards = slotPages.slice(0, 3).map(slug => {
          const data = SLOT_DATA[slug] || { name: slug, rtp: '96%', maxWin: '×5 000', provider: 'Unknown' };
          return {
            slug,
            name: data.name,
            provider: data.provider,
            rtp: data.rtp,
            maxWin: data.maxWin,
            description_hint: `2 предложения: тема слота + впечатление. RTP ${data.rtp}, макс. ${data.maxWin}.`,
            cta: pickCta('casino'),
            link: `/${slug}`,
          };
        });
        result.push({
          section: 'Slots',
          words: '80-100',
          h2: pick([
            `Популярные слоты на ${b}`,
            'Топ слотов — что крутить',
            'Казино: мои любимые слоты',
            `Слоты ${b} — личный топ`,
          ]),
          cards: slotCards,
          keywords: ['казино'],
          style: `Тон: ${sn.tone}. Для каждого слота — уникальный CTA.`,
        });
        break;
      }

      case 'Live':
        result.push({
          section: 'Live',
          words: '80-100',
          h2: pick([
            'Live-ставки и live-казино',
            `Лайв на ${b} — ставки в реальном времени`,
            'Live: ставки и дилеры онлайн',
            'В режиме реального времени',
          ]),
          paragraphs: [
            { plan: `1-2 абзаца: как работает live, задержки, количество событий (${brand.liveEvents}).`, words: '40-60' },
          ],
          features: [
            `${brand.liveEvents} live-событий ежедневно`,
            'Cash Out — забрать ставку до конца матча',
            `Live-казино с дилерами: ${brand.crashGames.join(', ')}`,
            'Трансляции матчей в приложении',
          ],
          keywords: [],
          style: `Тон: ${sn.tone}. Упомянуть опыт live-ставки.`,
        });
        break;

      case 'App':
        result.push({
          section: 'App',
          words: '60-80',
          h2: pick([
            'Приложение: ставки с телефона',
            `${b} на Android и iOS`,
            'Мобильное приложение — как скачать',
            'APK для Android — инструкция',
          ]),
          paragraphs: [
            { plan: 'Краткий обзор приложения. Размер APK (~40 МБ), как установить, личный опыт.', words: '40-50' },
          ],
          steps_hint: '3-4 шага установки APK: скачать → разрешить источники → установить → войти',
          keywords: ['скачать'],
          internal_links: pages.filter(p => detectPageType(p) === 'download').map(p => `/${p}`),
          style: `Тон: ${sn.tone}.`,
        });
        break;

      case 'Testimonials':
        result.push({
          section: 'Testimonials',
          words: '80-120',
          h2: pick([
            'Что говорят другие игроки',
            'Отзывы казахстанцев',
            `Отзывы о ${b} — реальные мнения`,
          ]),
          cards: [
            { name: 'Аноним из Алматы', rating: '4/5', hint: 'Положительный, о быстром выводе на Kaspi' },
            { name: 'Аноним из Астаны', rating: '3.5/5', hint: 'Смешанный, о блокировках и зеркале' },
            { name: 'Аноним из Караганды', rating: '4.5/5', hint: 'Положительный, о приложении и live' },
          ],
          note: 'Отзывы от лица вымышленных пользователей. Разные города, разный опыт. Не все идеальные.',
          keywords: [],
          style: `Тон: ${sn.tone}.`,
        });
        break;

      case 'Comparison':
        result.push({
          section: 'Comparison',
          words: '60-80',
          h2: pick([`${b} vs конкуренты`, 'Сравнение с другими конторами', 'Таблица сравнения']),
          table_hint: 'Таблица: Параметр | ' + b + ' | Конкурент 1 | Конкурент 2. Параметры: бонус, мин. депозит, кол-во видов спорта, оплата в тенге.',
          keywords: [b],
          style: 'Объективно, без явного перекоса в сторону бренда.',
        });
        break;

      case 'Stats':
        result.push({
          section: 'Stats',
          words: '20-30',
          h2: pick([`${b} в цифрах`, 'Ключевые цифры', 'Статистика платформы']),
          stats: [
            { value: brand.sportsCount, label: 'видов спорта' },
            { value: brand.gamesCount, label: 'игр в казино' },
            { value: brand.liveEvents, label: 'live-событий' },
            { value: '15+', label: 'способов оплаты' },
          ],
          keywords: [],
        });
        break;

      case 'FAQ':
        result.push({
          section: 'FAQ',
          words: '200-250',
          h2: pick([
            'Частые вопросы',
            `Вопросы о ${b}`,
            'FAQ — отвечаю на вопросы',
            'Спрашивают — отвечаю',
          ]),
          questions: faqQuestions.map(q => ({
            number: q.num,
            category: q.category,
            question: q.text,
            answer_hint: `2-3 предложения. Тон: ${sn.tone}. Разговорный ответ с конкретикой, не шаблонный.`,
          })),
          schema: 'FAQPage',
          keywords: [primaryKw],
          style: `Ответы: ${sn.tone}. Каждый ответ содержит конкретную цифру или факт. Не «канцелярит».`,
        });
        break;

      case 'CTA':
        result.push({
          section: 'CTA',
          words: '15-25',
          h2: pick([
            'Готовы начать?',
            'Ваш аккаунт ждёт',
            `Попробуй ${b} сам`,
            'Время действовать',
          ]),
          subtitle: `Одно предложение. Личное обращение к читателю. Содержит бренд «${b}».`,
          cta: { text: pickCta('final'), href: 'affiliateLink', external: true },
          keywords: [b],
        });
        break;
    }
  }

  return { sections: result, usedCtas: [...usedCtas] };
}

function buildSubpageOutlines(config, brand) {
  const b = config.brand;
  const pages = config.pages || [];
  const style = config.author?.bio_style || 'casual';
  const sn = STYLE_NOTES[style];
  const allSlugs = pages.filter(p => p !== 'index' && p !== '404');
  const outlines = {};

  for (const slug of pages) {
    if (slug === 'index' || slug === '404') continue;
    const type = detectPageType(slug);
    if (!type) continue;

    const base = {
      slug,
      page_type: type,
      words: type === 'about' ? '400-600' : '500-800',
      schema_hint: null,
      internal_links: pickN(allSlugs.filter(s => s !== slug), 3).map(s => `/${s}`),
      style: `Тон: ${sn.tone}. ${sn.markers}`,
    };

    switch (type) {
      case 'registration':
        outlines[slug] = {
          ...base,
          h1: `Как зарегистрироваться на ${b} в Казахстане`,
          schema_hint: 'HowTo + HowToStep',
          blocks: [
            { h2: 'Пошаговая регистрация', type: 'steps', content: '4-5 шагов: выбор способа → заполнение → валюта KZT → промокод → подтверждение' },
            { h2: `Способы регистрации на ${b}`, type: 'cards', content: '3-4 карточки: по телефону, email, соцсети, в один клик' },
            { h2: 'Бонус при регистрации', type: 'text', content: `Абзац о приветственном бонусе ${brand.bonusAmount}. Ссылка на страницу бонусов.` },
            { h2: 'Верификация', type: 'text', content: 'Абзац о KYC: удостоверение + ИИН + селфи. Личный опыт: сколько заняло.' },
          ],
        };
        break;
      case 'download':
        outlines[slug] = {
          ...base,
          h1: `Скачать ${b} — APK для Android и iPhone`,
          schema_hint: 'HowTo + HowToStep',
          blocks: [
            { h2: 'Скачать на Android (APK)', type: 'steps', content: '4 шага: ссылка → разрешить источники → установить → войти' },
            { h2: 'Установка на iOS', type: 'steps', content: '3 шага: зеркало → скачать из App Store → войти' },
            { h2: 'Обзор приложения', type: 'text', content: `Плюсы и минусы мобильного приложения ${b}. Размер, скорость, удобство.` },
            { h2: 'Системные требования', type: 'table', content: 'Таблица: ОС | Версия | Размер | RAM' },
          ],
        };
        break;
      case 'casino':
        outlines[slug] = {
          ...base,
          h1: `Казино ${b} — слоты, рулетка и live-дилеры`,
          schema_hint: 'Article',
          blocks: [
            { h2: 'Обзор казино', type: 'text', content: `${brand.gamesCount} игр, провайдеры: ${brand.providers.join(', ')}. Личное впечатление.` },
            { h2: 'Популярные слоты', type: 'cards', content: 'Топ-5 слотов с RTP, провайдером и мнением' },
            { h2: `Live-казино и краш-игры`, type: 'text', content: `${brand.crashGames.join(', ')}. Опыт игры в Aviator.` },
            { h2: 'Бонусы для казино', type: 'text', content: `${brand.bonusFreespins}, вейджер ${brand.wager}. Стоит ли брать.` },
          ],
        };
        break;
      case 'mirror':
        outlines[slug] = {
          ...base,
          h1: `${b} зеркало — рабочий доступ для Казахстана`,
          schema_hint: 'Article',
          blocks: [
            { h2: 'Почему блокируют', type: 'text', content: 'Абзац о блокировках Kcell, Beeline KZ. Причины.' },
            { h2: '3 способа зайти', type: 'steps', content: 'Зеркало → приложение → DNS (8.8.8.8)' },
            { h2: 'Как отличить настоящее зеркало', type: 'text', content: 'Предупреждение о фишинге. Признаки реального зеркала.' },
          ],
        };
        break;
      case 'account':
        outlines[slug] = {
          ...base,
          h1: `Личный кабинет ${b} — вход, настройки, вывод`,
          schema_hint: 'Article',
          blocks: [
            { h2: 'Как войти', type: 'steps', content: '3 шага: сайт/приложение → логин/пароль → двухфакторная' },
            { h2: 'Возможности кабинета', type: 'cards', content: '4-5 карточек: история ставок, вывод, бонусы, верификация, настройки' },
            { h2: 'Вывод средств', type: 'text', content: 'Подробно: Kaspi Gold, Halyk, USDT. Сроки, лимиты, личный опыт.' },
          ],
        };
        break;
      case 'bonus':
        outlines[slug] = {
          ...base,
          h1: `Бонусы ${b} — приветственный пакет и акции`,
          schema_hint: 'Article',
          blocks: [
            { h2: 'Приветственный бонус', type: 'text', content: `До ${brand.bonusAmount} + ${brand.bonusFreespins}. Условия получения.` },
            { h2: 'Как отыграть бонус', type: 'steps', content: `Вейджер ${brand.wager}. Пошагово: что считается, сроки, подводные камни.` },
            { h2: 'Другие акции', type: 'cards', content: 'Экспресс-бонус, кешбэк, промокоды — что реально работает.' },
            { h2: 'Стоит ли брать бонус', type: 'text', content: 'Честное мнение: кому подойдёт, кому нет.' },
          ],
        };
        break;
      case 'affiliate':
        outlines[slug] = {
          ...base,
          h1: `Партнёрская программа ${b} — заработок на рефералах`,
          schema_hint: 'Article',
          blocks: [
            { h2: 'Как работает партнёрка', type: 'text', content: 'RevShare до 40%, CPA от $50. Модели заработка.' },
            { h2: 'Как начать', type: 'steps', content: '3 шага: регистрация → реферальная ссылка → привлечение' },
            { h2: 'Сколько можно заработать', type: 'text', content: 'Реальные цифры, сроки выхода на доход.' },
          ],
        };
        break;
      case 'about':
        outlines[slug] = {
          ...base,
          words: '400-600',
          h1: `Об авторе — кто стоит за обзором ${b}`,
          schema_hint: 'AboutPage + Person',
          blocks: [
            { h2: 'Кто я', type: 'text', content: `${config.author?.name}, ${config.author?.city}, ${config.author?.age} лет. С ${YEAR - (config.author?.experience_years || 5)} года в ставках.` },
            { h2: 'Зачем этот сайт', type: 'text', content: 'Мотивация: делюсь опытом, не заказной обзор. Личная история.' },
            { h2: 'Как тестирую', type: 'text', content: 'Пополняю реальные деньги, ставлю, вывожу. Не «теоретик».' },
            { h2: 'Про честность', type: 'text', content: 'Открытое признание партнёрских ссылок. Это не влияет на оценки.' },
            { h2: 'Предупреждение', type: 'text', content: '21+, ответственная игра. Не ставьте больше, чем можете потерять.' },
          ],
        };
        break;
    }
  }

  return outlines;
}

function buildSlotOutlines(config, brand) {
  const b = config.brand;
  const style = config.author?.bio_style || 'casual';
  const sn = STYLE_NOTES[style];
  const slotPages = config.slot_pages || [];
  const outlines = {};

  for (const slug of slotPages) {
    const data = SLOT_DATA[slug] || { name: slug, rtp: '96%', maxWin: '×5 000', provider: 'Unknown' };
    outlines[slug] = {
      slug,
      page_type: 'slot',
      words: '500-800',
      h1: `${data.name} — обзор слота от ${data.provider}`,
      schema_hint: 'Review + SoftwareApplication (GameApplication)',
      slot_info: data,
      blocks: [
        { h2: `Обзор ${data.name}`, type: 'text', content: `Тема слота, RTP ${data.rtp}, волатильность, макс. ${data.maxWin}. Первое впечатление.` },
        { h2: 'Как играть', type: 'text', content: 'Механика: символы, бонусные раунды, множители. 2-3 абзаца.' },
        { h2: 'Мой опыт', type: 'text', content: `Личный опыт игры на ${b}. Конкретные суммы, сессии, результат.` },
        { h2: 'Стоит ли играть', type: 'text', content: 'Итоговая оценка. Кому подойдёт, кому нет. Плюсы и минусы.' },
      ],
      internal_links: [`/${config.pages?.find(p => detectPageType(p) === 'casino') || 'casino'}`],
      style: `Тон: ${sn.tone}. ${sn.markers}`,
    };
  }

  return outlines;
}

function buildKeywordBudget(config, sections) {
  const b = config.brand;
  const primaryKw = config.seo?.primary_keyword || `${b} казахстан`;
  const secondaryKws = config.seo?.secondary_keywords || [];

  const budget = {
    brand: { word: b, max_per_paragraph: 1, max_per_page: 10, synonyms: ['контора', 'площадка', 'букмекер', 'тут', 'у них', 'платформа', 'сервис'] },
    ставки: { word: 'ставки', max_per_paragraph: 1, max_per_page: 6, synonyms: ['прогнозы', 'пари', 'беттинг', 'игра'] },
    казино: { word: 'казино', max_per_paragraph: 1, max_per_page: 6, synonyms: ['слоты', 'автоматы', 'игровой клуб', 'раздел с играми'] },
    бонус: { word: 'бонус', max_per_paragraph: 1, max_per_page: 6, synonyms: ['подарок', 'акция', 'предложение', 'пакет', 'награда'] },
    тенге: { word: 'тенге', max_per_paragraph: 1, max_per_page: 6, synonyms: ['валюта', 'KZT', '₸', 'в местной валюте'] },
    primary_keyword: { word: primaryKw, max_per_page: 5, placement: 'H1, первый абзац, середина текста, финальный CTA' },
    secondary_keywords: secondaryKws.map(kw => ({ word: kw, max_per_page: 2 })),
  };

  return budget;
}

function buildLinkingPlan(config) {
  const pages = (config.pages || []).filter(p => p !== '404');
  const slots = config.slot_pages || [];
  const allPages = [...pages, ...slots];
  const plan = {};
  const keyPages = pages.filter(p => ['registration', 'bonus', 'casino'].includes(detectPageType(p)));

  for (const slug of allPages) {
    if (slug === 'index') {
      plan[slug] = { outgoing: allPages.filter(p => p !== 'index').slice(0, 8).map(p => `/${p}`), min: 5 };
    } else if (slots.includes(slug)) {
      const casinoPage = pages.find(p => detectPageType(p) === 'casino');
      const otherSlots = slots.filter(s => s !== slug).slice(0, 2);
      plan[slug] = { outgoing: [casinoPage ? `/${casinoPage}` : '/', ...otherSlots.map(s => `/${s}`)], min: 2 };
    } else {
      const targets = pickN(allPages.filter(p => p !== slug && p !== 'index'), 4);
      if (!targets.some(t => detectPageType(t) === 'about') && pages.includes('about')) targets.push('about');
      plan[slug] = { outgoing: targets.slice(0, 5).map(p => `/${p}`), min: 3 };
    }
  }

  const incoming = {};
  for (const [source, data] of Object.entries(plan)) {
    for (const target of data.outgoing) {
      const t = target.replace('/', '');
      if (!incoming[t]) incoming[t] = [];
      incoming[t].push(source);
    }
  }

  return { plan, incoming };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('');
    console.log('\x1b[1m=== Генератор контент-скелета по секциям ===\x1b[0m');
    console.log('');
    console.log('Использование:');
    console.log('  node _scaffold/generate-content.cjs <путь-к-проекту>');
    console.log('');
    console.log('Примеры:');
    console.log('  node _scaffold/generate-content.cjs projects/1xbet/project_1');
    console.log('');
    console.log('Читает project.config.json → генерирует content-skeleton.json');
    console.log('со структурой контента для главной страницы и подстраниц.');
    console.log('Агент использует скелет для генерации уникальных текстов.');
    process.exit(1);
  }

  const projectPath = path.resolve(args[0]);
  const configPath = path.join(projectPath, 'project.config.json');
  if (!fs.existsSync(configPath)) {
    console.error(`\x1b[31m✗ Файл не найден: ${configPath}\x1b[0m`);
    process.exit(1);
  }

  let config;
  try { config = JSON.parse(fs.readFileSync(configPath, 'utf-8')); }
  catch (e) { console.error(`\x1b[31m✗ Ошибка парсинга: ${e.message}\x1b[0m`); process.exit(1); }

  const brandName = config.brand;
  const brand = BRANDS[brandName];
  if (!brand) {
    console.error(`\x1b[31m✗ Неизвестный бренд: ${brandName}. Доступны: ${Object.keys(BRANDS).join(', ')}\x1b[0m`);
    process.exit(1);
  }

  const style = config.author?.bio_style || 'casual';

  console.log('');
  console.log('\x1b[1m=== Генератор контент-скелета ===\x1b[0m');
  console.log('');
  console.log(`  Проект:  \x1b[36m${projectPath}\x1b[0m`);
  console.log(`  Бренд:   \x1b[33m${brandName}\x1b[0m`);
  console.log(`  Автор:   ${config.author?.name || '—'} (${config.author?.city || '—'})`);
  console.log(`  Стиль:   \x1b[35m${style}\x1b[0m — ${STYLE_NOTES[style]?.tone || ''}`);
  console.log(`  Страниц: ${(config.pages || []).length} основных + ${(config.slot_pages || []).length} слотовых`);
  console.log('');

  const allFaq = parseFaqBank();
  const usedFaq = getUsedFaqNumbers();
  const faqQuestions = selectFaqQuestions(allFaq, usedFaq, 7);

  const sections = resolveSections(config);
  const { sections: mainSections, usedCtas } = buildMainPageSkeleton(config, brand, sections, faqQuestions);
  const subpageOutlines = buildSubpageOutlines(config, brand);
  const slotOutlines = buildSlotOutlines(config, brand);
  const keywordBudget = buildKeywordBudget(config, mainSections);
  const linkingPlan = buildLinkingPlan(config);

  const skeleton = {
    _meta: {
      brand: brandName,
      domain: config.domain,
      author: config.author,
      style,
      style_description: STYLE_NOTES[style],
      generated_at: new Date().toISOString(),
      year: YEAR,
    },
    keyword_budget: keywordBudget,
    linking_plan: linkingPlan,
    main_page: {
      total_words: '1000-1400',
      sections_order: sections,
      sections: mainSections,
      used_cta_texts: usedCtas,
    },
    subpages: subpageOutlines,
    slot_pages: slotOutlines,
    faq: {
      selected_questions: faqQuestions.map(q => ({ number: q.num, question: q.text, category: q.category })),
      numbers_for_registry: faqQuestions.map(q => q.num).join(', '),
    },
  };

  const outputPath = path.join(projectPath, 'content-skeleton.json');
  fs.writeFileSync(outputPath, JSON.stringify(skeleton, null, 2), 'utf-8');

  console.log('\x1b[36m--- Главная страница ---\x1b[0m');
  console.log(`  Секции (${sections.length}): ${sections.join(' → ')}`);
  console.log(`  Слов: 1000-1400`);
  console.log('');
  for (const s of mainSections) {
    const heading = s.h1 || s.h2 || '—';
    console.log(`  \x1b[1m${s.section}\x1b[0m (${s.words} слов)`);
    console.log(`    ${heading}`);
    if (s.cards) console.log(`    ${s.cards.length} карточ${s.cards.length > 4 ? 'ек' : 'ки'}`);
    if (s.questions) console.log(`    ${s.questions.length} FAQ-вопросов`);
  }

  console.log('');
  console.log('\x1b[36m--- Подстраницы ---\x1b[0m');
  for (const [slug, outline] of Object.entries(subpageOutlines)) {
    console.log(`  \x1b[1m/${slug}\x1b[0m (${outline.page_type}, ${outline.words} слов)`);
    console.log(`    H1: ${outline.h1}`);
    console.log(`    Блоков: ${outline.blocks?.length || 0} | Schema: ${outline.schema_hint || '—'}`);
  }

  if (Object.keys(slotOutlines).length > 0) {
    console.log('');
    console.log('\x1b[36m--- Слот-обзоры ---\x1b[0m');
    for (const [slug, outline] of Object.entries(slotOutlines)) {
      console.log(`  \x1b[1m/${slug}\x1b[0m (${outline.slot_info.name}, RTP ${outline.slot_info.rtp})`);
      console.log(`    H1: ${outline.h1}`);
    }
  }

  console.log('');
  console.log('\x1b[36m--- FAQ (выбраны из банка) ---\x1b[0m');
  for (const q of faqQuestions) {
    console.log(`  #${q.num} [${q.category}] ${q.text}`);
  }

  console.log('');
  console.log('\x1b[36m--- CTA (уникальные тексты) ---\x1b[0m');
  usedCtas.forEach((cta, i) => console.log(`  ${i + 1}. ${cta}`));

  console.log('');
  console.log('\x1b[36m--- Перелинковка ---\x1b[0m');
  for (const [page, data] of Object.entries(linkingPlan.plan)) {
    console.log(`  /${page} → ${data.outgoing.join(', ')} (мин. ${data.min})`);
  }

  console.log('');
  console.log(`\x1b[32m✓ Сохранено: ${outputPath}\x1b[0m`);
  console.log('');
  console.log('  Следующий шаг: агент использует content-skeleton.json');
  console.log('  для генерации уникальных текстов проекта.');
  console.log(`  FAQ номера для REGISTRY.md: ${faqQuestions.map(q => q.num).join(', ')}`);
  console.log('');
}

main();
