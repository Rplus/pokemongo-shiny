#!/usr/bin/env bash

set -euo pipefail

APP_HOST="${APP_HOST:-127.0.0.1}"
APP_PORT="${APP_PORT:-5173}"
IMG_PORT="${IMG_PORT:-1111}"

APP_URL="http://${APP_HOST}:${APP_PORT}/pokemongo-shiny/"
CDN_IMAGE="https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm1.s.icon.png"
LOCAL_IMG_URL="http://localhost:${IMG_PORT}/new-imgs/pm1.s.icon.png"

need_image_server=0
if [[ "${APP_HOST}" == "localhost" ]]; then
  need_image_server=1
fi

cleanup() {
  if [[ -n "${DEV_PID:-}" ]] && kill -0 "$DEV_PID" 2>/dev/null; then
    kill "$DEV_PID" || true
  fi
  if [[ -n "${IMG_PID:-}" ]] && kill -0 "$IMG_PID" 2>/dev/null; then
    kill "$IMG_PID" || true
  fi
  wait || true
}
trap cleanup EXIT INT TERM

wait_for_http() {
  local url="$1"
  local retries=30
  for i in $(seq 1 "$retries"); do
    if curl -fsS "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  echo "timeout waiting for $url"
  return 1
}

echo "Starting Pokémon Go Shiny test environment"

if (( need_image_server )); then
  if [[ ! -d "tasks/tmp/new-imgs" ]]; then
    echo "Missing tasks/tmp/new-imgs. Local image server will not start."
  else
    echo "Starting local image server on :${IMG_PORT}"
    python3 -m http.server "${IMG_PORT}" --directory tasks/tmp/new-imgs > /tmp/pokego-img.log 2>&1 &
    IMG_PID=$!
  fi
fi

echo "Starting app on ${APP_URL}"
npm run dev -- --host "${APP_HOST}" --port "${APP_PORT}" > /tmp/pokego-dev.log 2>&1 &
DEV_PID=$!

wait_for_http "${APP_URL}"
echo "App is reachable: ${APP_URL}"

echo "Checking CDN image endpoint"
if curl -fsSI "${CDN_IMAGE}" >/dev/null 2>&1; then
  echo "CDN image OK"
else
  echo "CDN image check FAILED"
fi

if (( need_image_server )); then
  echo "Checking local image endpoint"
  if curl -fsSI "${LOCAL_IMG_URL}" >/dev/null 2>&1; then
    echo "Local image OK"
  else
    echo "Local image check FAILED"
  fi
fi

echo ""
echo "Tips:"
echo "  Open ${APP_URL}"
echo "  Console checks"
echo "  - cards: document.querySelectorAll('.pm').length"
echo "  - first image: document.querySelector('.pm img')?.src"
echo ""

wait
