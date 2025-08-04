/**
 * CORREÇÃO DE EMERGÊNCIA - RESTAURAR CLIQUES
 * Este arquivo corrige problemas de interatividade no sistema
 */

// Função para corrigir problemas de cliques
function forceEnableClicks() {
    console.log('🔧 Iniciando correção de cliques...');
    
    // 1. Remover qualquer overlay invisível
    const overlays = document.querySelectorAll('[style*="position: fixed"]');
    overlays.forEach(overlay => {
        if (overlay.style.display !== 'none' && overlay.id !== 'modalOverlay') {
            overlay.style.display = 'none';
            console.log('❌ Overlay removido:', overlay);
        }
    });
    
    // 2. Forçar z-index normal para todos os elementos
    document.querySelectorAll('*').forEach(element => {
        const styles = window.getComputedStyle(element);
        if (styles.zIndex && parseInt(styles.zIndex) > 999 && element.id !== 'modalOverlay') {
            element.style.zIndex = 'auto';
            console.log('🔧 Z-index corrigido:', element);
        }
    });
    
    // 3. Restaurar pointer-events
    document.querySelectorAll('*').forEach(element => {
        if (element.style.pointerEvents === 'none' && !element.classList.contains('disabled')) {
            element.style.pointerEvents = 'auto';
            console.log('👆 Pointer events restaurado:', element);
        }
    });
    
    // 4. Reativar event listeners para botões principais
    reactivateMainButtons();
    
    console.log('✅ Correção de cliques concluída!');
}

// Reativar botões principais
function reactivateMainButtons() {
    // Botões de navegação
    document.querySelectorAll('.nav-item').forEach(item => {
        // Remover listeners antigos
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        // Adicionar novo listener
        newItem.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const section = newItem.getAttribute('data-section');
            if (section && window.app) {
                window.app.showSection(section);
                
                // Atualizar item ativo
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                newItem.classList.add('active');
            }
        });
    });
    
    // Botão de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        const newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
        
        newLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.app) {
                window.app.logout();
            }
        });
    }
    
    // Formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const newLoginForm = loginForm.cloneNode(true);
        loginForm.parentNode.replaceChild(newLoginForm, loginForm);
        
        newLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (window.auth) {
                window.auth.login(username, password);
            }
        });
    }
    
    // Todos os botões
    document.querySelectorAll('button').forEach(button => {
        if (!button.onclick && !button.getAttribute('data-fixed')) {
            button.style.cursor = 'pointer';
            button.style.pointerEvents = 'auto';
            button.setAttribute('data-fixed', 'true');
        }
    });
    
    // Todos os links
    document.querySelectorAll('a').forEach(link => {
        if (!link.onclick && !link.getAttribute('data-fixed')) {
            link.style.cursor = 'pointer';
            link.style.pointerEvents = 'auto';
            link.setAttribute('data-fixed', 'true');
        }
    });
    
    console.log('🔄 Event listeners reativados!');
}

// Executar correção ao carregar
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(forceEnableClicks, 1000);
    
    // Verificar a cada 5 segundos se ainda está funcionando
    setInterval(() => {
        const testButton = document.querySelector('button, .nav-item, a');
        if (testButton && window.getComputedStyle(testButton).pointerEvents === 'none') {
            console.log('⚠️ Problema detectado! Reaplicando correção...');
            forceEnableClicks();
        }
    }, 5000);
});

// Comando manual para usar no console
window.fixClicks = forceEnableClicks;

console.log('🛠️ Sistema de correção de cliques carregado!');
console.log('💡 Se ainda tiver problemas, digite: fixClicks() no console');
