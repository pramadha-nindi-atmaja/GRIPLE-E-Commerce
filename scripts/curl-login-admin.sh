#!/usr/bin/env bash
# Simulasi login NextAuth (Credentials) dengan curl.
# Syarat: `pnpm dev` jalan di BASE_URL (default http://localhost:3000)
#         Akun ada di DB setelah `pnpm db:seed`

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
EMAIL="${ADMIN_EMAIL:-admin@griple.com}"
PASSWORD="${ADMIN_PASSWORD:-dev-admin-change-me}"
COOKIE_JAR="${TMPDIR:-/tmp}/griple-auth-cookies.txt"
HEADER_OUT="${COOKIE_JAR}.headers.txt"

rm -f "$COOKIE_JAR" "$HEADER_OUT"

echo "1) Ambil CSRF + cookie..."
CSRF_JSON=$(curl -sS -c "$COOKIE_JAR" "${BASE_URL}/api/auth/csrf")
TOKEN=$(node -e "console.log(JSON.parse(process.argv[1]).csrfToken)" "$CSRF_JSON")

echo "2) POST credentials (form-urlencoded)..."
HTTP=$(curl -sS -D "$HEADER_OUT" -o /dev/null -w "%{http_code}" \
  -b "$COOKIE_JAR" -c "$COOKIE_JAR" \
  -X POST "${BASE_URL}/api/auth/callback/credentials" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Origin: ${BASE_URL}" \
  -H "Referer: ${BASE_URL}/auth/login" \
  --data-urlencode "csrfToken=${TOKEN}" \
  --data-urlencode "email=${EMAIL}" \
  --data-urlencode "password=${PASSWORD}" \
  --data-urlencode "callbackUrl=${BASE_URL}/admin/dashboard")

echo "HTTP status: $HTTP"
echo "--- Response headers ---"
cat "$HEADER_OUT"

if [[ "$HTTP" == "302" ]] && grep -qi "Location:.*admin/dashboard" "$HEADER_OUT" 2>/dev/null; then
  echo ""
  echo "OK: redirect ke admin (session di cookie jar: $COOKIE_JAR)."
elif [[ "$HTTP" == "302" ]] && grep -qi "CredentialsSignin" "$HEADER_OUT" 2>/dev/null; then
  echo ""
  echo "GAGAL: CredentialsSignin — jalankan pnpm db:seed dan cek EMAIL/PASSWORD / DATABASE_URL."
elif [[ "$HTTP" == "302" ]] && grep -qi "MissingCSRF" "$HEADER_OUT" 2>/dev/null; then
  echo ""
  echo "GAGAL: MissingCSRF — pastikan GET CSRF dan POST pakai cookie jar yang sama (-b -c)."
fi
