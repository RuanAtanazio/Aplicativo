@echo off
title OptMetrics Compras - Instalacao
color 0A

echo.
echo  ██████╗ ██████╗ ████████╗███╗   ███╗███████╗████████╗██████╗ ██╗ ██████╗███████╗
echo ██╔═══██╗██╔══██╗╚══██╔══╝████╗ ████║██╔════╝╚══██╔══╝██╔══██╗██║██╔════╝██╔════╝
echo ██║   ██║██████╔╝   ██║   ██╔████╔██║█████╗     ██║   ██████╔╝██║██║     ███████╗
echo ██║   ██║██╔═══╝    ██║   ██║╚██╔╝██║██╔══╝     ██║   ██╔══██╗██║██║     ╚════██║
echo ╚██████╔╝██║        ██║   ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║██║╚██████╗███████║
echo  ╚═════╝ ╚═╝        ╚═╝   ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝ ╚═════╝╚══════╝
echo.
echo                        Sistema de Gerenciamento de Compras v1.0
echo                                 Aplicativo Desktop para Windows
echo.
echo ===============================================================================
echo.

:: Verificar se já está instalado
if exist "node_modules\electron\dist\electron.exe" (
    echo [INFO] Aplicacao ja esta instalada.
    echo.
    goto :menu
)

echo [SETUP] Iniciando instalacao do OptMetrics Compras...
echo.

:: Verificar Node.js
echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo.
    echo Por favor, instale o Node.js:
    echo 1. Acesse: https://nodejs.org/
    echo 2. Baixe a versao LTS
    echo 3. Execute a instalacao
    echo 4. Reinicie o computador
    echo 5. Execute este script novamente
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo    ✓ Node.js %NODE_VERSION% encontrado

:: Verificar npm
echo [2/5] Verificando npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] npm nao encontrado!
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo    ✓ npm %NPM_VERSION% encontrado

:: Configurar package.json para Electron
echo [3/5] Configurando projeto...
if exist "package-electron.json" (
    copy package-electron.json package.json >nul 2>&1
    echo    ✓ Configuracao aplicada
) else (
    echo [ERRO] Arquivo de configuracao nao encontrado!
    pause
    exit /b 1
)

:: Instalar dependências
echo [4/5] Instalando dependencias do Electron...
echo    Isso pode levar alguns minutos...
npm install >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias!
    echo Tentando com verbose...
    npm install
    pause
    exit /b 1
)
echo    ✓ Dependencias instaladas com sucesso

:: Verificar instalação
echo [5/5] Verificando instalacao...
if exist "node_modules\electron\dist\electron.exe" (
    echo    ✓ Electron instalado com sucesso
) else (
    echo [ERRO] Electron nao foi instalado corretamente!
    pause
    exit /b 1
)

echo.
echo ===============================================================================
echo [SUCESSO] OptMetrics Compras instalado com sucesso!
echo ===============================================================================
echo.

:menu
echo Escolha uma opcao:
echo.
echo [1] Executar OptMetrics Compras
echo [2] Criar instalador para distribuicao
echo [3] Executar em modo de desenvolvimento
echo [4] Sair
echo.
set /p choice="Digite sua opcao (1-4): "

if "%choice%"=="1" goto :run
if "%choice%"=="2" goto :build
if "%choice%"=="3" goto :dev
if "%choice%"=="4" goto :end
echo Opcao invalida!
goto :menu

:run
echo.
echo [RUN] Iniciando OptMetrics Compras...
npm start
goto :menu

:build
echo.
echo [BUILD] Criando instalador...
echo Isso pode levar varios minutos...
npm run build
if %errorlevel% equ 0 (
    echo.
    echo ✓ Instalador criado com sucesso!
    echo Verifique a pasta 'dist' para os arquivos gerados.
    if exist "dist\*.exe" (
        echo.
        echo Arquivos criados:
        dir dist\*.exe /b
    )
) else (
    echo.
    echo [ERRO] Falha ao criar instalador!
)
echo.
pause
goto :menu

:dev
echo.
echo [DEV] Iniciando em modo desenvolvimento...
npm run dev
goto :menu

:end
echo.
echo Obrigado por usar OptMetrics Compras!
timeout /t 2 >nul
exit /b 0
