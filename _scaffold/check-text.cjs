#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const LIMITS = {
  spam: 30,
  water: 15,
  unique: 95,
};

const COLORS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function loadApiKey() {
  const envPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '..', '.env'),
  ];
  for (const p of envPaths) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf-8');
      const match = content.match(/TEXTRU_API_KEY=(.+)/);
      if (match) return match[1].trim();
    }
  }
  return null;
}

function stripHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function postRequest(url, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(responseData)); }
        catch { resolve({ error_desc: responseData }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function findHtmlFiles(distDir) {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html') && entry.name !== '404.html') files.push(full);
    }
  }
  walk(distDir);
  return files;
}

function getPageName(filePath, distDir) {
  const rel = path.relative(distDir, filePath);
  if (rel === 'index.html') return '/';
  return '/' + rel.replace('/index.html', '').replace('.html', '');
}

async function checkText(apiKey, text, pageName) {
  const submitRes = await postRequest('https://api.text.ru/post', {
    userkey: apiKey,
    text: text,
  });

  if (submitRes.error_code) {
    return { page: pageName, error: `[${submitRes.error_code}] ${submitRes.error_desc}` };
  }

  const uid = submitRes.text_uid;
  process.stdout.write(`  ${COLORS.cyan}⏳${COLORS.reset} ${pageName} — отправлен (uid: ${uid}), ждём...`);

  let attempts = 0;
  const maxAttempts = 30;
  while (attempts < maxAttempts) {
    await sleep(10000);
    attempts++;

    const result = await postRequest('https://api.text.ru/post', {
      userkey: apiKey,
      uid: uid,
      jsonvisible: 'detail',
    });

    if (result.error_code === 181) {
      process.stdout.write('.');
      continue;
    }

    if (result.error_code) {
      console.log('');
      return { page: pageName, error: `[${result.error_code}] ${result.error_desc}` };
    }

    if (result.text_unique !== undefined) {
      console.log('');
      let seo = {};
      try {
        seo = typeof result.seo_check === 'string' ? JSON.parse(result.seo_check) : result.seo_check || {};
      } catch { seo = {}; }

      return {
        page: pageName,
        unique: parseFloat(result.text_unique),
        spam: seo.spam_percent || 0,
        water: seo.water_percent || 0,
        words: seo.count_words || 0,
        topKeys: (seo.list_keys || []).slice(0, 5).map(k => `${k.key_title}(${k.count})`),
      };
    }
  }

  console.log('');
  return { page: pageName, error: 'Таймаут — проверка не завершилась за 5 минут' };
}

async function main() {
  const projectDir = process.argv[2] || '.';
  const distDir = path.resolve(projectDir, 'dist');
  const onlyPage = process.argv[3];

  if (!fs.existsSync(distDir)) {
    console.error(`${COLORS.red}dist/ не найден в ${projectDir}. Сначала выполните npm run build${COLORS.reset}`);
    process.exit(1);
  }

  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error(`${COLORS.red}.env с TEXTRU_API_KEY не найден${COLORS.reset}`);
    process.exit(1);
  }

  console.log('');
  console.log(`${COLORS.bold}=== Проверка текста через text.ru API ===${COLORS.reset}`);
  console.log(`Проект: ${projectDir}`);
  console.log('');

  let htmlFiles = findHtmlFiles(distDir);

  if (onlyPage) {
    htmlFiles = htmlFiles.filter(f => getPageName(f, distDir).includes(onlyPage));
  }

  console.log(`Найдено страниц: ${htmlFiles.length}`);
  console.log(`Лимиты: спам < ${LIMITS.spam}%, вода < ${LIMITS.water}%, уникальность > ${LIMITS.unique}%`);
  console.log('');

  const results = [];
  let fails = 0;

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf-8');
    const text = stripHtml(html);

    if (text.length < 100) {
      console.log(`  ${COLORS.yellow}⚠${COLORS.reset} ${getPageName(file, distDir)} — текст слишком короткий (${text.length} символов), пропускаем`);
      continue;
    }

    const result = await checkText(apiKey, text, getPageName(file, distDir));
    results.push(result);

    if (result.error) {
      console.log(`  ${COLORS.red}✗${COLORS.reset} ${result.page} — ОШИБКА: ${result.error}`);
      fails++;
      continue;
    }

    const spamOk = result.spam <= LIMITS.spam;
    const waterOk = result.water <= LIMITS.water;
    const uniqueOk = result.unique >= LIMITS.unique;
    const allOk = spamOk && waterOk && uniqueOk;

    if (!allOk) fails++;

    const status = allOk ? `${COLORS.green}✓ PASS${COLORS.reset}` : `${COLORS.red}✗ FAIL${COLORS.reset}`;
    const spamColor = spamOk ? COLORS.green : COLORS.red;
    const waterColor = waterOk ? COLORS.green : COLORS.red;
    const uniqueColor = uniqueOk ? COLORS.green : COLORS.red;

    console.log(`  ${status} ${result.page}`);
    console.log(`        Спам: ${spamColor}${result.spam}%${COLORS.reset} | Вода: ${waterColor}${result.water}%${COLORS.reset} | Уникальность: ${uniqueColor}${result.unique}%${COLORS.reset} | Слов: ${result.words}`);
    if (result.topKeys && result.topKeys.length > 0) {
      console.log(`        Топ ключи: ${result.topKeys.join(', ')}`);
    }
    console.log('');

    await sleep(2000);
  }

  console.log('');
  console.log(`${COLORS.bold}================================${COLORS.reset}`);
  console.log(`  Проверено: ${results.length} | ${COLORS.green}PASS: ${results.length - fails}${COLORS.reset} | ${COLORS.red}FAIL: ${fails}${COLORS.reset}`);
  console.log(`${COLORS.bold}================================${COLORS.reset}`);

  if (fails > 0) {
    console.log('');
    console.log(`${COLORS.red}Есть страницы с проблемами. Исправьте текст и проверьте снова.${COLORS.reset}`);
    console.log(`${COLORS.yellow}Совет: уменьшите повторы бренда, уберите вводные конструкции, добавьте синонимы.${COLORS.reset}`);
  } else {
    console.log('');
    console.log(`${COLORS.green}Все страницы прошли проверку!${COLORS.reset}`);
  }

  process.exit(fails);
}

main().catch(console.error);
