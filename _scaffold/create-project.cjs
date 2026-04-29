#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const ROOT = path.resolve(__dirname, '..')
const REGISTRY = path.join(ROOT, 'REGISTRY.md')
const PROJECTS_DIR = path.join(ROOT, 'projects')

const BRANDS = {
	'1xbet': {
		name: '1xBet',
		keywords: [
			'1xbet казахстан',
			'1хбет кз',
			'1xbet скачать',
			'1xbet регистрация',
		],
		slots: [
			'sugar-rush',
			'sweet-bonanza',
			'gates-of-olympus',
			'dead-or-alive-2',
			'big-bass-bonanza',
			'book-of-dead',
			'the-dog-house',
			'sugar-rush-1000',
		],
	},
	pinup: {
		name: 'Pin-Up',
		keywords: ['pin-up казахстан', 'пин ап кз', 'pin up casino', 'пинап слоты'],
		slots: [
			'sweet-bonanza',
			'sugar-rush',
			'gates-of-olympus',
			'fruit-party',
			'starlight-princess',
			'madame-destiny-megaways',
			'great-rhino-megaways',
		],
	},
	mostbet: {
		name: 'Mostbet',
		keywords: [
			'mostbet казахстан',
			'мостбет кз',
			'mostbet скачать',
			'мостбет авиатор',
		],
		slots: [
			'sweet-bonanza',
			'gates-of-olympus',
			'sugar-rush',
			'fruit-party',
			'big-bass-splash',
			'reactoonz-2',
		],
	},
	'1win': {
		name: '1Win',
		keywords: ['1win казахстан', '1вин кз', '1win casino', '1win lucky jet'],
		slots: [
			'sweet-bonanza',
			'gates-of-olympus',
			'bananas-go-bahamas',
			'coin-strike',
			'rocket-queen',
		],
	},
	melbet: {
		name: 'Melbet',
		keywords: [
			'melbet казахстан',
			'мелбет кз',
			'melbet ставки',
			'мелбет скачать',
		],
		slots: ['sweet-bonanza', 'gates-of-olympus', 'sugar-rush'],
	},
}

const COLORS = [
	{ id: 'navy-gold', base: '#0a1628', accent: '#f59e0b', secondary: '#10b981' },
	{
		id: 'dark-emerald',
		base: '#041f1e',
		accent: '#10b981',
		secondary: '#fbbf24',
	},
	{
		id: 'midnight-red',
		base: '#0c0f1a',
		accent: '#ef4444',
		secondary: '#f8fafc',
	},
	{
		id: 'charcoal-orange',
		base: '#1a1a2e',
		accent: '#f97316',
		secondary: '#38bdf8',
	},
	{
		id: 'deep-purple',
		base: '#1a0533',
		accent: '#a855f7',
		secondary: '#ec4899',
	},
	{
		id: 'slate-cyan',
		base: '#0f172a',
		accent: '#06b6d4',
		secondary: '#22c55e',
	},
	{
		id: 'obsidian-amber',
		base: '#111318',
		accent: '#f59e0b',
		secondary: '#84cc16',
	},
	{
		id: 'carbon-lime',
		base: '#18181b',
		accent: '#84cc16',
		secondary: '#22d3ee',
	},
	{
		id: 'abyss-coral',
		base: '#0a0e17',
		accent: '#fb7185',
		secondary: '#2dd4bf',
	},
	{ id: 'iron-blue', base: '#111827', accent: '#3b82f6', secondary: '#fb923c' },
]

const FONTS = [
	'Inter',
	'Manrope',
	'Nunito Sans',
	'Source Sans 3',
	'PT Sans',
	'DM Sans',
	'Rubik',
	'Plus Jakarta Sans',
]

const VISUAL_STYLES = ['premium-encyclopedia', 'casino-glam', 'dark-premium']

/* ========================================================================
 * ЗАКОНСЕРВИРОВАНО — раньше использовалось для генерации мульти-форматных проектов.
 * Сейчас активен только формат H (Премиум-энциклопедия в стиле BC.Game).
 *
 * const STYLES = ['casual', 'analytical', 'enthusiast', 'skeptic'];
 * const VISUAL_STYLES_LEGACY = ['dark-premium', 'light-clean', 'sports-energy', 'brutalist', 'casino-glam', 'blog-personal'];
 * const CONTENT_FORMATS_LEGACY = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
 * ======================================================================== */

const REGIONS = {
	KZ: {
		name: 'Казахстан',
		currency: 'KZT',
		currencySymbol: '₸',
		currencyName: 'тенге',
		geoPlacename: 'Kazakhstan',
		cities: [
			'Алматы',
			'Астана',
			'Шымкент',
			'Караганда',
			'Актобе',
			'Тараз',
			'Павлодар',
			'Семей',
			'Атырау',
			'Костанай',
		],
		maleNames: [
			'Марат',
			'Даулет',
			'Ерлан',
			'Нурсултан',
			'Арман',
			'Тимур',
			'Руслан',
			'Алибек',
			'Бауыржан',
			'Данияр',
			'Азамат',
			'Кайрат',
			'Серик',
		],
		femaleNames: [
			'Айгерим',
			'Динара',
			'Жанна',
			'Мадина',
			'Камила',
			'Асель',
			'Алия',
			'Гульнара',
			'Дана',
			'Аружан',
		],
		surnames: [
			'Тулегенов',
			'Касымов',
			'Нурланов',
			'Ахметов',
			'Бекмуратов',
			'Сагындыков',
			'Жумабаев',
			'Оспанов',
			'Сулейменов',
			'Мухамедов',
			'Калиев',
		],
		femaleSurnames: [
			'Тулегенова',
			'Касымова',
			'Нурланова',
			'Ахметова',
			'Сагындыкова',
			'Калиева',
		],
	},
	UZ: {
		name: 'Узбекистан',
		currency: 'UZS',
		currencySymbol: 'сум',
		currencyName: 'сум',
		geoPlacename: 'Uzbekistan',
		cities: [
			'Ташкент',
			'Самарканд',
			'Бухара',
			'Наманган',
			'Андижан',
			'Фергана',
			'Нукус',
			'Карши',
			'Навои',
			'Термез',
		],
		maleNames: [
			'Бахтиёр',
			'Шерзод',
			'Азиз',
			'Жавохир',
			'Достон',
			'Отабек',
			'Бобур',
			'Улугбек',
			'Сардор',
			'Нодир',
			'Фаррух',
			'Ислом',
		],
		femaleNames: [
			'Дилноза',
			'Гулнора',
			'Зулфия',
			'Нигора',
			'Шахло',
			'Мадина',
			'Севара',
			'Камола',
			'Озода',
		],
		surnames: [
			'Каримов',
			'Рахимов',
			'Мирзаев',
			'Хасанов',
			'Юсупов',
			'Исмаилов',
			'Алимов',
			'Ташматов',
			'Нурматов',
			'Абдуллаев',
		],
		femaleSurnames: [
			'Каримова',
			'Рахимова',
			'Мирзаева',
			'Хасанова',
			'Юсупова',
			'Исмаилова',
		],
	},
	AZ: {
		name: 'Азербайджан',
		currency: 'AZN',
		currencySymbol: '₼',
		currencyName: 'манат',
		geoPlacename: 'Azerbaijan',
		cities: [
			'Баку',
			'Гянджа',
			'Сумгаит',
			'Мингячевир',
			'Ленкорань',
			'Ширван',
			'Нахичевань',
			'Шеки',
		],
		maleNames: [
			'Эльнур',
			'Руслан',
			'Орхан',
			'Турал',
			'Эмин',
			'Фарид',
			'Джавид',
			'Рашад',
			'Вугар',
			'Ильгар',
		],
		femaleNames: [
			'Айтен',
			'Гюнель',
			'Лейла',
			'Нармин',
			'Севиндж',
			'Айгюн',
			'Гюльнар',
			'Фидан',
		],
		surnames: [
			'Мамедов',
			'Алиев',
			'Гасанов',
			'Гусейнов',
			'Мустафаев',
			'Байрамов',
			'Ибрагимов',
			'Керимов',
		],
		femaleSurnames: [
			'Мамедова',
			'Алиева',
			'Гасанова',
			'Гусейнова',
			'Мустафаева',
			'Байрамова',
		],
	},
	KG: {
		name: 'Кыргызстан',
		currency: 'KGS',
		currencySymbol: 'сом',
		currencyName: 'сом',
		geoPlacename: 'Kyrgyzstan',
		cities: [
			'Бишкек',
			'Ош',
			'Джалал-Абад',
			'Каракол',
			'Токмок',
			'Балыкчы',
			'Нарын',
		],
		maleNames: [
			'Нурлан',
			'Бакыт',
			'Азамат',
			'Эрлан',
			'Тилек',
			'Канат',
			'Руслан',
			'Адилет',
			'Айбек',
			'Данияр',
		],
		femaleNames: [
			'Айзада',
			'Бегимай',
			'Нурай',
			'Айпери',
			'Жылдыз',
			'Элиза',
			'Бермет',
		],
		surnames: [
			'Жумабеков',
			'Асанов',
			'Токтосунов',
			'Жапаров',
			'Бекназаров',
			'Алиев',
			'Исаков',
		],
		femaleSurnames: ['Жумабекова', 'Асанова', 'Токтосунова', 'Жапарова'],
	},
	TJ: {
		name: 'Таджикистан',
		currency: 'TJS',
		currencySymbol: 'сомони',
		currencyName: 'сомони',
		geoPlacename: 'Tajikistan',
		cities: [
			'Душанбе',
			'Худжанд',
			'Бохтар',
			'Куляб',
			'Истаравшан',
			'Турсунзаде',
			'Пенджикент',
		],
		maleNames: [
			'Фирдавс',
			'Далер',
			'Шухрат',
			'Бахром',
			'Рустам',
			'Фаридун',
			'Комрон',
			'Джамшед',
		],
		femaleNames: ['Фируза', 'Манижа', 'Гулрухсор', 'Зебо', 'Шахло', 'Парвина'],
		surnames: [
			'Рахматуллоев',
			'Ашуров',
			'Каримов',
			'Назаров',
			'Саидов',
			'Зоиров',
		],
		femaleSurnames: ['Рахматуллоева', 'Ашурова', 'Каримова', 'Назарова'],
	},
	BY: {
		name: 'Беларусь',
		currency: 'BYN',
		currencySymbol: 'Br',
		currencyName: 'белорусский рубль',
		geoPlacename: 'Belarus',
		cities: [
			'Минск',
			'Гомель',
			'Могилёв',
			'Витебск',
			'Гродно',
			'Брест',
			'Бобруйск',
		],
		maleNames: [
			'Александр',
			'Дмитрий',
			'Сергей',
			'Андрей',
			'Николай',
			'Павел',
			'Кирилл',
			'Максим',
			'Иван',
			'Артём',
		],
		femaleNames: [
			'Анастасия',
			'Екатерина',
			'Ольга',
			'Мария',
			'Дарья',
			'Виктория',
			'Алина',
		],
		surnames: [
			'Козлов',
			'Новиков',
			'Лукашевич',
			'Бондаренко',
			'Василевский',
			'Морозов',
			'Петрович',
		],
		femaleSurnames: [
			'Козлова',
			'Новикова',
			'Лукашевич',
			'Бондаренко',
			'Морозова',
		],
	},
	UA: {
		name: 'Украина',
		currency: 'UAH',
		currencySymbol: '₴',
		currencyName: 'гривна',
		geoPlacename: 'Ukraine',
		cities: [
			'Киев',
			'Харьков',
			'Одесса',
			'Днепр',
			'Львов',
			'Запорожье',
			'Кривой Рог',
			'Николаев',
		],
		maleNames: [
			'Олександр',
			'Дмитро',
			'Богдан',
			'Артем',
			'Тарас',
			'Назар',
			'Руслан',
			'Влад',
		],
		femaleNames: ['Оксана', 'Яна', 'Марія', 'Юлія', 'Аліна', 'Дарина', 'Софія'],
		surnames: [
			'Шевченко',
			'Бондаренко',
			'Ковальчук',
			'Мельник',
			'Коваленко',
			'Ткаченко',
			'Кравченко',
		],
		femaleSurnames: [
			'Шевченко',
			'Бондаренко',
			'Ковальчук',
			'Мельник',
			'Коваленко',
		],
	},
	RU: {
		name: 'Россия',
		currency: 'RUB',
		currencySymbol: '₽',
		currencyName: 'рубль',
		geoPlacename: 'Russia',
		cities: [
			'Москва',
			'Санкт-Петербург',
			'Новосибирск',
			'Екатеринбург',
			'Казань',
			'Нижний Новгород',
			'Челябинск',
			'Самара',
			'Ростов-на-Дону',
			'Уфа',
		],
		maleNames: [
			'Александр',
			'Дмитрий',
			'Максим',
			'Артём',
			'Иван',
			'Михаил',
			'Кирилл',
			'Никита',
			'Андрей',
			'Сергей',
		],
		femaleNames: [
			'Анастасия',
			'Мария',
			'Дарья',
			'Елена',
			'Ольга',
			'Екатерина',
			'Алина',
			'Татьяна',
		],
		surnames: [
			'Иванов',
			'Петров',
			'Смирнов',
			'Кузнецов',
			'Попов',
			'Волков',
			'Козлов',
			'Новиков',
			'Морозов',
			'Лебедев',
		],
		femaleSurnames: [
			'Иванова',
			'Петрова',
			'Смирнова',
			'Кузнецова',
			'Попова',
			'Волкова',
			'Козлова',
		],
	},
	MD: {
		name: 'Молдова',
		currency: 'MDL',
		currencySymbol: 'лей',
		currencyName: 'лей',
		geoPlacename: 'Moldova',
		cities: [
			'Кишинёв',
			'Бельцы',
			'Тирасполь',
			'Бендеры',
			'Кагул',
			'Комрат',
			'Унгень',
		],
		maleNames: [
			'Ион',
			'Василий',
			'Дмитрий',
			'Андрей',
			'Александру',
			'Николай',
			'Михай',
			'Виорел',
			'Раду',
			'Дорин',
		],
		femaleNames: [
			'Мария',
			'Анна',
			'Елена',
			'Кристина',
			'Наталья',
			'Людмила',
			'Алина',
			'Виктория',
		],
		surnames: [
			'Попеску',
			'Кожокару',
			'Морару',
			'Ротару',
			'Чеботарь',
			'Руссу',
			'Бодиштяну',
			'Мунтяну',
			'Кику',
			'Лунгу',
		],
		femaleSurnames: [
			'Попеску',
			'Кожокару',
			'Морару',
			'Ротару',
			'Чеботарь',
			'Руссу',
			'Лунгу',
		],
	},
}

const PAGE_SLUGS = {
	registraciya: [
		'registraciya',
		'sozdat-akkaunt',
		'nachalo-raboty',
		'otkryt-schet',
	],
	skachat: ['skachat', 'prilozhenie', 'mobile-app', 'ustanovka'],
	casino: ['casino', 'igrovye-avtomaty', 'onlajn-kazino', 'slots-i-igry'],
	zerkalo: ['zerkalo', 'dostup', 'rabochij-sajt', 'alternativnyj-vhod'],
	'lichnyy-kabinet': ['lichnyy-kabinet', 'vhod', 'moj-profil', 'akkaunt'],
	bonus: ['bonus', 'akcii', 'podarki', 'privetstvennye-bonusy'],
	partnerskaya: ['partnerskaya-programma', 'zarabotok', 'affiliate'],
}

function pick(arr) {
	return arr[Math.floor(Math.random() * arr.length)]
}
function pickN(arr, n) {
	const shuffled = [...arr].sort(() => Math.random() - 0.5)
	return shuffled.slice(0, n)
}

function getUsedFromRegistry() {
	const used = { colors: [], fonts: [], authors: [], cities: [], presets: [] }
	if (!fs.existsSync(REGISTRY)) return used
	const content = fs.readFileSync(REGISTRY, 'utf-8')
	for (const line of content.split('\n')) {
		if (
			line.startsWith('| ') &&
			!line.startsWith('| #') &&
			!line.startsWith('|---')
		) {
			const cells = line
				.split('|')
				.map(c => c.trim())
				.filter(Boolean)
			if (cells.length >= 12) {
				if (cells[5]) used.colors.push(cells[5])
				if (cells[6]) used.fonts.push(cells[6])
				if (cells[9]) used.authors.push(cells[9])
				if (cells[10]) used.cities.push(cells[10])
			}
		}
		const presetMatch = line.match(/\[ \]\s+(\d+)\s+—/)
		if (presetMatch) used.presets.push(parseInt(presetMatch[1]))
	}
	return used
}

function getNextProjectNum(brandKey) {
	const brandDir = path.join(PROJECTS_DIR, brandKey)
	if (!fs.existsSync(brandDir)) return 1
	const dirs = fs.readdirSync(brandDir).filter(d => d.startsWith('project_'))
	const nums = dirs
		.map(d => parseInt(d.replace('project_', '')))
		.filter(n => !isNaN(n))
	return nums.length > 0 ? Math.max(...nums) + 1 : 1
}

function generateConfig(brandKey, regionCode) {
	const brand = BRANDS[brandKey]
	const region = REGIONS[regionCode] || REGIONS['KZ']
	const used = getUsedFromRegistry()
	const projectNum = getNextProjectNum(brandKey)

	const availableColors = COLORS.filter(c => !used.colors.includes(c.id))
	const color =
		availableColors.length > 0 ? pick(availableColors) : pick(COLORS)

	const availableFonts = FONTS.filter(f => !used.fonts.includes(f))
	const font = availableFonts.length > 0 ? pick(availableFonts) : pick(FONTS)

	const numPages = 4 + Math.floor(Math.random() * 3)
	const pageTypes = Object.keys(PAGE_SLUGS)
	const selectedPageTypes = pickN(pageTypes, numPages)
	const pages = [
		'index',
		...selectedPageTypes.map(pt => pick(PAGE_SLUGS[pt])),
		'about',
	]

	const numSlots = 2 + Math.floor(Math.random() * 2)
	const slots = pickN(brand.slots, numSlots)

	const freePresets = []
	for (let i = 1; i <= 15; i++) {
		if (!used.presets.includes(i)) freePresets.push(i)
	}
	const preset = freePresets.length > 0 ? freePresets[0] : null

	const domainPrefixes = [
		`${brandKey}-obzor`,
		`${brandKey}-kz-guide`,
		`${brandKey}-stavki`,
		`${brandKey}-kazahstan`,
		`${brandKey}-kz`,
		`${brandKey}-bonus`,
		`review-${brandKey}`,
		`${brandKey}-info`,
		`guide-${brandKey}`,
	]
	const domainSuffixes = ['.kz', '.com', '.info', '.site']
	const domain = pick(domainPrefixes) + pick(domainSuffixes)

	const visualStyle = pick(VISUAL_STYLES)
	const primaryBonusPercent = pick([100, 150, 180, 200, 220, 250, 300])
	const freespins = pick([50, 100, 150, 200, 250])
	const totalBonusPercent = primaryBonusPercent * pick([4, 5, 6])

	const config = {
		brand: brand.name,
		region: regionCode,
		language: 'ru',
		domain,
		affiliate_url: '#',
		color_preset: color.id,
		visual_style: visualStyle,
		content_format: 'H',
		preset_number: preset,
		font,
		logo_type: pick(['A', 'B', 'C', 'D', 'E', 'F']),
		pages,
		slot_pages: slots,
		sections_order: 'fixed',
		seo: {
			primary_keyword: brand.keywords[0]
				.replace('казахстан', region.name.toLowerCase())
				.replace('кз', regionCode.toLowerCase()),
			secondary_keywords: brand.keywords
				.slice(1)
				.map(k => k.replace('кз', regionCode.toLowerCase())),
			geo_target: regionCode,
		},
		bonus: {
			primary_percent: primaryBonusPercent,
			max_amount: `до ${(primaryBonusPercent * 1000).toLocaleString('ru-RU')} ${region.currencySymbol || '₸'}`,
			freespins,
			first_n_deposits_total_percent: totalBonusPercent,
			wager: pick(['x35', 'x40', 'x45']),
		},
		noindex: false,
	}

	return { config, projectNum, brandKey }
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})
const ask = q => new Promise(r => rl.question(q, r))

async function main() {
	console.log('')
	console.log('\x1b[1m=== Генератор project.config.json ===\x1b[0m')
	console.log('')

	const brandKeys = Object.keys(BRANDS)
	console.log('Доступные бренды:')
	brandKeys.forEach((k, i) =>
		console.log(`  ${i + 1}. ${BRANDS[k].name} (${k})`),
	)
	console.log('')

	const brandInput = await ask('Выбери бренд (номер или название): ')
	let brandKey
	const num = parseInt(brandInput)
	if (num >= 1 && num <= brandKeys.length) {
		brandKey = brandKeys[num - 1]
	} else {
		brandKey = brandInput.toLowerCase().replace(/[-\s]/g, '')
		if (!BRANDS[brandKey]) {
			console.log('\x1b[31mБренд не найден\x1b[0m')
			rl.close()
			return
		}
	}

	console.log('')
	const regionKeys = Object.keys(REGIONS)
	console.log('Доступные регионы:')
	regionKeys.forEach((k, i) =>
		console.log(
			`  ${i + 1}. ${REGIONS[k].name} (${k}) — ${REGIONS[k].currency}`,
		),
	)
	console.log('')

	const regionInput = await ask('Выбери регион (номер или код): ')
	let regionCode
	const rNum = parseInt(regionInput)
	if (rNum >= 1 && rNum <= regionKeys.length) {
		regionCode = regionKeys[rNum - 1]
	} else {
		regionCode = regionInput.toUpperCase()
		if (!REGIONS[regionCode]) {
			console.log('\x1b[31mРегион не найден\x1b[0m')
			rl.close()
			return
		}
	}

	console.log('')
	console.log(`Бренд: \x1b[33m${BRANDS[brandKey].name}\x1b[0m`)
	console.log(
		`Регион: \x1b[36m${REGIONS[regionCode].name}\x1b[0m (${regionCode}, ${REGIONS[regionCode].currency})`,
	)
	console.log('Генерирую конфиг...')
	console.log('')

	const { config, projectNum } = generateConfig(brandKey, regionCode)
	const projectPath = path.join(PROJECTS_DIR, brandKey, `project_${projectNum}`)

	console.log('\x1b[36m--- Сгенерированный конфиг ---\x1b[0m')
	console.log('')
	console.log(`  Домен:    ${config.domain}`)
	console.log(
		`  Формат:   \x1b[36mH (Премиум-энциклопедия в стиле BC.Game)\x1b[0m`,
	)
	console.log(`  Стиль:    \x1b[35m${config.visual_style}\x1b[0m`)
	console.log(`  Цвет:     ${config.color_preset}`)
	console.log(`  Шрифт:    ${config.font}`)
	console.log(`  Лого:     тип ${config.logo_type}`)
	console.log(`  Пресет:   #${config.preset_number}`)
	console.log(
		`  Бонус:    \x1b[33m${config.bonus.primary_percent}%\x1b[0m на 1-й депозит, ${config.bonus.freespins} фриспинов, до ${config.bonus.first_n_deposits_total_percent}% за 4 депозита`,
	)
	console.log(`  Страницы: ${config.pages.join(', ')}`)
	console.log(`  Слоты:    ${config.slot_pages.join(', ')}`)
	console.log(`  Путь:     ${projectPath}`)
	console.log('')

	const confirm = await ask('Сохранить? (y/n): ')
	if (confirm.toLowerCase() !== 'y') {
		console.log('Отменено.')
		rl.close()
		return
	}

	fs.mkdirSync(projectPath, { recursive: true })
	fs.writeFileSync(
		path.join(projectPath, 'project.config.json'),
		JSON.stringify(config, null, 2),
	)

	console.log('')
	console.log(
		`\x1b[32m✓ Конфиг сохранён: ${projectPath}/project.config.json\x1b[0m`,
	)
	console.log('')
	console.log('Следующий шаг:')
	console.log(`  Скинь картинки слотов: ${config.slot_pages.join(', ')}`)
	console.log(`  Затем запусти генерацию проекта`)

	rl.close()
}

main()
