// Configurações específicas para aplicativo desktop
window.electronAPI = {
    isElectron: true,
    platform: 'desktop',
    version: '1.0.0'
};

// Configurações de janela para aplicativo desktop
if (typeof require !== 'undefined') {
    try {
        const { ipcRenderer } = require('electron');
        
        // APIs específicas do Electron podem ser adicionadas aqui
        window.electronAPI.ipc = ipcRenderer;
        
        // Eventos de janela
        window.addEventListener('beforeunload', (e) => {
            // Confirmar fechamento se houver dados não salvos
            const hasUnsavedData = localStorage.getItem('hasUnsavedChanges');
            if (hasUnsavedData === 'true') {
                e.preventDefault();
                e.returnValue = '';
                return 'Existem alterações não salvas. Deseja realmente sair?';
            }
        });
        
    } catch (error) {
        console.log('Rodando em modo web browser');
    }
}

// Configurações para otimização desktop
document.addEventListener('DOMContentLoaded', () => {
    // Desabilitar seleção de texto para comportamento mais nativo
    document.onselectstart = () => false;
    document.ondragstart = () => false;
    
    // Configurar atalhos de teclado
    document.addEventListener('keydown', (e) => {
        // Ctrl + R = Recarregar
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            location.reload();
        }
        
        // F5 = Recarregar
        if (e.key === 'F5') {
            e.preventDefault();
            location.reload();
        }
        
        // Ctrl + Q = Fechar (será interceptado pelo Electron)
        if (e.ctrlKey && e.key === 'q') {
            e.preventDefault();
            // O Electron tratará isso
        }
        
        // F11 = Tela cheia
        if (e.key === 'F11') {
            e.preventDefault();
            // O Electron tratará isso
        }
    });
    
    // Adicionar classe para styling específico do desktop
    document.body.classList.add('desktop-app');
    
    console.log('OptMetrics Compras Desktop v1.0.0 iniciado');
});
