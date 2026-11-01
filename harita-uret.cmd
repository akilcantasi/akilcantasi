@echo off
chcp 65001 >nul
title Akil Cantasi - Harita ve afet noktalari
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\harita-uret.ps1" %*
echo.
pause
