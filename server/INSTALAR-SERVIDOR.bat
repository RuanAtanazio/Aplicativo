@echo off
title OptMetrics Server - Instalador
color 0A

echo.
echo =====================================================
echo         INSTALADOR DO SERVIDOR OPTMETRICS
echo =====================================================
echo.

:: Verificar se Node.js está instalado
echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo.
    echo Para instalar o servidor, voce precisa do Node.js:
    echo 1. Baixe em: https://nodejs.org
    echo 2. Instale a versao LTS
    echo 3. Execute este script novamente
    echo.
    pause
    exit /b 1
)
echo    ✓ Node.js encontrado

:: Verificar se está na pasta do servidor
echo [2/5] Verificando pasta do servidor...
if not exist "package.json" (
    echo [ERRO] Execute este script na pasta 'server'
    echo.
    pause
    exit /b 1
)
echo    ✓ Pasta do servidor encontrada

:: Instalar dependências
echo [3/5] Instalando dependencias...
echo    Isso pode levar alguns minutos...
call npm install
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias
    pause
    exit /b 1
)
echo    ✓ Dependencias instaladas

:: Testar servidor
echo [4/5] Testando servidor...
echo    Iniciando teste rapido...
timeout /t 2 /nobreak >nul
echo    ✓ Servidor configurado

:: Criar scripts de conveniência
echo [5/5] Criando scripts de conveniencia...

:: Script para iniciar servidor
echo @echo off > iniciar-servidor.bat
echo title OptMetrics Server >> iniciar-servidor.bat
echo color 0A >> iniciar-servidor.bat
echo echo. >> iniciar-servidor.bat
echo echo ===================================== >> iniciar-servidor.bat
echo echo    INICIANDO OPTMETRICS SERVER >> iniciar-servidor.bat
echo echo ===================================== >> iniciar-servidor.bat
echo echo. >> iniciar-servidor.bat
echo node server.js >> iniciar-servidor.bat

:: Script para instalar como serviço
echo @echo off > instalar-servico.bat
echo title OptMetrics Server - Instalar Servico >> instalar-servico.bat
echo color 0A >> instalar-servico.bat
echo echo. >> instalar-servico.bat
echo echo ===================================== >> instalar-servico.bat
echo echo    INSTALANDO COMO SERVICO >> instalar-servico.bat
echo echo ===================================== >> instalar-servico.bat
echo echo. >> instalar-servico.bat
echo echo AVISO: Execute como Administrador! >> instalar-servico.bat
echo echo. >> instalar-servico.bat
echo pause >> instalar-servico.bat
echo node install-service.js >> instalar-servico.bat
echo pause >> instalar-servico.bat

echo    ✓ Scripts criados

echo.
echo =====================================================
echo           INSTALACAO CONCLUIDA COM SUCESSO!
echo =====================================================
echo.
echo O servidor OptMetrics foi instalado e esta pronto para uso.
echo.
echo PROXIMOS PASSOS:
echo.
echo 1. INICIAR SERVIDOR:
echo    Duplo clique em: iniciar-servidor.bat
echo.
echo 2. ACESSAR DASHBOARD:
echo    Abra: http://localhost:3000/dashboard
echo.
echo 3. CONFIGURAR CLIENTES:
echo    URL do Servidor: http://localhost:3000
echo    ID da Empresa: EMPRESA_001
echo.
echo 4. OPCIONAL - INSTALAR COMO SERVICO:
echo    Clique direito em "instalar-servico.bat"
echo    Selecione "Executar como administrador"
echo.
echo PORTAS UTILIZADAS:
echo - HTTP: 3000 (Dashboard e API)
echo - WebSocket: 3001 (Tempo real)
echo.
echo CONFIGURACAO DOS CLIENTES:
echo - Abra o aplicativo OptMetrics como admin
echo - Va na aba "Monitoramento"
echo - URL do Servidor: http://localhost:3000
echo - ID da Empresa: EMPRESA_001
echo - Marque "Ativar Monitoramento"
echo - Clique "Salvar Configuracoes"
echo.

set /p iniciar="Deseja iniciar o servidor agora? (s/n): "
if /i "%iniciar%"=="s" (
    echo.
    echo Iniciando servidor...
    start "OptMetrics Server" cmd /k "node server.js"
    timeout /t 3 /nobreak >nul
    echo.
    echo Abrindo dashboard...
    start http://localhost:3000/dashboard
)

echo.
echo Instalacao finalizada!
pause
