# PulsePredict AI - Website Launcher
# Run this script from the project root: Early-disease-prediction\

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "  PulsePredict AI - Starting System & Website...          " -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

# Check domain mapping in hosts file
$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$hasDomain = (Get-Content -Path $hostsPath -ErrorAction SilentlyContinue) -match "pulsepredict\.ai"

if (-not $hasDomain) {
    Write-Host "[!] Domain 'pulsepredict.ai' not yet registered in hosts file." -ForegroundColor Yellow
    Write-Host "    To enable direct 'http://pulsepredict.ai' domain access:" -ForegroundColor Yellow
    Write-Host "    Right-click 'setup_domain.ps1' -> 'Run with PowerShell' as Administrator." -ForegroundColor Yellow
    Write-Host ""
    $webUrl = "http://localhost"
} else {
    Write-Host "[+] Custom domain 'pulsepredict.ai' is active!" -ForegroundColor Green
    $webUrl = "http://pulsepredict.ai"
}

# Start Backend (FastAPI + Uvicorn)
Write-Host "[1/2] Starting FastAPI Intelligence Engine (port 8000)..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; .\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload" -PassThru
Write-Host "      Backend PID: $($backendProcess.Id) (Active on :8000)" -ForegroundColor Green

Start-Sleep -Seconds 2

# Start Frontend (Vite on standard HTTP port 80)
Write-Host "[2/2] Starting Web Application (port 80)..." -ForegroundColor Yellow
$frontendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; npm run dev -- --port 80" -PassThru
Write-Host "      Frontend PID: $($frontendProcess.Id) (Active on :80)" -ForegroundColor Green

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Green
Write-Host "  Website is ONLINE!                                     " -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  * Website URL:  $webUrl" -ForegroundColor Cyan
Write-Host "  * API Docs:     http://localhost:8000/docs" -ForegroundColor White
Write-Host "  * Model Ver:    v2.0.0 (SVM, Logistic Regression, XGBoost)" -ForegroundColor White
Write-Host ""
Write-Host "  Opening $webUrl in your browser..." -ForegroundColor Gray
Write-Host ""

# Automatically open website in browser
Start-Sleep -Seconds 1
Start-Process $webUrl

