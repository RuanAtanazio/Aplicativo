// Gerenciador de Fornecedores
class FornecedoresManager {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        console.log('FornecedoresManager: setupEventListeners chamado');
        
        // Botão novo fornecedor - verificar permissão
        const novoFornecedorBtn = document.getElementById('novoFornecedor');
        console.log('Botão novoFornecedor encontrado:', !!novoFornecedorBtn);
        
        if (novoFornecedorBtn) {
            // Remover event listeners anteriores
            novoFornecedorBtn.replaceWith(novoFornecedorBtn.cloneNode(true));
            const newBtn = document.getElementById('novoFornecedor');
            
            if (window.app && window.app.hasPermission && !window.app.hasPermission('fornecedores', 'create')) {
                console.log('Usuário sem permissão para criar fornecedores');
                newBtn.style.display = 'none';
            } else {
                console.log('Usuário com permissão, adicionando event listener');
                newBtn.style.display = 'block';
                newBtn.addEventListener('click', () => {
                    console.log('Novo fornecedor clicado');
                    this.showNovoFornecedorModal();
                });
            }
        }

        // Filtros
        const filtroNomeFornecedor = document.getElementById('filtroNomeFornecedor');
        const filtroTelefoneFornecedor = document.getElementById('filtroTelefoneFornecedor');
        const filtroEmailFornecedor = document.getElementById('filtroEmailFornecedor');
        
        if (filtroNomeFornecedor) {
            filtroNomeFornecedor.addEventListener('input', () => this.applyFilters());
        }
        if (filtroTelefoneFornecedor) {
            filtroTelefoneFornecedor.addEventListener('input', () => this.applyFilters());
        }
        if (filtroEmailFornecedor) {
            filtroEmailFornecedor.addEventListener('input', () => this.applyFilters());
        }
    }

    loadFornecedores() {
        this.applyFilters();
    }

    applyFilters() {
        const fornecedores = this.getFornecedores();
        
        // Ordenar fornecedores alfabeticamente
        fornecedores.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        
        // Aplicar filtros
        const filtroNome = document.getElementById('filtroNomeFornecedor').value.toLowerCase();
        const filtroTelefone = document.getElementById('filtroTelefoneFornecedor').value.toLowerCase();
        const filtroEmail = document.getElementById('filtroEmailFornecedor').value.toLowerCase();
        
        const fornecedoresFiltrados = fornecedores.filter(fornecedor => {
            let matches = true;
            
            if (filtroNome && !fornecedor.nome.toLowerCase().includes(filtroNome)) {
                matches = false;
            }
            
            if (filtroTelefone && !(fornecedor.telefone || '').toLowerCase().includes(filtroTelefone)) {
                matches = false;
            }
            
            if (filtroEmail && !(fornecedor.email || '').toLowerCase().includes(filtroEmail)) {
                matches = false;
            }
            
            return matches;
        });
        
        this.renderFornecedores(fornecedoresFiltrados);
    }

    renderFornecedores(fornecedores) {
        const tbody = document.getElementById('fornecedoresTableBody');
        tbody.innerHTML = '';

        fornecedores.forEach(fornecedor => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${fornecedor.nome}</td>
                <td>${fornecedor.telefone || '-'}</td>
                <td>${fornecedor.email || '-'}</td>
                <td>
                    <button class="btn-secondary" onclick="fornecedoresManager.viewFornecedor(${fornecedor.id})">Ver</button>
                    ${window.app && window.app.hasPermission('fornecedores', 'edit') ? `<button class="btn-secondary" onclick="fornecedoresManager.editFornecedor(${fornecedor.id})">Editar</button>` : ''}
                    ${window.app && window.app.hasPermission('fornecedores', 'delete') ? `<button class="btn-danger" onclick="fornecedoresManager.deleteFornecedor(${fornecedor.id})">Excluir</button>` : ''}
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    clearFilters() {
        document.getElementById('filtroNomeFornecedor').value = '';
        document.getElementById('filtroTelefoneFornecedor').value = '';
        document.getElementById('filtroEmailFornecedor').value = '';
        this.applyFilters();
    }

    showNovoFornecedorModal() {
        const modalContent = `
            <form id="fornecedorForm">
                <div class="form-group">
                    <label for="nome">Nome do Fornecedor *</label>
                    <input type="text" id="nome" required maxlength="100">
                </div>
                <div class="form-group">
                    <label for="telefone">Telefone</label>
                    <input type="tel" id="telefone" placeholder="(11) 99999-9999" maxlength="20">
                </div>
                <div class="form-group">
                    <label for="email">E-mail</label>
                    <input type="email" id="email" maxlength="100">
                </div>
                <div class="form-group">
                    <label for="endereco">Endereço</label>
                    <textarea id="endereco" rows="3" maxlength="200"></textarea>
                </div>
                <div class="form-group">
                    <label for="cnpj">CNPJ</label>
                    <input type="text" id="cnpj" placeholder="00.000.000/0000-00" maxlength="18">
                </div>
                <div class="form-group">
                    <label for="contato">Pessoa de Contato</label>
                    <input type="text" id="contato" maxlength="100">
                </div>
                <div class="form-group">
                    <label for="observacoes">Observações</label>
                    <textarea id="observacoes" rows="3" maxlength="500"></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">Cancelar</button>
                    <button type="submit" class="btn-primary">Salvar Fornecedor</button>
                </div>
            </form>
        `;

        app.showModal('Novo Fornecedor', modalContent);

        // Configurar máscara para telefone
        this.setupPhoneMask();
        
        // Configurar máscara para CNPJ
        this.setupCNPJMask();

        // Configurar envio do formulário
        document.getElementById('fornecedorForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveFornecedor();
        });
    }

    setupPhoneMask() {
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                    value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
                    value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
                    value = value.replace(/^(\d{2})(\d{1,5})$/, '($1) $2');
                    value = value.replace(/^(\d{2})$/, '($1');
                }
                e.target.value = value;
            });
        }
    }

    setupCNPJMask() {
        const cnpjInput = document.getElementById('cnpj');
        if (cnpjInput) {
            cnpjInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 14) {
                    value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
                }
                e.target.value = value;
            });
        }
    }

    saveFornecedor(fornecedorId = null) {
        const nome = document.getElementById('nome').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const email = document.getElementById('email').value.trim();
        const endereco = document.getElementById('endereco').value.trim();
        const cnpj = document.getElementById('cnpj').value.trim();
        const contato = document.getElementById('contato').value.trim();
        const observacoes = document.getElementById('observacoes').value.trim();

        // Validações
        if (!nome) {
            app.showMessage('O nome do fornecedor é obrigatório.', 'error');
            return;
        }

        if (email && !this.isValidEmail(email)) {
            app.showMessage('Por favor, insira um e-mail válido.', 'error');
            return;
        }

        if (cnpj && !this.isValidCNPJ(cnpj)) {
            app.showMessage('Por favor, insira um CNPJ válido.', 'error');
            return;
        }

        const fornecedorData = {
            nome: Utils.sanitizeInput(nome),
            telefone: telefone,
            email: email,
            endereco: Utils.sanitizeInput(endereco),
            cnpj: cnpj,
            contato: Utils.sanitizeInput(contato),
            observacoes: Utils.sanitizeInput(observacoes)
        };

        const fornecedores = this.getFornecedores();

        // Verificar se já existe fornecedor com mesmo nome
        const existingFornecedor = fornecedores.find(f => 
            f.nome.toLowerCase() === nome.toLowerCase() && f.id !== fornecedorId
        );

        if (existingFornecedor) {
            app.showMessage('Já existe um fornecedor com este nome.', 'error');
            return;
        }

        if (fornecedorId) {
            // Editar fornecedor existente
            const index = fornecedores.findIndex(f => f.id === fornecedorId);
            if (index !== -1) {
                fornecedores[index] = { ...fornecedores[index], ...fornecedorData };
                fornecedores[index].atualizadoEm = new Date().toISOString();
            }
        } else {
            // Novo fornecedor
            fornecedorData.id = this.generateId();
            fornecedorData.criadoEm = new Date().toISOString();
            fornecedores.push(fornecedorData);
        }

        localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
        
        // Log da ação
        if (window.adminManager) {
            const action = fornecedorId ? 'edit' : 'create';
            const details = `Fornecedor ${action === 'edit' ? 'editado' : 'criado'}: ${fornecedorData.nome}`;
            window.adminManager.logAction(action, 'fornecedores', details);
        }
        
        app.closeModal();
        this.loadFornecedores();
        app.showMessage(
            fornecedorId ? 'Fornecedor atualizado com sucesso!' : 'Fornecedor criado com sucesso!', 
            'success'
        );
    }

    viewFornecedor(id) {
        const fornecedor = this.getFornecedores().find(f => f.id === id);
        if (!fornecedor) return;

        const modalContent = `
            <div class="fornecedor-details">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <p><strong>Nome:</strong> ${fornecedor.nome}</p>
                        <p><strong>Telefone:</strong> ${fornecedor.telefone || '-'}</p>
                        <p><strong>E-mail:</strong> ${fornecedor.email || '-'}</p>
                        <p><strong>CNPJ:</strong> ${fornecedor.cnpj || '-'}</p>
                    </div>
                    <div>
                        <p><strong>Contato:</strong> ${fornecedor.contato || '-'}</p>
                        <p><strong>Criado em:</strong> ${fornecedor.criadoEm ? Utils.formatDate(fornecedor.criadoEm) : '-'}</p>
                        <p><strong>Atualizado em:</strong> ${fornecedor.atualizadoEm ? Utils.formatDate(fornecedor.atualizadoEm) : '-'}</p>
                    </div>
                </div>
                
                ${fornecedor.endereco ? `
                    <div style="margin-top: 20px;">
                        <p><strong>Endereço:</strong></p>
                        <p style="background-color: #f8f9fa; padding: 10px; border-radius: 4px;">${fornecedor.endereco}</p>
                    </div>
                ` : ''}
                
                ${fornecedor.observacoes ? `
                    <div style="margin-top: 20px;">
                        <p><strong>Observações:</strong></p>
                        <p style="background-color: #f8f9fa; padding: 10px; border-radius: 4px;">${fornecedor.observacoes}</p>
                    </div>
                ` : ''}
                
                <div class="form-actions">
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">Fechar</button>
                    <button type="button" onclick="fornecedoresManager.editFornecedor(${id})" class="btn-primary">Editar</button>
                </div>
            </div>
        `;

        app.showModal('Detalhes do Fornecedor', modalContent);
    }

    editFornecedor(id) {
        const fornecedor = this.getFornecedores().find(f => f.id === id);
        if (!fornecedor) return;

        this.showNovoFornecedorModal();

        // Preencher formulário com dados existentes
        setTimeout(() => {
            document.getElementById('nome').value = fornecedor.nome || '';
            document.getElementById('telefone').value = fornecedor.telefone || '';
            document.getElementById('email').value = fornecedor.email || '';
            document.getElementById('endereco').value = fornecedor.endereco || '';
            document.getElementById('cnpj').value = fornecedor.cnpj || '';
            document.getElementById('contato').value = fornecedor.contato || '';
            document.getElementById('observacoes').value = fornecedor.observacoes || '';

            // Atualizar título do modal
            document.querySelector('.modal-header h3').textContent = 'Editar Fornecedor';

            // Atualizar evento de submissão para edição
            const form = document.getElementById('fornecedorForm');
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
            
            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveFornecedor(id);
            });
        }, 100);
    }

    deleteFornecedor(id) {
        // Verificar se o fornecedor está sendo usado em pedidos
        const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
        const fornecedorEmUso = pedidos.some(p => p.fornecedorId === id);

        if (fornecedorEmUso) {
            app.showMessage('Este fornecedor não pode ser excluído pois possui pedidos associados.', 'error');
            return;
        }

        if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
            const fornecedor = this.getFornecedores().find(f => f.id === id);
            const fornecedores = this.getFornecedores().filter(f => f.id !== id);
            localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
            
            // Log da ação
            if (window.adminManager && fornecedor) {
                window.adminManager.logAction('delete', 'fornecedores', `Fornecedor excluído: ${fornecedor.nome}`);
            }
            
            this.loadFornecedores();
            app.showMessage('Fornecedor excluído com sucesso!', 'success');
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidCNPJ(cnpj) {
        cnpj = cnpj.replace(/\D/g, '');
        
        if (cnpj.length !== 14) return false;
        
        // Verificar se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cnpj)) return false;
        
        // Validação dos dígitos verificadores
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) return false;
        
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1)) return false;
        
        return true;
    }

    getFornecedores() {
        return JSON.parse(localStorage.getItem('fornecedores') || '[]');
    }

    generateId() {
        const fornecedores = this.getFornecedores();
        return fornecedores.length > 0 ? Math.max(...fornecedores.map(f => f.id)) + 1 : 1;
    }

    // Método para exportar fornecedores
    exportFornecedores() {
        const fornecedores = this.getFornecedores();
        const csvContent = this.convertToCSV(fornecedores);
        this.downloadCSV(csvContent, 'fornecedores.csv');
    }

    convertToCSV(data) {
        const headers = ['ID', 'Nome', 'Telefone', 'Email', 'CNPJ', 'Contato', 'Endereco', 'Observacoes'];
        const csvRows = [headers.join(',')];
        
        data.forEach(fornecedor => {
            const row = [
                fornecedor.id,
                `"${fornecedor.nome || ''}"`,
                `"${fornecedor.telefone || ''}"`,
                `"${fornecedor.email || ''}"`,
                `"${fornecedor.cnpj || ''}"`,
                `"${fornecedor.contato || ''}"`,
                `"${fornecedor.endereco || ''}"`,
                `"${fornecedor.observacoes || ''}"`
            ];
            csvRows.push(row.join(','));
        });
        
        return csvRows.join('\n');
    }

    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
}

// Inicializar gerenciador de fornecedores
document.addEventListener('DOMContentLoaded', () => {
    window.fornecedoresManager = new FornecedoresManager();
});
