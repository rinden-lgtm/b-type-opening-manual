# GitHub へプッシュ（初回のみ gh auth login が必要）
# 使い方: .\scripts\publish.ps1

$ErrorActionPreference = "Stop"
$RepoName = "b-type-opening-manual"
$GitHubOrg = "rinden-lgtm"
$RemoteUrl = "https://github.com/$GitHubOrg/$RepoName.git"

Write-Host "=== 就労継続支援B型 開設準備手引書 - GitHub 公開 ===" -ForegroundColor Cyan

# GitHub CLI 認証確認
$ghAuth = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "GitHub CLI にログインしていません。" -ForegroundColor Yellow
    Write-Host "以下を実行してログインしてください:" -ForegroundColor Yellow
    Write-Host "  gh auth login" -ForegroundColor White
    exit 1
}

# リモートリポジトリ確認・作成
$remoteExists = git remote get-url origin 2>$null
if (-not $remoteExists) {
    Write-Host "GitHub リポジトリを作成します: $GitHubOrg/$RepoName" -ForegroundColor Green
    gh repo create $RepoName --private --source=. --remote=origin --description "就労継続支援B型 開設準備手引書（社内マニュアル）"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "リポジトリ作成に失敗しました。手動で作成してください:" -ForegroundColor Red
        Write-Host "  gh repo create $RepoName --private --source=. --remote=origin" -ForegroundColor White
        exit 1
    }
} else {
    Write-Host "リモート origin: $remoteExists" -ForegroundColor Green
}

# main ブランチへプッシュ
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== GitHub へのプッシュ完了 ===" -ForegroundColor Green
    Write-Host "リポジトリ: https://github.com/$GitHubOrg/$RepoName" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "次のステップ（Vercel）:" -ForegroundColor Yellow
    Write-Host "  1. https://vercel.com にログイン" -ForegroundColor White
    Write-Host "  2. Add New Project → GitHub から $RepoName を Import" -ForegroundColor White
    Write-Host "  3. Build Command: npm run docs:build" -ForegroundColor White
    Write-Host "  4. Output Directory: docs/.vitepress/dist" -ForegroundColor White
    Write-Host "  5. Deploy を実行" -ForegroundColor White
} else {
    Write-Host "プッシュに失敗しました。" -ForegroundColor Red
    exit 1
}
