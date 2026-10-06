#!/bin/bash
# ==============================================================================
# StartGuard AI - Startup Failure Prediction & Runway Intelligence Platform
# Starts FastAPI Backend (Port 8000) and React 19 / Vite Frontend (Port 5173)
# ==============================================================================

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo "================================================================="
echo "   STARTGUARD AI: STARTUP RUNWAY & FAILURE PREDICTION PLATFORM   "
echo "================================================================="
echo "Project Root: $ROOT_DIR"
echo ""

# 1. Start Backend in Background
echo "Starting FastAPI Backend on http://127.0.0.1:8000..."
cd "$BACKEND_DIR"
"$BACKEND_DIR/venv/bin/uvicorn" main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

sleep 2

# 2. Start Frontend
echo "Starting React/Vite Frontend on http://localhost:5173..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "-----------------------------------------------------------------"
echo "StartGuard AI is now running!"
echo "  • Web Dashboard : http://localhost:5173"
echo "  • Backend REST  : http://127.0.0.1:8000"
echo "  • API Docs (Swagger): http://127.0.0.1:8000/docs"
echo "-----------------------------------------------------------------"
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM
wait
