@echo off
chcp 65001 >nul
title Akil Cantasi - APK derleme
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\apk-derle.ps1"
echo.
pause
