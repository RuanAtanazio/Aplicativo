// Aplicação Principal
class OptmetricsApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Verificar se existe usuário logado
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showMainApp();
        } else {
            this.showLoginScreen();
        }

        this.setupEventListeners();
        this.loadInitialData();
    }

    setupEventListeners() {
        // Navegação do menu
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.showSection(section);
                
                // Atualizar item ativo
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Botão de logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Fechar modal clicando no overlay
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') {
                this.closeModal();
            }
        });

        // Tecla ESC para fechar modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    showLoginScreen() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('registerScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'none';
    }

    showMainApp() {
        console.log('showMainApp chamado');
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('registerScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'flex';
        
        if (this.currentUser) {
            console.log('Usuário atual:', this.currentUser);
            document.getElementById('currentUser').textContent = this.currentUser.username;
            this.setupUserPermissions();
        } else {
            console.log('Nenhum usuário atual definido');
        }
    }

    setupUserPermissions() {
        console.log('setupUserPermissions chamado');
        const user = this.getCurrentUserData();
        console.log('Dados do usuário:', user);
        
        if (!user || !user.permissions) {
            console.log('Usuário sem permissões válidas');
            return;
        }

        // Controlar visibilidade do menu
        this.controlMenuVisibility(user.permissions);
        
        // Controlar botões de ação
        this.controlActionButtons(user.permissions);
        
        // Reinicializar event listeners dos managers
        this.setupManagersEventListeners();
        
        // Adicionar menu de administração se for admin
        console.log('Verificando se é admin:', user.role === 'admin');
        if (user.role === 'admin') {
            console.log('Chamando addAdminMenu');
            this.addAdminMenu();
            
            // Inicializar painel administrativo avançado
            if (window.AdvancedAdminPanel) {
                this.advancedAdminPanel = new AdvancedAdminPanel();
            }
        }
        
        // Inicializar sistema de monitoramento
        if (window.monitoringSystem) {
            window.monitoringSystem.trackAction('page_view', { page: 'dashboard' });
        }
    }

    setupManagersEventListeners() {
        console.log('Reinicializando event listeners dos managers...');
        
        // Reinicializar event listeners de todos os managers
        if (window.pedidosManager) {
            window.pedidosManager.setupEventListeners();
        }
        if (window.fornecedoresManager) {
            window.fornecedoresManager.setupEventListeners();
        }
        if (window.itensManager) {
            window.itensManager.setupEventListeners();
        }
        if (window.precosManager) {
            window.precosManager.setupEventListeners();
        }
    }

    controlMenuVisibility(permissions) {
        const menuItems = document.querySelectorAll('.nav-item');
        
        menuItems.forEach(item => {
            const section = item.getAttribute('data-section');
            if (permissions[section] && !permissions[section].view) {
                item.style.display = 'none';
            } else {
                item.style.display = 'flex';
            }
        });
    }

    controlActionButtons(permissions) {
        // Esta função será chamada quando cada seção for carregada
        this.userPermissions = permissions;
    }

    addAdminMenu() {
        console.log('addAdminMenu chamado');
        const navMenu = document.querySelector('.nav-menu');
        console.log('navMenu encontrado:', !!navMenu);
        
        // Verificar se já existe o menu admin
        if (document.querySelector('[data-section="admin"]')) {
            console.log('Menu admin já existe');
            return;
        }
        
        console.log('Criando menu admin...');
        const adminMenuItem = document.createElement('a');
        adminMenuItem.href = '#';
        adminMenuItem.className = 'nav-item';
        adminMenuItem.setAttribute('data-section', 'admin');
        adminMenuItem.innerHTML = `
            <span class="nav-icon">⚙️</span>
            Administração
        `;
        
        adminMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('admin');
            
            // Atualizar item ativo
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            adminMenuItem.classList.add('active');
        });
        
        console.log('Adicionando menu admin ao DOM...');
        navMenu.appendChild(adminMenuItem);
        console.log('Menu admin adicionado com sucesso!');
    }

    getCurrentUserData() {
        if (!this.currentUser) return null;
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.find(u => u.id === this.currentUser.id);
    }

    hasPermission(section, action) {
        const user = this.getCurrentUserData();
        console.log(`Verificando permissão: ${section}.${action} para usuário:`, user);
        
        if (!user || !user.permissions || !user.permissions[section]) {
            console.log('Permissão negada: usuário ou permissões não encontradas');
            return false;
        }
        
        const hasPermission = user.permissions[section][action] === true;
        console.log(`Permissão ${section}.${action}:`, hasPermission);
        return hasPermission;
    }

    showSection(sectionName) {
        // Esconder todas as seções
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar seção selecionada
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Registrar visualização da página
            if (window.AuthMonitoring) {
                window.AuthMonitoring.trackPageView(sectionName);
            }
            
            // Carregar dados da seção específica
            this.loadSectionData(sectionName);
        }
    }

    loadSectionData(sectionName) {
        switch(sectionName) {
            case 'pedidos':
                window.pedidosManager.loadPedidos();
                break;
            case 'fornecedores':
                window.fornecedoresManager.loadFornecedores();
                break;
            case 'itens':
                window.itensManager.loadItens();
                break;
            case 'precos':
                window.precosManager.loadPrecos();
                break;
        }
    }

    loadInitialData() {
        // Inicializar dados padrão se não existirem
        if (!localStorage.getItem('fornecedores')) {
            const fornecedoresDefault = [
                { id: 1, nome: 'Suspröer A', telefone: '(11) 99999-9999', email: 'contato@susproeA.com' },
                { id: 2, nome: 'Fornecedor B', telefone: '(11) 88888-8888', email: 'contato@fornecedorB.com' },
                { id: 3, nome: 'Suspröer C', telefone: '(11) 77777-7777', email: 'contato@susproeC.com' }
            ];
            localStorage.setItem('fornecedores', JSON.stringify(fornecedoresDefault));
        }

        if (!localStorage.getItem('itens')) {
            const itensDefault = [
                { id: 1, nome: 'Item A', descricao: 'Descrição do Item A', unidade: 'UN', categoria: 'Categoria 1' },
                { id: 2, nome: 'Item B', descricao: 'Descrição do Item B', unidade: 'KG', categoria: 'Categoria 2' },
                { id: 3, nome: 'Item C', descricao: 'Descrição do Item C', unidade: 'M', categoria: 'Categoria 1' }
            ];
            localStorage.setItem('itens', JSON.stringify(itensDefault));
        }

        if (!localStorage.getItem('pedidos')) {
            const pedidosDefault = [
                { 
                    id: 1, 
                    dataPedido: '2025-08-03', 
                    dataEntrega: '2025-08-10', 
                    fornecedorId: 1, 
                    status: 'pendente',
                    itens: [{ itemId: 1, quantidade: 10, preco: 15.50 }]
                },
                { 
                    id: 2, 
                    dataPedido: '2025-07-28', 
                    dataEntrega: '2025-08-04', 
                    fornecedorId: 2, 
                    status: 'aprovado',
                    itens: [{ itemId: 2, quantidade: 5, preco: 25.00 }]
                }
            ];
            localStorage.setItem('pedidos', JSON.stringify(pedidosDefault));
        }

        if (!localStorage.getItem('precos')) {
            const precosDefault = [
                { id: 1, fornecedorId: 1, itemId: 1, preco: 15.50, dataAtualizacao: '2025-08-01' },
                { id: 2, fornecedorId: 2, itemId: 1, preco: 16.00, dataAtualizacao: '2025-08-01' },
                { id: 3, fornecedorId: 1, itemId: 2, preco: 25.00, dataAtualizacao: '2025-08-01' }
            ];
            localStorage.setItem('precos', JSON.stringify(precosDefault));
        }
    }

    logout() {
        if (confirm('Tem certeza que deseja sair?')) {
            // Registrar logout no sistema de monitoramento
            if (window.AuthMonitoring && this.currentUser) {
                window.AuthMonitoring.trackLogout(this.currentUser.username);
            }
            
            localStorage.removeItem('currentUser');
            this.currentUser = null;
            this.showLoginScreen();
        }
    }

    // Utilitários para Modal
    showModal(title, content) {
        const modalContent = document.getElementById('modalContent');
        modalContent.innerHTML = `
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-modal" onclick="app.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        `;
        document.getElementById('modalOverlay').style.display = 'flex';
    }

    closeModal() {
        document.getElementById('modalOverlay').style.display = 'none';
    }

    showMessage(message, type = 'info') {
        // Criar elemento de mensagem
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        
        // Adicionar ao topo da página
        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(messageEl, mainContent.firstChild);
        
        // Remover após 3 segundos
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 3000);
    }

    // Utilitários de formatação
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    // Geradores de ID únicos
    generateId(entityType) {
        const existing = JSON.parse(localStorage.getItem(entityType) || '[]');
        return existing.length > 0 ? Math.max(...existing.map(item => item.id)) + 1 : 1;
    }
}

// Utilitários globais
window.Utils = {
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    },
    
    formatCurrency: (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },
    
    validateRequired: (fields) => {
        for (const field of fields) {
            if (!field.value.trim()) {
                field.focus();
                return false;
            }
        }
        return true;
    },
    
    sanitizeInput: (input) => {
        return input.trim().replace(/<[^>]*>/g, '');
    }
};

// Inicializar aplicação quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, inicializando aplicação...');
    window.app = new OptmetricsApp();
    
    // Inicializar managers globalmente
    console.log('Inicializando managers...');
    window.pedidosManager = new PedidosManager();
    window.fornecedoresManager = new FornecedoresManager();
    window.itensManager = new ItensManager();
    window.precosManager = new PrecosManager();
    window.adminManager = new AdminManager();
    
    console.log('Managers inicializados com sucesso');
});
