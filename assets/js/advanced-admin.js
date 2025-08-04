/**
 * Painel Administrativo Avançado com Monitoramento Empresarial
 */

class AdvancedAdminPanel {
    constructor() {
        this.monitoringSystem = window.monitoringSystem;
        this.init();
    }

    init() {
        this.createMonitoringTab();
        this.setupMonitoringControls();
    }

    createMonitoringTab() {
        const adminTabs = document.querySelector('.admin-tabs');
        if (!adminTabs) return;

        // Adicionar aba de monitoramento
        const monitoringTab = document.createElement('button');
        monitoringTab.className = 'tab-button';
        monitoringTab.setAttribute('data-tab', 'monitoring');
        monitoringTab.innerHTML = '<i class="fas fa-chart-line"></i> Monitoramento';
        adminTabs.appendChild(monitoringTab);

        // Criar conteúdo da aba
        const adminContent = document.querySelector('.admin-content');
        const monitoringContent = document.createElement('div');
        monitoringContent.className = 'tab-content';
        monitoringContent.id = 'monitoring';
        monitoringContent.innerHTML = this.getMonitoringHTML();
        adminContent.appendChild(monitoringContent);

        // Configurar eventos
        monitoringTab.addEventListener('click', () => {
            this.showMonitoringTab();
        });
    }

    getMonitoringHTML() {
        return `
            <div class="monitoring-panel">
                <div class="panel-header">
                    <h2><i class="fas fa-chart-line"></i> Monitoramento Empresarial</h2>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="adminPanel.refreshMonitoring()">
                            <i class="fas fa-sync"></i> Atualizar
                        </button>
                        <button class="btn btn-success" onclick="adminPanel.exportReport()">
                            <i class="fas fa-download"></i> Exportar
                        </button>
                    </div>
                </div>

                <div class="monitoring-config">
                    <h3>Configurações de Monitoramento</h3>
                    <div class="config-grid">
                        <div class="config-item">
                            <label>
                                <input type="checkbox" id="enableMonitoring"> 
                                Ativar Monitoramento
                            </label>
                        </div>
                        <div class="config-item">
                            <label>URL do Servidor (opcional):</label>
                            <input type="url" id="serverUrl" placeholder="https://seu-servidor.com">
                        </div>
                        <div class="config-item">
                            <label>ID da Empresa:</label>
                            <input type="text" id="companyId" placeholder="EMPRESA_001">
                        </div>
                        <div class="config-item">
                            <button class="btn btn-primary" onclick="adminPanel.saveMonitoringConfig()">
                                Salvar Configurações
                            </button>
                        </div>
                    </div>
                </div>

                <div class="monitoring-stats">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-users"></i></div>
                            <div class="stat-info">
                                <h3 id="totalUsers">0</h3>
                                <p>Usuários Únicos</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-mouse-pointer"></i></div>
                            <div class="stat-info">
                                <h3 id="totalActions">0</h3>
                                <p>Ações Registradas</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-clock"></i></div>
                            <div class="stat-info">
                                <h3 id="avgSession">0min</h3>
                                <p>Tempo Médio</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-desktop"></i></div>
                            <div class="stat-info">
                                <h3 id="totalComputers">0</h3>
                                <p>Computadores</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="monitoring-filters">
                    <h3>Filtros de Relatório</h3>
                    <div class="filter-grid">
                        <div class="filter-item">
                            <label>Usuário:</label>
                            <select id="filterUser">
                                <option value="">Todos</option>
                            </select>
                        </div>
                        <div class="filter-item">
                            <label>Ação:</label>
                            <select id="filterAction">
                                <option value="">Todas</option>
                                <option value="login">Login</option>
                                <option value="logout">Logout</option>
                                <option value="page_view">Visualização</option>
                                <option value="data_action">Ação nos Dados</option>
                            </select>
                        </div>
                        <div class="filter-item">
                            <label>Data Início:</label>
                            <input type="date" id="filterStartDate">
                        </div>
                        <div class="filter-item">
                            <label>Data Fim:</label>
                            <input type="date" id="filterEndDate">
                        </div>
                        <div class="filter-item">
                            <button class="btn btn-primary" onclick="adminPanel.applyFilters()">
                                <i class="fas fa-filter"></i> Aplicar
                            </button>
                            <button class="btn btn-secondary" onclick="adminPanel.clearFilters()">
                                <i class="fas fa-times"></i> Limpar
                            </button>
                        </div>
                    </div>
                </div>

                <div class="activity-timeline">
                    <h3>Linha do Tempo de Atividades</h3>
                    <div class="timeline-container" id="timelineContainer">
                        <!-- Timeline será gerada dinamicamente -->
                    </div>
                </div>

                <div class="computer-list">
                    <h3>Computadores Monitorados</h3>
                    <div class="computers-grid" id="computersGrid">
                        <!-- Lista de computadores será gerada dinamicamente -->
                    </div>
                </div>

                <div class="detailed-log">
                    <h3>Log Detalhado</h3>
                    <div class="log-controls">
                        <button class="btn btn-info" onclick="adminPanel.exportCSV()">
                            <i class="fas fa-file-csv"></i> Exportar CSV
                        </button>
                        <button class="btn btn-info" onclick="adminPanel.exportJSON()">
                            <i class="fas fa-file-code"></i> Exportar JSON
                        </button>
                    </div>
                    <div class="log-table-container">
                        <table class="log-table" id="logTable">
                            <thead>
                                <tr>
                                    <th>Data/Hora</th>
                                    <th>Usuário</th>
                                    <th>Ação</th>
                                    <th>Detalhes</th>
                                    <th>Computador</th>
                                </tr>
                            </thead>
                            <tbody id="logTableBody">
                                <!-- Logs serão carregados dinamicamente -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    showMonitoringTab() {
        // Ativar aba
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector('[data-tab="monitoring"]').classList.add('active');
        document.getElementById('monitoring').classList.add('active');

        // Carregar dados
        this.loadMonitoringData();
    }

    loadMonitoringData() {
        this.loadMonitoringConfig();
        this.updateStats();
        this.loadActivityTimeline();
        this.loadComputersList();
        this.loadDetailedLog();
        this.populateUserFilter();
    }

    loadMonitoringConfig() {
        const settings = this.monitoringSystem.getMonitoringSettings();
        
        document.getElementById('enableMonitoring').checked = settings.enabled;
        document.getElementById('serverUrl').value = settings.serverUrl || '';
        document.getElementById('companyId').value = settings.companyId || '';
    }

    saveMonitoringConfig() {
        const settings = {
            enabled: document.getElementById('enableMonitoring').checked,
            serverUrl: document.getElementById('serverUrl').value,
            companyId: document.getElementById('companyId').value,
            trackActions: true,
            trackTime: true,
            syncInterval: 30000
        };

        this.monitoringSystem.setMonitoringSettings(settings);
        
        this.showAlert('Configurações salvas com sucesso!', 'success');
        
        // Reinicializar sistema se necessário
        if (settings.enabled && !this.monitoringSystem.isEnabled) {
            this.monitoringSystem.init();
        }
    }

    updateStats() {
        const activities = this.monitoringSystem.getAllActivities();
        const uniqueUsers = [...new Set(activities.map(a => a.userId))];
        const uniqueComputers = [...new Set(activities.map(a => a.computerInfo?.computerName).filter(Boolean))];
        
        // Calcular tempo médio de sessão
        const sessionTimes = activities
            .filter(a => a.action === 'logout' && a.details?.sessionDuration)
            .map(a => a.details.sessionDuration);
        
        const avgSession = sessionTimes.length > 0 
            ? Math.round(sessionTimes.reduce((a, b) => a + b, 0) / sessionTimes.length / 60000)
            : 0;

        document.getElementById('totalUsers').textContent = uniqueUsers.length;
        document.getElementById('totalActions').textContent = activities.length;
        document.getElementById('avgSession').textContent = `${avgSession}min`;
        document.getElementById('totalComputers').textContent = uniqueComputers.length;
    }

    loadActivityTimeline() {
        const container = document.getElementById('timelineContainer');
        const activities = this.monitoringSystem.getAllActivities()
            .slice(-20) // Últimas 20 atividades
            .reverse();

        container.innerHTML = activities.map(activity => `
            <div class="timeline-item">
                <div class="timeline-time">${this.formatDateTime(activity.timestamp)}</div>
                <div class="timeline-content">
                    <strong>${activity.userName}</strong> - ${this.formatAction(activity.action)}
                    <br><small>${activity.computerInfo?.computerName || 'Computador desconhecido'}</small>
                </div>
            </div>
        `).join('');
    }

    loadComputersList() {
        const container = document.getElementById('computersGrid');
        const activities = this.monitoringSystem.getAllActivities();
        
        // Agrupar por computador
        const computers = {};
        activities.forEach(activity => {
            const computerName = activity.computerInfo?.computerName || 'Desconhecido';
            if (!computers[computerName]) {
                computers[computerName] = {
                    name: computerName,
                    users: new Set(),
                    lastActivity: activity.timestamp,
                    totalActions: 0
                };
            }
            computers[computerName].users.add(activity.userName);
            computers[computerName].totalActions++;
            if (new Date(activity.timestamp) > new Date(computers[computerName].lastActivity)) {
                computers[computerName].lastActivity = activity.timestamp;
            }
        });

        container.innerHTML = Object.values(computers).map(computer => `
            <div class="computer-card">
                <div class="computer-icon"><i class="fas fa-desktop"></i></div>
                <div class="computer-info">
                    <h4>${computer.name}</h4>
                    <p>Usuários: ${computer.users.size}</p>
                    <p>Ações: ${computer.totalActions}</p>
                    <p>Última atividade: ${this.formatDateTime(computer.lastActivity)}</p>
                </div>
            </div>
        `).join('');
    }

    loadDetailedLog(filters = {}) {
        const tbody = document.getElementById('logTableBody');
        let activities = this.monitoringSystem.getAllActivities();

        // Aplicar filtros
        if (filters.user) {
            activities = activities.filter(a => a.userId === filters.user);
        }
        if (filters.action) {
            activities = activities.filter(a => a.action === filters.action);
        }
        if (filters.startDate && filters.endDate) {
            activities = this.monitoringSystem.getActivitiesByTimeRange(filters.startDate, filters.endDate);
        }

        tbody.innerHTML = activities
            .slice(-100) // Últimas 100 atividades
            .reverse()
            .map(activity => `
                <tr>
                    <td>${this.formatDateTime(activity.timestamp)}</td>
                    <td>${activity.userName}</td>
                    <td>${this.formatAction(activity.action)}</td>
                    <td>${this.formatDetails(activity.details)}</td>
                    <td>${activity.computerInfo?.computerName || 'Desconhecido'}</td>
                </tr>
            `).join('');
    }

    populateUserFilter() {
        const select = document.getElementById('filterUser');
        const activities = this.monitoringSystem.getAllActivities();
        const users = [...new Set(activities.map(a => ({ id: a.userId, name: a.userName })))];
        
        select.innerHTML = '<option value="">Todos</option>' + 
            users.map(user => `<option value="${user.id}">${user.name}</option>`).join('');
    }

    applyFilters() {
        const filters = {
            user: document.getElementById('filterUser').value,
            action: document.getElementById('filterAction').value,
            startDate: document.getElementById('filterStartDate').value,
            endDate: document.getElementById('filterEndDate').value
        };

        this.loadDetailedLog(filters);
    }

    clearFilters() {
        document.getElementById('filterUser').value = '';
        document.getElementById('filterAction').value = '';
        document.getElementById('filterStartDate').value = '';
        document.getElementById('filterEndDate').value = '';
        this.loadDetailedLog();
    }

    refreshMonitoring() {
        this.loadMonitoringData();
        this.showAlert('Dados atualizados!', 'success');
    }

    exportReport() {
        const filters = {
            user: document.getElementById('filterUser').value,
            action: document.getElementById('filterAction').value,
            startDate: document.getElementById('filterStartDate').value,
            endDate: document.getElementById('filterEndDate').value
        };

        const report = this.monitoringSystem.generateActivityReport(filters);
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio_monitoramento_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    exportCSV() {
        const csv = this.monitoringSystem.exportActivities('csv');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `atividades_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    exportJSON() {
        const json = this.monitoringSystem.exportActivities('json');
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `atividades_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Utilitários de formatação
    formatDateTime(timestamp) {
        return new Date(timestamp).toLocaleString('pt-BR');
    }

    formatAction(action) {
        const actions = {
            'login': 'Login',
            'logout': 'Logout',
            'page_view': 'Visualização de Página',
            'data_action': 'Ação nos Dados',
            'heartbeat': 'Atividade'
        };
        return actions[action] || action;
    }

    formatDetails(details) {
        if (!details || typeof details !== 'object') return '-';
        
        if (details.action && details.module) {
            return `${details.action} em ${details.module}`;
        }
        
        if (details.page) {
            return `Página: ${details.page}`;
        }
        
        return JSON.stringify(details);
    }

    showAlert(message, type = 'info') {
        // Implementar sistema de alertas
        alert(message);
    }
}

// Integrar com sistema existente
if (typeof window !== 'undefined') {
    window.AdvancedAdminPanel = AdvancedAdminPanel;
}
