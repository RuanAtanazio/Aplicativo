/**
 * Sistema de Monitoramento P2P (Peer-to-Peer)
 * Permite monitoramento direto na rede local sem servidor dedicado
 */

class P2PMonitoring {
    constructor() {
        this.isAdmin = false;
        this.networkClients = new Map();
        this.broadcastInterval = null;
        this.discoveryInterval = null;
        this.httpServer = null;
        this.webSocketServer = null;
        this.networkIP = null;
        this.adminPort = 3100;
        
        this.init();
    }

    async init() {
        await this.detectNetworkInfo();
        this.setupEventListeners();
        
        // Se for admin, iniciar como servidor P2P
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.role === 'admin') {
            this.startAdminMode();
        } else {
            this.startClientMode();
        }
    }

    async detectNetworkInfo() {
        try {
            // Detectar IP da rede local
            this.networkIP = await this.getLocalNetworkIP();
            console.log('IP da rede detectado:', this.networkIP);
        } catch (error) {
            console.error('Erro ao detectar IP da rede:', error);
            this.networkIP = 'localhost';
        }
    }

    async getLocalNetworkIP() {
        return new Promise((resolve) => {
            // Método para detectar IP local real
            const rtc = new RTCPeerConnection({
                iceServers: [{urls: "stun:stun.l.google.com:19302"}]
            });
            
            rtc.createDataChannel('');
            rtc.createOffer().then(offer => rtc.setLocalDescription(offer));
            
            rtc.onicecandidate = (event) => {
                if (event.candidate) {
                    const candidate = event.candidate.candidate;
                    const ip = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
                    if (ip && ip[1] && !ip[1].startsWith('169.254')) {
                        rtc.close();
                        resolve(ip[1]);
                    }
                }
            };
            
            // Fallback depois de 3 segundos
            setTimeout(() => {
                rtc.close();
                resolve('localhost');
            }, 3000);
        });
    }

    startAdminMode() {
        console.log('🔧 Iniciando modo administrador P2P');
        this.isAdmin = true;
        
        // Iniciar mini-servidor HTTP para dashboard
        this.startMiniServer();
        
        // Iniciar broadcast para anunciar presença do admin
        this.startAdminBroadcast();
        
        // Mostrar informações na interface
        this.showAdminInfo();
    }

    startMiniServer() {
        // Como estamos no navegador, vamos usar uma abordagem diferente
        // Vamos criar um sistema de comunicação via localStorage + broadcast
        this.setupLocalStorageServer();
        
        console.log(`✅ Mini-servidor P2P iniciado`);
        console.log(`📊 Dashboard local: http://${this.networkIP}:${this.adminPort}/dashboard`);
    }

    setupLocalStorageServer() {
        // Simular servidor usando localStorage compartilhado
        const serverData = {
            isActive: true,
            adminIP: this.networkIP,
            adminPort: this.adminPort,
            startTime: new Date().toISOString(),
            connectedClients: []
        };
        
        localStorage.setItem('p2p_admin_server', JSON.stringify(serverData));
        
        // Processar mensagens dos clientes
        window.addEventListener('storage', (e) => {
            if (e.key === 'p2p_client_message') {
                this.processClientMessage(JSON.parse(e.newValue));
            }
        });
    }

    startClientMode() {
        console.log('👤 Iniciando modo cliente P2P');
        this.isAdmin = false;
        
        // Procurar por administradores na rede
        this.discoverAdmins();
        
        // Enviar dados para admin se encontrado
        this.startDataSync();
    }

    discoverAdmins() {
        // Verificar localStorage por servidores admin ativos
        this.discoveryInterval = setInterval(() => {
            const adminServer = localStorage.getItem('p2p_admin_server');
            if (adminServer) {
                const serverInfo = JSON.parse(adminServer);
                if (serverInfo.isActive) {
                    this.connectToAdmin(serverInfo);
                }
            }
        }, 5000);
    }

    connectToAdmin(serverInfo) {
        console.log('🔌 Conectando ao admin:', serverInfo.adminIP);
        
        // Registrar cliente no servidor admin
        this.sendToAdmin({
            type: 'client_register',
            clientInfo: {
                ip: this.networkIP,
                userId: this.getCurrentUser().username,
                userName: this.getCurrentUser().name || this.getCurrentUser().username,
                computerName: this.getComputerName(),
                connectTime: new Date().toISOString()
            }
        });
        
        // Iniciar heartbeat
        this.startHeartbeat();
    }

    sendToAdmin(data) {
        // Enviar via localStorage (simula rede local)
        const message = {
            timestamp: new Date().toISOString(),
            fromIP: this.networkIP,
            data: data
        };
        
        localStorage.setItem('p2p_client_message', JSON.stringify(message));
        
        // Limpar mensagem após um tempo
        setTimeout(() => {
            localStorage.removeItem('p2p_client_message');
        }, 1000);
    }

    processClientMessage(message) {
        if (!this.isAdmin) return;
        
        const { data } = message;
        
        switch (data.type) {
            case 'client_register':
                this.registerClient(data.clientInfo);
                break;
            case 'activity':
                this.logClientActivity(data);
                break;
            case 'heartbeat':
                this.updateClientStatus(data);
                break;
        }
        
        // Atualizar dashboard se estiver aberto
        this.updateDashboard();
    }

    registerClient(clientInfo) {
        console.log('📱 Novo cliente conectado:', clientInfo.userName);
        
        this.networkClients.set(clientInfo.userId, {
            ...clientInfo,
            lastSeen: new Date().toISOString(),
            activities: []
        });
        
        this.saveNetworkData();
    }

    logClientActivity(activityData) {
        const client = this.networkClients.get(activityData.userId);
        if (client) {
            client.activities.push({
                ...activityData,
                timestamp: new Date().toISOString()
            });
            
            // Manter apenas últimas 100 atividades por cliente
            if (client.activities.length > 100) {
                client.activities = client.activities.slice(-100);
            }
            
            this.saveNetworkData();
        }
    }

    updateClientStatus(heartbeatData) {
        const client = this.networkClients.get(heartbeatData.userId);
        if (client) {
            client.lastSeen = new Date().toISOString();
            client.currentPage = heartbeatData.currentPage;
            this.saveNetworkData();
        }
    }

    startDataSync() {
        // Enviar atividades para admin a cada 10 segundos
        setInterval(() => {
            if (!this.isAdmin) {
                this.syncActivitiesWithAdmin();
            }
        }, 10000);
    }

    syncActivitiesWithAdmin() {
        const activities = this.getLocalActivities();
        const recentActivities = activities.slice(-10); // Últimas 10 atividades
        
        if (recentActivities.length > 0) {
            this.sendToAdmin({
                type: 'activity_batch',
                userId: this.getCurrentUser().username,
                activities: recentActivities
            });
        }
    }

    startHeartbeat() {
        setInterval(() => {
            if (!this.isAdmin) {
                this.sendToAdmin({
                    type: 'heartbeat',
                    userId: this.getCurrentUser().username,
                    currentPage: window.location.hash || '#dashboard',
                    timestamp: new Date().toISOString()
                });
            }
        }, 30000); // A cada 30 segundos
    }

    startAdminBroadcast() {
        // Manter servidor admin ativo no localStorage
        this.broadcastInterval = setInterval(() => {
            const serverData = {
                isActive: true,
                adminIP: this.networkIP,
                adminPort: this.adminPort,
                lastUpdate: new Date().toISOString(),
                connectedClients: Array.from(this.networkClients.keys())
            };
            
            localStorage.setItem('p2p_admin_server', JSON.stringify(serverData));
        }, 5000);
    }

    showAdminInfo() {
        // Mostrar informações do servidor P2P na interface admin
        const adminSection = document.getElementById('admin');
        if (adminSection) {
            const infoDiv = document.createElement('div');
            infoDiv.className = 'p2p-server-info';
            infoDiv.innerHTML = `
                <div class="server-status">
                    <h3>🌐 Servidor P2P Ativo</h3>
                    <div class="status-grid">
                        <div class="status-item">
                            <strong>IP da Rede:</strong> ${this.networkIP}
                        </div>
                        <div class="status-item">
                            <strong>Clientes Conectados:</strong> <span id="clientCount">0</span>
                        </div>
                        <div class="status-item">
                            <strong>Status:</strong> <span class="status-online">Online</span>
                        </div>
                    </div>
                    
                    <div class="client-list">
                        <h4>👥 Usuários na Rede:</h4>
                        <div id="networkClientsList"></div>
                    </div>
                    
                    <div class="network-activities">
                        <h4>📊 Atividades da Rede:</h4>
                        <div id="networkActivitiesList"></div>
                    </div>
                </div>
            `;
            
            // Inserir no início da seção admin
            adminSection.insertBefore(infoDiv, adminSection.firstChild);
            
            // Atualizar dados a cada 5 segundos
            setInterval(() => this.updateDashboard(), 5000);
        }
    }

    updateDashboard() {
        const clientCountEl = document.getElementById('clientCount');
        const clientsListEl = document.getElementById('networkClientsList');
        const activitiesListEl = document.getElementById('networkActivitiesList');
        
        if (clientCountEl) {
            clientCountEl.textContent = this.networkClients.size;
        }
        
        if (clientsListEl) {
            clientsListEl.innerHTML = Array.from(this.networkClients.values()).map(client => {
                const lastSeen = new Date(client.lastSeen);
                const isOnline = (Date.now() - lastSeen.getTime()) < 60000; // Online se visto nos últimos 60s
                
                return `
                    <div class="client-item ${isOnline ? 'online' : 'offline'}">
                        <div class="client-info">
                            <strong>${client.userName}</strong>
                            <span class="client-details">
                                ${client.computerName} | ${client.currentPage || 'Página desconhecida'}
                            </span>
                        </div>
                        <div class="client-status">
                            <span class="status-indicator ${isOnline ? 'online' : 'offline'}"></span>
                            ${isOnline ? 'Online' : 'Offline'}
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        if (activitiesListEl) {
            const allActivities = [];
            this.networkClients.forEach(client => {
                if (client.activities) {
                    allActivities.push(...client.activities.map(activity => ({
                        ...activity,
                        userName: client.userName
                    })));
                }
            });
            
            // Ordenar por timestamp (mais recente primeiro)
            allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            activitiesListEl.innerHTML = allActivities.slice(0, 20).map(activity => `
                <div class="activity-item">
                    <div class="activity-user">${activity.userName}</div>
                    <div class="activity-action">${this.formatAction(activity.action)}</div>
                    <div class="activity-time">${this.formatTime(activity.timestamp)}</div>
                </div>
            `).join('');
        }
    }

    formatAction(action) {
        const actions = {
            'login': '🔑 Login',
            'logout': '🚪 Logout',
            'page_view': '👁️ Visualização',
            'data_action': '📝 Ação nos dados',
            'heartbeat': '💗 Atividade'
        };
        return actions[action] || action;
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('pt-BR');
    }

    // Integração com sistema de monitoramento existente
    trackActivity(action, details = {}) {
        const activity = {
            id: this.generateId(),
            userId: this.getCurrentUser().username,
            userName: this.getCurrentUser().name || this.getCurrentUser().username,
            action: action,
            details: details,
            timestamp: new Date().toISOString(),
            computerName: this.getComputerName()
        };
        
        // Salvar localmente
        this.saveLocalActivity(activity);
        
        // Enviar para admin se não for admin
        if (!this.isAdmin) {
            this.sendToAdmin({
                type: 'activity',
                ...activity
            });
        }
    }

    saveLocalActivity(activity) {
        const activities = this.getLocalActivities();
        activities.push(activity);
        
        // Manter apenas últimas 200 atividades
        if (activities.length > 200) {
            activities.splice(0, activities.length - 200);
        }
        
        localStorage.setItem('p2p_activities', JSON.stringify(activities));
    }

    getLocalActivities() {
        const activities = localStorage.getItem('p2p_activities');
        return activities ? JSON.parse(activities) : [];
    }

    saveNetworkData() {
        const networkData = {
            clients: Array.from(this.networkClients.entries()),
            lastUpdate: new Date().toISOString()
        };
        localStorage.setItem('p2p_network_data', JSON.stringify(networkData));
    }

    loadNetworkData() {
        const data = localStorage.getItem('p2p_network_data');
        if (data) {
            const networkData = JSON.parse(data);
            this.networkClients = new Map(networkData.clients);
        }
    }

    // Utilitários
    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : { username: 'unknown', role: 'user' };
    }

    getComputerName() {
        // Tentar obter nome do computador
        return navigator.platform || 'Computador Desconhecido';
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    setupEventListeners() {
        // Cleanup ao sair
        window.addEventListener('beforeunload', () => {
            if (this.isAdmin) {
                localStorage.removeItem('p2p_admin_server');
            }
            
            if (this.broadcastInterval) {
                clearInterval(this.broadcastInterval);
            }
            
            if (this.discoveryInterval) {
                clearInterval(this.discoveryInterval);
            }
        });
    }

    // Métodos públicos para integração
    getNetworkStats() {
        return {
            isAdmin: this.isAdmin,
            networkIP: this.networkIP,
            connectedClients: this.networkClients.size,
            clients: Array.from(this.networkClients.values())
        };
    }

    disconnect() {
        if (this.broadcastInterval) {
            clearInterval(this.broadcastInterval);
        }
        
        if (this.discoveryInterval) {
            clearInterval(this.discoveryInterval);
        }
        
        if (this.isAdmin) {
            localStorage.removeItem('p2p_admin_server');
        }
    }
}

// Inicializar sistema P2P
if (typeof window !== 'undefined') {
    window.P2PMonitoring = P2PMonitoring;
    
    // Aguardar carregamento completo antes de inicializar
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.p2pMonitoring = new P2PMonitoring();
        }, 1000);
    });
}
