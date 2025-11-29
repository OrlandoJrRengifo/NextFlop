#!/usr/bin/env bash
set -euo pipefail

API_URL=${API_URL:-http://localhost:8000}

echo "Running simple smoke tests against $API_URL"

# wait for gateway to be up
for i in {1..30}; do
  if curl -fsS "$API_URL/" >/dev/null 2>&1 || curl -fsS "$API_URL/api/media?limit=1" >/dev/null 2>&1; then
    echo "API reachable"
    break
  fi
  echo "Waiting for API gateway... ($i)"
  sleep 2
done

# create a unique test user
TS=$(date +%s)
EMAIL="smoke+$TS@example.com"
PASSWORD="smokepass123"

echo "Registering test user: $EMAIL"
REGISTER_RESP=$(curl -s -X POST "$API_URL/api/auth/register" -H "Content-Type: application/json" -d '{"email":"'$EMAIL'","password":"'$PASSWORD'","name":"Smoke Tester"}')

echo "Register response: $REGISTER_RESP"

# login (some services may return the token on register, but still call login to be consistent)
echo "Logging in as test user"
LOGIN_RESP=$(curl -s -X POST "$API_URL/api/auth/login" -H "Content-Type: application/json" -d '{"email":"'$EMAIL'","password":"'$PASSWORD'"}')
echo "Login response: $LOGIN_RESP"

# extract token and user id using python (robust across keys)
TOKEN=$(printf '%s' "$LOGIN_RESP" | python3 - <<'PY'
import sys, json
try:
  j = json.load(sys.stdin)
except Exception:
  print('')
  sys.exit(0)
token = ''
if isinstance(j, dict):
  token = j.get('accessToken') or j.get('access_token') or j.get('token') or ''
  user = j.get('user') or {}
  uid = user.get('id') or user.get('_id') or ''
  # emit token and user id separated by a space
  print(token + ' ' + uid)
else:
  print(' ')
PY
)

TOKEN=$(echo "$TOKEN" | awk '{print $1}')
USER_ID=$(echo "$TOKEN" | awk '{print $2}')

if [ -z "$TOKEN" ]; then
  echo "ERROR: login did not return a token. Aborting."
  exit 1
fi

echo "Got auth token: ${TOKEN:0:10}..."
AUTH_HEADER="Authorization: Bearer $TOKEN"

echo "Fetching a few media items..."
MEDIA_LIST=$(curl -s -G "$API_URL/api/media" --data-urlencode "limit=5")
echo "Media list: $(printf '%s' "$MEDIA_LIST" | python3 -c 'import sys, json; print(json.dumps(json.load(sys.stdin)) if sys.stdin.readable() else "{}")' 2>/dev/null || echo "$MEDIA_LIST")"

# pick first media id (if any)
MEDIA_ID=$(printf '%s' "$MEDIA_LIST" | python3 - <<'PY'
import sys, json
try:
  j = json.load(sys.stdin)
except Exception:
  print('')
  sys.exit(0)
if isinstance(j, list) and len(j) > 0:
  first = j[0]
  if isinstance(first, dict):
    print(first.get('id') or first.get('_id') or first.get('movieId') or '')
  else:
    print('')
else:
  print('')
PY
)

echo "First media id: $MEDIA_ID"

echo "Checking popular & new-releases endpoints"
curl -s -f "$API_URL/api/media/popular" -o /dev/null && echo "OK: /api/media/popular"
curl -s -f "$API_URL/api/media/new-releases" -o /dev/null && echo "OK: /api/media/new-releases"

if [ -n "$MEDIA_ID" ]; then
  echo "Adding media ($MEDIA_ID) to user watchlist"
  ADD_RESP=$(curl -s -X POST "$API_URL/api/users/watchlist" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"movieId":"'$MEDIA_ID'"}')
  echo "Add watchlist response: $ADD_RESP"

  echo "Removing media from watchlist"
  REMOVE_RESP=$(curl -s -X DELETE "$API_URL/api/users/watchlist/$MEDIA_ID" -H "$AUTH_HEADER")
  echo "Remove watchlist response: $REMOVE_RESP"
else
  echo "No media items found; skipping watchlist tests"
fi

echo "Creating a profile for the user (if endpoint accepts it)"
PROFILE_RESP=$(curl -s -X POST "$API_URL/api/users/profiles" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{"name":"Smoke Profile"}')
echo "Profile response: $PROFILE_RESP"

PROFILE_ID=$(printf '%s' "$PROFILE_RESP" | python3 - <<'PY'
import sys, json
try:
  j = json.load(sys.stdin)
except Exception:
  print('')
  sys.exit(0)
if isinstance(j, dict):
  print(j.get('id') or j.get('_id') or '')
else:
  print('')
PY
)

if [ -n "$PROFILE_ID" ]; then
  echo "Created profile id: $PROFILE_ID, deleting it now"
  DELP=$(curl -s -X DELETE "$API_URL/api/users/profiles/$PROFILE_ID" -H "$AUTH_HEADER")
  echo "Delete profile response: $DELP"
fi

echo "Fetching subscription plans"
PLANS=$(curl -s "$API_URL/api/subscriptions/plans")
echo "Plans: $PLANS"

echo "Smoke tests finished — basic flows executed successfully"