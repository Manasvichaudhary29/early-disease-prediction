# PulsePredict AI - Start All Servers
# Run this script from the project root: Early-disease-prediction\

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  PulsePredict AI - Starting Servers..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Start Backend (FastAPI + Uvicorn)
Write-Host "[1/2] Starting FastAPI Backend (port 8000)..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; .\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload" -PassThru
Write-Host "      Backend PID: $($backendProcess.Id)" -ForegroundColor Green

Start-Sleep -Seconds 2

# Start Frontend (Vite Dev Server)
Write-Host "[2/2] Starting Vite Frontend (port 5173)..." -ForegroundColor Yellow
$frontendProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; npm run dev" -PassThru
Write-Host "      Frontend PID: $($frontendProcess.Id)" -ForegroundColor Green

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  All servers running!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:   http://localhost:8000" -ForegroundColor White
Write-Host "  API Docs:  http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "  Press CTRL+C to exit or close the terminal windows." -ForegroundColor Gray
Write-Host ""

# Open browser
Start-Sleep -Seconds 2
Start-Process "http://localhost:5173"
