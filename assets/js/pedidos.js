// Gerenciador de Pedidos de Compra
class PedidosManager {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        console.log('PedidosManager: setupEventListeners chamado');
        
        // Botão novo pedido - verificar permissão
        const novoPedidoBtn = document.getElementById('novoPedido');
        console.log('Botão novoPedido encontrado:', !!novoPedidoBtn);
        
        if (novoPedidoBtn) {
            // Remover event listeners anteriores
            novoPedidoBtn.replaceWith(novoPedidoBtn.cloneNode(true));
            const newBtn = document.getElementById('novoPedido');
            
            if (window.app && window.app.hasPermission && !window.app.hasPermission('pedidos', 'create')) {
                console.log('Usuário sem permissão para criar pedidos');
                newBtn.style.display = 'none';
            } else {
                console.log('Usuário com permissão, adicionando event listener');
                newBtn.style.display = 'block';
                newBtn.addEventListener('click', () => {
                    console.log('Novo pedido clicado');
                    this.showNovoPedidoModal();
                });
            }
        }

        // Filtros
        const filtroDataPedido = document.getElementById('filtroDataPedido');
        const filtroFornecedorPedido = document.getElementById('filtroFornecedorPedido');
        const filtroStatusPedido = document.getElementById('filtroStatusPedido');
        
        if (filtroDataPedido) {
            filtroDataPedido.addEventListener('input', () => this.applyFilters());
        }
        if (filtroFornecedorPedido) {
            filtroFornecedorPedido.addEventListener('change', () => this.applyFilters());
        }
        if (filtroStatusPedido) {
            filtroStatusPedido.addEventListener('change', () => this.applyFilters());
        }
    }

    loadPedidos() {
        this.loadFornecedorFilters();
        this.applyFilters();
    }

    loadFornecedorFilters() {
        const fornecedores = this.getFornecedores();
        const select = document.getElementById('filtroFornecedorPedido');
        
        // Manter opção "Todos"
        const currentValue = select.value;
        select.innerHTML = '<option value="">Todos os fornecedores</option>';
        
        // Ordenar fornecedores alfabeticamente
        fornecedores.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        
        fornecedores.forEach(fornecedor => {
            const option = document.createElement('option');
            option.value = fornecedor.id;
            option.textContent = fornecedor.nome;
            select.appendChild(option);
        });
        
        select.value = currentValue;
    }

    applyFilters() {
        const pedidos = this.getPedidos();
        const fornecedores = this.getFornecedores();
        
        // Ordenar pedidos por data (mais recentes primeiro)
        pedidos.sort((a, b) => new Date(b.dataPedido) - new Date(a.dataPedido));
        
        // Aplicar filtros
        const filtroData = document.getElementById('filtroDataPedido').value;
        const filtroFornecedor = parseInt(document.getElementById('filtroFornecedorPedido').value);
        const filtroStatus = document.getElementById('filtroStatusPedido').value;
        
        const pedidosFiltrados = pedidos.filter(pedido => {
            let matches = true;
            
            if (filtroData && pedido.dataPedido !== filtroData) {
                matches = false;
            }
            
            if (filtroFornecedor && pedido.fornecedorId !== filtroFornecedor) {
                matches = false;
            }
            
            if (filtroStatus && pedido.status !== filtroStatus) {
                matches = false;
            }
            
            return matches;
        });
        
        this.renderPedidos(pedidosFiltrados, fornecedores);
    }

    renderPedidos(pedidos, fornecedores) {
        const tbody = document.getElementById('pedidosTableBody');
        tbody.innerHTML = '';

        pedidos.forEach(pedido => {
            const fornecedor = fornecedores.find(f => f.id === pedido.fornecedorId);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${Utils.formatDate(pedido.dataPedido)}</td>
                <td>${Utils.formatDate(pedido.dataEntrega)}</td>
                <td>${fornecedor ? fornecedor.nome : 'Fornecedor não encontrado'}</td>
                <td><span class="status ${pedido.status}">${this.getStatusLabel(pedido.status)}</span></td>
                <td>
                    <button class="btn-secondary" onclick="pedidosManager.viewPedido(${pedido.id})">Ver</button>
                    ${window.app && window.app.hasPermission('pedidos', 'edit') ? `<button class="btn-secondary" onclick="pedidosManager.editPedido(${pedido.id})">Editar</button>` : ''}
                    ${window.app && window.app.hasPermission('pedidos', 'delete') ? `<button class="btn-danger" onclick="pedidosManager.deletePedido(${pedido.id})">Excluir</button>` : ''}
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    clearFilters() {
        document.getElementById('filtroDataPedido').value = '';
        document.getElementById('filtroFornecedorPedido').value = '';
        document.getElementById('filtroStatusPedido').value = '';
        this.applyFilters();
    }

    showNovoPedidoModal() {
        const fornecedores = this.getFornecedores();
        const itens = this.getItens();
        
        const fornecedoresOptions = fornecedores.map(f => 
            `<option value="${f.id}">${f.nome}</option>`
        ).join('');

        const itensOptions = itens.map(i => 
            `<option value="${i.id}">${i.nome}</option>`
        ).join('');

        const modalContent = `
            <form id="pedidoForm">
                <div class="form-group">
                    <label for="dataPedido">Data do Pedido *</label>
                    <input type="date" id="dataPedido" required>
                </div>
                <div class="form-group">
                    <label for="dataEntrega">Data de Entrega *</label>
                    <input type="date" id="dataEntrega" required>
                </div>
                <div class="form-group">
                    <label for="fornecedorId">Fornecedor *</label>
                    <select id="fornecedorId" required>
                        <option value="">Selecione um fornecedor</option>
                        ${fornecedoresOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label for="status">Status</label>
                    <select id="status">
                        <option value="pendente">Pendente</option>
                        <option value="aprovado">Aprovado</option>
                        <option value="cancelado">Cancelado</option>
                        <option value="entregue">Entregue</option>
                    </select>
                </div>
                
                <h4>Itens do Pedido</h4>
                <div id="itensPedido">
                    <div class="item-row">
                        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px; align-items: end; margin-bottom: 10px;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Item</label>
                                <select class="item-select" required>
                                    <option value="">Selecione um item</option>
                                    ${itensOptions}
                                </select>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Quantidade</label>
                                <input type="number" class="quantidade-input" min="1" step="0.01" required>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Preço Unitário</label>
                                <input type="number" class="preco-input" min="0" step="0.01" required>
                            </div>
                            <button type="button" class="btn-danger remove-item" onclick="this.parentElement.parentElement.remove()">×</button>
                        </div>
                    </div>
                </div>
                <button type="button" id="addItem" class="btn-secondary">Adicionar Item</button>
                
                <div class="form-actions">
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">Cancelar</button>
                    <button type="submit" class="btn-primary">Salvar Pedido</button>
                </div>
            </form>
        `;

        app.showModal('Novo Pedido', modalContent);

        // Configurar data padrão (hoje)
        document.getElementById('dataPedido').valueAsDate = new Date();
        
        // Configurar evento para adicionar itens
        document.getElementById('addItem').addEventListener('click', () => {
            this.addItemRow();
        });

        // Configurar envio do formulário
        document.getElementById('pedidoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePedido();
        });
    }

    addItemRow() {
        const itens = this.getItens();
        const itensOptions = itens.map(i => 
            `<option value="${i.id}">${i.nome}</option>`
        ).join('');

        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';
        itemRow.innerHTML = `
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px; align-items: end; margin-bottom: 10px;">
                <div class="form-group" style="margin-bottom: 0;">
                    <select class="item-select" required>
                        <option value="">Selecione um item</option>
                        ${itensOptions}
                    </select>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <input type="number" class="quantidade-input" min="1" step="0.01" required>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <input type="number" class="preco-input" min="0" step="0.01" required>
                </div>
                <button type="button" class="btn-danger remove-item" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.getElementById('itensPedido').appendChild(itemRow);
    }

    savePedido(pedidoId = null) {
        const form = document.getElementById('pedidoForm');
        const formData = new FormData(form);

        // Coletar itens
        const itensRows = document.querySelectorAll('.item-row');
        const itens = [];

        for (const row of itensRows) {
            const itemId = parseInt(row.querySelector('.item-select').value);
            const quantidade = parseFloat(row.querySelector('.quantidade-input').value);
            const preco = parseFloat(row.querySelector('.preco-input').value);

            if (itemId && quantidade && preco) {
                itens.push({ itemId, quantidade, preco });
            }
        }

        if (itens.length === 0) {
            app.showMessage('Adicione pelo menos um item ao pedido.', 'error');
            return;
        }

        const pedidoData = {
            dataPedido: document.getElementById('dataPedido').value,
            dataEntrega: document.getElementById('dataEntrega').value,
            fornecedorId: parseInt(document.getElementById('fornecedorId').value),
            status: document.getElementById('status').value,
            itens: itens
        };

        // Validar datas
        const dataPedido = new Date(pedidoData.dataPedido);
        const dataEntrega = new Date(pedidoData.dataEntrega);

        if (dataEntrega <= dataPedido) {
            app.showMessage('A data de entrega deve ser posterior à data do pedido.', 'error');
            return;
        }

        const pedidos = this.getPedidos();

        if (pedidoId) {
            // Editar pedido existente
            const index = pedidos.findIndex(p => p.id === pedidoId);
            if (index !== -1) {
                pedidos[index] = { ...pedidos[index], ...pedidoData };
            }
        } else {
            // Novo pedido
            pedidoData.id = this.generateId();
            pedidoData.criadoEm = new Date().toISOString();
            pedidos.push(pedidoData);
        }

        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        
        // Log da ação
        if (window.adminManager) {
            const action = pedidoId ? 'edit' : 'create';
            const details = `Pedido ${action === 'edit' ? 'editado' : 'criado'}: #${pedidoData.id} - Fornecedor: ${pedidoData.fornecedorId}`;
            window.adminManager.logAction(action, 'pedidos', details);
        }
        
        app.closeModal();
        this.loadPedidos();
        app.showMessage(pedidoId ? 'Pedido atualizado com sucesso!' : 'Pedido criado com sucesso!', 'success');
    }

    viewPedido(id) {
        const pedido = this.getPedidos().find(p => p.id === id);
        const fornecedor = this.getFornecedores().find(f => f.id === pedido.fornecedorId);
        const itens = this.getItens();

        if (!pedido) return;

        const itensHtml = pedido.itens.map(item => {
            const itemData = itens.find(i => i.id === item.itemId);
            const total = item.quantidade * item.preco;
            return `
                <tr>
                    <td>${itemData ? itemData.nome : 'Item não encontrado'}</td>
                    <td>${item.quantidade}</td>
                    <td>${Utils.formatCurrency(item.preco)}</td>
                    <td>${Utils.formatCurrency(total)}</td>
                </tr>
            `;
        }).join('');

        const totalGeral = pedido.itens.reduce((sum, item) => sum + (item.quantidade * item.preco), 0);

        const modalContent = `
            <div class="pedido-details">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div>
                        <strong>Data do Pedido:</strong> ${Utils.formatDate(pedido.dataPedido)}<br>
                        <strong>Data de Entrega:</strong> ${Utils.formatDate(pedido.dataEntrega)}<br>
                    </div>
                    <div>
                        <strong>Fornecedor:</strong> ${fornecedor ? fornecedor.nome : 'N/A'}<br>
                        <strong>Status:</strong> <span class="status ${pedido.status}">${this.getStatusLabel(pedido.status)}</span>
                    </div>
                </div>
                
                <h4>Itens do Pedido</h4>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background-color: #f8f9fa;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Item</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Quantidade</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Preço Unit.</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itensHtml}
                    </tbody>
                    <tfoot>
                        <tr style="background-color: #f8f9fa; font-weight: bold;">
                            <td colspan="3" style="padding: 10px; border: 1px solid #ddd; text-align: right;">Total Geral:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${Utils.formatCurrency(totalGeral)}</td>
                        </tr>
                    </tfoot>
                </table>
                
                <div class="form-actions">
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">Fechar</button>
                    <button type="button" onclick="pedidosManager.editPedido(${id})" class="btn-primary">Editar</button>
                </div>
            </div>
        `;

        app.showModal('Detalhes do Pedido', modalContent);
    }

    editPedido(id) {
        const pedido = this.getPedidos().find(p => p.id === id);
        if (!pedido) return;

        this.showNovoPedidoModal();

        // Preencher formulário com dados existentes
        setTimeout(() => {
            document.getElementById('dataPedido').value = pedido.dataPedido;
            document.getElementById('dataEntrega').value = pedido.dataEntrega;
            document.getElementById('fornecedorId').value = pedido.fornecedorId;
            document.getElementById('status').value = pedido.status;

            // Limpar itens existentes e adicionar os do pedido
            document.getElementById('itensPedido').innerHTML = '';
            
            pedido.itens.forEach((item, index) => {
                if (index === 0) {
                    this.addItemRow();
                } else {
                    this.addItemRow();
                }
                
                const rows = document.querySelectorAll('.item-row');
                const currentRow = rows[rows.length - 1];
                currentRow.querySelector('.item-select').value = item.itemId;
                currentRow.querySelector('.quantidade-input').value = item.quantidade;
                currentRow.querySelector('.preco-input').value = item.preco;
            });

            // Atualizar evento de submissão para edição
            document.getElementById('pedidoForm').removeEventListener('submit', arguments.callee);
            document.getElementById('pedidoForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePedido(id);
            });
        }, 100);
    }

    deletePedido(id) {
        if (confirm('Tem certeza que deseja excluir este pedido?')) {
            const pedido = this.getPedidos().find(p => p.id === id);
            const pedidos = this.getPedidos().filter(p => p.id !== id);
            localStorage.setItem('pedidos', JSON.stringify(pedidos));
            
            // Log da ação
            if (window.adminManager && pedido) {
                window.adminManager.logAction('delete', 'pedidos', `Pedido excluído: #${pedido.id} - Fornecedor: ${pedido.fornecedorId}`);
            }
            
            this.loadPedidos();
            app.showMessage('Pedido excluído com sucesso!', 'success');
        }
    }

    getStatusLabel(status) {
        const labels = {
            'pendente': 'Pendente',
            'aprovado': 'Aprovado',
            'cancelado': 'Cancelado',
            'entregue': 'Entregue'
        };
        return labels[status] || status;
    }

    getPedidos() {
        return JSON.parse(localStorage.getItem('pedidos') || '[]');
    }

    getFornecedores() {
        return JSON.parse(localStorage.getItem('fornecedores') || '[]');
    }

    getItens() {
        return JSON.parse(localStorage.getItem('itens') || '[]');
    }

    generateId() {
        const pedidos = this.getPedidos();
        return pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id)) + 1 : 1;
    }
}

// Inicializar gerenciador de pedidos
document.addEventListener('DOMContentLoaded', () => {
    window.pedidosManager = new PedidosManager();
});
