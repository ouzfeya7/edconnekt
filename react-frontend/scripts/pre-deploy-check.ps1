# Script de verification pre-deploiement
# Usage: .\scripts\pre-deploy-check.ps1

Write-Host "Pre-deploiement EdConnekt Frontend" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0

# 1. Verifier que node_modules existe
Write-Host "Verification des dependances..." -ForegroundColor Yellow
if (-Not (Test-Path "node_modules")) {
    Write-Host "Erreur: node_modules manquant. Executez npm install" -ForegroundColor Red
    $errors++
} else {
    Write-Host "OK - node_modules present" -ForegroundColor Green
}

# 2. Verifier .env.local
Write-Host ""
Write-Host "Verification des variables d'environnement..." -ForegroundColor Yellow
if (-Not (Test-Path ".env.local")) {
    Write-Host "Attention: .env.local manquant" -ForegroundColor Yellow
    $warnings++
} else {
    Write-Host "OK - .env.local present" -ForegroundColor Green
}

# 3. Build TypeScript
Write-Host ""
Write-Host "Compilation TypeScript..." -ForegroundColor Yellow
$tscOutput = & npx tsc -b 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreurs TypeScript detectees:" -ForegroundColor Red
    Write-Host $tscOutput -ForegroundColor Red
    $errors++
} else {
    Write-Host "OK - Aucune erreur TypeScript" -ForegroundColor Green
}

# 4. Build Vite
Write-Host ""
Write-Host "Build de production..." -ForegroundColor Yellow
$buildOutput = & npm run build 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build echoue:" -ForegroundColor Red
    Write-Host $buildOutput -ForegroundColor Red
    $errors++
} else {
    Write-Host "OK - Build reussi" -ForegroundColor Green
    
    # Verifier la taille du bundle
    if (Test-Path "dist/assets") {
        $jsFiles = Get-ChildItem -Path "dist/assets" -Filter "*.js" -File
        $totalSize = ($jsFiles | Measure-Object -Property Length -Sum).Sum / 1MB
        
        Write-Host "Taille totale des JS: $([math]::Round($totalSize, 2)) MB" -ForegroundColor Cyan
        
        if ($totalSize -gt 5) {
            Write-Host "Warning: Bundle tres large (>5MB)" -ForegroundColor Yellow
            $warnings++
        }
    }
}

# 5. Verifier dist/
Write-Host ""
Write-Host "Verification du dossier dist/..." -ForegroundColor Yellow
if (-Not (Test-Path "dist/index.html")) {
    Write-Host "Erreur: dist/index.html manquant" -ForegroundColor Red
    $errors++
} else {
    Write-Host "OK - dist/index.html present" -ForegroundColor Green
}

# 6. Verifier les fichiers critiques
Write-Host ""
Write-Host "Verification des fichiers critiques..." -ForegroundColor Yellow
$criticalFiles = @(
    "src/main.tsx",
    "src/App.tsx",
    "index.html",
    "vite.config.ts"
)

foreach ($file in $criticalFiles) {
    if (-Not (Test-Path $file)) {
        Write-Host "Fichier manquant: $file" -ForegroundColor Red
        $errors++
    }
}
Write-Host "OK - Tous les fichiers critiques presents" -ForegroundColor Green

# Resume
Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "RESUME" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "Erreurs: $errors" -ForegroundColor $(if ($errors -eq 0) { "Green" } else { "Red" })
Write-Host "Warnings: $warnings" -ForegroundColor $(if ($warnings -eq 0) { "Green" } else { "Yellow" })
Write-Host ""

if ($errors -eq 0) {
    Write-Host "SUCCES: Le code semble pret pour la production!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaines etapes recommandees:" -ForegroundColor Cyan
    Write-Host "1. Executer npm run preview pour tester localement" -ForegroundColor White
    Write-Host "2. Verifier CHECKLIST_PRODUCTION.md pour les tests manuels" -ForegroundColor White
    Write-Host "3. Tester sur un environnement de staging si disponible" -ForegroundColor White
    Write-Host "4. Deployer en production" -ForegroundColor White
    exit 0
} else {
    Write-Host "ECHEC: Corriger les erreurs avant de deployer" -ForegroundColor Red
    exit 1
}
