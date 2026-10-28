$ErrorActionPreference = 'Stop'
$appRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $appRoot
$serverPort = 3001
$envFile = Join-Path $appRoot '.env'
if (Test-Path -LiteralPath $envFile) {
    foreach ($line in Get-Content -LiteralPath $envFile) {
        if ($line -match '^\s*PORT\s*=') {
            $portValue = ($line -split '=', 2)[1].Trim().Trim('"').Trim("'")
            if ($portValue -notmatch '^\d{1,5}$' -or [int]$portValue -lt 1 -or [int]$portValue -gt 65535) {
                throw 'El puerto PORT de .env debe ser un número entre 1 y 65535.'
            }
            $serverPort = [int]$portValue
            break
        }
    }
}
$localHealthUrl = "http://127.0.0.1:$serverPort/api/health"
$browserUrl = "http://localhost:$serverPort"

try {
    $existing = Invoke-RestMethod -Uri $localHealthUrl -TimeoutSec 2
    if ($existing.ok -and $existing.name -eq 'Prueba 1') {
        Start-Process $browserUrl
        exit 0
    }
} catch {}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host 'Prueba 1 necesita Node.js 20 o posterior.' -ForegroundColor Red
    Write-Host 'Instala Node.js y vuelve a abrir este archivo.'
    Read-Host 'Presiona Enter para cerrar'
    exit 1
}
$nodeVersion = (& node -p 'process.versions.node').Trim()
$nodeMajor = [int]$nodeVersion.Split('.')[0]
if ($nodeMajor -lt 20) {
    Write-Host "Prueba 1 necesita Node.js 20 o posterior. Se encontró $nodeVersion." -ForegroundColor Red
    Read-Host 'Presiona Enter para cerrar'
    exit 1
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host 'No encontramos npm. Repara la instalación de Node.js y vuelve a abrir este archivo.' -ForegroundColor Red
    Read-Host 'Presiona Enter para cerrar'
    exit 1
}

if (-not (Test-Path -LiteralPath (Join-Path $appRoot 'node_modules'))) {
    Write-Host 'Preparando la aplicación por primera vez…'
    npm install
    if ($LASTEXITCODE -ne 0) { throw 'No se pudieron instalar las dependencias.' }
}

Write-Host 'Preparando tu aplicación local…'
npm run seed
if ($LASTEXITCODE -ne 0) { throw 'No se pudo preparar el catálogo.' }
npm run build
if ($LASTEXITCODE -ne 0) { throw 'No se pudo preparar la aplicación.' }

$nodePath = (Get-Command node -ErrorAction Stop).Source
$logDirectory = Join-Path $appRoot 'logs'
New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
$logPath = Join-Path $logDirectory 'prueba1-local.log'
$pidPath = Join-Path $appRoot '.local-server.pid'
$rootForCommand = $appRoot.Replace("'", "''")
$nodeForCommand = $nodePath.Replace("'", "''")
$logForCommand = $logPath.Replace("'", "''")
$launchCommand = @"
`$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath '$rootForCommand'
`$env:NODE_ENV = 'production'
`$env:PORT = '$serverPort'
`$env:HOST = '127.0.0.1'
& '$nodeForCommand' 'server/index.js' *> '$logForCommand'
exit `$LASTEXITCODE
"@
$serverProcess = Start-Process -FilePath 'powershell.exe' -WindowStyle Hidden -PassThru -ArgumentList @('-NoProfile', '-Command', $launchCommand)
@{ id = $serverProcess.Id; startedAt = $serverProcess.StartTime.ToUniversalTime().ToString('o'); root = $appRoot; port = $serverPort; kind = 'launcher' } |
    ConvertTo-Json | Set-Content -LiteralPath $pidPath -Encoding utf8

$ready = $false
for ($attempt = 0; $attempt -lt 30; $attempt++) {
    Start-Sleep -Milliseconds 500
    try {
        $health = Invoke-RestMethod -Uri $localHealthUrl -TimeoutSec 2
        if ($health.ok -and $health.name -eq 'Prueba 1') { $ready = $true; break }
    } catch {}
}

if (-not $ready) {
    Write-Host "No se pudo iniciar Prueba 1. Revisa el registro: $logPath" -ForegroundColor Red
    Read-Host 'Presiona Enter para cerrar'
    exit 1
}

Start-Process $browserUrl
