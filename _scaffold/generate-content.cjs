#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const YEAR = new Date().getFullYear()

function resolveRegionCode(input) {
	if (!input) return 'KZ'
	const upper = input.toUpperCase()
	if (upper.length <= 3) return upper
	const nameMap = {
		казахстан: 'KZ',
		узбекистан: 'UZ',
		азербайджан: 'AZ',
		кыргызстан: 'KG',
		таджикистан: 'TJ',
		беларусь: 'BY',
		украина: 'UA',
		россия: 'RU',
		молдова: 'MD',
	}
	return nameMap[input.toLowerCase()] || 'KZ'
}

const REGION_DATA = {
	KZ: {
		name: 'Казахстан',
		currency: 'тенге',
		currencyCode: 'KZT',
		currencySymbol: '₸',
		bonus: '220 000 ₸',
		minDeposit: '1 000 ₸',
		banks: ['Kaspi', 'Halyk', 'Jusan'],
		mainBank: 'Kaspi',
		providers: ['Kcell', 'Beeline KZ', 'Altel'],
		league: 'КПЛ',
		clubs: ['Астана', 'Кайрат', 'Барыс'],
		docId: 'ИИН',
		geoRegion: 'KZ',
		geoPlacename: 'Kazakhstan',
	},
	UZ: {
		name: 'Узбекистан',
		currency: 'сум',
		currencyCode: 'UZS',
		currencySymbol: 'сум',
		bonus: '11 000 000 сум',
		minDeposit: '50 000 сум',
		banks: ['Uzcard', 'Humo', 'Kapitalbank'],
		mainBank: 'Uzcard',
		providers: ['Ucell', 'Beeline UZ', 'Uzmobile'],
		league: 'Суперлига Узбекистана',
		clubs: ['Пахтакор', 'Бунёдкор', 'Насаф'],
		docId: 'ПИНФЛ',
		geoRegion: 'UZ',
		geoPlacename: 'Uzbekistan',
	},
	AZ: {
		name: 'Азербайджан',
		currency: 'манат',
		currencyCode: 'AZN',
		currencySymbol: '₼',
		bonus: '550 ₼',
		minDeposit: '5 ₼',
		banks: ['Kapital Bank', 'PASHA', 'ABB'],
		mainBank: 'Kapital Bank',
		providers: ['Azercell', 'Bakcell', 'Nar'],
		league: 'Премьер-лига Азербайджана',
		clubs: ['Карабах', 'Нефтчи', 'Габала'],
		docId: 'ФИН',
		geoRegion: 'AZ',
		geoPlacename: 'Azerbaijan',
	},
	KG: {
		name: 'Кыргызстан',
		currency: 'сом',
		currencyCode: 'KGS',
		currencySymbol: 'сом',
		bonus: '110 000 сом',
		minDeposit: '500 сом',
		banks: ['Оптима', 'KICB', 'MBank'],
		mainBank: 'Оптима',
		providers: ['Megacom', 'Beeline KG', 'O!'],
		league: 'Премьер-лига Кыргызстана',
		clubs: ['Дордой', 'Абдыш-Ата'],
		docId: 'ИНН',
		geoRegion: 'KG',
		geoPlacename: 'Kyrgyzstan',
	},
	TJ: {
		name: 'Таджикистан',
		currency: 'сомони',
		currencyCode: 'TJS',
		currencySymbol: 'сомони',
		bonus: '11 000 сомони',
		minDeposit: '50 сомони',
		banks: ['Амонатбонк', 'Ориёнбонк', 'Eskhata'],
		mainBank: 'Амонатбонк',
		providers: ['Tcell', 'Megafon TJ', 'Babilon-M'],
		league: 'Высшая лига Таджикистана',
		clubs: ['Истиклол', 'Худжанд'],
		docId: 'ИНН',
		geoRegion: 'TJ',
		geoPlacename: 'Tajikistan',
	},
	BY: {
		name: 'Беларусь',
		currency: 'белорусский рубль',
		currencyCode: 'BYN',
		currencySymbol: 'Br',
		bonus: '550 Br',
		minDeposit: '5 Br',
		banks: ['Беларусбанк', 'Приорбанк', 'Альфа-Банк BY'],
		mainBank: 'Беларусбанк',
		providers: ['A1', 'life:)'],
		league: 'Высшая лига Беларуси',
		clubs: ['БАТЭ', 'Динамо Минск', 'Шахтёр Солигорск'],
		docId: 'идентификационный номер',
		geoRegion: 'BY',
		geoPlacename: 'Belarus',
	},
	UA: {
		name: 'Украина',
		currency: 'гривна',
		currencyCode: 'UAH',
		currencySymbol: '₴',
		bonus: '9 000 ₴',
		minDeposit: '100 ₴',
		banks: ['Приватбанк', 'Монобанк', 'Ощадбанк'],
		mainBank: 'Приватбанк',
		providers: ['Київстар', 'Vodafone UA', 'lifecell'],
		league: 'УПЛ',
		clubs: ['Шахтёр', 'Динамо Киев', 'Заря'],
		docId: 'ИНН',
		geoRegion: 'UA',
		geoPlacename: 'Ukraine',
	},
	RU: {
		name: 'Россия',
		currency: 'рубль',
		currencyCode: 'RUB',
		currencySymbol: '₽',
		bonus: '32 500 ₽',
		minDeposit: '100 ₽',
		banks: ['Сбербанк', 'Тинькофф', 'Альфа-Банк'],
		mainBank: 'Сбербанк',
		providers: ['МТС', 'Мегафон', 'Билайн'],
		league: 'РПЛ',
		clubs: ['Зенит', 'Спартак', 'ЦСКА'],
		docId: 'СНИЛС',
		geoRegion: 'RU',
		geoPlacename: 'Russia',
	},
	MD: {
		name: 'Молдова',
		currency: 'лей',
		currencyCode: 'MDL',
		currencySymbol: 'лей',
		bonus: '4 500 лей',
		minDeposit: '50 лей',
		banks: ['MAIB', 'Moldindconbank', 'Victoriabank'],
		mainBank: 'MAIB',
		providers: ['Orange MD', 'Moldcell', 'Unite'],
		league: 'Национальный дивизион Молдовы',
		clubs: ['Шериф', 'Петрокуб', 'Милсами'],
		docId: 'IDNP',
		geoRegion: 'MD',
		geoPlacename: 'Moldova',
	},
}

function pick(arr) {
	return arr[Math.floor(Math.random() * arr.length)]
}
function pickN(arr, n) {
	const shuffled = [...arr].sort(() => Math.random() - 0.5)
	return shuffled.slice(0, Math.min(n, arr.length))
}

const BRANDS = {
	'1xBet': {
		type: 'ставки + казино',
		accent: 'широкая линия, live-ставки, мобильное приложение, крипто, 1xGames',
		sports: [
			'Футбол (КПЛ, АПЛ, Ла Лига)',
			'Хоккей (НХЛ, КХЛ, «Барыс»)',
			'Теннис (ATP, WTA)',
			'Баскетбол (НБА, Евролига)',
			'Киберспорт (CS2, Dota 2)',
			'Бокс и MMA',
		],
		crashGames: ['Aviator', 'JetX', 'Crazy Time', 'Lightning Roulette'],
		exclusive: '1xGames (Crash, Crystal, Dice, Plinko)',
		providers: [
			'Pragmatic Play',
			'NetEnt',
			"Play'n GO",
			'Evolution',
			'Microgaming',
		],
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
	Mostbet: {
		type: 'ставки + казино',
		accent: 'высокие коэффициенты, экспресс-бонусы, покер, Aviator',
		sports: [
			'Футбол (КПЛ, АПЛ, Бундеслига)',
			'Теннис',
			'Хоккей (КХЛ, НХЛ)',
			'Баскетбол',
			'Киберспорт',
		],
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
		sports: [
			'Футбол',
			'Теннис',
			'Баскетбол',
			'Киберспорт (CS2, Dota 2, Valorant)',
		],
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
	Melbet: {
		type: 'ставки (спорт-фокус)',
		accent: 'спорт, высокие коэффициенты, live-ставки, экспрессы',
		sports: [
			'Футбол (КПЛ, АПЛ, Серия А, Ла Лига)',
			'Хоккей',
			'Теннис',
			'Баскетбол',
			'Бокс',
			'Киберспорт',
		],
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
}

const SLUG_TO_TYPE = {
	index: 'index',
	about: 'about',
	404: '404',
	registraciya: 'registration',
	'sozdat-akkaunt': 'registration',
	'nachalo-raboty': 'registration',
	'otkryt-schet': 'registration',
	skachat: 'download',
	prilozhenie: 'download',
	'mobile-app': 'download',
	ustanovka: 'download',
	casino: 'casino',
	'igrovye-avtomaty': 'casino',
	'onlajn-kazino': 'casino',
	'slots-i-igry': 'casino',
	zerkalo: 'mirror',
	dostup: 'mirror',
	'rabochij-sajt': 'mirror',
	'alternativnyj-vhod': 'mirror',
	'lichnyy-kabinet': 'account',
	vhod: 'account',
	'moj-profil': 'account',
	akkaunt: 'account',
	bonus: 'bonus',
	akcii: 'bonus',
	podarki: 'bonus',
	'privetstvennye-bonusy': 'bonus',
	'partnerskaya-programma': 'affiliate',
	zarabotok: 'affiliate',
	affiliate: 'affiliate',
}

const SLOT_DATA = {
	'sugar-rush': {
		name: 'Sugar Rush',
		rtp: '96.50%',
		maxWin: '×5 000',
		provider: 'Pragmatic Play',
	},
	'sweet-bonanza': {
		name: 'Sweet Bonanza',
		rtp: '96.48%',
		maxWin: '×21 175',
		provider: 'Pragmatic Play',
	},
	'gates-of-olympus': {
		name: 'Gates of Olympus',
		rtp: '96.50%',
		maxWin: '×5 000',
		provider: 'Pragmatic Play',
	},
	'dead-or-alive-2': {
		name: 'Dead or Alive 2',
		rtp: '96.82%',
		maxWin: '×111 111',
		provider: 'NetEnt',
	},
	'big-bass-bonanza': {
		name: 'Big Bass Bonanza',
		rtp: '96.71%',
		maxWin: '×2 100',
		provider: 'Pragmatic Play',
	},
	'big-bass-splash': {
		name: 'Big Bass Splash',
		rtp: '96.71%',
		maxWin: '×2 100',
		provider: 'Pragmatic Play',
	},
	'book-of-dead': {
		name: 'Book of Dead',
		rtp: '96.21%',
		maxWin: '×5 000',
		provider: "Play'n GO",
	},
	'the-dog-house': {
		name: 'The Dog House',
		rtp: '96.51%',
		maxWin: '×6 750',
		provider: 'Pragmatic Play',
	},
	'sugar-rush-1000': {
		name: 'Sugar Rush 1000',
		rtp: '96.53%',
		maxWin: '×25 000',
		provider: 'Pragmatic Play',
	},
	'fruit-party': {
		name: 'Fruit Party',
		rtp: '96.47%',
		maxWin: '×5 000',
		provider: 'Pragmatic Play',
	},
	'starlight-princess': {
		name: 'Starlight Princess',
		rtp: '96.50%',
		maxWin: '×5 000',
		provider: 'Pragmatic Play',
	},
	'madame-destiny-megaways': {
		name: 'Madame Destiny Megaways',
		rtp: '96.56%',
		maxWin: '×5 000',
		provider: 'Pragmatic Play',
	},
	'great-rhino-megaways': {
		name: 'Great Rhino Megaways',
		rtp: '96.58%',
		maxWin: '×20 000',
		provider: 'Pragmatic Play',
	},
	'bananas-go-bahamas': {
		name: 'Bananas go Bahamas',
		rtp: '96.10%',
		maxWin: '×9 000',
		provider: 'Novomatic',
	},
	'coin-strike': {
		name: 'Coin Strike',
		rtp: '96.00%',
		maxWin: '×2 580',
		provider: 'SmartSoft',
	},
	'rocket-queen': {
		name: 'Rocket Queen',
		rtp: '96.20%',
		maxWin: '×10 000',
		provider: '1Win Games',
	},
	'reactoonz-2': {
		name: 'Reactoonz 2',
		rtp: '96.20%',
		maxWin: '×5 083',
		provider: "Play'n GO",
	},
}

const CTA_BANK = {
	registration: [
		'Забрать бонус на старте',
		'Открыть аккаунт за 2 минуты',
		'Зарегистрироваться с бонусом',
		'Создать профиль в KZT',
		'Начать с приветственным пакетом',
		'Получить фрибет на первый депозит',
	],
	casino: [
		'Играть с бонусом',
		'Запустить слот бесплатно',
		'Попробовать в демо-режиме',
		'Открыть казино с бонусом',
		'Крутить с фриспинами',
		'Испытать удачу',
	],
	sports: [
		'Сделать первую ставку',
		'Ставить на КПЛ',
		'Получить фрибет',
		'Начать со ставок на спорт',
	],
	app: [
		'Скачать APK бесплатно',
		'Установить приложение',
		'Загрузить на Android',
		'Перейти на рабочее зеркало',
		'Открыть через зеркало',
	],
	account: [
		'Войти в личный кабинет',
		'Авторизоваться',
		'Управлять ставками',
		'Открыть личный кабинет',
	],
	final: [
		'Готовы попробовать?',
		'Начните прямо сейчас',
		'Ваш аккаунт ждёт',
		'Пора действовать',
		'Не откладывайте',
	],
}

const FORMAT_NOTES = {
	H: {
		name: 'Премиум-энциклопедия (BC.Game-стиль)',
		voice:
			'3-е лицо платформы + обращение «вы»: «{brand} предлагает...», «Вы можете легко пополнить счёт через...»',
		about_type:
			'О платформе — описание {brand}, лицензии, методология обзоров, партнёрка, ответственная игра',
		has_author: false,
		h2_style:
			'Энциклопедические: «Что такое {brand}?», «Популярные игры казино», «Как получить бонус 200%», «Регистрация на {brand}», «Бонусы {brand}», «Способы оплаты», «Вывод средств», «{brand} — лицензии и безопасность», «Процесс верификации», «Приложения {brand}», «Поддержка {brand}», «FAQ»',
		cta_style:
			'Маркетинговые: «Зарегистрируйтесь сейчас», «Заберите бонус 200%», «Скачать приложение», «Сделать первую ставку», «Начать играть»',
		faq_style:
			'Развёрнутые, энциклопедические — 3-6 предложений на ответ, с конкретными цифрами и инструкциями',
		forbidden:
			'1-е лицо («я», «мне», «лично»), разговорные вставки («ну», «короче», «ладно»), субъективные оценки, короткие абзацы из 1 предложения, главная меньше 3000 слов, меньше 12 H2-секций, меньше 15 заглушек',
		main_words: '3000-4000',
		sub_words: '1500-2500',
		slot_words: '1200-1800',
		main_h2_min: 12,
		main_h2_max: 15,
		main_images_min: 15,
		main_images_max: 20,
		sub_images_min: 8,
		sub_images_max: 12,
		promo_banner_repeats: '5-7 раз на главной, после каждых 2-3 секций',
		extras: [
			'Сводная таблица параметров с эмодзи-маркерами в Hero (✅📃🎮🃏🎲🎰🔢🎁💳💰⌛📱📞)',
			'Таблица VIP-уровней или таблица бонусов на 4 депозита где-то на главной',
			'Numbered list для пошаговых инструкций (4-7 шагов)',
			'Bullet list для способов оплаты, преимуществ, security features',
			'Бейджи доверия: «Проверено», «Использовано N минут назад», «Подробнее»',
			'Кнопки скачивания Android + iOS под каждым промо-баннером',
			'Финальный блок с рейтингом 4.9/5',
		],
		main_sections_order: [
			'Hero',
			'PlatformOverviewTable',
			'WhatIsBrand',
			'PromoBanner_1',
			'PopularGames',
			'PopularSports',
			'PromoBanner_2',
			'HowToGetBonus',
			'Registration',
			'Bonuses',
			'PromoBanner_3',
			'Deposit',
			'PaymentMethods',
			'PromoBanner_4',
			'Withdrawal',
			'LicensesSecurity',
			'Verification',
			'Apps',
			'PromoBanner_5',
			'Support',
			'FAQ',
			'FinalCTA',
		],
	},
	/* ========================================================================
   * ЗАКОНСЕРВИРОВАННЫЕ ФОРМАТЫ A-G — НЕ ИСПОЛЬЗУЮТСЯ
   * ========================================================================
   * Раньше у нас было 7 форматов контента. После анализа конкурента
   * bc-game-brazil.com решено все новые проекты делать только в формате H.
   * Объекты ниже сохранены закомментированными — на случай возврата
   * к мульти-форматной генерации.
   *
  A: {
    name: 'Авторский блог',
    voice: '1-е лицо, персона-автор',
    about_type: 'Об авторе — биография, опыт, город',
    has_author: true,
    h2_style: 'Личные, субъективные: «Мой опыт с...», «Что нравится и что бесит»',
    cta_style: 'Рекомендательные: «Забрать бонус», «Попробовать самому»',
    faq_style: 'Разговорный тон, от первого лица',
    forbidden: 'Корпоративный язык, «мы предлагаем», «платформа обеспечивает»',
    main_words: '1000-1400',
    sub_words: '500-800',
  },
  B: {
    name: 'Корпоративная платформа',
    voice: 'От компании: «мы предлагаем», «наши клиенты», эмодзи в H2 допустимы',
    about_type: 'О платформе — история, лицензия, ответственная игра',
    has_author: false,
    h2_style: 'Официальные: «Почему выбирают {brand}», «Преимущества платформы», эмодзи допустимы',
    cta_style: 'Продающие: «Регистрация», «Получить бонус», «Начать игру»',
    faq_style: 'Профессиональный, 3-е лицо',
    forbidden: '«Я», личные истории, субъективные оценки, «лично мне не зашло»',
    main_words: '1000-1400',
    sub_words: '500-800',
    extras: 'Промокод как центральный элемент, бейджи-цифры (25M+, 1000+)',
  },
  C: {
    name: 'Информационный портал',
    voice: '3-е лицо: «контора предлагает», «платформа обеспечивает»',
    about_type: 'О редакции / О портале',
    has_author: false,
    h2_style: 'Информационные: «Обзор БК {brand}», «Способы финансовых операций»',
    cta_style: 'Нейтральные: «Перейти на официальный сайт», «Узнать подробнее»',
    faq_style: 'Длинные подробные ответы, энциклопедический',
    forbidden: 'Разговорный тон, «ну», «короче», эмоциональные оценки',
    main_words: '1500-2000',
    sub_words: '800-1200',
  },
  D: {
    name: 'Обзорный сайт с дисклеймерами',
    voice: 'Дистанцированный: «по данным из открытых источников», «согласно отзывам»',
    about_type: 'Дисклеймер: НЕ официальный сайт, НЕ зеркало, НЕ проводит операции',
    has_author: false,
    h2_style: 'Осторожные: «Информация о регистрации», «Обзор бонусной программы (по данным обзоров)»',
    cta_style: 'Мягкие: «Посетить официальный сайт», «Узнать актуальные условия»',
    faq_style: 'Осторожный, со ссылками на источники',
    forbidden: 'Прямые утверждения, гарантии, «лучший», «мы предлагаем»',
    main_words: '1000-1400',
    sub_words: '500-800',
    extras: 'Дисклеймер 💡/⚠️ после КАЖДОГО информационного блока',
  },
  E: {
    name: 'Лендинг-витрина',
    voice: 'Маркетинговый, короткий: «Начать», «Скачать», «Получить»',
    about_type: 'Минимальный: 1 экран, лицензия + ответственная игра',
    has_author: false,
    h2_style: 'Короткие с глаголами: «Ставки на любой вид спорта», «Четыре шага до первой ставки»',
    cta_style: 'МНОГО. Каждая секция = CTA. «Начать играть», «Сделать ставку»',
    faq_style: 'Краткие ответы, 1-2 предложения',
    forbidden: 'Длинные абзацы (>3 предложений), аналитика, рассуждения',
    main_words: '600-900',
    sub_words: '300-500',
    extras: 'Карточки как основа контента. Step-by-step flow. Минимум текста',
  },
  F: {
    name: 'Гайд/Туториал',
    voice: 'Обучающий: «чтобы зарегистрироваться, выполните...», «на этом шаге нужно...»',
    about_type: 'О проекте — обучающий ресурс, команда',
    has_author: false,
    h2_style: 'Инструкционные: «Как зарегистрироваться — пошагово», «Инструкция: вывод на Kaspi»',
    cta_style: 'Утилитарные: «Перейти к регистрации», «Скачать приложение»',
    faq_style: 'Технический, чёткие ответы',
    forbidden: 'Мнения, эмоции, «мне понравилось», оценочные суждения',
    main_words: '1000-1400',
    sub_words: '500-800',
  },
  G: {
    name: 'Агрегатор/сравнение',
    voice: 'Аналитический: «по совокупности параметров», оценки X/5',
    about_type: 'Об аналитической команде',
    has_author: false,
    h2_style: 'Сравнительные: «{brand} vs Mostbet: сравнение для KZ», «Рейтинг бонусов»',
    cta_style: 'Аналитические: «Сравнить условия», «Посмотреть рейтинг»',
    faq_style: 'Фактический, со ссылками на данные',
    forbidden: 'Явная предвзятость, «однозначно лучший» без доказательств',
    main_words: '1000-1400',
    sub_words: '500-800',
    extras: 'Таблицы сравнения + рейтинги как основа',
  },
   * ====================================================================== */
}

const STYLE_NOTES = {
	casual: {
		tone: 'разговорный, расслабленный',
		paragraphs: 'короткие (2-3 предложения)',
		markers:
			'много вставок «ну», «вот», «короче», незаконченные мысли, эмоциональные реплики',
		example:
			'«Скачал APK, весит мегабайт 40 — нормально. На Samsung A54 встало без проблем.»',
	},
	analytical: {
		tone: 'структурированный, с данными и цифрами',
		paragraphs: 'средние (4-5 предложений), с таблицами и сравнениями',
		markers:
			'конкретные числа, проценты, сравнения, «по моим замерам», «если судить по статистике»',
		example:
			'«Маржа на КПЛ — 4.5-5%. На топ-матчи АПЛ — 3.2%. Это средний показатель для СНГ-конторы.»',
	},
	enthusiast: {
		tone: 'эмоциональный, увлечённый',
		paragraphs: 'средние, с личными историями',
		markers:
			'восклицания (но не в каждом предложении), «это просто огонь», «честно — офигел», рекомендации друзьям',
		example:
			'«Поставил экспресс из 5 событий на КПЛ — зашёл! 15 000 тенге превратились в 120 тысяч!»',
	},
	skeptic: {
		tone: 'осторожный, критичный',
		paragraphs: 'средние, с оговорками и предупреждениями',
		markers:
			'много минусов, «но не уверен», «время покажет», осторожные рекомендации «попробовать можно, но...»',
		example:
			'«Бонус выглядит щедро, но вейджер ×35 — это жёстко. Отыграть реально, но непросто.»',
	},
}

function parseFaqBank() {
	const faqPath = path.join(ROOT, 'docs', 'FAQ_BANK.md')
	if (!fs.existsSync(faqPath)) return {}
	const content = fs.readFileSync(faqPath, 'utf-8')
	const questions = {}
	let currentCategory = ''
	for (const line of content.split('\n')) {
		const catMatch = line.match(/^## (.+)/)
		if (catMatch) {
			currentCategory = catMatch[1].trim()
			continue
		}
		const qMatch = line.match(/^(\d+)\.\s+(.+)/)
		if (qMatch) {
			questions[parseInt(qMatch[1])] = {
				text: qMatch[2].trim(),
				category: currentCategory,
			}
		}
	}
	return questions
}

function getUsedFaqNumbers() {
	const regPath = path.join(ROOT, 'docs', 'REGISTRY.md')
	if (!fs.existsSync(regPath)) return new Set()
	const content = fs.readFileSync(regPath, 'utf-8')
	const used = new Set()
	let inFaqSection = false
	for (const line of content.split('\n')) {
		if (line.includes('Использованные FAQ-вопросы')) {
			inFaqSection = true
			continue
		}
		if (inFaqSection && line.startsWith('---')) break
		if (
			inFaqSection &&
			line.startsWith('|') &&
			!line.startsWith('| Проект') &&
			!line.startsWith('|---')
		) {
			const nums = line.match(/\d+/g)
			if (nums) nums.forEach(n => used.add(parseInt(n)))
		}
	}
	return used
}

function selectFaqQuestions(allQuestions, usedNumbers, count) {
	const categories = {}
	for (const [num, q] of Object.entries(allQuestions)) {
		const n = parseInt(num)
		if (usedNumbers.has(n)) continue
		if (!categories[q.category]) categories[q.category] = []
		categories[q.category].push({ num: n, ...q })
	}

	const selected = []
	const catKeys = Object.keys(categories)
	let catIdx = 0
	while (selected.length < count && catKeys.length > 0) {
		const cat = catKeys[catIdx % catKeys.length]
		if (categories[cat].length > 0) {
			const idx = Math.floor(Math.random() * categories[cat].length)
			selected.push(categories[cat].splice(idx, 1)[0])
			if (categories[cat].length === 0) {
				catKeys.splice(catIdx % catKeys.length, 1)
				if (catKeys.length === 0) break
			}
		}
		catIdx++
	}
	return selected.sort((a, b) => a.num - b.num)
}

function detectPageType(slug) {
	return SLUG_TO_TYPE[slug] || null
}

function resolveSections(config) {
	if (Array.isArray(config.sections_order)) {
		return config.sections_order
	}

	const cfmt = config.content_format || 'H'
	if (cfmt === 'H' && FORMAT_NOTES.H?.main_sections_order) {
		return [...FORMAT_NOTES.H.main_sections_order]
	}

	const mandatory = ['Hero', 'Overview']
	const closing = ['FAQ', 'CTA']
	const optional = [
		'Sports',
		'Advantages',
		'Payments',
		'Bonus',
		'Slots',
		'Live',
		'App',
		'Testimonials',
		'Comparison',
		'Stats',
	]
	const middle = pickN(optional, 3 + Math.floor(Math.random() * 3))
	return [...mandatory, ...middle, ...closing]
}

function buildMainPageSkeleton(config, brand, sections, faqQuestions) {
	const b = config.brand
	const style = config.author?.bio_style || 'casual'
	const sn = STYLE_NOTES[style]
	const pages = config.pages || []
	const slotPages = config.slot_pages || []
	const primaryKw = config.seo?.primary_keyword || `${b} казахстан`
	const secondaryKws = config.seo?.secondary_keywords || []

	const subpageSlugs = pages.filter(
		p => p !== 'index' && p !== '404' && p !== 'about',
	)
	const usedCtas = new Set()

	function pickCta(category) {
		const pool = CTA_BANK[category] || CTA_BANK.registration
		const available = pool.filter(c => !usedCtas.has(c))
		const chosen = available.length > 0 ? pick(available) : pick(pool)
		usedCtas.add(chosen)
		return chosen
	}

	function linkTargets(n) {
		return pickN(subpageSlugs, Math.min(n, subpageSlugs.length)).map(
			s => `/${s}`,
		)
	}

	const result = []

	for (const section of sections) {
		switch (section) {
			case 'Hero':
				result.push({
					section: 'Hero',
					words: '30-40 (подзаголовок)',
					h1: `${b} Казахстан — ${brand.type} для игроков из KZ`,
					h1_note: 'НЕ дублировать title. Содержит primary keyword.',
					subtitle: `Личный обзор ${b} от игрока из ${config.author?.city || 'Казахстана'}. ${brand.sportsCount} видов спорта, ${brand.gamesCount} игр в казино, счёт в тенге.`,
					badge: pick([
						`Обновлено ${YEAR}`,
						'Проверено лично',
						`Актуально на ${YEAR}`,
						`${brand.liveEvents} live-событий`,
					]),
					stats: [
						{ value: brand.sportsCount, label: 'видов спорта' },
						{ value: brand.minDeposit, label: 'мин. депозит' },
						{ value: '100%', label: 'на первый депозит' },
					],
					cta_primary: {
						text: pickCta('registration'),
						href: 'affiliateLink',
						external: true,
					},
					cta_secondary: {
						text: pickCta('sports'),
						href: linkTargets(1)[0] || '/about',
					},
					keywords: [primaryKw],
					style: `Тон: ${sn.tone}`,
				})
				break

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
				})
				break

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
						icon_hint: sport.includes('Футбол')
							? 'мяч'
							: sport.includes('Хоккей')
								? 'шайба'
								: sport.includes('Теннис')
									? 'ракетка'
									: sport.includes('Баскетбол')
										? 'мяч баскетбольный'
										: sport.includes('Киберспорт')
											? 'геймпад'
											: 'перчатка',
					})),
					keywords: ['ставки'],
					internal_links: [],
					style: `Тон: ${sn.tone}. Факты, не описания.`,
				})
				break

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
						{
							title: 'Линия и коэффициенты',
							plus: `${brand.sportsCount} видов спорта, маржа 3-5%`,
							minus: 'На КПЛ роспись беднее, чем на АПЛ',
						},
						{
							title: 'Оплата в тенге',
							plus: 'Kaspi, Halyk, Jusan — без конвертации',
							minus: 'Kaspi иногда отклоняет платежи',
						},
						{
							title: 'Мобильное приложение',
							plus: 'APK ~40 МБ, работает стабильно',
							minus: 'Нет в Google Play, обновлять вручную',
						},
						{
							title: 'Казино и слоты',
							plus: `${brand.gamesCount} игр, ${brand.providers.join(', ')}`,
							minus: `Вейджер ${brand.wager} — жёстко`,
						},
						{
							title: 'Бонусы',
							plus: `До ${brand.bonusAmount} + ${brand.bonusFreespins}`,
							minus: 'Условия отыгрыша не самые простые',
						},
						{
							title: 'Поддержка',
							plus: 'Чат 24/7 на русском',
							minus: 'Отвечают шаблонно, нужно настаивать',
						},
					],
					note: 'Каждая карточка: заголовок + 2 предложения (плюс и минус). Честно, без идеализации.',
					keywords: [b],
					style: `Тон: ${sn.tone}.`,
				})
				break

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
						{
							method: 'Kaspi / Halyk / Jusan',
							hint: 'Карты и переводы казахстанских банков',
						},
						{
							method: 'Криптовалюта (USDT)',
							hint: 'TRC20, без комиссии платформы, 15-30 мин',
						},
						{
							method: 'Электронные кошельки',
							hint: 'QIWI, WebMoney — работает, но медленнее',
						},
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
				})
				break

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
						{
							type: 'Спортивный бонус',
							value: `100% до ${brand.bonusAmount}`,
							condition: `Вейджер ${brand.wager}, 30 дней`,
						},
						{
							type: 'Казино-бонус',
							value: brand.bonusFreespins,
							condition: `Вейджер ${brand.wager}, конкретные слоты`,
						},
						{
							type: 'Фрибет',
							value: 'Бесплатная ставка',
							condition: 'При выполнении условий первого депозита',
						},
					],
					keywords: ['бонус'],
					internal_links: pages
						.filter(p => detectPageType(p) === 'bonus')
						.map(p => `/${p}`),
					style: `Тон: ${sn.tone}. Обязательно упомянуть сложность отыгрыша — честно.`,
				})
				break

			case 'Slots': {
				const slotCards = slotPages.slice(0, 3).map(slug => {
					const data = SLOT_DATA[slug] || {
						name: slug,
						rtp: '96%',
						maxWin: '×5 000',
						provider: 'Unknown',
					}
					return {
						slug,
						name: data.name,
						provider: data.provider,
						rtp: data.rtp,
						maxWin: data.maxWin,
						description_hint: `2 предложения: тема слота + впечатление. RTP ${data.rtp}, макс. ${data.maxWin}.`,
						cta: pickCta('casino'),
						link: `/${slug}`,
					}
				})
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
				})
				break
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
						{
							plan: `1-2 абзаца: как работает live, задержки, количество событий (${brand.liveEvents}).`,
							words: '40-60',
						},
					],
					features: [
						`${brand.liveEvents} live-событий ежедневно`,
						'Cash Out — забрать ставку до конца матча',
						`Live-казино с дилерами: ${brand.crashGames.join(', ')}`,
						'Трансляции матчей в приложении',
					],
					keywords: [],
					style: `Тон: ${sn.tone}. Упомянуть опыт live-ставки.`,
				})
				break

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
						{
							plan: 'Краткий обзор приложения. Размер APK (~40 МБ), как установить, личный опыт.',
							words: '40-50',
						},
					],
					steps_hint:
						'3-4 шага установки APK: скачать → разрешить источники → установить → войти',
					keywords: ['скачать'],
					internal_links: pages
						.filter(p => detectPageType(p) === 'download')
						.map(p => `/${p}`),
					style: `Тон: ${sn.tone}.`,
				})
				break

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
						{
							name: 'Аноним из Алматы',
							rating: '4/5',
							hint: 'Положительный, о быстром выводе на Kaspi',
						},
						{
							name: 'Аноним из Астаны',
							rating: '3.5/5',
							hint: 'Смешанный, о блокировках и зеркале',
						},
						{
							name: 'Аноним из Караганды',
							rating: '4.5/5',
							hint: 'Положительный, о приложении и live',
						},
					],
					note: 'Отзывы от лица вымышленных пользователей. Разные города, разный опыт. Не все идеальные.',
					keywords: [],
					style: `Тон: ${sn.tone}.`,
				})
				break

			case 'Comparison':
				result.push({
					section: 'Comparison',
					words: '60-80',
					h2: pick([
						`${b} vs конкуренты`,
						'Сравнение с другими конторами',
						'Таблица сравнения',
					]),
					table_hint:
						'Таблица: Параметр | ' +
						b +
						' | Конкурент 1 | Конкурент 2. Параметры: бонус, мин. депозит, кол-во видов спорта, оплата в тенге.',
					keywords: [b],
					style: 'Объективно, без явного перекоса в сторону бренда.',
				})
				break

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
				})
				break

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
				})
				break

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
					cta: {
						text: pickCta('final'),
						href: 'affiliateLink',
						external: true,
					},
					keywords: [b],
				})
				break
		}
	}

	return { sections: result, usedCtas: [...usedCtas] }
}

function buildMainPageSkeletonH(
	config,
	brand,
	sections,
	faqQuestions,
	regInfo,
) {
	const b = config.brand
	const region =
		regInfo ||
		REGION_DATA[resolveRegionCode(config.region)] ||
		REGION_DATA['KZ']
	const primaryKw =
		config.seo?.primary_keyword ||
		`${b} ${(config.region || 'KZ').toLowerCase()}`
	const secondaryKws = config.seo?.secondary_keywords || []
	const pages = config.pages || []
	const subpageSlugs = pages.filter(
		p => p !== 'index' && p !== '404' && p !== 'about',
	)
	const usedCtas = new Set()

	const bonus = config.bonus || {}
	const primaryPercent = bonus.primary_percent || 200
	const currencySymbol = region.currencySymbol || '₸'
	const maxAmount =
		bonus.max_amount ||
		`до ${Math.round(primaryPercent * 1000).toLocaleString('ru-RU')} ${currencySymbol}`
	const freespins = bonus.freespins || 150
	const totalPercent =
		bonus.first_n_deposits_total_percent || primaryPercent * 5
	const regionName = region.name || 'Казахстана'
	const mainBank = region.mainBank || 'Kaspi'
	const otherBank = (region.banks || ['Kaspi', 'Halyk'])[1] || 'Halyk'

	function pickCta(category) {
		const pool = CTA_BANK[category] || CTA_BANK.registration
		const available = pool.filter(c => !usedCtas.has(c))
		const chosen = available.length > 0 ? pick(available) : pick(pool)
		usedCtas.add(chosen)
		return chosen
	}

	const promoBannerHeadlines = [
		`Зарегистрируйтесь сегодня и получите бонус ${primaryPercent}% на первый депозит!`,
		`Сделайте депозит за 7 минут и удвойте свой банк`,
		`Активируйте промокод и заберите эксклюзивный бонус`,
		`Скачайте приложение и начните играть прямо сейчас`,
		`Получите ${primaryPercent}% бонус на первый депозит — играйте с увеличенным банком`,
		`Создайте аккаунт за 2 минуты и заберите ${freespins} фриспинов в подарок`,
		`Эксклюзивный приветственный пакет до ${totalPercent}% за 4 депозита`,
	]
	let promoBannerIdx = 0

	function buildPromoBanner(n, imageNumber) {
		const headline =
			promoBannerHeadlines[promoBannerIdx % promoBannerHeadlines.length]
		promoBannerIdx++
		return {
			section: `PromoBanner_${n}`,
			type: 'promo_banner',
			words: '30-60',
			image: `${imageNumber}. Промо-баннер: бонус ${primaryPercent}% на первый депозит, монеты, подарок`,
			headline,
			body: `Описание условий бонуса в 1-2 предложения. Минимальный депозит — 1 000 ${currencySymbol}, бонус активируется автоматически после пополнения. Срок действия — 7 дней с момента регистрации.`,
			primary_cta: {
				text: pick([
					'Играть сейчас',
					'Забрать бонус',
					'Зарегистрироваться',
					'Начать играть',
				]),
				href: 'affiliateLink',
				external: true,
			},
			badges: [
				'Проверено',
				`Использовано ${5 + Math.floor(Math.random() * 30)} минут назад`,
				'Подробнее',
			],
			app_buttons: [
				{ text: 'Скачать на Android', href: '/skachat' },
				{ text: 'Скачать на iOS', href: '/skachat' },
			],
		}
	}

	let imageCounter = 0
	const nextImage = () => ++imageCounter

	const result = []

	for (const section of sections) {
		switch (section) {
			case 'Hero':
				result.push({
					section: 'Hero',
					words: '40-60 (подзаголовок)',
					h1: `${b} ${regionName} — бонус ${primaryPercent}% на первый депозит и до ${freespins} фриспинов`,
					h1_note:
						'Содержит primary keyword и цифру бонуса. НЕ дублирует title.',
					subtitle: `${b} — онлайн-казино и букмекер для игроков из ${regionName}. Зарегистрируйтесь за 2 минуты, сделайте депозит за 7 минут — и получите бонус ${primaryPercent}% на первую игру.`,
					cta_primary: {
						text: pickCta('registration'),
						href: 'affiliateLink',
						external: true,
					},
					cta_secondary: { text: pickCta('app'), href: '/skachat' },
					stats: [
						{ value: '10 000+', label: 'игр' },
						{ value: '98.48%', label: 'RTP' },
						{ value: '24/7', label: 'поддержка' },
					],
					image: `${nextImage()}. Hero: атмосфера казино / спортивной арены в фирменных цветах проекта`,
					keywords: [primaryKw, ...secondaryKws.slice(0, 1)],
				})
				break

			case 'PlatformOverviewTable':
				result.push({
					section: 'PlatformOverviewTable',
					type: 'parameters_table',
					words: '20-30 (вводное предложение)',
					intro: `Краткая сводка ключевых параметров платформы ${b}.`,
					rows: [
						['✅ Сайт', `https://${config.domain || 'example.com'}`],
						['📃 Лицензия', 'Curaçao Interactive Licensing N.V.'],
						['🎮 Игры казино', 'Слоты, настольные, краш-игры, Live'],
						['🃏 Live Casino', 'Да'],
						['🎲 Live-игры', 'Рулетка, Покер, Блэкджек, Баккара'],
						['🎰 Число игр', '10 000+'],
						['🔢 RTP', '98.48%'],
						[
							'🎁 Бонусы',
							`Приветственный ${primaryPercent}%, ${totalPercent}% за 4 депозита, фриспины, кэшбэк, VIP`,
						],
						[
							'💳 Депозит',
							`${mainBank}, ${otherBank}, Visa/Mastercard, USDT, Bitcoin (от 1 000 ${currencySymbol})`,
						],
						[
							'💰 Вывод',
							`Те же методы, обработка 1-5 минут (крипта) / до 3 дней (карта)`,
						],
						['⌛ Скорость', '1-5 минут'],
						['📱 Приложение', 'iOS, Android'],
						['📞 Поддержка', '24/7, чат на сайте, email, Telegram'],
					],
				})
				break

			case 'WhatIsBrand':
				result.push({
					section: 'WhatIsBrand',
					words: '250-350',
					h2: `Что такое ${b}?`,
					content_hint: `2-3 абзаца общего описания платформы ${b}: тип (казино / букмекер / гибрид), год основания, страны присутствия, ключевые особенности (поддержка локальных платежей, криптовалют, лицензия). Обязательны региональные маркеры из ${regionName}: ${mainBank}, ${otherBank} и т.п.`,
					image: `${nextImage()}. ${b} Casino: лобби с играми и приветственным баннером`,
					keywords: [primaryKw],
				})
				break

			case 'PromoBanner_1':
				result.push(buildPromoBanner(1, nextImage()))
				break
			case 'PromoBanner_2':
				result.push(buildPromoBanner(2, nextImage()))
				break
			case 'PromoBanner_3':
				result.push(buildPromoBanner(3, nextImage()))
				break
			case 'PromoBanner_4':
				result.push(buildPromoBanner(4, nextImage()))
				break
			case 'PromoBanner_5':
				result.push(buildPromoBanner(5, nextImage()))
				break

			case 'PopularGames':
				result.push({
					section: 'PopularGames',
					words: '300-400',
					h2: `Популярные игры казино на ${b}`,
					intro: 'Краткое введение о ассортименте игр на платформе.',
					subsections: [
						{
							h3: 'Слоты',
							words: '60-90',
							content_hint: `Описание раздела слотов: тематика, провайдеры (${(brand.providers && brand.providers.length ? brand.providers : ['Pragmatic Play', "Play'n GO", 'NetEnt']).join(', ')}), популярные тайтлы, RTP. Использовать слоты бренда: ${(brand.slots || []).join(', ')}.`,
							image: `${nextImage()}. Слоты ${b}: яркая стена игровых автоматов`,
						},
						{
							h3: 'Live-казино',
							words: '60-90',
							content_hint:
								'Описание раздела Live: реальные дилеры, типы игр (рулетка, блэкджек, баккара, покер), студии вещания.',
							image: `${nextImage()}. Live-казино: дилер у стола с картами и фишками`,
						},
						{
							h3: 'Black Jack',
							words: '50-80',
							content_hint:
								'Описание блэкджека: варианты игры, лимиты ставок, провайдеры.',
						},
						{
							h3: 'Покер',
							words: '50-80',
							content_hint:
								"Описание покера: Texas Hold'em, Omaha, турниры, кэш-игры.",
						},
					],
					keywords: ['казино', 'слоты', 'live'],
				})
				break

			case 'PopularSports':
				result.push({
					section: 'PopularSports',
					words: '200-280',
					h2: `Популярные ставки на спорт на ${b}`,
					content_hint: `Описание спортивного раздела: виды спорта (футбол, баскетбол, теннис, хоккей, киберспорт), линия на ${region.league || 'местные'} (${(region.clubs || []).slice(0, 2).join(', ')}), live-ставки, виртуальный спорт. Региональный акцент на местных лигах.`,
					image: `${nextImage()}. Спортивные ставки: стадион ночью с подсветкой`,
					keywords: ['ставки', 'спорт'],
				})
				break

			case 'HowToGetBonus':
				result.push({
					section: 'HowToGetBonus',
					words: '250-350',
					h2: `Как получить бонус ${primaryPercent}%`,
					intro: `Чтобы получить приветственный бонус ${primaryPercent}% на первый депозит, выполните 4 простых шага:`,
					steps: [
						{
							num: 1,
							title: 'Регистрация аккаунта',
							content: `Нажмите кнопку «Регистрация» в правом верхнем углу. Выберите способ регистрации: email, телефон или социальная сеть.`,
						},
						{
							num: 2,
							title: 'Быстрая реакция после регистрации',
							content: `Время критично. У вас есть 7 минут на первый депозит, чтобы получить максимальный бонус ${primaryPercent}%.`,
						},
						{
							num: 3,
							title: 'Первый депозит',
							content: `В личном кабинете перейдите в раздел «Депозит». Выберите способ оплаты: ${mainBank}, ${otherBank}, USDT, Bitcoin. Минимальная сумма — 1 000 ${currencySymbol}.`,
						},
						{
							num: 4,
							title: 'Получение бонуса',
							content: `Бонус автоматически зачисляется на ваш счёт после успешного депозита. Для отыгрыша — вейджер ${bonus.wager || 'x35'}.`,
						},
					],
					image: `${nextImage()}. Получение бонуса: иллюстрация с подарком и стрелками шагов`,
					keywords: ['бонус', primaryKw],
				})
				break

			case 'Registration':
				result.push({
					section: 'Registration',
					words: '230-300',
					h2: `Регистрация на ${b}`,
					intro: `Создание аккаунта на ${b} — простая и быстрая процедура. Вот пошаговая инструкция:`,
					steps: [
						{
							num: 1,
							title: `Перейдите на сайт ${b}`,
							content:
								'Откройте официальный сайт через любой браузер на компьютере или мобильном устройстве.',
						},
						{
							num: 2,
							title: 'Найдите кнопку «Регистрация»',
							content:
								'Кнопка расположена в правом верхнем углу страницы и выделена ярким акцентным цветом.',
						},
						{
							num: 3,
							title: 'Выберите способ регистрации',
							content:
								'Email, номер телефона, социальные сети (Google, Telegram, VK). Выберите удобный для вас вариант.',
						},
						{
							num: 4,
							title: 'Заполните данные',
							content:
								'Введите запрошенную информацию. Укажите валюту аккаунта (тенге для игроков из Казахстана), страну и согласитесь с правилами.',
						},
						{
							num: 5,
							title: 'Подтверждение',
							content:
								'Подтвердите email или номер телефона. Аккаунт активирован.',
						},
					],
					cta: {
						text: pickCta('registration'),
						href: 'affiliateLink',
						external: true,
						internal_link:
							'/' +
							(subpageSlugs.find(s =>
								/reg|akkaunt|sozdat|nachalo|otkryt-schet|vhod/.test(s),
							) || 'registraciya'),
					},
					keywords: [`${b} регистрация`],
				})
				break

			case 'Bonuses':
				result.push({
					section: 'Bonuses',
					words: '350-450',
					h2: `Бонусы ${b}`,
					intro: `${b} предлагает обширную программу бонусов как для новых, так и для постоянных игроков.`,
					subsections: [
						{
							h3: `Приветственный пакет — ${totalPercent}% за 4 депозита`,
							content_hint: `Подробное описание бонусов на 4 первых депозита: 1-й — ${primaryPercent}%, 2-й — ${Math.round(primaryPercent * 1.2)}%, 3-й — ${Math.round(primaryPercent * 1.5)}%, 4-й — ${Math.round(primaryPercent * 1.8)}%. Максимальные суммы по каждому депозиту.`,
						},
						{
							h3: 'Реферальный бонус',
							content_hint:
								'Описание реферальной программы: бонус за каждого приглашённого друга, процент от его ставок (15%), бонусы за активность.',
							image: `${nextImage()}. Реферальный бонус: сеть друзей и стрелки`,
						},
						{
							h3: 'Промокоды',
							content_hint:
								'Где брать промокоды (промо-страница, email-рассылка, соцсети, партнёры). Как активировать в личном кабинете.',
						},
						{
							h3: 'VIP-программа',
							content_hint:
								'Уровни VIP (Bronze → Silver → Gold → Platinum I → Platinum II → Diamond I → II → III SVIP). Бонусы каждого уровня. Таблица VIP-уровней.',
						},
					],
					table: {
						type: 'vip_levels_or_4_deposits',
						note: 'Обязательная таблица: либо VIP-уровни с бонусами по каждому, либо детализация 4 депозитов с процентом и максимальной суммой.',
					},
					image: `${nextImage()}. Бонусы ${b}: подарок, монеты, сундук с сокровищами`,
					keywords: ['бонус', `${b} бонус`],
				})
				break

			case 'Deposit':
				result.push({
					section: 'Deposit',
					words: '250-330',
					h2: `Внесение депозита на ${b}`,
					intro: `Пополнение счёта на ${b} занимает несколько минут. Пошаговая инструкция:`,
					steps: [
						{
							num: 1,
							title: 'Авторизация',
							content:
								'Войдите в свой аккаунт по логину и паролю. При активной двухфакторной аутентификации введите код из приложения.',
						},
						{
							num: 2,
							title: 'Раздел «Депозит»',
							content:
								'Перейдите в раздел «Кошелёк» или «Депозит» в личном кабинете.',
						},
						{
							num: 3,
							title: 'Выбор валюты и метода',
							content: `Выберите валюту (тенге, USD, USDT, BTC и др.) и удобный метод пополнения: Kaspi, Halyk, Visa/Mastercard, криптовалюта.`,
						},
						{
							num: 4,
							title: 'Сумма депозита',
							content: `Введите сумму. Минимум — 1 000 ${currencySymbol}. Учитывайте, что для активации приветственного бонуса депозит должен превышать минимальный порог.`,
						},
						{
							num: 5,
							title: 'Подтверждение',
							content:
								'Проверьте данные и подтвердите перевод. Зачисление обычно занимает 1-5 минут.',
						},
					],
					image: `${nextImage()}. Депозит: иконки Kaspi, Halyk, USDT, Bitcoin на тёмном фоне`,
					keywords: ['депозит', 'пополнение'],
				})
				break

			case 'PaymentMethods':
				result.push({
					section: 'PaymentMethods',
					words: '180-260',
					h2: `Способы оплаты на ${b}`,
					intro: `Платформа ${b} поддерживает множество способов пополнения и вывода средств — игроки из ${regionName} могут выбрать удобный вариант.`,
					methods: [
						{
							name: mainBank,
							limits: `1 000 — 500 000 ${currencySymbol}`,
							time: '1-5 минут',
						},
						{
							name: otherBank,
							limits: `1 000 — 1 000 000 ${currencySymbol}`,
							time: 'до 30 минут',
						},
						{
							name: 'Visa / Mastercard',
							limits: `1 000 — 500 000 ${currencySymbol}`,
							time: 'депозит мгновенно, вывод до 3 дней',
						},
						{
							name: 'USDT (TRC20, ERC20)',
							limits: 'от 5 USDT',
							time: '5-30 минут',
						},
						{ name: 'Bitcoin', limits: 'от 0.0005 BTC', time: '30-60 минут' },
						{ name: 'Ethereum', limits: 'от 0.014 ETH', time: '15-30 минут' },
					],
					keywords: ['оплата', 'депозит', 'вывод'],
				})
				break

			case 'Withdrawal':
				result.push({
					section: 'Withdrawal',
					words: '230-310',
					h2: `Вывод средств с ${b}`,
					intro: `Процесс вывода средств на ${b} оптимизирован для скорости и безопасности. Подробная инструкция:`,
					steps: [
						{
							num: 1,
							title: 'Раздел «Вывод»',
							content:
								'В личном кабинете перейдите в раздел «Кошелёк» → «Вывод».',
						},
						{
							num: 2,
							title: 'Выбор метода',
							content: `Выберите тот же метод, через который пополняли счёт (требование KYC). Доступны: ${mainBank}, ${otherBank}, банковская карта, USDT, Bitcoin.`,
						},
						{
							num: 3,
							title: 'Сумма вывода',
							content: `Укажите сумму в рамках лимитов: минимум — от 1 000 ${currencySymbol} (зависит от метода), максимум — устанавливается VIP-уровнем.`,
						},
						{
							num: 4,
							title: 'Адрес кошелька',
							content:
								'Введите адрес внешнего кошелька (для крипты) или реквизиты банковского счёта (для фиата).',
						},
						{
							num: 5,
							title: 'Подтверждение',
							content:
								'Подтвердите операцию через 2FA или код из email. Время обработки: 1-5 минут для крипты, до 3 дней для банковских карт.',
						},
						{
							num: 6,
							title: 'Верификация (если ещё не пройдена)',
							content:
								'При первом выводе или при крупных суммах система может запросить KYC: фото удостоверения личности и селфи.',
						},
					],
					image: `${nextImage()}. Вывод средств: монеты и стрелка на банковскую карту / кошелёк`,
					keywords: ['вывод', 'кэшаут'],
				})
				break

			case 'LicensesSecurity':
				result.push({
					section: 'LicensesSecurity',
					words: '180-250',
					h2: `${b} — лицензии и безопасность`,
					content_hint: `Описание лицензии (Curaçao / MGA / Anjouan), регулирующих органов, мер безопасности.`,
					features: [
						{
							title: 'SSL-шифрование',
							content:
								'Все транзакции и персональные данные передаются по защищённым каналам с SSL-шифрованием.',
						},
						{
							title: 'Двухфакторная аутентификация (2FA)',
							content:
								'Дополнительный уровень защиты аккаунта — код из приложения-аутентификатора.',
						},
						{
							title: 'Provably Fair',
							content:
								'Алгоритм честности игр: каждый исход можно проверить с помощью уникального хэша.',
						},
						{
							title: 'KYC и AML процедуры',
							content:
								'Соответствие международным требованиям по противодействию отмыванию средств.',
						},
					],
					image: `${nextImage()}. Лицензии: щит безопасности, печать Curaçao, замок SSL`,
					keywords: ['безопасность', 'лицензия'],
				})
				break

			case 'Verification':
				result.push({
					section: 'Verification',
					words: '120-180',
					h2: `Процесс верификации аккаунта`,
					content_hint: `Краткое описание процесса верификации (KYC): когда требуется, какие документы загружать (паспорт/удостоверение, селфи с документом, подтверждение адреса), сроки рассмотрения (1-5 рабочих дней).`,
					keywords: ['верификация', 'KYC'],
				})
				break

			case 'Apps':
				result.push({
					section: 'Apps',
					words: '300-400',
					h2: `Приложения ${b}`,
					intro: `${b} предлагает мобильные приложения для Android и iOS — все функции платформы доступны на смартфоне.`,
					subsections: [
						{
							h3: `${b} для Android`,
							words: '120-160',
							content_hint: `Описание Android-приложения: где скачать (официальный сайт, не Google Play), системные требования, размер APK (40-50 MB), процесс установки (включить «неизвестные источники»).`,
							image: `${nextImage()}. Мокап Android: главный экран ${b} на смартфоне Samsung`,
						},
						{
							h3: `${b} для iOS`,
							words: '120-160',
							content_hint: `Описание iOS-приложения: где скачать (App Store или TestFlight), системные требования, размер.`,
							image: `${nextImage()}. Мокап iOS: главный экран ${b} на iPhone`,
						},
					],
					keywords: ['приложение', 'apk'],
				})
				break

			case 'Support':
				result.push({
					section: 'Support',
					words: '180-260',
					h2: `Поддержка ${b}`,
					content_hint: `Описание каналов поддержки: онлайн-чат на сайте (24/7), email, Telegram-бот, FAQ-раздел. Среднее время ответа в чате — 3-5 минут. Языки поддержки.`,
					channels: [
						{ name: 'Онлайн-чат', time: 'до 5 минут', hours: '24/7' },
						{ name: 'Email', time: 'до 24 часов', hours: '24/7' },
						{ name: 'Telegram', time: 'до 30 минут', hours: '24/7' },
						{ name: 'FAQ-раздел', time: 'мгновенно', hours: '—' },
					],
					image: `${nextImage()}. Поддержка: иконки чата, email, Telegram, рейтинг 24/7`,
					keywords: ['поддержка', 'support'],
				})
				break

			case 'FAQ':
				result.push({
					section: 'FAQ',
					words: '500-700',
					h2: 'Часто задаваемые вопросы',
					schema_hint: 'FAQPage',
					questions: faqQuestions.map(q => ({
						num: q.num,
						question: q.text,
						answer_words: '60-110',
						answer_hint:
							'Развёрнутый ответ 3-6 предложений с конкретными цифрами и пошаговыми указаниями. Без 1-го лица. В стиле энциклопедии: «Платформа поддерживает...», «Игроки могут...». Региональные маркеры (Kaspi, тенге и т.п.) — где уместно.',
						category: q.category,
					})),
				})
				break

			case 'FinalCTA':
				result.push({
					section: 'FinalCTA',
					words: '40-70',
					h2: pick([
						`Начните играть на ${b} прямо сейчас`,
						`Попробуйте ${b} с бонусом ${primaryPercent}%`,
						`Зарегистрируйтесь и получите приветственный пакет`,
						`${b} — играйте на любом устройстве`,
					]),
					subtitle: `Зарегистрируйтесь, сделайте депозит за 7 минут и получите бонус ${primaryPercent}% на первый депозит — а также до ${totalPercent}% за 4 первых депозита.`,
					rating: '4.9/5',
					cta: {
						text: pickCta('final'),
						href: 'affiliateLink',
						external: true,
					},
					image: `${nextImage()}. Финальный CTA-блок: 4.9/5 рейтинг, корона, бонус ${totalPercent}% за 4 депозита`,
					keywords: [b, primaryKw],
				})
				break

			default:
				result.push({
					section,
					words: '120-200',
					note: `Секция ${section} не имеет подробного шаблона в формате H — агент генерирует контент по описанию формата H в docs/VARIATION_STRATEGY.md (секция 12) и docs/CONTENT_GUIDE.md.`,
				})
				break
		}
	}

	return { sections: result, usedCtas: [...usedCtas] }
}

function buildSubpageOutlines(config, brand) {
	const b = config.brand
	const pages = config.pages || []
	const style = config.author?.bio_style || 'casual'
	const sn = STYLE_NOTES[style]
	const allSlugs = pages.filter(p => p !== 'index' && p !== '404')
	const outlines = {}

	for (const slug of pages) {
		if (slug === 'index' || slug === '404') continue
		const type = detectPageType(slug)
		if (!type) continue

		const base = {
			slug,
			page_type: type,
			words: type === 'about' ? '400-600' : '500-800',
			schema_hint: null,
			internal_links: pickN(
				allSlugs.filter(s => s !== slug),
				3,
			).map(s => `/${s}`),
			style: `Тон: ${sn.tone}. ${sn.markers}`,
		}

		switch (type) {
			case 'registration':
				outlines[slug] = {
					...base,
					h1: `Как зарегистрироваться на ${b} в Казахстане`,
					schema_hint: 'HowTo + HowToStep',
					blocks: [
						{
							h2: 'Пошаговая регистрация',
							type: 'steps',
							content:
								'4-5 шагов: выбор способа → заполнение → валюта KZT → промокод → подтверждение',
						},
						{
							h2: `Способы регистрации на ${b}`,
							type: 'cards',
							content: '3-4 карточки: по телефону, email, соцсети, в один клик',
						},
						{
							h2: 'Бонус при регистрации',
							type: 'text',
							content: `Абзац о приветственном бонусе ${brand.bonusAmount}. Ссылка на страницу бонусов.`,
						},
						{
							h2: 'Верификация',
							type: 'text',
							content:
								'Абзац о KYC: удостоверение + ИИН + селфи. Личный опыт: сколько заняло.',
						},
					],
				}
				break
			case 'download':
				outlines[slug] = {
					...base,
					h1: `Скачать ${b} — APK для Android и iPhone`,
					schema_hint: 'HowTo + HowToStep',
					blocks: [
						{
							h2: 'Скачать на Android (APK)',
							type: 'steps',
							content:
								'4 шага: ссылка → разрешить источники → установить → войти',
						},
						{
							h2: 'Установка на iOS',
							type: 'steps',
							content: '3 шага: зеркало → скачать из App Store → войти',
						},
						{
							h2: 'Обзор приложения',
							type: 'text',
							content: `Плюсы и минусы мобильного приложения ${b}. Размер, скорость, удобство.`,
						},
						{
							h2: 'Системные требования',
							type: 'table',
							content: 'Таблица: ОС | Версия | Размер | RAM',
						},
					],
				}
				break
			case 'casino':
				outlines[slug] = {
					...base,
					h1: `Казино ${b} — слоты, рулетка и live-дилеры`,
					schema_hint: 'Article',
					blocks: [
						{
							h2: 'Обзор казино',
							type: 'text',
							content: `${brand.gamesCount} игр, провайдеры: ${brand.providers.join(', ')}. Личное впечатление.`,
						},
						{
							h2: 'Популярные слоты',
							type: 'cards',
							content: 'Топ-5 слотов с RTP, провайдером и мнением',
						},
						{
							h2: `Live-казино и краш-игры`,
							type: 'text',
							content: `${brand.crashGames.join(', ')}. Опыт игры в Aviator.`,
						},
						{
							h2: 'Бонусы для казино',
							type: 'text',
							content: `${brand.bonusFreespins}, вейджер ${brand.wager}. Стоит ли брать.`,
						},
					],
				}
				break
			case 'mirror':
				outlines[slug] = {
					...base,
					h1: `${b} зеркало — рабочий доступ для Казахстана`,
					schema_hint: 'Article',
					blocks: [
						{
							h2: 'Почему блокируют',
							type: 'text',
							content: 'Абзац о блокировках Kcell, Beeline KZ. Причины.',
						},
						{
							h2: '3 способа зайти',
							type: 'steps',
							content: 'Зеркало → приложение → DNS (8.8.8.8)',
						},
						{
							h2: 'Как отличить настоящее зеркало',
							type: 'text',
							content: 'Предупреждение о фишинге. Признаки реального зеркала.',
						},
					],
				}
				break
			case 'account':
				outlines[slug] = {
					...base,
					h1: `Личный кабинет ${b} — вход, настройки, вывод`,
					schema_hint: 'Article',
					blocks: [
						{
							h2: 'Как войти',
							type: 'steps',
							content: '3 шага: сайт/приложение → логин/пароль → двухфакторная',
						},
						{
							h2: 'Возможности кабинета',
							type: 'cards',
							content:
								'4-5 карточек: история ставок, вывод, бонусы, верификация, настройки',
						},
						{
							h2: 'Вывод средств',
							type: 'text',
							content:
								'Подробно: Kaspi Gold, Halyk, USDT. Сроки, лимиты, личный опыт.',
						},
					],
				}
				break
			case 'bonus':
				outlines[slug] = {
					...base,
					h1: `Бонусы ${b} — приветственный пакет и акции`,
					schema_hint: 'Article',
					blocks: [
						{
							h2: 'Приветственный бонус',
							type: 'text',
							content: `До ${brand.bonusAmount} + ${brand.bonusFreespins}. Условия получения.`,
						},
						{
							h2: 'Как отыграть бонус',
							type: 'steps',
							content: `Вейджер ${brand.wager}. Пошагово: что считается, сроки, подводные камни.`,
						},
						{
							h2: 'Другие акции',
							type: 'cards',
							content:
								'Экспресс-бонус, кешбэк, промокоды — что реально работает.',
						},
						{
							h2: 'Стоит ли брать бонус',
							type: 'text',
							content: 'Честное мнение: кому подойдёт, кому нет.',
						},
					],
				}
				break
			case 'affiliate':
				outlines[slug] = {
					...base,
					h1: `Партнёрская программа ${b} — заработок на рефералах`,
					schema_hint: 'Article',
					blocks: [
						{
							h2: 'Как работает партнёрка',
							type: 'text',
							content: 'RevShare до 40%, CPA от $50. Модели заработка.',
						},
						{
							h2: 'Как начать',
							type: 'steps',
							content: '3 шага: регистрация → реферальная ссылка → привлечение',
						},
						{
							h2: 'Сколько можно заработать',
							type: 'text',
							content: 'Реальные цифры, сроки выхода на доход.',
						},
					],
				}
				break
			case 'about':
				outlines[slug] = {
					...base,
					words: '400-600',
					h1: `Об авторе — кто стоит за обзором ${b}`,
					schema_hint: 'AboutPage + Person',
					blocks: [
						{
							h2: 'Кто я',
							type: 'text',
							content: `${config.author?.name}, ${config.author?.city}, ${config.author?.age} лет. С ${YEAR - (config.author?.experience_years || 5)} года в ставках.`,
						},
						{
							h2: 'Зачем этот сайт',
							type: 'text',
							content:
								'Мотивация: делюсь опытом, не заказной обзор. Личная история.',
						},
						{
							h2: 'Как тестирую',
							type: 'text',
							content:
								'Пополняю реальные деньги, ставлю, вывожу. Не «теоретик».',
						},
						{
							h2: 'Про честность',
							type: 'text',
							content:
								'Открытое признание партнёрских ссылок. Это не влияет на оценки.',
						},
						{
							h2: 'Предупреждение',
							type: 'text',
							content:
								'21+, ответственная игра. Не ставьте больше, чем можете потерять.',
						},
					],
				}
				break
		}
	}

	return outlines
}

function buildSlotOutlines(config, brand) {
	const b = config.brand
	const style = config.author?.bio_style || 'casual'
	const sn = STYLE_NOTES[style]
	const slotPages = config.slot_pages || []
	const outlines = {}

	for (const slug of slotPages) {
		const data = SLOT_DATA[slug] || {
			name: slug,
			rtp: '96%',
			maxWin: '×5 000',
			provider: 'Unknown',
		}
		outlines[slug] = {
			slug,
			page_type: 'slot',
			words: '500-800',
			h1: `${data.name} — обзор слота от ${data.provider}`,
			schema_hint: 'Review + SoftwareApplication (GameApplication)',
			slot_info: data,
			blocks: [
				{
					h2: `Обзор ${data.name}`,
					type: 'text',
					content: `Тема слота, RTP ${data.rtp}, волатильность, макс. ${data.maxWin}. Первое впечатление.`,
				},
				{
					h2: 'Как играть',
					type: 'text',
					content: 'Механика: символы, бонусные раунды, множители. 2-3 абзаца.',
				},
				{
					h2: 'Мой опыт',
					type: 'text',
					content: `Личный опыт игры на ${b}. Конкретные суммы, сессии, результат.`,
				},
				{
					h2: 'Стоит ли играть',
					type: 'text',
					content: 'Итоговая оценка. Кому подойдёт, кому нет. Плюсы и минусы.',
				},
			],
			internal_links: [
				`/${config.pages?.find(p => detectPageType(p) === 'casino') || 'casino'}`,
			],
			style: `Тон: ${sn.tone}. ${sn.markers}`,
		}
	}

	return outlines
}

function buildKeywordBudget(config, sections) {
	const b = config.brand
	const primaryKw = config.seo?.primary_keyword || `${b} казахстан`
	const secondaryKws = config.seo?.secondary_keywords || []

	const budget = {
		brand: {
			word: b,
			max_per_paragraph: 1,
			max_per_page: 10,
			synonyms: [
				'контора',
				'площадка',
				'букмекер',
				'тут',
				'у них',
				'платформа',
				'сервис',
			],
		},
		ставки: {
			word: 'ставки',
			max_per_paragraph: 1,
			max_per_page: 6,
			synonyms: ['прогнозы', 'пари', 'беттинг', 'игра'],
		},
		казино: {
			word: 'казино',
			max_per_paragraph: 1,
			max_per_page: 6,
			synonyms: ['слоты', 'автоматы', 'игровой клуб', 'раздел с играми'],
		},
		бонус: {
			word: 'бонус',
			max_per_paragraph: 1,
			max_per_page: 6,
			synonyms: ['подарок', 'акция', 'предложение', 'пакет', 'награда'],
		},
		тенге: {
			word: 'тенге',
			max_per_paragraph: 1,
			max_per_page: 6,
			synonyms: ['валюта', 'KZT', '₸', 'в местной валюте'],
		},
		primary_keyword: {
			word: primaryKw,
			max_per_page: 5,
			placement: 'H1, первый абзац, середина текста, финальный CTA',
		},
		secondary_keywords: secondaryKws.map(kw => ({ word: kw, max_per_page: 2 })),
	}

	return budget
}

function buildLinkingPlan(config) {
	const pages = (config.pages || []).filter(p => p !== '404')
	const slots = config.slot_pages || []
	const allPages = [...pages, ...slots]
	const plan = {}
	const keyPages = pages.filter(p =>
		['registration', 'bonus', 'casino'].includes(detectPageType(p)),
	)

	for (const slug of allPages) {
		if (slug === 'index') {
			plan[slug] = {
				outgoing: allPages
					.filter(p => p !== 'index')
					.slice(0, 8)
					.map(p => `/${p}`),
				min: 5,
			}
		} else if (slots.includes(slug)) {
			const casinoPage = pages.find(p => detectPageType(p) === 'casino')
			const otherSlots = slots.filter(s => s !== slug).slice(0, 2)
			plan[slug] = {
				outgoing: [
					casinoPage ? `/${casinoPage}` : '/',
					...otherSlots.map(s => `/${s}`),
				],
				min: 2,
			}
		} else {
			const targets = pickN(
				allPages.filter(p => p !== slug && p !== 'index'),
				4,
			)
			if (
				!targets.some(t => detectPageType(t) === 'about') &&
				pages.includes('about')
			)
				targets.push('about')
			plan[slug] = { outgoing: targets.slice(0, 5).map(p => `/${p}`), min: 3 }
		}
	}

	const incoming = {}
	for (const [source, data] of Object.entries(plan)) {
		for (const target of data.outgoing) {
			const t = target.replace('/', '')
			if (!incoming[t]) incoming[t] = []
			incoming[t].push(source)
		}
	}

	return { plan, incoming }
}

const TYPO_BANK = {
	drop_letter: [
		'прилжение',
		'регистраця',
		'верифкация',
		'коэфициент',
		'пополнеие',
		'приветсвенный',
		'доступый',
	],
	swap_letters: ['подтормаживть', 'тенеге', 'букемкер', 'поддрежка'],
	double_letter: ['бонусс', 'каззино', 'оттзыв', 'коммиссия'],
	tsya_tsya: [
		'регистрироватся',
		'авторизоватся',
		'пополняеться',
		'обновляеться',
	],
	wrong_vowel: ['скочать', 'палучить', 'привитственный', 'верефикация'],
}

const PUNCT_PATTERNS = [
	'запятая вместо точки (поток мысли)',
	'пропуск запятой перед что/который',
	'тире вместо двоеточия',
	'лишняя запятая перед «и»',
]

const SLANG_BANK = [
	'норм',
	'кэф',
	'апк',
	'тг',
	'инфа',
	'залил',
	'слил',
	'зашло',
	'ЛК',
]

function buildHumanRealismHints(config, sections) {
	const pageCount =
		(config.pages || []).length + (config.slot_pages || []).length
	const typoTypes = Object.keys(TYPO_BANK)

	const perPage = []
	for (let i = 0; i < pageCount; i++) {
		const typoCount = 1 + Math.floor(Math.random() * 4)
		const punctCount = 2 + Math.floor(Math.random() * 2)
		const typos = []
		for (let t = 0; t < typoCount; t++) {
			const type = typoTypes[Math.floor(Math.random() * typoTypes.length)]
			const words = TYPO_BANK[type]
			typos.push({
				type,
				example: words[Math.floor(Math.random() * words.length)],
			})
		}
		perPage.push({
			typo_count: typoCount,
			typos,
			punct_count: punctCount,
			punct_types: pickN(PUNCT_PATTERNS, punctCount),
			slang_count: 2 + Math.floor(Math.random() * 3),
			slang_suggestions: pickN(SLANG_BANK, 3),
			contradiction: i % 3 === 0,
			unfinished_thought: i % 2 === 0,
			self_correction: true,
			emotional_reactions: 3 + Math.floor(Math.random() * 3),
			uneven_depth: i < sections.length,
		})
	}

	return {
		rules: {
			typos_per_page: '1-4 орфографических опечатки',
			punct_per_page: '2-3 пунктуационных сбоя',
			no_errors_in: 'H1, title, description, первое предложение абзаца',
			contradictions: '1-2 на страницу — разный опыт в разных абзацах',
			self_corrections: '1-2 на страницу — «ну то есть», «ладно, за две»',
			emotional_reactions: '3-5 на страницу — в скобках или через тире',
			slang: '2-4 на страницу из банка',
			uneven_depth: 'минимум 2 короткие секции + 1 длинная',
			vague_time: '2-3 на страницу — «где-то в марте», «кажется»',
			faq_style_variation:
				'разная длина ответов: 1 подробный, 1 краткий, 1 с отступлением',
		},
		typo_bank: TYPO_BANK,
		slang_bank: SLANG_BANK,
		per_page_hints: perPage,
	}
}

function main() {
	const args = process.argv.slice(2)
	if (args.length === 0) {
		console.log('')
		console.log('\x1b[1m=== Генератор контент-скелета по секциям ===\x1b[0m')
		console.log('')
		console.log('Использование:')
		console.log('  node _scaffold/generate-content.cjs <путь-к-проекту>')
		console.log('')
		console.log('Примеры:')
		console.log(
			'  node _scaffold/generate-content.cjs projects/1xbet/project_1',
		)
		console.log('')
		console.log('Читает project.config.json → генерирует content-skeleton.json')
		console.log('со структурой контента для главной страницы и подстраниц.')
		console.log('Агент использует скелет для генерации уникальных текстов.')
		process.exit(1)
	}

	const projectPath = path.resolve(args[0])
	const configPath = path.join(projectPath, 'project.config.json')
	if (!fs.existsSync(configPath)) {
		console.error(`\x1b[31m✗ Файл не найден: ${configPath}\x1b[0m`)
		process.exit(1)
	}

	let config
	try {
		config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
	} catch (e) {
		console.error(`\x1b[31m✗ Ошибка парсинга: ${e.message}\x1b[0m`)
		process.exit(1)
	}

	const brandName = config.brand
	const brand = BRANDS[brandName]
	if (!brand) {
		console.error(
			`\x1b[31m✗ Неизвестный бренд: ${brandName}. Доступны: ${Object.keys(BRANDS).join(', ')}\x1b[0m`,
		)
		process.exit(1)
	}

	const style = config.author?.bio_style || 'casual'

	console.log('')
	console.log('\x1b[1m=== Генератор контент-скелета ===\x1b[0m')
	console.log('')
	console.log(`  Проект:  \x1b[36m${projectPath}\x1b[0m`)
	const cfmt = config.content_format || 'H'
	const cfmtInfo = FORMAT_NOTES[cfmt] || FORMAT_NOTES['H']
	console.log(`  Бренд:   \x1b[33m${brandName}\x1b[0m`)
	const regCode = resolveRegionCode(config.region)
	const regInfo = REGION_DATA[regCode] || REGION_DATA['KZ']
	console.log(
		`  Регион:  \x1b[33m${regInfo.name}\x1b[0m (${regCode}, ${regInfo.currency}, ${regInfo.mainBank})`,
	)
	console.log(`  Формат:  \x1b[36m${cfmt}: ${cfmtInfo.name}\x1b[0m`)
	if (cfmtInfo.has_author) {
		console.log(
			`  Автор:   ${config.author?.name || '—'} (${config.author?.city || '—'})`,
		)
		console.log(
			`  Стиль:   \x1b[35m${style}\x1b[0m — ${STYLE_NOTES[style]?.tone || ''}`,
		)
	} else {
		console.log(`  Автор:   \x1b[90m(нет персоны — формат ${cfmt})\x1b[0m`)
	}
	console.log(`  Голос:   ${cfmtInfo.voice}`)
	console.log(
		`  Страниц: ${(config.pages || []).length} основных + ${(config.slot_pages || []).length} слотовых`,
	)
	console.log('')

	const allFaq = parseFaqBank()
	const usedFaq = getUsedFaqNumbers()
	const faqQuestions = selectFaqQuestions(allFaq, usedFaq, 7)

	const sections = resolveSections(config)
	const useFormatH = (config.content_format || 'H') === 'H'
	const { sections: mainSections, usedCtas } = useFormatH
		? buildMainPageSkeletonH(config, brand, sections, faqQuestions, regInfo)
		: buildMainPageSkeleton(config, brand, sections, faqQuestions)
	const subpageOutlines = buildSubpageOutlines(config, brand)
	const slotOutlines = buildSlotOutlines(config, brand)
	const keywordBudget = buildKeywordBudget(config, mainSections)
	const linkingPlan = buildLinkingPlan(config)

	const contentFormat = config.content_format || 'H'
	const formatInfo = FORMAT_NOTES[contentFormat] || FORMAT_NOTES['H']

	const regionCode = resolveRegionCode(config.region)
	const regionInfo = REGION_DATA[regionCode] || REGION_DATA['KZ']

	const skeleton = {
		_meta: {
			brand: brandName,
			domain: config.domain,
			region: regionInfo,
			region_code: regionCode,
			author: formatInfo.has_author ? config.author : null,
			content_format: contentFormat,
			content_format_name: formatInfo.name,
			format_rules: formatInfo,
			style: formatInfo.has_author ? style : null,
			style_description: formatInfo.has_author
				? STYLE_NOTES[style] || null
				: null,
			generated_at: new Date().toISOString(),
			year: YEAR,
		},
		keyword_budget: keywordBudget,
		linking_plan: linkingPlan,
		main_page: {
			total_words: formatInfo.main_words,
			sections_order: sections,
			sections: mainSections,
			used_cta_texts: usedCtas,
		},
		subpages: subpageOutlines,
		slot_pages: slotOutlines,
		faq: {
			selected_questions: faqQuestions.map(q => ({
				number: q.num,
				question: q.text,
				category: q.category,
			})),
			numbers_for_registry: faqQuestions.map(q => q.num).join(', '),
		},
		human_realism: buildHumanRealismHints(config, sections),
	}

	const outputPath = path.join(projectPath, 'content-skeleton.json')
	fs.writeFileSync(outputPath, JSON.stringify(skeleton, null, 2), 'utf-8')

	console.log('\x1b[36m--- Главная страница ---\x1b[0m')
	console.log(`  Секции (${sections.length}): ${sections.join(' → ')}`)
	console.log(`  Слов: ${formatInfo.main_words}`)
	console.log('')
	for (const s of mainSections) {
		const heading = s.h1 || s.h2 || '—'
		console.log(`  \x1b[1m${s.section}\x1b[0m (${s.words} слов)`)
		console.log(`    ${heading}`)
		if (s.cards)
			console.log(
				`    ${s.cards.length} карточ${s.cards.length > 4 ? 'ек' : 'ки'}`,
			)
		if (s.questions) console.log(`    ${s.questions.length} FAQ-вопросов`)
	}

	console.log('')
	console.log('\x1b[36m--- Подстраницы ---\x1b[0m')
	for (const [slug, outline] of Object.entries(subpageOutlines)) {
		console.log(
			`  \x1b[1m/${slug}\x1b[0m (${outline.page_type}, ${outline.words} слов)`,
		)
		console.log(`    H1: ${outline.h1}`)
		console.log(
			`    Блоков: ${outline.blocks?.length || 0} | Schema: ${outline.schema_hint || '—'}`,
		)
	}

	if (Object.keys(slotOutlines).length > 0) {
		console.log('')
		console.log('\x1b[36m--- Слот-обзоры ---\x1b[0m')
		for (const [slug, outline] of Object.entries(slotOutlines)) {
			console.log(
				`  \x1b[1m/${slug}\x1b[0m (${outline.slot_info.name}, RTP ${outline.slot_info.rtp})`,
			)
			console.log(`    H1: ${outline.h1}`)
		}
	}

	console.log('')
	console.log('\x1b[36m--- FAQ (выбраны из банка) ---\x1b[0m')
	for (const q of faqQuestions) {
		console.log(`  #${q.num} [${q.category}] ${q.text}`)
	}

	console.log('')
	console.log('\x1b[36m--- CTA (уникальные тексты) ---\x1b[0m')
	usedCtas.forEach((cta, i) => console.log(`  ${i + 1}. ${cta}`))

	console.log('')
	console.log('\x1b[36m--- Перелинковка ---\x1b[0m')
	for (const [page, data] of Object.entries(linkingPlan.plan)) {
		console.log(`  /${page} → ${data.outgoing.join(', ')} (мин. ${data.min})`)
	}

	console.log('')
	console.log('')
	console.log('\x1b[36m--- Человеческий реализм (техники 6-18) ---\x1b[0m')
	console.log(`  Опечатки: ${skeleton.human_realism.rules.typos_per_page}`)
	console.log(`  Пунктуация: ${skeleton.human_realism.rules.punct_per_page}`)
	console.log(
		`  Сленг: ${skeleton.human_realism.rules.slang} (${SLANG_BANK.slice(0, 5).join(', ')}...)`,
	)
	console.log(`  Противоречия, самоисправления, эмоции, неровная глубина`)
	console.log(
		`  Банк опечаток: ${Object.values(TYPO_BANK).flat().length} готовых слов`,
	)

	console.log('')
	console.log(`\x1b[32m✓ Сохранено: ${outputPath}\x1b[0m`)
	console.log('')
	console.log('  Следующий шаг: агент использует content-skeleton.json')
	console.log('  для генерации уникальных текстов проекта.')
	console.log(
		'  Секция human_realism содержит конкретные подсказки по ошибкам для каждой страницы.',
	)
	console.log(
		`  FAQ номера для REGISTRY.md: ${faqQuestions.map(q => q.num).join(', ')}`,
	)
	console.log('')
}

main()
