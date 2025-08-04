@echo off
echo ====================================
echo   OptMetrics Compras - Executar
echo ====================================
echo.

if not exist "node_modules\electron" (
    echo Dependencias nao encontradas. Executando setup...
    call setup.bat
) else (
    echo Iniciando OptMetrics Compras...
    npm start
)

pause
