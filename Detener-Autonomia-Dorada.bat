@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -File "%~dp0Detener-Autonomia-Dorada.ps1"
