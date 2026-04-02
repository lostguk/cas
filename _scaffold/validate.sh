#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'
PASS=0
FAIL=0
WARN=0

check() {
  if [ "$1" = "pass" ]; then
    echo -e "  ${GREEN}✓${NC} $2"
    ((PASS++))
  elif [ "$1" = "fail" ]; then
    echo -e "  ${RED}✗${NC} $2"
    ((FAIL++))
  else
    echo -e "  ${YELLOW}⚠${NC} $2"
    ((WARN++))
  fi
}

PROJECT_DIR="${1:-.}"

if [ ! -f "$PROJECT_DIR/project.config.json" ]; then
  echo -e "${RED}project.config.json не найден в $PROJECT_DIR${NC}"
  exit 1
fi

echo ""
echo "=== Валидация проекта: $PROJECT_DIR ==="
echo ""

DOMAIN=$(python3 -c "import json; print(json.load(open('$PROJECT_DIR/project.config.json'))['domain'])" 2>/dev/null)
BRAND=$(python3 -c "import json; print(json.load(open('$PROJECT_DIR/project.config.json'))['brand'])" 2>/dev/null)
PAGES=$(python3 -c "import json; d=json.load(open('$PROJECT_DIR/project.config.json')); print(' '.join(d.get('pages',[]) + d.get('slot_pages',[])))" 2>/dev/null)

echo "Бренд: $BRAND | Домен: $DOMAIN"
echo ""

echo "[1] Сборка"
if [ -d "$PROJECT_DIR/dist" ]; then
  check pass "Папка dist/ существует"
else
  check fail "Папка dist/ НЕ найдена — запустите npm run build"
fi

echo ""
echo "[2] Страницы"
for page in $PAGES; do
  if [ "$page" = "index" ]; then
    [ -f "$PROJECT_DIR/dist/index.html" ] && check pass "/ (index.html)" || check fail "/ (index.html) НЕ найден"
  else
    [ -f "$PROJECT_DIR/dist/$page/index.html" ] && check pass "/$page" || check fail "/$page НЕ найден в dist/"
  fi
done
[ -f "$PROJECT_DIR/dist/404.html" ] && check pass "/404" || check fail "/404.html НЕ найден"

echo ""
echo "[3] Изображения"
IMG_COUNT=$(find "$PROJECT_DIR/src/assets/images" -type f 2>/dev/null | wc -l | tr -d ' ')
if [ "$IMG_COUNT" -ge 13 ]; then
  check pass "Изображений: $IMG_COUNT (минимум 13)"
elif [ "$IMG_COUNT" -ge 7 ]; then
  check warn "Изображений: $IMG_COUNT (рекомендуется 13+)"
else
  check fail "Изображений: $IMG_COUNT (мало, нужно минимум 7)"
fi

echo ""
echo "[4] Статические файлы"
[ -f "$PROJECT_DIR/public/.htaccess" ] && check pass ".htaccess" || check fail ".htaccess НЕ найден"
[ -f "$PROJECT_DIR/public/robots.txt" ] && check pass "robots.txt" || check fail "robots.txt НЕ найден"
[ -f "$PROJECT_DIR/public/favicon.svg" ] && check pass "favicon.svg" || check fail "favicon.svg НЕ найден"
[ -f "$PROJECT_DIR/public/og-default.png" ] && check pass "og-default.png" || check warn "og-default.png НЕ найден в public/"

if [ -f "$PROJECT_DIR/public/robots.txt" ]; then
  grep -q "$DOMAIN" "$PROJECT_DIR/public/robots.txt" && check pass "robots.txt содержит домен $DOMAIN" || check fail "robots.txt НЕ содержит домен $DOMAIN"
fi

echo ""
echo "[5] Sitemap"
[ -f "$PROJECT_DIR/dist/sitemap-index.xml" ] && check pass "sitemap-index.xml" || check fail "sitemap НЕ сгенерирован"

echo ""
echo "[6] Код"
COMMENT_COUNT=$(grep -r "^\s*//" "$PROJECT_DIR/src" --include="*.astro" --include="*.ts" --include="*.css" 2>/dev/null | wc -l | tr -d ' ')
if [ "$COMMENT_COUNT" -eq 0 ]; then
  check pass "Комментариев в коде: 0"
else
  check fail "Найдено $COMMENT_COUNT строк с комментариями (должно быть 0)"
fi

echo ""
echo "[7] Уникальность title"
TITLES=$(grep -rh "<title>" "$PROJECT_DIR/dist" --include="*.html" 2>/dev/null | sort)
UNIQUE_TITLES=$(echo "$TITLES" | sort -u | wc -l | tr -d ' ')
TOTAL_TITLES=$(echo "$TITLES" | wc -l | tr -d ' ')
if [ "$UNIQUE_TITLES" -eq "$TOTAL_TITLES" ]; then
  check pass "Все title уникальны ($UNIQUE_TITLES страниц)"
else
  check fail "Дубликаты title: $TOTAL_TITLES всего, $UNIQUE_TITLES уникальных"
fi

echo ""
echo "[8] project.config.json"
[ -f "$PROJECT_DIR/project.config.json" ] && check pass "Конфиг на месте" || check fail "Конфиг отсутствует"

echo ""
echo "================================"
echo -e "  ${GREEN}Passed: $PASS${NC}  ${RED}Failed: $FAIL${NC}  ${YELLOW}Warnings: $WARN${NC}"
echo "================================"
echo ""

[ "$FAIL" -eq 0 ] && echo -e "${GREEN}Проект готов к деплою!${NC}" || echo -e "${RED}Есть ошибки — исправьте перед деплоем${NC}"
exit $FAIL
