@echo off
echo ====================================
echo   OptMetrics Compras - Setup
echo ====================================
echo.

echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js em: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js encontrado

echo.
echo [2/4] Instalando dependencias...
npm install electron@^27.0.0 --save-dev
npm install electron-builder@^24.6.4 --save-dev

if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias
    pause
    exit /b 1
)

echo.
echo [3/4] Copiando configuracao do Electron...
copy package-electron.json package.json >nul 2>&1

echo.
echo [4/4] Testando aplicacao...
echo Iniciando OptMetrics Compras...
npm start

echo.
echo ====================================
echo   Setup concluido com sucesso!
echo ====================================
echo.
echo Para executar a aplicacao:
echo   npm start
echo.
echo Para criar instalador:
echo   npm run build
echo.
pause
