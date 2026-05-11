#!/usr/bin/env pwsh
#requires -Version 7.0

<#
.SYNOPSIS
    Coolify Deployment Automation Script
.DESCRIPTION
    Automates deployment of TextFileSKBBK to Coolify
.NOTES
    Version: 1.0
    Requires: PowerShell 7.0+
#>

$ErrorActionPreference = "Stop"

Write-Host "🚀 Coolify Deployment Automation" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$CoolifyUrl = "http://waju.my:8000"
$ProjectUuid = "r10k19fu0ro125hx8s65uxot"
$EnvironmentUuid = "esqew8egcccgvy5xjioz473y"
$ApplicationUuid = "yqzj0jtm69xb8ddqwtbl07es"

# Colors
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Cyan = "Cyan"

function Write-Status {
    param($Message, $Status)
    switch ($Status) {
        "Success" { Write-Host "✅ $Message" -ForegroundColor $Green }
        "Warning" { Write-Host "⚠️  $Message" -ForegroundColor $Yellow }
        "Error" { Write-Host "❌ $Message" -ForegroundColor $Red }
        "Info" { Write-Host "ℹ️  $Message" -ForegroundColor $Cyan }
    }
}

function Test-GitStatus {
    Write-Status "Checking git status..." "Info"

    $branch = git branch --show-current 2>$null
    if ($branch -ne "clean-main") {
        Write-Status "Not on clean-main branch. Current: $branch" "Error"
        exit 1
    }

    $status = git status --porcelain
    if ($status) {
        Write-Status "Uncommitted changes found:" "Error"
        Write-Host $status
        Write-Status "Please commit changes first" "Error"
        exit 1
    }

    Write-Status "Git status clean on branch: $branch" "Success"
}

function Test-SensitiveData {
    Write-Status "Scanning for sensitive data..." "Info"

    $patterns = @(
        "walter@.*\.my",
        "60123757460",
        "sk_live_[a-zA-Z0-9]{10,}",
        "43\.156\.140\.185"
    )

    $found = $false
    $scriptName = Split-Path -Leaf $PSCommandPath
    foreach ($pattern in $patterns) {
        $matches = git ls-files | Where-Object { $_ -ne $scriptName } | xargs grep -l $pattern 2>$null
        if ($matches) {
            Write-Status "Found sensitive pattern '$pattern' in: $matches" "Error"
            $found = $true
        }
    }

    if ($found) {
        Write-Status "Sensitive data detected! Aborting." "Error"
        exit 1
    }

    Write-Status "No sensitive data found" "Success"
}

function Push-ToGitHub {
    Write-Status "Pushing to GitHub..." "Info"

    git push origin clean-main 2>&1 | Out-Null

    if ($LASTEXITCODE -ne 0) {
        Write-Status "Failed to push to GitHub" "Error"
        exit 1
    }

    Write-Status "Pushed to GitHub successfully" "Success"
}

function Show-NextSteps {
    Write-Host ""
    Write-Host "📋 Next Steps (Manual in Coolify):" -ForegroundColor $Cyan
    Write-Host "===================================" -ForegroundColor $Cyan
    Write-Host ""
    Write-Host "1. Open Coolify Dashboard:"
    Write-Host "   $CoolifyUrl"
    Write-Host ""
    Write-Host "2. Navigate to:"
    Write-Host "   Project > production > textfilecaruman"
    Write-Host ""
    Write-Host "3. Check Environment Variables:"
    Write-Host "   - DATABASE_URL (from Coolify DB settings)"
    Write-Host "   - NEXTAUTH_SECRET (generate: openssl rand -base64 32)"
    Write-Host "   - SMTP_USER, SMTP_PASSWORD"
    Write-Host "   - BILLPLZ_* keys"
    Write-Host ""
    Write-Host "4. Click 'Deploy' button"
    Write-Host ""
    Write-Host "5. Monitor deployment logs"
    Write-Host ""
    Write-Host "🔗 Useful URLs:"
    Write-Host "   - Coolify:    $CoolifyUrl/project/$ProjectUuid"
    Write-Host "   - App:        https://caruman.waju.my"
    Write-Host "   - GitHub:     https://github.com/kamkikorich/textfilecaruman"
    Write-Host ""
}

# Main Execution
try {
    Test-GitStatus
    Test-SensitiveData
    Push-ToGitHub
    Show-NextSteps

    Write-Status "Automation completed successfully!" "Success"
}
catch {
    Write-Status "Unexpected error: $_" "Error"
    exit 1
}
