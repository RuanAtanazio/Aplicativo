// Gerenciador de Itens
class ItensManager {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        console.log('ItensManager: setupEventListeners chamado');
        
        // Botão novo item - verificar permissão
        const novoItemBtn = document.getElementById('novoItem');
        console.log('Botão novoItem encontrado:', !!novoItemBtn);
        
        if (novoItemBtn) {
            // Remover event listeners anteriores
            novoItemBtn.replaceWith(novoItemBtn.cloneNode(true));
            const newBtn = document.getElementById('novoItem');
            
            if (window.app && window.app.hasPermission && !window.app.hasPermission('itens', 'create')) {
                console.log('Usuário sem permissão para criar itens');
                newBtn.style.display = 'none';
            } else {
                console.log('Usuário com permissão, adicionando event listener');
                newBtn.style.display = 'block';
                newBtn.addEventListener('click', () => {
                    console.log('Novo item clicado');
                    this.showNovoItemModal();
                });
            }
        }

        // Filtros
        const filtroNomeItem = document.getElementById('filtroNomeItem');
        const filtroCategoriaItem = document.getElementById('filtroCategoriaItem');
        const filtroUnidadeItem = document.getElementById('filtroUnidadeItem');
        const filtroEstoqueBaixo = document.getElementById('filtroEstoqueBaixo');
        
        if (filtroNomeItem) {
            filtroNomeItem.addEventListener('input', () => this.applyFilters());
        }
        if (filtroCategoriaItem) {
            filtroCategoriaItem.addEventListener('change', () => this.applyFilters());
        }
        if (filtroUnidadeItem) {
            filtroUnidadeItem.addEventListener('change', () => this.applyFilters());
        }
        if (filtroEstoqueBaixo) {
            filtroEstoqueBaixo.addEventListener('change', () => this.applyFilters());
        }
    }

    loadItens() {
        this.loadFilterOptions();
        this.applyFilters();
    }

    loadFilterOptions() {
        const itens = this.getItens();
        
        // Carregar categorias únicas
        const categorias = [...new Set(itens.map(item => item.categoria).filter(cat => cat))];
        categorias.sort((a, b) => a.localeCompare(b, 'pt-BR'));
        
        const selectCategoria = document.getElementById('filtroCategoriaItem');
        const currentCategoria = selectCategoria.value;
        selectCategoria.innerHTML = '<option value="">Todas as categorias</option>';
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            selectCategoria.appendChild(option);
        });
        selectCategoria.value = currentCategoria;
        
        // Carregar unidades únicas
        const unidades = [...new Set(itens.map(item => item.unidade).filter(unidade => unidade))];
        unidades.sort((a, b) => a.localeCompare(b, 'pt-BR'));
        
        const selectUnidade = document.getElementById('filtroUnidadeItem');
        const currentUnidade = selectUnidade.value;
        selectUnidade.innerHTML = '<option value="">Todas as unidades</option>';
        unidades.forEach(unidade => {
            const option = document.createElement('option');
            option.value = unidade;
            option.textContent = unidade;
            selectUnidade.appendChild(option);
        });
        selectUnidade.value = currentUnidade;
    }

    applyFilters() {
        const itens = this.getItens();
        
        // Ordenar itens alfabeticamente
        itens.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        
        // Aplicar filtros
        const filtroNome = document.getElementById('filtroNomeItem').value.toLowerCase();
        const filtroCategoria = document.getElementById('filtroCategoriaItem').value;
        const filtroUnidade = document.getElementById('filtroUnidadeItem').value;
        const filtroEstoque = document.getElementById('filtroEstoqueBaixo').value;
        
        const itensFiltrados = itens.filter(item => {
            let matches = true;
            
            if (filtroNome && !item.nome.toLowerCase().includes(filtroNome)) {
                matches = false;
            }
            
            if (filtroCategoria && item.categoria !== filtroCategoria) {
                matches = false;
            }
            
            if (filtroUnidade && item.unidade !== filtroUnidade) {
                matches = false;
            }
            
            if (filtroEstoque) {
                const estoque = item.estoque || 0;
                const minimo = item.estoqueMinimo || 0;
                
                if (filtroEstoque === 'baixo' && estoque > minimo) {
                    matches = false;
                }
                
                if (filtroEstoque === 'zero' && estoque > 0) {
                    matches = false;
                }
            }
            
            return matches;
        });
        
        this.renderItens(itensFiltrados);
    }

    renderItens(itens) {
        const tbody = document.getElementById('itensTableBody');
        tbody.innerHTML = '';

        itens.forEach(item => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.descricao || '-'}</td>
                <td>${item.unidade}</td>
                <td>${item.categoria || '-'}</td>
                <td>
                    <button class="btn-secondary" onclick="itensManager.viewItem(${item.id})">Ver</button>
                    ${window.app && window.app.hasPermission('itens', 'edit') ? `<button class="btn-secondary" onclick="itensManager.editItem(${item.id})">Editar</button>` : ''}
                    ${window.app && window.app.hasPermission('itens', 'delete') ? `<button class="btn-danger" onclick="itensManager.deleteItem(${item.id})">Excluir</button>` : ''}
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    clearFilters() {
        document.getElementById('filtroNomeItem').value = '';
        document.getElementById('filtroCategoriaItem').value = '';
        document.getElementById('filtroUnidadeItem').value = '';
        document.getElementById('filtroEstoqueBaixo').value = '';
        this.applyFilters();
    }

    showNovoItemModal() {
        const modalContent = `
            <form id="itemForm">
                <div class="form-group">
                    <label for="nome">Nome do Item *</label>
                    <input type="text" id="nome" required maxlength="100">
                </div>
                <div class="form-group">
                    <label for="descricao">Descrição</label>
                    <textarea id="descricao" rows="3" maxlength="500"></textarea>
                </div>
                <div class="form-group">
                    <label for="unidade">Unidade de Medida *</label>
                    <select id="unidade" required>
                        <option value="">Selecione uma unidade</option>
                        <option value="UN">Unidade (UN)</option>
                        <option value="PC">Peça (PC)</option>
                        <option value="KG">Quilograma (KG)</option>
                        <option value="G">Grama (G)</option>
                        <option value="L">Litro (L)</option>
                        <option value="ML">Mililitro (ML)</option>
                        <option value="M">Metro (M)</option>
                        <option value="CM">Centímetro (CM)</option>
                        <option value="M2">Metro Quadrado (M²)</option>
                        <option value="M3">Metro Cúbico (M³)</option>
                        <option value="CX">Caixa (CX)</option>
                        <option value="PAC">Pacote (PAC)</option>
                        <option value="FRD">Fardo (FRD)</option>
                        <option value="HR">Hora (HR)</option>
                        <option value="SERV">Serviço (SERV)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="categoria">Categoria</label>
                    <input type="text" id="categoria" maxlength="50" placeholder="Ex: Escritório, Limpeza, Informática">
                </div>
                <div class="form-group">
                    <label for="codigo">Código/SKU</label>
                    <input type="text" id="codigo" maxlength="50" placeholder="Código interno do item">
                </div>
                <div class="form-group">
                    <label for="marca">Marca</label>
                    <input type="text" id="marca" maxlength="50">
                </div>
                <div class="form-group">
                    <label for="estoque">Estoque Atual</label>
                    <input type="number" id="estoque" min="0" step="0.01" placeholder="Quantidade em estoque">
                </div>
                <div class="form-group">
                    <label for="estoqueMinimo">Estoque Mínimo</label>
                    <input type="number" id="estoqueMinimo" min="0" step="0.01" placeholder="Quantidade mínima para alerta">
                </div>
                <div class="form-group">
                    <label for="observacoes">Observações</label>
                    <textarea id="observacoes" rows="3" maxlength="500"></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">Cancelar</button>
                    <button type="submit" class="btn-primary">Salvar Item</button>
                </div>
            </form>
        `;

        app.showModal('Novo Item', modalContent);

        // Configurar envio do formulário
        document.getElementById('itemForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveItem();
        });
    }

    saveItem(itemId = null) {
        const nome = document.getElementById('nome').value.trim();
        const descricao = document.getElementById('descricao').value.trim();
        const unidade = document.getElementById('unidade').value;
        const categoria = document.getElementById('categoria').value.trim();
        const codigo = document.getElementById('codigo').value.trim();
        const marca = document.getElementById('marca').value.trim();
        const estoque = parseFloat(document.getElementById('estoque').value) || 0;
        const estoqueMinimo = parseFloat(document.getElementById('estoqueMinimo').value) || 0;
        const observacoes = document.getElementById('observacoes').value.trim();

        // Validações
        if (!nome) {
            app.showMessage('O nome do item é obrigatório.', 'error');
            return;
        }

        if (!unidade) {
            app.showMessage('A unidade de medida é obrigatória.', 'error');
            return;
        }

        const itemData = {
            nome: Utils.sanitizeInput(nome),
            descricao: Utils.sanitizeInput(descricao),
            unidade: unidade,
            categoria: Utils.sanitizeInput(categoria),
            codigo: Utils.sanitizeInput(codigo),
            marca: Utils.sanitizeInput(marca),
            estoque: estoque,
            estoqueMinimo: estoqueMinimo,
            observacoes: Utils.sanitizeInput(observacoes)
        };

        const itens = this.getItens();

        // Verificar se já existe item com mesmo nome
        const existingItem = itens.find(i => 
            i.nome.toLowerCase() === nome.toLowerCase() && i.id !== itemId
        );

        if (existingItem) {
            app.showMessage('Já existe um item com este nome.', 'error');
            return;
        }

        // Verificar se já existe item com mesmo código (se informado)
        if (codigo) {
            const existingCodigo = itens.find(i => 
                i.codigo && i.codigo.toLowerCase() === codigo.toLowerCase() && i.id !== itemId
            );

            if (existingCodigo) {
                app.showMessage('Já existe um item com este código.', 'error');
                return;
            }
        }

        if (itemId) {
            // Editar item existente
            const index = itens.findIndex(i => i.id === itemId);
            if (index !== -1) {
                itens[index] = { ...itens[index], ...itemData };
                itens[index].atualizadoEm = new Date().toISOString();
            }
        } else {
            // Novo item
            itemData.id = this.generateId();
            itemData.criadoEm = new Date().toISOString();
            itens.push(itemData);
        }

        localStorage.setItem('itens', JSON.stringify(itens));
        
        // Log da ação
        if (window.adminManager) {
            const action = itemId ? 'edit' : 'create';
            const details = `Item ${action === 'edit' ? 'editado' : 'criado'}: ${itemData.nome}`;
            window.adminManager.logAction(action, 'itens', details);
        }
        
        app.closeModal();
        this.loadItens();
        app.showMessage(
            itemId ? 'Item atualizado com sucesso!' : 'Item criado com sucesso!', 
            'success'
        );
    }

    viewItem(id) {
        const item = this.getItens().find(i => i.id === id);
        if (!item) return;

        // Verificar se estoque está baixo
        const estoqueStatus = this.getEstoqueStatus(item);

        const modalContent = `
            <div class="item-details">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <p><strong>Nome:</strong> ${item.nome}</p>
                        <p><strong>Unidade:</strong> ${item.unidade}</p>
                        <p><strong>Categoria:</strong> ${item.categoria || '-'}</p>
                        <p><strong>Código/SKU:</strong> ${item.codigo || '-'}</p>
                        <p><strong>Marca:</strong> ${item.marca || '-'}</p>
                    </div>
                    <div>
                        <p><strong>Estoque Atual:</strong> 
                            <span style="color: ${estoqueStatus.color}; font-weight: bold;">
                                ${item.estoque || 0} ${item.unidade}
                            </span>
                            ${estoqueStatus.alert ? `<span style="color: red; margin-left: 10px;">⚠️ ${estoqueStatus.alert}</span>` : ''}
                        </p>
                        <p><strong>Estoque Mínimo:</strong> ${item.estoqueMinimo || 0} ${item.unidade}</p>
                        <p><strong>Criado em:</strong> ${item.criadoEm ? Utils.formatDate(item.criadoEm) : '-'}</p>
                        <p><strong>Atualizado em:</strong> ${item.atualizadoEm ? Utils.formatDate(item.atualizadoEm) : '-'}</p>
                    </div>
                </div>
                
                ${item.descricao ? `
                    <div style="margin-top: 20px;">
                        <p><strong>Descrição:</strong></p>
                        <p style="background-color: #f8f9fa; padding: 10px; border-radius: 4px;">${item.descricao}</p>
                    </div>
                ` : ''}
                
                ${item.observacoes ? `
                    <div style="margin-top: 20px;">
                        <p><strong>Observações:</strong></p>
                        <p style="background-color: #f8f9fa; padding: 10px; border-radius: 4px;">${item.observacoes}</p>
                    </div>
                ` : ''}
                
                <div class="form-actions">
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">Fechar</button>
                    <button type="button" onclick="itensManager.editItem(${id})" class="btn-primary">Editar</button>
                    <button type="button" onclick="itensManager.showEstoqueModal(${id})" class="btn-secondary">Ajustar Estoque</button>
                </div>
            </div>
        `;

        app.showModal('Detalhes do Item', modalContent);
    }

    editItem(id) {
        const item = this.getItens().find(i => i.id === id);
        if (!item) return;

        this.showNovoItemModal();

        // Preencher formulário com dados existentes
        setTimeout(() => {
            document.getElementById('nome').value = item.nome || '';
            document.getElementById('descricao').value = item.descricao || '';
            document.getElementById('unidade').value = item.unidade || '';
            document.getElementById('categoria').value = item.categoria || '';
            document.getElementById('codigo').value = item.codigo || '';
            document.getElementById('marca').value = item.marca || '';
            document.getElementById('estoque').value = item.estoque || 0;
            document.getElementById('estoqueMinimo').value = item.estoqueMinimo || 0;
            document.getElementById('observacoes').value = item.observacoes || '';

            // Atualizar título do modal
            document.querySelector('.modal-header h3').textContent = 'Editar Item';

            // Atualizar evento de submissão para edição
            const form = document.getElementById('itemForm');
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
            
            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveItem(id);
            });
        }, 100);
    }

    deleteItem(id) {
        // Verificar se o item está sendo usado em pedidos
        const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
        const itemEmUso = pedidos.some(p => 
            p.itens && p.itens.some(item => item.itemId === id)
        );

        if (itemEmUso) {
            app.showMessage('Este item não pode ser excluído pois está associado a pedidos.', 'error');
            return;
        }

        // Verificar se o item está na tabela de preços
        const precos = JSON.parse(localStorage.getItem('precos') || '[]');
        const itemComPreco = precos.some(p => p.itemId === id);

        if (itemComPreco) {
            if (!confirm('Este item possui preços cadastrados. Tem certeza que deseja excluí-lo? Os preços também serão removidos.')) {
                return;
            }
            // Remover preços associados
            const novosPrecos = precos.filter(p => p.itemId !== id);
            localStorage.setItem('precos', JSON.stringify(novosPrecos));
        }

        if (confirm('Tem certeza que deseja excluir este item?')) {
            const item = this.getItens().find(i => i.id === id);
            const itens = this.getItens().filter(i => i.id !== id);
            localStorage.setItem('itens', JSON.stringify(itens));
            
            // Log da ação
            if (window.adminManager && item) {
                window.adminManager.logAction('delete', 'itens', `Item excluído: ${item.nome}`);
            }
            
            this.loadItens();
            app.showMessage('Item excluído com sucesso!', 'success');
        }
    }

    showEstoqueModal(id) {
        const item = this.getItens().find(i => i.id === id);
        if (!item) return;

        const modalContent = `
            <form id="estoqueForm">
                <div class="form-group">
                    <label for="estoqueAtual">Estoque Atual</label>
                    <input type="number" id="estoqueAtual" value="${item.estoque || 0}" step="0.01" readonly>
                </div>
                <div class="form-group">
                    <label for="tipoMovimento">Tipo de Movimento</label>
                    <select id="tipoMovimento" required>
                        <option value="">Selecione o tipo</option>
                        <option value="entrada">Entrada</option>
                        <option value="saida">Saída</option>
                        <option value="ajuste">Ajuste</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="quantidade">Quantidade</label>
                    <input type="number" id="quantidade" min="0" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="motivoMovimento">Motivo</label>
                    <textarea id="motivoMovimento" rows="2" placeholder="Descreva o motivo do movimento"></textarea>
                </div>
                <div id="novoEstoque" style="margin-top: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 4px;">
                    <strong>Novo Estoque: </strong><span id="calculoEstoque">-</span>
                </div>
                
                <div class="form-actions">
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">Cancelar</button>
                    <button type="submit" class="btn-primary">Confirmar Movimento</button>
                </div>
            </form>
        `;

        app.showModal('Ajustar Estoque - ' + item.nome, modalContent);

        // Configurar cálculo automático
        const tipoSelect = document.getElementById('tipoMovimento');
        const quantidadeInput = document.getElementById('quantidade');
        const calculoSpan = document.getElementById('calculoEstoque');

        const calcularNovoEstoque = () => {
            const estoqueAtual = parseFloat(document.getElementById('estoqueAtual').value) || 0;
            const quantidade = parseFloat(quantidadeInput.value) || 0;
            const tipo = tipoSelect.value;

            let novoEstoque = estoqueAtual;

            if (tipo === 'entrada') {
                novoEstoque = estoqueAtual + quantidade;
            } else if (tipo === 'saida') {
                novoEstoque = estoqueAtual - quantidade;
            } else if (tipo === 'ajuste') {
                novoEstoque = quantidade;
            }

            calculoSpan.textContent = `${novoEstoque} ${item.unidade}`;
            
            // Colorir se ficar negativo
            if (novoEstoque < 0) {
                calculoSpan.style.color = 'red';
            } else {
                calculoSpan.style.color = 'green';
            }
        };

        tipoSelect.addEventListener('change', calcularNovoEstoque);
        quantidadeInput.addEventListener('input', calcularNovoEstoque);

        // Configurar envio do formulário
        document.getElementById('estoqueForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.ajustarEstoque(id);
        });
    }

    ajustarEstoque(id) {
        const item = this.getItens().find(i => i.id === id);
        if (!item) return;

        const estoqueAtual = parseFloat(document.getElementById('estoqueAtual').value) || 0;
        const tipo = document.getElementById('tipoMovimento').value;
        const quantidade = parseFloat(document.getElementById('quantidade').value) || 0;
        const motivo = document.getElementById('motivoMovimento').value.trim();

        if (!tipo) {
            app.showMessage('Selecione o tipo de movimento.', 'error');
            return;
        }

        if (quantidade <= 0) {
            app.showMessage('A quantidade deve ser maior que zero.', 'error');
            return;
        }

        let novoEstoque = estoqueAtual;

        if (tipo === 'entrada') {
            novoEstoque = estoqueAtual + quantidade;
        } else if (tipo === 'saida') {
            novoEstoque = estoqueAtual - quantidade;
            if (novoEstoque < 0) {
                if (!confirm('O estoque ficará negativo. Deseja continuar?')) {
                    return;
                }
            }
        } else if (tipo === 'ajuste') {
            novoEstoque = quantidade;
        }

        // Salvar movimento no histórico (opcional - pode ser implementado depois)
        const movimento = {
            itemId: id,
            tipo: tipo,
            quantidade: quantidade,
            estoqueAnterior: estoqueAtual,
            estoqueNovo: novoEstoque,
            motivo: motivo,
            data: new Date().toISOString(),
            usuario: app.currentUser ? app.currentUser.username : 'Sistema'
        };

        // Atualizar estoque do item
        const itens = this.getItens();
        const index = itens.findIndex(i => i.id === id);
        if (index !== -1) {
            itens[index].estoque = novoEstoque;
            itens[index].atualizadoEm = new Date().toISOString();
        }

        localStorage.setItem('itens', JSON.stringify(itens));

        // Salvar movimento no histórico
        const historico = JSON.parse(localStorage.getItem('movimentosEstoque') || '[]');
        historico.push(movimento);
        localStorage.setItem('movimentosEstoque', JSON.stringify(historico));

        app.closeModal();
        this.loadItens();
        app.showMessage('Estoque ajustado com sucesso!', 'success');
    }

    getEstoqueStatus(item) {
        const estoque = item.estoque || 0;
        const minimo = item.estoqueMinimo || 0;

        if (estoque <= 0) {
            return { color: 'red', alert: 'SEM ESTOQUE' };
        } else if (estoque <= minimo) {
            return { color: 'orange', alert: 'ESTOQUE BAIXO' };
        } else {
            return { color: 'green', alert: null };
        }
    }

    getItens() {
        return JSON.parse(localStorage.getItem('itens') || '[]');
    }

    generateId() {
        const itens = this.getItens();
        return itens.length > 0 ? Math.max(...itens.map(i => i.id)) + 1 : 1;
    }

    // Método para relatório de estoque baixo
    getItensEstoqueBaixo() {
        const itens = this.getItens();
        return itens.filter(item => {
            const estoque = item.estoque || 0;
            const minimo = item.estoqueMinimo || 0;
            return estoque <= minimo;
        });
    }

    // Método para exportar itens
    exportItens() {
        const itens = this.getItens();
        const csvContent = this.convertToCSV(itens);
        this.downloadCSV(csvContent, 'itens.csv');
    }

    convertToCSV(data) {
        const headers = ['ID', 'Nome', 'Descricao', 'Unidade', 'Categoria', 'Codigo', 'Marca', 'Estoque', 'Estoque Minimo'];
        const csvRows = [headers.join(',')];
        
        data.forEach(item => {
            const row = [
                item.id,
                `"${item.nome || ''}"`,
                `"${item.descricao || ''}"`,
                `"${item.unidade || ''}"`,
                `"${item.categoria || ''}"`,
                `"${item.codigo || ''}"`,
                `"${item.marca || ''}"`,
                item.estoque || 0,
                item.estoqueMinimo || 0
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

// Inicializar gerenciador de itens
document.addEventListener('DOMContentLoaded', () => {
    window.itensManager = new ItensManager();
});
