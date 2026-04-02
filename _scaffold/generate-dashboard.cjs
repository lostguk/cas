#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY = path.join(ROOT, 'docs', 'REGISTRY.md');
const PROJECTS_DIR = path.join(ROOT, 'projects');
const OUTPUT = path.join(ROOT, 'dashboard.html');

function parseRegistry() {
  const content = fs.readFileSync(REGISTRY, 'utf-8');
  const projects = [];
  const faq = [];
  const slugs = [];
  const images = [];
  const presets = [];

  let section = '';
  for (const line of content.split('\n')) {
    if (line.startsWith('## Проекты')) section = 'projects';
    else if (line.startsWith('## Использованные FAQ')) section = 'faq';
    else if (line.startsWith('## Использованные URL')) section = 'slugs';
    else if (line.startsWith('## Использованные имена')) section = 'images';
    else if (line.startsWith('## Свободные пресеты')) section = 'presets';

    if (line.startsWith('|') && !line.startsWith('|---') && !line.startsWith('| #') && !line.startsWith('| Проект') && !line.startsWith('| Проект')) {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean);
      if (section === 'projects' && cells.length >= 12) {
        projects.push({ num: cells[0], path: cells[1], brand: cells[2], domain: cells[3], preset: cells[4], color: cells[5], font: cells[6], logo: cells[7], hero: cells[8], author: cells[9], city: cells[10], style: cells[11], status: cells[12] || 'unknown' });
      }
      if (section === 'faq' && cells.length >= 2) faq.push({ project: cells[0], questions: cells[1] });
      if (section === 'slugs' && cells.length >= 2) slugs.push({ project: cells[0], slugs: cells[1] });
      if (section === 'images' && cells.length >= 3) images.push({ project: cells[0], scheme: cells[1], names: cells[2] });
    }

    if (section === 'presets' && line.startsWith('- [')) {
      const used = line.includes('[ ]');
      const match = line.match(/(\d+)\s*—\s*(.+)/);
      if (match) presets.push({ num: parseInt(match[1]), label: match[2].trim(), used });
    }
  }

  return { projects, faq, slugs, images, presets };
}

function scanProjects() {
  const result = [];
  if (!fs.existsSync(PROJECTS_DIR)) return result;

  for (const brand of fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })) {
    if (!brand.isDirectory()) continue;
    const brandDir = path.join(PROJECTS_DIR, brand.name);
    for (const proj of fs.readdirSync(brandDir, { withFileTypes: true })) {
      if (!proj.isDirectory()) continue;
      const projDir = path.join(brandDir, proj.name);
      const configPath = path.join(projDir, 'project.config.json');
      const distPath = path.join(projDir, 'dist');
      const srcImages = path.join(projDir, 'src', 'assets', 'images');

      const info = {
        brand: brand.name,
        project: proj.name,
        path: `projects/${brand.name}/${proj.name}`,
        hasConfig: fs.existsSync(configPath),
        hasDist: fs.existsSync(distPath),
        pageCount: 0,
        imageCount: 0,
        config: null,
      };

      if (info.hasConfig) {
        try { info.config = JSON.parse(fs.readFileSync(configPath, 'utf-8')); } catch {}
      }
      if (info.hasDist) {
        info.pageCount = countHtml(distPath);
      }
      if (fs.existsSync(srcImages)) {
        info.imageCount = fs.readdirSync(srcImages).filter(f => /\.(png|jpg|jpeg|webp|svg)$/i.test(f)).length;
      }

      result.push(info);
    }
  }
  return result;
}

function countHtml(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) count += countHtml(path.join(dir, entry.name));
    else if (entry.name.endsWith('.html')) count++;
  }
  return count;
}

function generateHtml(registry, liveProjects) {
  const now = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' });
  const usedPresets = registry.presets.filter(p => p.used).length;
  const freePresets = registry.presets.filter(p => !p.used).length;
  const totalProjects = registry.projects.length;

  const usedFaqNums = new Set();
  registry.faq.forEach(f => {
    f.questions.split(',').map(n => n.trim()).filter(n => n !== '—').forEach(n => usedFaqNums.add(n));
  });

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dashboard — Генератор промо-сайтов</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0e17;color:#e2e8f0;font-family:system-ui,-apple-system,sans-serif;line-height:1.6;padding:24px}
h1{font-size:24px;font-weight:700;margin-bottom:8px}
h2{font-size:18px;font-weight:600;margin:32px 0 12px;color:#fbbf24}
.subtitle{color:#64748b;font-size:14px;margin-bottom:24px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:32px}
.stat{background:#111827;border:1px solid #1e293b;border-radius:12px;padding:16px;text-align:center}
.stat-value{font-size:28px;font-weight:700}
.stat-label{font-size:12px;color:#64748b;margin-top:4px}
.gold{color:#fbbf24}.green{color:#10b981}.red{color:#ef4444}.blue{color:#3b82f6}.purple{color:#a855f7}
table{width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px}
th{background:#1e293b;color:#94a3b8;font-weight:500;text-align:left;padding:10px 12px;white-space:nowrap}
td{border-bottom:1px solid #1e293b;padding:8px 12px;vertical-align:top}
tr:hover td{background:#111827}
.badge{display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:600}
.badge-green{background:#10b98120;color:#10b981}
.badge-yellow{background:#f59e0b20;color:#f59e0b}
.badge-red{background:#ef444420;color:#ef4444}
.badge-blue{background:#3b82f620;color:#3b82f6}
.badge-purple{background:#a855f720;color:#a855f7}
.presets{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
.preset{width:48px;height:48px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;border:2px solid}
.preset-free{background:#10b98115;border-color:#10b98140;color:#10b981}
.preset-used{background:#ef444415;border-color:#ef444440;color:#ef4444}
.faq-grid{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:24px}
.faq-num{width:32px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600}
.faq-free{background:#1e293b;color:#475569}
.faq-used{background:#f59e0b20;color:#f59e0b}
.section{background:#111827;border:1px solid #1e293b;border-radius:12px;padding:20px;margin-bottom:16px}
.live-info{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;margin-top:8px}
.live-item{font-size:12px;color:#94a3b8}
.live-item span{color:#e2e8f0;font-weight:500}
.filters{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.filter-btn{padding:6px 16px;border-radius:8px;border:1px solid #1e293b;background:#111827;color:#94a3b8;cursor:pointer;font-size:13px;font-weight:500;transition:all .2s}
.filter-btn:hover{border-color:#fbbf24;color:#fbbf24}
.filter-btn.active{background:#fbbf2420;border-color:#fbbf24;color:#fbbf24}
</style>
</head>
<body>
<h1>Dashboard — Генератор промо-сайтов</h1>
<p class="subtitle">Обновлено: ${now} (Алматы)</p>

<div class="stats">
  <div class="stat"><div class="stat-value gold">${totalProjects}</div><div class="stat-label">Проектов в реестре</div></div>
  <div class="stat"><div class="stat-value green">${liveProjects.filter(p=>p.hasDist).length}</div><div class="stat-label">Собрано (dist/)</div></div>
  <div class="stat"><div class="stat-value blue">${freePresets}</div><div class="stat-label">Свободных пресетов</div></div>
  <div class="stat"><div class="stat-value purple">${usedFaqNums.size}/80</div><div class="stat-label">FAQ использовано</div></div>
</div>

<h2>Проекты</h2>
<div class="section">
<div class="filters">
  <button class="filter-btn active" onclick="filterBrand('all')">Все</button>
  ${[...new Set(registry.projects.map(p => p.brand))].map(b => `<button class="filter-btn" onclick="filterBrand('${b}')">${b}</button>`).join('\n  ')}
</div>
<table id="projects-table">
<thead><tr><th>#</th><th>Бренд</th><th>Домен</th><th>Пресет</th><th>Цвет</th><th>Шрифт</th><th>Лого</th><th>Hero</th><th>Автор</th><th>Город</th><th>Стиль</th><th>Слоты</th><th>Страниц</th><th>Картинок</th><th>Статус</th></tr></thead>
<tbody>
${registry.projects.map((p, i) => {
  const live = liveProjects.find(lp => lp.path === p.path);
  const pages = live ? live.pageCount : '—';
  const imgs = live ? live.imageCount : '—';
  const slots = live && live.config && live.config.slot_pages ? live.config.slot_pages.join(', ') : '—';
  const statusClass = p.status === 'создан' ? 'badge-green' : p.status === 'создаётся' ? 'badge-yellow' : 'badge-blue';
  return `<tr data-brand="${p.brand}">
    <td>${p.num}</td>
    <td><span class="badge badge-purple">${p.brand}</span></td>
    <td>${p.domain}</td>
    <td>${p.preset}</td>
    <td><span class="badge badge-blue">${p.color}</span></td>
    <td>${p.font}</td>
    <td>${p.logo}</td>
    <td>${p.hero}</td>
    <td>${p.author}</td>
    <td>${p.city}</td>
    <td>${p.style}</td>
    <td><code style="font-size:11px;color:#a855f7">${slots}</code></td>
    <td>${pages}</td>
    <td>${imgs}</td>
    <td><span class="badge ${statusClass}">${p.status}</span></td>
  </tr>`;
}).join('\n')}
</tbody>
</table>
</div>

<h2>Пресеты вариаций</h2>
<div class="section">
<div class="presets">
${registry.presets.map(p => `<div class="preset ${p.used ? 'preset-used' : 'preset-free'}" title="${p.label}">${p.num}</div>`).join('\n')}
</div>
<p style="font-size:12px;color:#64748b">Зелёные — свободны, красные — заняты. Hover для деталей.</p>
</div>

<h2>FAQ-вопросы (80 шт.)</h2>
<div class="section">
<div class="faq-grid">
${Array.from({length:80}, (_,i) => {
  const n = String(i+1);
  const used = usedFaqNums.has(n);
  return `<div class="faq-num ${used ? 'faq-used' : 'faq-free'}">${n}</div>`;
}).join('\n')}
</div>
<p style="font-size:12px;color:#64748b">Жёлтые — использованы в проектах. Серые — свободны.</p>
</div>

<h2>URL-slugs по проектам</h2>
<div class="section">
<table>
<thead><tr><th>Проект</th><th>Slugs</th></tr></thead>
<tbody>
${registry.slugs.map(s => `<tr><td>${s.project}</td><td><code style="font-size:12px;color:#94a3b8">${s.slugs}</code></td></tr>`).join('\n')}
</tbody>
</table>
</div>

<h2>Сканирование файловой системы</h2>
<div class="section">
${liveProjects.map(p => `
<div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #1e293b">
  <strong>${p.path}</strong> ${p.hasDist ? '<span class="badge badge-green">собран</span>' : '<span class="badge badge-red">не собран</span>'}
  ${p.hasConfig ? '<span class="badge badge-blue">config</span>' : '<span class="badge badge-red">нет config</span>'}
  <div class="live-info">
    <div class="live-item">Страниц в dist: <span>${p.pageCount}</span></div>
    <div class="live-item">Изображений: <span>${p.imageCount}</span></div>
    ${p.config ? `<div class="live-item">Домен: <span>${p.config.domain}</span></div>` : ''}
    ${p.config ? `<div class="live-item">Бренд: <span>${p.config.brand}</span></div>` : ''}
    ${p.config ? `<div class="live-item">Автор: <span>${p.config.author?.name || '—'}</span></div>` : ''}
  </div>
</div>
`).join('\n')}
</div>

<p style="text-align:center;color:#475569;font-size:12px;margin-top:32px">
  Сгенерировано скриптом generate-dashboard.cjs | Запуск: node _scaffold/generate-dashboard.cjs
</p>
<script>
function filterBrand(brand) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('#projects-table tbody tr').forEach(row => {
    row.style.display = (brand === 'all' || row.dataset.brand === brand) ? '' : 'none';
  });
}
</script>
</body>
</html>`;
}

const registry = parseRegistry();
const liveProjects = scanProjects();
const html = generateHtml(registry, liveProjects);
fs.writeFileSync(OUTPUT, html, 'utf-8');
console.log(`Dashboard saved to: ${OUTPUT}`);
console.log(`Projects in registry: ${registry.projects.length}`);
console.log(`Live projects scanned: ${liveProjects.length}`);
console.log(`Open in browser: file://${OUTPUT}`);
