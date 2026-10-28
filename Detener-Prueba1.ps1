$ErrorActionPreference = 'Stop'
$appRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidPath = Join-Path $appRoot '.local-server.pid'
if (-not (Test-Path -LiteralPath $pidPath)) {
    Write-Host 'Prueba 1 no registra un servidor local activo.'
    exit 0
}
$metadata = $null
$serverId = 0
$serverPort = 3001
try {
    $metadata = Get-Content -LiteralPath $pidPath -Raw | ConvertFrom-Json -ErrorAction Stop
    $serverId = [int]$metadata.id
    if ($metadata.port -and [int]$metadata.port -ge 1 -and [int]$metadata.port -le 65535) {
        $serverPort = [int]$metadata.port
    }
} catch {
    try { $serverId = [int](Get-Content -LiteralPath $pidPath -Raw) } catch {}
}
if ($serverId -le 0) {
    Write-Host 'No se encontró un identificador válido del servidor.' -ForegroundColor Yellow
    exit 0
}

$process = Get-CimInstance Win32_Process -Filter "ProcessId = $serverId" -ErrorAction SilentlyContinue
$isOwnedServer = $false
if ($metadata -and $metadata.root -eq $appRoot -and $metadata.startedAt) {
    $runningProcess = Get-Process -Id $serverId -ErrorAction SilentlyContinue
    if ($runningProcess) {
        $actualStart = $runningProcess.StartTime.ToUniversalTime()
        if ($metadata.startedAt -is [DateTime]) {
            $expectedStart = ([DateTime]$metadata.startedAt).ToUniversalTime()
        } else {
            $expectedStart = [DateTimeOffset]::Parse([string]$metadata.startedAt).UtcDateTime
        }
        $isOwnedServer = [Math]::Abs(($actualStart - $expectedStart).TotalSeconds) -lt 2
    }

    if ($metadata.kind -eq 'node') {
        $entryPoint = Join-Path $appRoot 'server\index.js'
        $isOwnedServer = $isOwnedServer -and $process -and $process.Name -eq 'node.exe' -and $process.CommandLine -like "*$entryPoint*"
        $listener = Get-NetTCPConnection -LocalPort $serverPort -State Listen -ErrorAction SilentlyContinue |
            Where-Object { $_.OwningProcess -eq $serverId -and $_.LocalAddress -eq '127.0.0.1' }
        $isOwnedServer = $isOwnedServer -and [bool]$listener
        if ($isOwnedServer) {
            try {
                $health = Invoke-RestMethod -Uri 'http://127.0.0.1:3001/api/health' -TimeoutSec 2
                $isOwnedServer = $health.ok -and $health.name -eq 'Prueba 1'
            } catch { $isOwnedServer = $false }
        }
    } elseif ($metadata.kind -eq 'launcher') {
        $isOwnedServer = $isOwnedServer -and $process -and $process.Name -eq 'powershell.exe' -and
            $process.CommandLine -like '*server/index.js*' -and $process.CommandLine -like "*$appRoot*"
        $nodeChildren = @(Get-CimInstance Win32_Process -Filter "ParentProcessId = $serverId" -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -like '*server/index.js*' })
        $childIds = @($nodeChildren | ForEach-Object { [int]$_.ProcessId })
        $listener = Get-NetTCPConnection -LocalPort $serverPort -State Listen -ErrorAction SilentlyContinue |
            Where-Object { $childIds -contains $_.OwningProcess -and $_.LocalAddress -eq '127.0.0.1' }
        $isOwnedServer = $isOwnedServer -and $childIds.Count -gt 0 -and [bool]$listener
        if ($isOwnedServer) {
            try {
                $health = Invoke-RestMethod -Uri "http://127.0.0.1:$serverPort/api/health" -TimeoutSec 2
                $isOwnedServer = $health.ok -and $health.name -eq 'Prueba 1'
            } catch { $isOwnedServer = $false }
        }
    } else {
        $isOwnedServer = $false
    }
}

if ($isOwnedServer) {
    & taskkill.exe /PID $serverId /T /F | Out-Null
    Remove-Item -LiteralPath $pidPath -Force -ErrorAction SilentlyContinue
    Write-Host 'Servidor local de Prueba 1 detenido.' -ForegroundColor Green
} else {
    Write-Host 'No se detuvo ningún proceso: el identificador guardado no corresponde al servidor de Prueba 1.' -ForegroundColor Yellow
}
