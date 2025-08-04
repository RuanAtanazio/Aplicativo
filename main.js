const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Manter referência global da janela
let mainWindow;

function createWindow() {
    // Criar a janela do navegador
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1000,
        minHeight: 600,
        icon: path.join(__dirname, 'assets', 'icon.ico'), // Ícone da aplicação
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            webSecurity: true
        },
        titleBarStyle: 'default',
        show: false, // Não mostrar até estar pronto
        backgroundColor: '#2c3e50' // Cor de fundo durante carregamento
    });

    // Carregar o arquivo index.html
    mainWindow.loadFile('index.html');

    // Mostrar janela quando estiver pronta
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        
        // Focar na janela
        if (process.platform === 'darwin') {
            app.focus();
        }
    });

    // Abrir links externos no navegador padrão
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Evento quando a janela for fechada
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Configurar menu
    createMenu();
}

function createMenu() {
    const template = [
        {
            label: 'Arquivo',
            submenu: [
                {
                    label: 'Backup de Dados',
                    click: () => {
                        exportBackup();
                    }
                },
                {
                    label: 'Importar Dados',
                    click: () => {
                        importBackup();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Sair',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Editar',
            submenu: [
                { role: 'undo', label: 'Desfazer' },
                { role: 'redo', label: 'Refazer' },
                { type: 'separator' },
                { role: 'cut', label: 'Recortar' },
                { role: 'copy', label: 'Copiar' },
                { role: 'paste', label: 'Colar' },
                { role: 'selectall', label: 'Selecionar Tudo' }
            ]
        },
        {
            label: 'Visualizar',
            submenu: [
                { role: 'reload', label: 'Recarregar' },
                { role: 'forceReload', label: 'Forçar Recarregamento' },
                { role: 'toggleDevTools', label: 'Ferramentas do Desenvolvedor' },
                { type: 'separator' },
                { role: 'resetZoom', label: 'Zoom Real' },
                { role: 'zoomIn', label: 'Ampliar' },
                { role: 'zoomOut', label: 'Reduzir' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'Tela Cheia' }
            ]
        },
        {
            label: 'Ajuda',
            submenu: [
                {
                    label: 'Sobre',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'Sobre OptMetrics Compras',
                            message: 'OptMetrics Compras',
                            detail: 'Sistema de Gerenciamento de Pedidos de Compra\nVersão 1.0.0\n\nDesenvolvido para Windows',
                            buttons: ['OK']
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

async function exportBackup() {
    try {
        const result = await dialog.showSaveDialog(mainWindow, {
            title: 'Exportar Backup',
            defaultPath: `OptMetrics-Backup-${new Date().toISOString().split('T')[0]}.json`,
            filters: [
                { name: 'Arquivos JSON', extensions: ['json'] }
            ]
        });

        if (!result.canceled) {
            // Executar script no renderer para obter dados
            const data = await mainWindow.webContents.executeJavaScript(`
                JSON.stringify({
                    users: localStorage.getItem('users') || '[]',
                    pedidos: localStorage.getItem('pedidos') || '[]',
                    fornecedores: localStorage.getItem('fornecedores') || '[]',
                    itens: localStorage.getItem('itens') || '[]',
                    precos: localStorage.getItem('precos') || '[]',
                    logs: localStorage.getItem('logs') || '[]',
                    exportDate: new Date().toISOString()
                })
            `);

            fs.writeFileSync(result.filePath, data);
            
            dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Backup Exportado',
                message: 'Backup exportado com sucesso!',
                detail: `Arquivo salvo em: ${result.filePath}`,
                buttons: ['OK']
            });
        }
    } catch (error) {
        dialog.showErrorBox('Erro', `Erro ao exportar backup: ${error.message}`);
    }
}

async function importBackup() {
    try {
        const result = await dialog.showOpenDialog(mainWindow, {
            title: 'Importar Backup',
            filters: [
                { name: 'Arquivos JSON', extensions: ['json'] }
            ],
            properties: ['openFile']
        });

        if (!result.canceled && result.filePaths.length > 0) {
            const data = fs.readFileSync(result.filePaths[0], 'utf8');
            const backupData = JSON.parse(data);

            // Confirmar importação
            const confirm = await dialog.showMessageBox(mainWindow, {
                type: 'warning',
                title: 'Confirmar Importação',
                message: 'Importar dados do backup?',
                detail: 'Esta ação irá substituir todos os dados atuais. Esta operação não pode ser desfeita.',
                buttons: ['Cancelar', 'Importar'],
                defaultId: 0,
                cancelId: 0
            });

            if (confirm.response === 1) {
                // Executar script no renderer para importar dados
                await mainWindow.webContents.executeJavaScript(`
                    localStorage.setItem('users', '${backupData.users}');
                    localStorage.setItem('pedidos', '${backupData.pedidos}');
                    localStorage.setItem('fornecedores', '${backupData.fornecedores}');
                    localStorage.setItem('itens', '${backupData.itens}');
                    localStorage.setItem('precos', '${backupData.precos}');
                    localStorage.setItem('logs', '${backupData.logs}');
                    location.reload();
                `);

                dialog.showMessageBox(mainWindow, {
                    type: 'info',
                    title: 'Backup Importado',
                    message: 'Backup importado com sucesso!',
                    detail: 'A aplicação será recarregada.',
                    buttons: ['OK']
                });
            }
        }
    } catch (error) {
        dialog.showErrorBox('Erro', `Erro ao importar backup: ${error.message}`);
    }
}

// Este método será chamado quando o Electron terminar de inicializar
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        // No macOS, é comum recriar uma janela quando o ícone do dock é clicado
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Sair quando todas as janelas estiverem fechadas
app.on('window-all-closed', () => {
    // No macOS, é comum que aplicativos permaneçam ativos até o usuário sair explicitamente
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Configurações de segurança
app.on('web-contents-created', (event, contents) => {
    // Impedir navegação externa
    contents.on('will-navigate', (navigationEvent, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        
        if (parsedUrl.origin !== 'file://') {
            navigationEvent.preventDefault();
        }
    });

    // Impedir criação de novas janelas
    contents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
});
