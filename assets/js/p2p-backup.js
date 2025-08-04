/**
 * SISTEMA DE BACKUP AUTOMÁTICO P2P
 * Salva dados de monitoramento mesmo quando admin sai
 */

class P2PBackupSystem {
    constructor() {
        this.backupKey = 'p2p_backup_data';
        this.isAdmin = false;
        this.init();
    }

    init() {
        // Detectar se é admin
        const currentUser = this.getCurrentUser();
        this.isAdmin = currentUser && currentUser.role === 'admin';
        
        if (this.isAdmin) {
            this.setupAdminBackup();
        } else {
            this.setupClientBackup();
        }
    }

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('currentUser'));
        } catch {
            return null;
        }
    }

    // SISTEMA PARA ADMIN
    setupAdminBackup() {
        // Salvar dados de monitoramento a cada 30 segundos
        setInterval(() => {
            this.saveAdminData();
        }, 30000);

        // Salvar quando fechar o aplicativo
        window.addEventListener('beforeunload', () => {
            this.saveAdminData();
            this.notifyUsersAdminOffline();
        });

        // Restaurar dados ao iniciar
        this.restoreAdminData();
    }

    saveAdminData() {
        try {
            const adminData = {
                timestamp: Date.now(),
                activities: this.getRecentActivities(),
                connectedUsers: this.getConnectedUsers(),
                statistics: this.getSystemStats(),
                lastOnline: new Date().toLocaleString()
            };

            localStorage.setItem(this.backupKey, JSON.stringify(adminData));
            console.log('📊 Dados de monitoramento salvos:', adminData);
        } catch (error) {
            console.error('❌ Erro ao salvar backup admin:', error);
        }
    }

    restoreAdminData() {
        try {
            const savedData = localStorage.getItem(this.backupKey);
            if (savedData) {
                const adminData = JSON.parse(savedData);
                console.log('🔄 Restaurando dados do admin:', adminData);
                
                // Restaurar timeline (últimas atividades)
                this.restoreActivities(adminData.activities);
                
                // Mostrar quando esteve offline
                this.showOfflineMessage(adminData.lastOnline);
            }
        } catch (error) {
            console.error('❌ Erro ao restaurar backup admin:', error);
        }
    }

    // SISTEMA PARA USUÁRIOS
    setupClientBackup() {
        // Salvar atividades locais mesmo sem admin
        this.saveUserActivity = (activity) => {
            try {
                const userActivities = JSON.parse(localStorage.getItem('user_activities') || '[]');
                userActivities.push({
                    ...activity,
                    timestamp: Date.now(),
                    user: this.getCurrentUser()?.username,
                    savedOffline: true
                });

                // Manter apenas últimas 50 atividades
                if (userActivities.length > 50) {
                    userActivities.splice(0, userActivities.length - 50);
                }

                localStorage.setItem('user_activities', JSON.stringify(userActivities));
                console.log('💾 Atividade salva offline:', activity);
            } catch (error) {
                console.error('❌ Erro ao salvar atividade:', error);
            }
        };

        // Verificar se admin voltou online
        setInterval(() => {
            this.checkAdminConnection();
        }, 10000);
    }

    checkAdminConnection() {
        // Tentar conectar com admin
        if (window.p2pMonitoring) {
            const wasOffline = localStorage.getItem('admin_was_offline');
            
            if (window.p2pMonitoring.adminFound && wasOffline) {
                console.log('🎉 Admin voltou online! Sincronizando dados...');
                this.syncOfflineActivities();
                localStorage.removeItem('admin_was_offline');
            } else if (!window.p2pMonitoring.adminFound && !wasOffline) {
                console.log('⚠️ Admin offline detectado');
                localStorage.setItem('admin_was_offline', 'true');
            }
        }
    }

    syncOfflineActivities() {
        try {
            const offlineActivities = JSON.parse(localStorage.getItem('user_activities') || '[]');
            
            if (offlineActivities.length > 0) {
                console.log(`📤 Sincronizando ${offlineActivities.length} atividades offline...`);
                
                // Enviar atividades para o admin
                offlineActivities.forEach(activity => {
                    if (window.p2pMonitoring && window.p2pMonitoring.sendActivity) {
                        window.p2pMonitoring.sendActivity(activity);
                    }
                });
                
                // Limpar atividades sincronizadas
                localStorage.removeItem('user_activities');
                console.log('✅ Sincronização concluída!');
            }
        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
        }
    }

    // FUNÇÕES AUXILIARES
    getRecentActivities() {
        // Buscar atividades do sistema P2P atual
        if (window.p2pMonitoring && window.p2pMonitoring.activities) {
            return window.p2pMonitoring.activities.slice(-20); // Últimas 20
        }
        return [];
    }

    getConnectedUsers() {
        if (window.p2pMonitoring && window.p2pMonitoring.networkClients) {
            return Array.from(window.p2pMonitoring.networkClients.keys());
        }
        return [];
    }

    getSystemStats() {
        return {
            totalUsers: this.getConnectedUsers().length,
            lastUpdate: Date.now(),
            systemVersion: '2.0-P2P'
        };
    }

    restoreActivities(activities) {
        if (activities && activities.length > 0) {
            // Adicionar atividades restauradas ao sistema atual
            if (window.p2pMonitoring) {
                window.p2pMonitoring.activities = window.p2pMonitoring.activities || [];
                window.p2pMonitoring.activities.unshift(...activities);
                
                // Atualizar interface
                if (window.p2pMonitoring.updateActivityDisplay) {
                    window.p2pMonitoring.updateActivityDisplay();
                }
            }
        }
    }

    showOfflineMessage(lastOnline) {
        if (lastOnline) {
            console.log(`📅 Sistema estava offline desde: ${lastOnline}`);
            
            // Mostrar na interface se possível
            const adminPanel = document.querySelector('#adminPanel');
            if (adminPanel) {
                const offlineMsg = document.createElement('div');
                offlineMsg.style.cssText = `
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    color: #856404;
                    padding: 10px;
                    border-radius: 5px;
                    margin: 10px 0;
                `;
                offlineMsg.innerHTML = `
                    ⚠️ <strong>Sistema estava offline</strong><br>
                    Última vez online: ${lastOnline}<br>
                    Dados restaurados com sucesso!
                `;
                adminPanel.insertBefore(offlineMsg, adminPanel.firstChild);
                
                // Remover mensagem após 10 segundos
                setTimeout(() => offlineMsg.remove(), 10000);
            }
        }
    }

    notifyUsersAdminOffline() {
        // Notificar usuários que admin está saindo
        if (window.p2pMonitoring && window.p2pMonitoring.broadcast) {
            window.p2pMonitoring.broadcast({
                type: 'admin_offline',
                message: 'Administrador desconectou. Sistema funcionará offline.',
                timestamp: Date.now()
            });
        }
    }
}

// Inicializar sistema de backup
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.p2pBackup = new P2PBackupSystem();
        console.log('🔄 Sistema de backup P2P iniciado!');
    }, 2000);
});

// Interceptar atividades do usuário para salvar offline
const originalActivity = window.trackActivity;
window.trackActivity = function(activity) {
    // Chamar função original se existir
    if (originalActivity) {
        originalActivity(activity);
    }
    
    // Salvar backup se admin offline
    if (window.p2pBackup && !window.p2pBackup.isAdmin) {
        window.p2pBackup.saveUserActivity(activity);
    }
};

console.log('💾 Sistema de backup automático P2P carregado!');
