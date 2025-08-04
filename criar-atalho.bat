@echo off
title OptMetrics Compras - Criar Atalho
color 0A

echo.
echo =====================================================
echo         CRIANDO ATALHO NA AREA DE TRABALHO
echo =====================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "DESKTOP=%USERPROFILE%\Desktop"
set "SHORTCUT_NAME=OptMetrics Compras.lnk"

echo [1/3] Verificando pasta do projeto...
if not exist "%SCRIPT_DIR%executar.bat" (
    echo [ERRO] Arquivo executar.bat nao encontrado!
    echo Certifique-se de que este script esta na pasta do projeto.
    pause
    exit /b 1
)
echo    ✓ Pasta do projeto encontrada

echo [2/3] Criando atalho na area de trabalho...

:: Criar arquivo VBS temporário para criar atalho
echo Set WshShell = WScript.CreateObject("WScript.Shell") > create_shortcut.vbs
echo Set Shortcut = WshShell.CreateShortcut("%DESKTOP%\%SHORTCUT_NAME%") >> create_shortcut.vbs
echo Shortcut.TargetPath = "%SCRIPT_DIR%executar.bat" >> create_shortcut.vbs
echo Shortcut.WorkingDirectory = "%SCRIPT_DIR%" >> create_shortcut.vbs
echo Shortcut.Description = "OptMetrics Compras - Sistema de Gerenciamento" >> create_shortcut.vbs
echo Shortcut.IconLocation = "%SCRIPT_DIR%executar.bat,0" >> create_shortcut.vbs
echo Shortcut.Save >> create_shortcut.vbs

:: Executar script VBS
cscript //nologo create_shortcut.vbs

:: Limpar arquivo temporário
del create_shortcut.vbs

if exist "%DESKTOP%\%SHORTCUT_NAME%" (
    echo    ✓ Atalho criado com sucesso!
) else (
    echo    [ERRO] Falha ao criar atalho
    pause
    exit /b 1
)

echo [3/3] Verificando atalho...
echo.
echo =====================================================
echo              ATALHO CRIADO COM SUCESSO!
echo =====================================================
echo.
echo Local: %DESKTOP%\%SHORTCUT_NAME%
echo.
echo Agora voce pode:
echo ✓ Usar o atalho na area de trabalho
echo ✓ Executar diretamente com duplo clique
echo ✓ Fixar na barra de tarefas (clique direito no atalho)
echo.

set /p abrir="Deseja executar o aplicativo agora? (s/n): "
if /i "%abrir%"=="s" (
    echo.
    echo Iniciando OptMetrics Compras...
    call "%SCRIPT_DIR%executar.bat"
)

echo.
echo Obrigado por usar OptMetrics Compras!
pause
