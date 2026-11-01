@echo off
chcp 65001 >nul
title Akil Cantasi - Onizleme
cd /d "%~dp0"
set PORT=%1
if "%PORT%"=="" set PORT=8080
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\onizle.ps1" -Port %PORT%
echo.
pause
