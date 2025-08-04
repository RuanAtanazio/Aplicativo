@echo off
title OptMetrics Compras - Download e Instalacao Automatica
color 0B

echo.
echo =====================================================================
echo                    OPTMETRICS COMPRAS - DOWNLOAD
echo =====================================================================
echo.
echo Este script ira baixar e instalar automaticamente o OptMetrics Compras
echo.

:: Verificar se Git esta instalado
git --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Git detectado - fazendo download via Git...
    echo.
    
    set /p pasta="Digite o nome da pasta (ou pressione Enter para 'OptMetrics-Compras'): "
    if "%pasta%"=="" set pasta=OptMetrics-Compras
    
    echo Clonando repositorio...
    git clone https://github.com/RuanAtanazio/Aplicativo.git "%pasta%"
    
    if exist "%pasta%" (
        echo.
        echo ✓ Download concluido com sucesso!
        echo.
        echo Entrando na pasta e executando instalacao...
        cd "%pasta%"
        call INSTALAR.bat
    ) else (
        echo [ERRO] Falha no download via Git
        goto :download_manual
    )
) else (
    echo [INFO] Git nao encontrado - download manual necessario
    goto :download_manual
)

goto :end

:download_manual
echo.
echo =====================================================================
echo                        DOWNLOAD MANUAL
echo =====================================================================
echo.
echo 1. Acesse: https://github.com/RuanAtanazio/Aplicativo
echo 2. Clique no botao verde "Code"
echo 3. Selecione "Download ZIP"
echo 4. Extraia o arquivo ZIP
echo 5. Execute o arquivo INSTALAR.bat
echo.
echo Ou instale o Git para download automatico:
echo https://git-scm.com/download/win
echo.

set /p abrir="Deseja abrir o link no navegador? (s/n): "
if /i "%abrir%"=="s" (
    start https://github.com/RuanAtanazio/Aplicativo
)

:end
echo.
echo Obrigado por usar OptMetrics Compras!
pause
