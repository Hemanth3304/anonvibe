#!/usr/bin/env pwsh
# ═══════════════════════════════════════════════════════════
#  AnonVibe — Windows Upload & Deploy Helper
#  Run this from PowerShell on your Windows machine
#  Usage: .\upload_and_deploy.ps1 -ServerIP 1.2.3.4 -Domain yourdomain.com -Email you@email.com
# ═══════════════════════════════════════════════════════════

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,

    [Parameter(Mandatory=$true)]
    [string]$Domain,

    [Parameter(Mandatory=$true)]
    [string]$Email,

    [string]$SSHUser = "root",
    [string]$ProjectPath = "$PSScriptRoot"
)

Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   AnonVibe — Upload & Deploy                 ║" -ForegroundColor Cyan
Write-Host "║   Server : $ServerIP                         ║" -ForegroundColor Cyan  
Write-Host "║   Domain : $Domain                           ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Upload project files ─────────────────────────────
Write-Host "▶ Uploading project to server..." -ForegroundColor Yellow
Write-Host "  (This may take a minute — uploading node_modules-free copy)" -ForegroundColor Gray

# Create a temp copy without node_modules for faster upload
$TempDir = "$env:TEMP\anonvibe_upload"
if (Test-Path $TempDir) { Remove-Item $TempDir -Recurse -Force }
New-Item -ItemType Directory -Path $TempDir | Out-Null

# Copy project excluding node_modules and dist
robocopy $ProjectPath $TempDir /E /XD "node_modules" ".git" /XF "*.log" | Out-Null

Write-Host "  Uploading via SCP..." -ForegroundColor Gray
scp -r $TempDir "${SSHUser}@${ServerIP}:/srv/anonvibe"

if ($LASTEXITCODE -ne 0) {
    Write-Host "✖ SCP failed. Make sure SSH is set up correctly." -ForegroundColor Red
    exit 1
}

Write-Host "✔ Upload complete!" -ForegroundColor Green

# ── Step 2: Run deploy script on server ──────────────────────
Write-Host ""
Write-Host "▶ Running deploy script on server..." -ForegroundColor Yellow

ssh "${SSHUser}@${ServerIP}" @"
cd /srv/anonvibe
chmod +x deploy.sh
bash deploy.sh "$Domain" "$Email"
"@

Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ Deployment complete!                     ║" -ForegroundColor Green
Write-Host "║     https://$Domain                         ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Green
