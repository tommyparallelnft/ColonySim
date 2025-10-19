# Colony Sim - Sync Notion and Push to GitHub
# This script syncs data from Notion to JSON and pushes to GitHub

Write-Host "🎮 Colony Sim - Sync & Push" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Sync from Notion
Write-Host "📡 Step 1: Syncing data from Notion..." -ForegroundColor Yellow
npm run sync-notion

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to sync from Notion. Make sure the backend is running!" -ForegroundColor Red
    Write-Host "   Run: cd notion-backend && node index.js" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Step 2: Git add all changes
Write-Host "📝 Step 2: Staging changes..." -ForegroundColor Yellow
git add .

# Step 3: Commit
Write-Host "💾 Step 3: Committing changes..." -ForegroundColor Yellow
$commitMessage = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Update game configuration from Notion"
}

git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Nothing to commit or commit failed" -ForegroundColor Yellow
}

Write-Host ""

# Step 4: Push to GitHub
Write-Host "🚀 Step 4: Pushing to GitHub..." -ForegroundColor Yellow
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Success! Changes pushed to GitHub" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Your game will be updated at:" -ForegroundColor Cyan
    Write-Host "   https://tommyparallelnft.github.io/ColonySim/" -ForegroundColor White
    Write-Host ""
    Write-Host "⏱️  GitHub Pages will rebuild in ~1-2 minutes" -ForegroundColor Yellow
} else {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    exit 1
}

