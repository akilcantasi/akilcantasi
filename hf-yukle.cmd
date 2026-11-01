@echo off
chcp 65001 >nul
title Akil Cantasi - Hugging Face yansisi
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\hf-yukle.ps1" %*
echo.
pause
