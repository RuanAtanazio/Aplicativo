/**
 * Sistema de Monitoramento Empresarial
 * Permite rastreamento de atividades e sincronização entre computadores
 */

class MonitoringSystem {
    constructor() {
        this.isEnabled = this.getMonitoringSettings().enabled;
        this.serverUrl = this.getMonitoringSettings().serverUrl;
        this.companyId = this.getMonitoringSettings().companyId;
        this.init();
    }

    init() {
        if (this.isEnabled) {
            this.startActivityTracking();
            this.setupPeriodicSync();
        }
    }

    // Configurações de monitoramento
    getMonitoringSettings() {
        const settings = localStorage.getItem('monitoring_settings');
        return settings ? JSON.parse(settings) : {
            enabled: false,
            serverUrl: '',
            companyId: '',
            trackActions: true,
            trackTime: true,
            syncInterval: 30000 // 30 segundos
        };
    }

    setMonitoringSettings(settings) {
        localStorage.setItem('monitoring_settings', JSON.stringify(settings));
        this.isEnabled = settings.enabled;
        this.serverUrl = settings.serverUrl;
        this.companyId = settings.companyId;
    }

    // Rastreamento de atividades
    trackAction(action, details = {}) {
        if (!this.isEnabled) return;

        const activity = {
            id: this.generateId(),
            userId: this.getCurrentUser().username,
            userName: this.getCurrentUser().name,
            action: action,
            details: details,
            timestamp: new Date().toISOString(),
            computerInfo: this.getComputerInfo()
        };

        this.saveActivity(activity);
        this.sendToServer(activity);
    }

    // Informações do computador
    getComputerInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            computerName: this.getComputerName(),
            ip: this.getLocalIP()
        };
    }

    getComputerName() {
        // Tenta obter nome do computador via variáveis de ambiente (funciona no Electron)
        if (typeof require !== 'undefined') {
            try {
                const os = require('os');
                return os.hostname();
            } catch (e) {
                return 'Computador Desconhecido';
            }
        }
        return 'Web Browser';
    }

    async getLocalIP() {
        try {
            // Método para obter IP local (simplificado)
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (e) {
            return 'IP não disponível';
        }
    }

    // Gerenciamento de atividades
    saveActivity(activity) {
        const activities = this.getStoredActivities();
        activities.push(activity);
        
        // Manter apenas os últimos 1000 registros
        if (activities.length > 1000) {
            activities.splice(0, activities.length - 1000);
        }
        
        localStorage.setItem('user_activities', JSON.stringify(activities));
    }

    getStoredActivities() {
        const activities = localStorage.getItem('user_activities');
        return activities ? JSON.parse(activities) : [];
    }

    // Envio para servidor (se configurado)
    async sendToServer(data) {
        if (!this.serverUrl) return;

        try {
            await fetch(`${this.serverUrl}/api/activity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Company-ID': this.companyId
                },
                body: JSON.stringify(data)
            });
        } catch (e) {
            console.log('Erro ao enviar dados para servidor:', e.message);
        }
    }

    // Sincronização periódica
    setupPeriodicSync() {
        setInterval(() => {
            this.syncOnlineStatus();
            this.sendHeartbeat();
        }, this.getMonitoringSettings().syncInterval);
    }

    syncOnlineStatus() {
        const onlineData = {
            userId: this.getCurrentUser().username,
            userName: this.getCurrentUser().name,
            lastSeen: new Date().toISOString(),
            computerInfo: this.getComputerInfo(),
            currentPage: window.location.hash || '#dashboard'
        };

        localStorage.setItem('online_status', JSON.stringify(onlineData));
        this.sendToServer({ type: 'heartbeat', data: onlineData });
    }

    sendHeartbeat() {
        this.trackAction('heartbeat', {
            currentPage: window.location.hash || '#dashboard',
            sessionDuration: this.getSessionDuration()
        });
    }

    // Utilitários
    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : { username: 'unknown', name: 'Usuário Desconhecido' };
    }

    getSessionDuration() {
        const loginTime = localStorage.getItem('login_time');
        if (!loginTime) return 0;
        return Date.now() - parseInt(loginTime);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Métodos para painel administrativo
    getAllActivities() {
        return this.getStoredActivities();
    }

    getActivitiesByUser(username) {
        return this.getStoredActivities().filter(activity => activity.userId === username);
    }

    getActivitiesByTimeRange(startDate, endDate) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        
        return this.getStoredActivities().filter(activity => {
            const activityTime = new Date(activity.timestamp).getTime();
            return activityTime >= start && activityTime <= end;
        });
    }

    // Relatórios
    generateActivityReport(filters = {}) {
        let activities = this.getAllActivities();

        if (filters.user) {
            activities = activities.filter(a => a.userId === filters.user);
        }

        if (filters.action) {
            activities = activities.filter(a => a.action === filters.action);
        }

        if (filters.startDate && filters.endDate) {
            activities = this.getActivitiesByTimeRange(filters.startDate, filters.endDate);
        }

        return {
            totalActivities: activities.length,
            uniqueUsers: [...new Set(activities.map(a => a.userId))],
            actionSummary: this.summarizeActions(activities),
            timeRange: this.getTimeRange(activities),
            activities: activities
        };
    }

    summarizeActions(activities) {
        const summary = {};
        activities.forEach(activity => {
            summary[activity.action] = (summary[activity.action] || 0) + 1;
        });
        return summary;
    }

    getTimeRange(activities) {
        if (activities.length === 0) return null;
        
        const timestamps = activities.map(a => new Date(a.timestamp).getTime());
        return {
            start: new Date(Math.min(...timestamps)).toISOString(),
            end: new Date(Math.max(...timestamps)).toISOString()
        };
    }

    // Exportação de dados
    exportActivities(format = 'json') {
        const activities = this.getAllActivities();
        
        if (format === 'csv') {
            return this.exportToCSV(activities);
        }
        
        return JSON.stringify(activities, null, 2);
    }

    exportToCSV(activities) {
        if (activities.length === 0) return '';
        
        const headers = ['Timestamp', 'Usuário', 'Ação', 'Detalhes', 'Computador'];
        const rows = activities.map(activity => [
            activity.timestamp,
            activity.userName,
            activity.action,
            JSON.stringify(activity.details),
            activity.computerInfo.computerName
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
}

// Integração com sistema de autenticação
class AuthMonitoring {
    static trackLogin(username) {
        if (window.monitoringSystem) {
            localStorage.setItem('login_time', Date.now().toString());
            window.monitoringSystem.trackAction('login', { username });
        }
    }

    static trackLogout(username) {
        if (window.monitoringSystem) {
            const sessionDuration = window.monitoringSystem.getSessionDuration();
            window.monitoringSystem.trackAction('logout', { 
                username, 
                sessionDuration 
            });
            localStorage.removeItem('login_time');
        }
    }

    static trackPageView(page) {
        if (window.monitoringSystem) {
            window.monitoringSystem.trackAction('page_view', { page });
        }
    }

    static trackDataAction(action, module, itemId = null) {
        if (window.monitoringSystem) {
            window.monitoringSystem.trackAction('data_action', {
                action, // create, update, delete, view
                module, // pedidos, fornecedores, itens, precos
                itemId
            });
        }
    }
}

// Inicializar sistema de monitoramento
if (typeof window !== 'undefined') {
    window.MonitoringSystem = MonitoringSystem;
    window.AuthMonitoring = AuthMonitoring;
    window.monitoringSystem = new MonitoringSystem();
}
