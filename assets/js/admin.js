// Gerenciador de Administração
class AdminManager {
    constructor() {
        // Só inicializar se o usuário for admin
        if (this.isAdmin()) {
            this.setupEventListeners();
        }
    }

    isAdmin() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return false;
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id === currentUser.id);
        return user && user.role === 'admin';
    }

    setupEventListeners() {
        // Event listeners serão configurados quando a seção admin for carregada
    }

    showTab(tabName) {
        // Esconder todas as tabs
        document.querySelectorAll('.admin-tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelectorAll('.admin-tab').forEach(btn => {
            btn.classList.remove('active');
        });

        // Mostrar tab selecionada
        document.getElementById(`admin${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`).classList.add('active');
        event.target.classList.add('active');

        // Carregar conteúdo da tab
        this.loadTabContent(tabName);
    }

    loadTabContent(tabName) {
        switch(tabName) {
            case 'online':
                this.loadOnlineUsers();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'logs':
                this.loadLogs();
                break;
            case 'backup':
                this.loadSystemStats();
                break;
        }
    }

    // === USUÁRIOS ONLINE ===
    loadOnlineUsers() {
        this.updateOnlineStats();
        this.renderOnlineUsers();
    }

    updateOnlineStats() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // Para simular usuários online, vamos considerar apenas o usuário atual
        // Em um ambiente real, isso viria de um servidor
        const onlineUsers = currentUser ? [currentUser] : [];
        
        const adminsOnline = onlineUsers.filter(user => {
            const fullUser = users.find(u => u.id === user.id);
            return fullUser && fullUser.role === 'admin';
        }).length;
        
        const regularUsersOnline = onlineUsers.length - adminsOnline;
        
        document.getElementById('totalOnline').textContent = onlineUsers.length;
        document.getElementById('adminsOnline').textContent = adminsOnline;
        document.getElementById('usersOnline').textContent = regularUsersOnline;
    }

    renderOnlineUsers() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const tbody = document.getElementById('onlineUsersTableBody');
        
        tbody.innerHTML = '';

        if (!currentUser) return;

        // Mostrar apenas o usuário atual como online
        const user = users.find(u => u.id === currentUser.id);
        if (!user) return;

        const row = document.createElement('tr');
        const loginTime = new Date(currentUser.loginTime);
        const timeOnline = this.calculateTimeOnline(loginTime);
        const roleLabel = user.role === 'admin' ? 'Administrador' : 'Usuário';
        
        row.innerHTML = `
            <td>${user.username}</td>
            <td><span class="status ${user.role}">${roleLabel}</span></td>
            <td>${Utils.formatDate(currentUser.loginTime)}</td>
            <td class="time-online">${timeOnline}</td>
            <td><span class="status-indicator online">Online</span></td>
            <td>
                ${user.id !== currentUser.id ? `
                    <button class="btn-secondary" onclick="adminManager.editUserPermissions(${user.id})">Permissões</button>
                    <button class="btn-danger" onclick="adminManager.forceLogout(${user.id})">Desconectar</button>
                ` : '<span style="color: #7f8c8d;">Você</span>'}
            </td>
        `;
        
        tbody.appendChild(row);
    }

    calculateTimeOnline(loginTime) {
        const now = new Date();
        const diff = now - loginTime;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }

    refreshOnlineUsers() {
        this.loadOnlineUsers();
        app.showMessage('Lista de usuários online atualizada!', 'success');
    }

    forceLogout(userId) {
        if (confirm('Tem certeza que deseja forçar o logout deste usuário?')) {
            // Em um ambiente real, isso enviaria um comando para o servidor
            app.showMessage('Funcionalidade de logout forçado seria implementada com servidor real.', 'info');
        }
    }

    // === GERENCIAMENTO DE USUÁRIOS ===
    loadUsers() {
        this.applyUserFilters();
    }

    applyUserFilters() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // Aplicar filtros
        const filtroRole = document.getElementById('filtroRoleUser')?.value || '';
        const filtroStatus = document.getElementById('filtroStatusUser')?.value || '';
        const filtroNome = document.getElementById('filtroNomeUser')?.value.toLowerCase() || '';
        
        let usuariosFiltrados = users.filter(user => {
            let matches = true;
            
            if (filtroRole && user.role !== filtroRole) {
                matches = false;
            }
            
            if (filtroStatus) {
                const isOnline = currentUser && user.id === currentUser.id;
                if (filtroStatus === 'online' && !isOnline) {
                    matches = false;
                } else if (filtroStatus === 'offline' && isOnline) {
                    matches = false;
                }
            }
            
            if (filtroNome && !user.username.toLowerCase().includes(filtroNome)) {
                matches = false;
            }
            
            return matches;
        });
        
        this.renderUsers(usuariosFiltrados, currentUser);
    }

    renderUsers(users, currentUser) {
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            
            const roleLabel = user.role === 'admin' ? 'Administrador' : 'Usuário';
            const lastLogin = this.getLastLogin(user.id);
            const isOnline = currentUser && user.id === currentUser.id;
            
            row.innerHTML = `
                <td><input type="checkbox" class="user-checkbox" value="${user.id}"></td>
                <td>${user.username}</td>
                <td><span class="status ${user.role}">${roleLabel}</span></td>
                <td>${Utils.formatDate(user.createdAt)}</td>
                <td>${lastLogin ? Utils.formatDate(lastLogin) : 'Nunca'}</td>
                <td><span class="status-indicator ${isOnline ? 'online' : 'offline'}">${isOnline ? 'Online' : 'Offline'}</span></td>
                <td>
                    <button class="btn-secondary" onclick="adminManager.editUserPermissions(${user.id})">Permissões</button>
                    <button class="btn-secondary" onclick="adminManager.changeUserRole(${user.id})">Alterar Papel</button>
                    ${user.id !== 1 ? `<button class="btn-danger" onclick="adminManager.deleteUser(${user.id})">Excluir</button>` : ''}
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    clearUserFilters() {
        document.getElementById('filtroRoleUser').value = '';
        document.getElementById('filtroStatusUser').value = '';
        document.getElementById('filtroNomeUser').value = '';
        this.applyUserFilters();
    }

    toggleSelectAll() {
        const selectAll = document.getElementById('selectAllUsers');
        const checkboxes = document.querySelectorAll('.user-checkbox');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });
    }

    changeUserRole(userId) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id === userId);
        
        if (!user) return;
        
        const currentRole = user.role;
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        const roleLabel = newRole === 'admin' ? 'Administrador' : 'Usuário';
        
        if (confirm(`Tem certeza que deseja alterar o papel de "${user.username}" para "${roleLabel}"?`)) {
            user.role = newRole;
            
            // Atualizar permissões baseadas no novo papel
            if (newRole === 'admin') {
                user.permissions = {
                    pedidos: { view: true, create: true, edit: true, delete: true },
                    fornecedores: { view: true, create: true, edit: true, delete: true },
                    itens: { view: true, create: true, edit: true, delete: true },
                    precos: { view: true, create: true, edit: true, delete: true },
                    logs: { view: true },
                    users: { view: true, create: true, edit: true, delete: true }
                };
            } else {
                user.permissions = {
                    pedidos: { view: true, create: true, edit: true, delete: false },
                    fornecedores: { view: true, create: false, edit: false, delete: false },
                    itens: { view: true, create: false, edit: false, delete: false },
                    precos: { view: true, create: false, edit: false, delete: false },
                    logs: { view: false },
                    users: { view: false, create: false, edit: false, delete: false }
                };
            }
            
            localStorage.setItem('users', JSON.stringify(users));
            
            this.logAction('edit', 'users', `Papel alterado: ${user.username} -> ${roleLabel}`);
            
            this.loadUsers();
            app.showMessage(`Papel de "${user.username}" alterado para "${roleLabel}" com sucesso!`, 'success');
        }
    }
    loadUsers() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const tbody = document.getElementById('usersTableBody');
        
        tbody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            
            const roleLabel = user.role === 'admin' ? 'Administrador' : 'Usuário';
            const lastLogin = this.getLastLogin(user.id);
            
            row.innerHTML = `
                <td>${user.username}</td>
                <td><span class="status ${user.role}">${roleLabel}</span></td>
                <td>${Utils.formatDate(user.createdAt)}</td>
                <td>${lastLogin ? Utils.formatDate(lastLogin) : 'Nunca'}</td>
                <td>
                    <button class="btn-secondary" onclick="adminManager.editUserPermissions(${user.id})">Permissões</button>
                    <button class="btn-secondary" onclick="adminManager.editUser(${user.id})">Editar</button>
                    ${user.id !== 1 ? `<button class="btn-danger" onclick="adminManager.deleteUser(${user.id})">Excluir</button>` : ''}
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    showCreateUserModal() {
        const modalContent = `
            <form id="createUserForm">
                <div class="form-group">
                    <label for="newUsername">Nome de Usuário *</label>
                    <input type="text" id="newUsername" required maxlength="50">
                </div>
                <div class="form-group">
                    <label for="newPassword">Senha *</label>
                    <input type="password" id="newPassword" required minlength="6">
                </div>
                <div class="form-group">
                    <label for="newRole">Papel *</label>
                    <select id="newRole" required>
                        <option value="user">Usuário</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">Cancelar</button>
                    <button type="submit" class="btn-primary">Criar Usuário</button>
                </div>
            </form>
        `;

        app.showModal('Criar Novo Usuário', modalContent);

        document.getElementById('createUserForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createUser();
        });
    }

    createUser() {
        const username = document.getElementById('newUsername').value.trim();
        const password = document.getElementById('newPassword').value;
        const role = document.getElementById('newRole').value;

        if (!username || !password) {
            app.showMessage('Preencha todos os campos obrigatórios.', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Verificar se usuário já existe
        if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
            app.showMessage('Este nome de usuário já existe.', 'error');
            return;
        }

        const permissions = role === 'admin' ? {
            pedidos: { view: true, create: true, edit: true, delete: true },
            fornecedores: { view: true, create: true, edit: true, delete: true },
            itens: { view: true, create: true, edit: true, delete: true },
            precos: { view: true, create: true, edit: true, delete: true },
            logs: { view: true },
            users: { view: true, create: true, edit: true, delete: true }
        } : {
            pedidos: { view: true, create: true, edit: true, delete: false },
            fornecedores: { view: true, create: false, edit: false, delete: false },
            itens: { view: true, create: false, edit: false, delete: false },
            precos: { view: true, create: false, edit: false, delete: false },
            logs: { view: false },
            users: { view: false, create: false, edit: false, delete: false }
        };

        const newUser = {
            id: Math.max(...users.map(u => u.id)) + 1,
            username: username,
            password: window.authManager.hashPassword(password),
            role: role,
            permissions: permissions,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        this.logAction('create', 'users', `Usuário criado: ${username} (${role})`);
        
        app.closeModal();
        this.loadUsers();
        app.showMessage('Usuário criado com sucesso!', 'success');
    }

    editUserPermissions(userId) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id === userId);
        
        if (!user) return;

        const permissions = user.permissions || {};
        
        const modalContent = `
            <form id="permissionsForm">
                <h4>Permissões para: ${user.username}</h4>
                
                <div class="permissions-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0;">
                    ${this.generatePermissionCheckboxes(permissions)}
                </div>
                
                <div class="form-actions">
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">Cancelar</button>
                    <button type="submit" class="btn-primary">Salvar Permissões</button>
                </div>
            </form>
        `;

        app.showModal('Editar Permissões', modalContent);

        document.getElementById('permissionsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUserPermissions(userId);
        });
    }

    generatePermissionCheckboxes(permissions) {
        const sections = [
            { key: 'pedidos', name: 'Pedidos de Compra' },
            { key: 'fornecedores', name: 'Fornecedores' },
            { key: 'itens', name: 'Itens' },
            { key: 'precos', name: 'Tabela de Preços' },
            { key: 'logs', name: 'Logs do Sistema' },
            { key: 'users', name: 'Usuários' }
        ];

        const actions = [
            { key: 'view', name: 'Visualizar' },
            { key: 'create', name: 'Criar' },
            { key: 'edit', name: 'Editar' },
            { key: 'delete', name: 'Excluir' }
        ];

        return sections.map(section => {
            const sectionPerms = permissions[section.key] || {};
            
            const checkboxes = actions.map(action => {
                if (section.key === 'logs' && action.key !== 'view') return '';
                
                const checked = sectionPerms[action.key] ? 'checked' : '';
                return `
                    <label style="display: flex; align-items: center; margin: 5px 0;">
                        <input type="checkbox" name="${section.key}_${action.key}" ${checked} style="margin-right: 8px;">
                        ${action.name}
                    </label>
                `;
            }).join('');

            return `
                <div style="border: 1px solid #ecf0f1; padding: 15px; border-radius: 6px;">
                    <h5 style="margin: 0 0 10px 0; color: #2c3e50;">${section.name}</h5>
                    ${checkboxes}
                </div>
            `;
        }).join('');
    }

    saveUserPermissions(userId) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) return;

        const formData = new FormData(document.getElementById('permissionsForm'));
        const permissions = {};

        ['pedidos', 'fornecedores', 'itens', 'precos', 'logs', 'users'].forEach(section => {
            permissions[section] = {
                view: formData.has(`${section}_view`),
                create: formData.has(`${section}_create`),
                edit: formData.has(`${section}_edit`),
                delete: formData.has(`${section}_delete`)
            };
        });

        users[userIndex].permissions = permissions;
        localStorage.setItem('users', JSON.stringify(users));

        this.logAction('edit', 'users', `Permissões alteradas para: ${users[userIndex].username}`);
        
        app.closeModal();
        this.loadUsers();
        app.showMessage('Permissões atualizadas com sucesso!', 'success');
    }

    deleteUser(userId) {
        if (userId === 1) {
            app.showMessage('O usuário administrador principal não pode ser excluído.', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id === userId);
        
        if (!user) return;

        if (confirm(`Tem certeza que deseja excluir o usuário "${user.username}"?`)) {
            const filteredUsers = users.filter(u => u.id !== userId);
            localStorage.setItem('users', JSON.stringify(filteredUsers));

            this.logAction('delete', 'users', `Usuário excluído: ${user.username}`);
            
            this.loadUsers();
            app.showMessage('Usuário excluído com sucesso!', 'success');
        }
    }

    // === SISTEMA DE LOGS ===
    loadLogs() {
        this.loadLogFilters();
        this.applyLogFilters();
    }

    loadLogFilters() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const select = document.getElementById('filtroUsuarioLog');
        
        select.innerHTML = '<option value="">Todos</option>';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.username;
            option.textContent = user.username;
            select.appendChild(option);
        });
    }

    applyLogFilters() {
        const logs = this.getLogs();
        
        const filtroTipo = document.getElementById('filtroTipoLog').value;
        const filtroUsuario = document.getElementById('filtroUsuarioLog').value;
        const filtroData = document.getElementById('filtroDataLog').value;
        
        const logsFiltrados = logs.filter(log => {
            let matches = true;
            
            if (filtroTipo && log.action !== filtroTipo) {
                matches = false;
            }
            
            if (filtroUsuario && log.user !== filtroUsuario) {
                matches = false;
            }
            
            if (filtroData) {
                const logDate = new Date(log.timestamp).toISOString().split('T')[0];
                if (logDate !== filtroData) {
                    matches = false;
                }
            }
            
            return matches;
        });
        
        this.renderLogs(logsFiltrados);
    }

    renderLogs(logs) {
        const tbody = document.getElementById('logsTableBody');
        tbody.innerHTML = '';

        // Ordenar logs por data (mais recentes primeiro)
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        logs.forEach(log => {
            const row = document.createElement('tr');
            
            const date = new Date(log.timestamp);
            const dateStr = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
            
            row.innerHTML = `
                <td>${dateStr}</td>
                <td>${log.user}</td>
                <td><span class="log-level ${log.action}">${this.getActionLabel(log.action)}</span></td>
                <td>${this.getModuleLabel(log.module)}</td>
                <td>${log.details}</td>
            `;
            
            tbody.appendChild(row);
        });
    }

    clearLogFilters() {
        document.getElementById('filtroTipoLog').value = '';
        document.getElementById('filtroUsuarioLog').value = '';
        document.getElementById('filtroDataLog').value = '';
        this.applyLogFilters();
    }

    clearLogs() {
        if (confirm('Tem certeza que deseja limpar todos os logs? Esta ação não pode ser desfeita.')) {
            localStorage.removeItem('systemLogs');
            this.loadLogs();
            app.showMessage('Logs limpos com sucesso!', 'success');
        }
    }

    // === BACKUP E RESTORE ===
    exportBackup() {
        const backupData = {
            timestamp: new Date().toISOString(),
            version: '1.0',
            data: {
                users: JSON.parse(localStorage.getItem('users') || '[]'),
                pedidos: JSON.parse(localStorage.getItem('pedidos') || '[]'),
                fornecedores: JSON.parse(localStorage.getItem('fornecedores') || '[]'),
                itens: JSON.parse(localStorage.getItem('itens') || '[]'),
                precos: JSON.parse(localStorage.getItem('precos') || '[]'),
                logs: JSON.parse(localStorage.getItem('systemLogs') || '[]')
            }
        };

        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        const date = new Date().toISOString().split('T')[0];
        link.download = `optmetrics-backup-${date}.json`;
        link.click();

        this.logAction('create', 'system', 'Backup exportado');
        app.showMessage('Backup exportado com sucesso!', 'success');
    }

    importBackup() {
        const fileInput = document.getElementById('backupFile');
        const file = fileInput.files[0];
        
        if (!file) {
            app.showMessage('Selecione um arquivo de backup.', 'error');
            return;
        }

        if (!confirm('ATENÇÃO: Esta operação substituirá todos os dados atuais. Deseja continuar?')) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backupData = JSON.parse(e.target.result);
                
                if (!backupData.data) {
                    throw new Error('Formato de backup inválido');
                }

                // Restaurar dados
                Object.keys(backupData.data).forEach(key => {
                    if (key !== 'logs') { // Não sobrescrever logs
                        localStorage.setItem(key, JSON.stringify(backupData.data[key]));
                    }
                });

                this.logAction('create', 'system', 'Backup restaurado');
                
                app.showMessage('Backup restaurado com sucesso! A página será recarregada.', 'success');
                
                setTimeout(() => {
                    location.reload();
                }, 2000);
                
            } catch (error) {
                app.showMessage('Erro ao restaurar backup: ' + error.message, 'error');
            }
        };
        
        reader.readAsText(file);
    }

    loadSystemStats() {
        const stats = {
            usuarios: JSON.parse(localStorage.getItem('users') || '[]').length,
            pedidos: JSON.parse(localStorage.getItem('pedidos') || '[]').length,
            fornecedores: JSON.parse(localStorage.getItem('fornecedores') || '[]').length,
            itens: JSON.parse(localStorage.getItem('itens') || '[]').length,
            precos: JSON.parse(localStorage.getItem('precos') || '[]').length,
            logs: JSON.parse(localStorage.getItem('systemLogs') || '[]').length
        };

        const container = document.getElementById('systemStats');
        container.innerHTML = Object.entries(stats).map(([key, value]) => `
            <div class="system-stat">
                <h5>${this.getStatLabel(key)}</h5>
                <div class="stat-value">${value}</div>
            </div>
        `).join('');
    }

    // === UTILITÁRIOS ===
    logAction(action, module, details) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        const logs = this.getLogs();
        const logEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            user: currentUser.username,
            action: action,
            module: module,
            details: details
        };

        logs.push(logEntry);
        
        // Manter apenas os últimos 1000 logs
        if (logs.length > 1000) {
            logs.splice(0, logs.length - 1000);
        }
        
        localStorage.setItem('systemLogs', JSON.stringify(logs));
    }

    getLogs() {
        return JSON.parse(localStorage.getItem('systemLogs') || '[]');
    }

    getLastLogin(userId) {
        const logs = this.getLogs();
        const loginLog = logs
            .filter(log => log.action === 'login' && log.details.includes('ID: ' + userId))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
        
        return loginLog ? loginLog.timestamp : null;
    }

    getActionLabel(action) {
        const labels = {
            'login': 'Login',
            'create': 'Criação',
            'edit': 'Edição',
            'delete': 'Exclusão',
            'error': 'Erro'
        };
        return labels[action] || action;
    }

    getModuleLabel(module) {
        const labels = {
            'pedidos': 'Pedidos',
            'fornecedores': 'Fornecedores',
            'itens': 'Itens',
            'precos': 'Preços',
            'users': 'Usuários',
            'system': 'Sistema'
        };
        return labels[module] || module;
    }

    getStatLabel(key) {
        const labels = {
            'usuarios': 'Usuários',
            'pedidos': 'Pedidos',
            'fornecedores': 'Fornecedores',
            'itens': 'Itens',
            'precos': 'Preços',
            'logs': 'Logs'
        };
        return labels[key] || key;
    }
}

// Inicializar gerenciador de administração
document.addEventListener('DOMContentLoaded', () => {
    window.adminManager = new AdminManager();
});
