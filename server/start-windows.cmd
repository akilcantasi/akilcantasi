@echo off
chcp 65001 >nul
title Akil Cantasi - Bilgi Noktasi
cd /d "%~dp0.."

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js bulunamadi. https://nodejs.org adresinden LTS surumunu kurun
  echo   ^(ya da USB bellekteki node kurulum dosyasini calistirin^), sonra tekrar deneyin.
  echo.
  pause
  exit /b 1
)

if not exist "dist\index.html" (
  echo.
  echo   UYARI: dist\index.html yok. Uygulama dosyalari eksik.
  echo.
)

if not exist "data" mkdir "data"

echo   Windows Guvenlik Duvari "erisime izin ver" diye sorarsa "Ozel aglar" secip izin verin.
node server\server.mjs %*
pause
