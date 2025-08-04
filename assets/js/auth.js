// Sistema de Autenticação
class AuthManager {
    constructor() {
        this.setupEventListeners();
        this.initializeDefaultUsers();
    }

    setupEventListeners() {
        // Formulário de login
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Formulário de registro
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Links para alternar entre login e registro
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterScreen();
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginScreen();
        });
    }

    initializeDefaultUsers() {
        // Criar usuários padrão se não existirem
        if (!localStorage.getItem('users')) {
            const defaultUsers = [
                {
                    id: 1,
                    username: 'admin',
                    password: 'admin', // Senha simples para facilitar o uso
                    role: 'admin',
                    permissions: {
                        pedidos: { view: true, create: true, edit: true, delete: true },
                        fornecedores: { view: true, create: true, edit: true, delete: true },
                        itens: { view: true, create: true, edit: true, delete: true },
                        precos: { view: true, create: true, edit: true, delete: true },
                        logs: { view: true },
                        users: { view: true, create: true, edit: true, delete: true }
                    },
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    username: 'usuario',
                    password: this.hashPassword('123456'),
                    role: 'user',
                    permissions: {
                        pedidos: { view: true, create: true, edit: true, delete: false },
                        fornecedores: { view: true, create: false, edit: false, delete: false },
                        itens: { view: true, create: false, edit: false, delete: false },
                        precos: { view: true, create: false, edit: false, delete: false },
                        logs: { view: false },
                        users: { view: false, create: false, edit: false, delete: false }
                    },
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }
    }

    showLoginScreen() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('registerScreen').style.display = 'none';
        this.clearMessages();
    }

    showRegisterScreen() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('registerScreen').style.display = 'flex';
        this.clearMessages();
    }

    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        // Validação básica
        if (!username || !password) {
            this.showMessage('Por favor, preencha todos os campos.', 'error', 'loginScreen');
            return;
        }

        // Verificar credenciais
        const users = this.getUsers();
        const user = users.find(u => 
            u.username.toLowerCase() === username.toLowerCase() && 
            u.password === password // Comparação direta sem hash
        );

        if (user) {
            // Login bem-sucedido
            const userData = {
                id: user.id,
                username: user.username,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            // Registrar login no sistema de monitoramento
            if (window.AuthMonitoring) {
                window.AuthMonitoring.trackLogin(user.username);
            }
            
            // Log do login - aguardar o admin manager ser inicializado
            setTimeout(() => {
                if (window.adminManager) {
                    window.adminManager.logAction('login', 'system', `Login realizado - ID: ${user.id}`);
                }
            }, 100);
            
            this.showMessage('Login realizado com sucesso!', 'success', 'loginScreen');
            
            setTimeout(() => {
                window.app.currentUser = userData;
                window.app.showMainApp();
            }, 1000);
        } else {
            this.showMessage('Usuário ou senha incorretos.', 'error', 'loginScreen');
        }

        // Limpar formulário
        document.getElementById('loginForm').reset();
    }

    handleRegister() {
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        // Validações
        if (!username || !password || !confirmPassword) {
            this.showMessage('Por favor, preencha todos os campos.', 'error', 'registerScreen');
            return;
        }

        if (username.length < 3) {
            this.showMessage('O nome de usuário deve ter pelo menos 3 caracteres.', 'error', 'registerScreen');
            return;
        }

        if (password.length < 6) {
            this.showMessage('A senha deve ter pelo menos 6 caracteres.', 'error', 'registerScreen');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage('As senhas não coincidem.', 'error', 'registerScreen');
            return;
        }

        // Verificar se usuário já existe
        const users = this.getUsers();
        if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
            this.showMessage('Este nome de usuário já está em uso.', 'error', 'registerScreen');
            return;
        }

        // Criar novo usuário
        const newUser = {
            id: this.generateUserId(),
            username: username,
            password: password, // Senha sem hash para simplicidade
            role: 'user', // Usuários criados via registro são sempre 'user'
            permissions: {
                pedidos: { view: true, create: true, edit: true, delete: false },
                fornecedores: { view: true, create: false, edit: false, delete: false },
                itens: { view: true, create: false, edit: false, delete: false },
                precos: { view: true, create: false, edit: false, delete: false },
                logs: { view: false },
                users: { view: false, create: false, edit: false, delete: false }
            },
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        this.showMessage('Conta criada com sucesso! Você pode fazer login agora.', 'success', 'registerScreen');
        
        // Limpar formulário e voltar para login
        document.getElementById('registerForm').reset();
        setTimeout(() => {
            this.showLoginScreen();
        }, 2000);
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    generateUserId() {
        const users = this.getUsers();
        return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    }

    // Hash simples para senhas (em produção, use uma biblioteca mais robusta)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    showMessage(message, type, screen) {
        this.clearMessages();
        
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        
        const targetForm = screen === 'loginScreen' ? 
            document.querySelector('#loginScreen form') : 
            document.querySelector('#registerScreen form');
        
        targetForm.insertBefore(messageEl, targetForm.firstChild);
        
        // Remover mensagem após 5 segundos
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 5000);
    }

    clearMessages() {
        document.querySelectorAll('.message').forEach(msg => {
            if (msg.parentNode) {
                msg.parentNode.removeChild(msg);
            }
        });
    }

    // Método para resetar dados (útil para desenvolvimento)
    resetData() {
        const confirmReset = confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.');
        if (confirmReset) {
            localStorage.clear();
            this.initializeDefaultUsers();
            window.app.loadInitialData();
            alert('Dados resetados com sucesso!');
            location.reload();
        }
    }

    // Método para exportar dados do usuário
    exportUserData() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        const userData = {
            user: currentUser,
            pedidos: JSON.parse(localStorage.getItem('pedidos') || '[]'),
            fornecedores: JSON.parse(localStorage.getItem('fornecedores') || '[]'),
            itens: JSON.parse(localStorage.getItem('itens') || '[]'),
            precos: JSON.parse(localStorage.getItem('precos') || '[]'),
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `optmetrics-backup-${currentUser.username}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Método para importar dados do usuário
    importUserData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.pedidos) localStorage.setItem('pedidos', JSON.stringify(data.pedidos));
                if (data.fornecedores) localStorage.setItem('fornecedores', JSON.stringify(data.fornecedores));
                if (data.itens) localStorage.setItem('itens', JSON.stringify(data.itens));
                if (data.precos) localStorage.setItem('precos', JSON.stringify(data.precos));
                
                alert('Dados importados com sucesso!');
                location.reload();
            } catch (error) {
                alert('Erro ao importar dados. Verifique se o arquivo está correto.');
            }
        };
        reader.readAsText(file);
    }
}

// Inicializar gerenciador de autenticação
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});
