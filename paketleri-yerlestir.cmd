@echo off
chcp 65001 >nul
title Akil Cantasi - Paketleri yerlestir
cd /d "%~dp0"
rem Indirilenler klasorundeki bilinen paketleri data\zim, data\models, data\ses icine tasir.
rem Secenekler: -Deneme (hicbir sey tasimadan goster), -Kaynak <klasor>, -Hedef <klasor>
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\paketleri-yerlestir.ps1" %*
echo.
pause
