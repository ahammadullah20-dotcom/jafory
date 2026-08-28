#!/usr/bin/env bash
set -u
base="https://jafory.netlify.app"
printf 'LIVE %s\n' "$base"
for path in / /admin /account /contact /compare /category/electronics /category/fashion /category/home-living /category/beauty-wellness /category/daily-essentials /category/ai-learn-ai-tech /robots.txt /sitemap.xml /google-site-verification.html; do
  code=$(curl --http1.1 -sS -o /tmp/jafory-audit-body -w '%{http_code}' --retry 2 --max-time 25 "$base$path" || true)
  bytes=$(wc -c </tmp/jafory-audit-body 2>/dev/null || echo 0)
  title=$(grep -o '<title>[^<]*' /tmp/jafory-audit-body 2>/dev/null | head -1 | sed 's/<title>//' || true)
  printf '%-34s %s %s %s\n' "$path" "$code" "$bytes" "$title"
done
for endpoint in 'catalog.home' 'catalog.category'; do
  printf 'ENDPOINT %s\n' "$endpoint"
done
