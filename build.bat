@echo off
echo ====================================
echo   Criando Instalador Windows
echo ====================================
echo.

echo [1/3] Verificando dependencias...
if not exist "node_modules\electron" (
    echo Instalando dependencias primeiro...
    call setup.bat
)

echo.
echo [2/3] Construindo aplicacao...
npm run build-win

if %errorlevel% neq 0 (
    echo ERRO: Falha ao construir aplicacao
    pause
    exit /b 1
)

echo.
echo [3/3] Verificando arquivos gerados...
if exist "dist\*.exe" (
    echo ✓ Instalador criado com sucesso!
    echo.
    echo Arquivos gerados em: dist\
    echo.
    dir dist\*.exe
    echo.
    echo Para instalar, execute o arquivo .exe na pasta dist\
) else (
    echo ERRO: Nenhum instalador foi criado
)

echo.
echo ====================================
echo   Build concluido!
echo ====================================
pause
