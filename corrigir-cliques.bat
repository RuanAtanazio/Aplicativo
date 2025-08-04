@echo off
title OptMetrics Compras - Correcao de Emergencia
color 0C

echo.
echo ================================================
echo      CORRECAO DE EMERGENCIA - CLIQUES
echo ================================================
echo.

echo [1/3] Fechando navegadores...
taskkill /f /im chrome.exe 2>nul
taskkill /f /im msedge.exe 2>nul
taskkill /f /im firefox.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/3] Limpando cache do navegador...
if exist "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" (
    rd /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" 2>nul
)
if exist "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache" (
    rd /s /q "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache" 2>nul
)

echo [3/3] Abrindo sistema corrigido...
timeout /t 2 /nobreak >nul

echo.
echo ✅ Sistema corrigido! Abrindo...
echo.

start index.html

echo.
echo ================================================
echo   SE AINDA TIVER PROBLEMAS:
echo   1. Pressione F12 no navegador
echo   2. Va na aba Console
echo   3. Digite: fixClicks()
echo   4. Pressione Enter
echo ================================================
echo.

pause
