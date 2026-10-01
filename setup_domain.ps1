# PulsePredict AI - Domain Name Setup Script
# Maps 'pulsepredict.ai' to 127.0.0.1 in Windows hosts file
# Requires Administrator privileges (will auto-elevate if needed)

$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$domainsToAdd = @(
    "127.0.0.1  pulsepredict.ai",
    "127.0.0.1  www.pulsepredict.ai"
)

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "Requesting Administrator privileges to register 'pulsepredict.ai' domain in Windows hosts file..." -ForegroundColor Yellow
    Start-Process powershell.exe -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
    exit
}

try {
    $existing = Get-Content -Path $hostsPath -Raw -ErrorAction Stop
    $added = 0
    foreach ($line in $domainsToAdd) {
        $domainName = ($line -split "\s+")[1]
        if ($existing -notmatch [regex]::Escape($domainName)) {
            Add-Content -Path $hostsPath -Value "`n$line" -ErrorAction Stop
            Write-Host "  [+] Added: $line" -ForegroundColor Green
            $added++
        } else {
            Write-Host "  [*] Already configured: $domainName" -ForegroundColor Cyan
        }
    }
    
    # Flush DNS Resolver Cache
    ipconfig /flushdns | Out-Null

    Write-Host ""
    Write-Host "=========================================================" -ForegroundColor Green
    Write-Host "  Domain 'http://pulsepredict.ai' is now ACTIVE!        " -ForegroundColor Green
    Write-Host "  You can now type 'pulsepredict.ai' in your browser.   " -ForegroundColor Green
    Write-Host "=========================================================" -ForegroundColor Green
    Write-Host ""
    Start-Sleep -Seconds 3
} catch {
    Write-Host "Error updating hosts file: $_" -ForegroundColor Red
    Start-Sleep -Seconds 5
}
