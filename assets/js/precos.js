// Gerenciador de Tabela de Preços
class PrecosManager {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        console.log('PrecosManager: setupEventListeners chamado');
        
        // Botão novo preço - verificar permissão
        const novoPrecoBtn = document.getElementById('novoPreco');
        console.log('Botão novoPreco encontrado:', !!novoPrecoBtn);
        
        if (novoPrecoBtn) {
            // Remover event listeners anteriores
            novoPrecoBtn.replaceWith(novoPrecoBtn.cloneNode(true));
            const newBtn = document.getElementById('novoPreco');
            
            if (window.app && window.app.hasPermission && !window.app.hasPermission('precos', 'create')) {
                console.log('Usuário sem permissão para criar preços');
                newBtn.style.display = 'none';
            } else {
                console.log('Usuário com permissão, adicionando event listener');
                newBtn.style.display = 'block';
                newBtn.addEventListener('click', () => {
                    console.log('Novo preço clicado');
                    this.showNovoPrecoModal();
                });
            }
        }

        // Filtros
        const filtroFornecedorPreco = document.getElementById('filtroFornecedorPreco');
        const filtroItemPreco = document.getElementById('filtroItemPreco');
        const filtroVigenciaPreco = document.getElementById('filtroVigenciaPreco');
        
        if (filtroFornecedorPreco) {
            filtroFornecedorPreco.addEventListener('change', () => this.applyFilters());
        }
        if (filtroItemPreco) {
            filtroItemPreco.addEventListener('change', () => this.applyFilters());
        }
        if (filtroVigenciaPreco) {
            filtroVigenciaPreco.addEventListener('change', () => this.applyFilters());
        }
    }

    loadPrecos() {
        this.loadFilterOptions();
        this.applyFilters();
    }

    loadFilterOptions() {
        const fornecedores = this.getFornecedores();
        const itens = this.getItens();
        
        // Carregar fornecedores ordenados alfabeticamente
        fornecedores.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        
        const selectFornecedor = document.getElementById('filtroFornecedorPreco');
        const currentFornecedor = selectFornecedor.value;
        selectFornecedor.innerHTML = '<option value="">Todos os fornecedores</option>';
        fornecedores.forEach(fornecedor => {
            const option = document.createElement('option');
            option.value = fornecedor.id;
            option.textContent = fornecedor.nome;
            selectFornecedor.appendChild(option);
        });
        selectFornecedor.value = currentFornecedor;
        
        // Carregar itens ordenados alfabeticamente
        itens.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        
        const selectItem = document.getElementById('filtroItemPreco');
        const currentItem = selectItem.value;
        selectItem.innerHTML = '<option value="">Todos os itens</option>';
        itens.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.nome} (${item.unidade})`;
            selectItem.appendChild(option);
        });
        selectItem.value = currentItem;
    }

    applyFilters() {
        const precos = this.getPrecos();
        const fornecedores = this.getFornecedores();
        const itens = this.getItens();
        
        // Ordenar preços por fornecedor e depois por item
        precos.sort((a, b) => {
            const fornecedorA = fornecedores.find(f => f.id === a.fornecedorId);
            const fornecedorB = fornecedores.find(f => f.id === b.fornecedorId);
            const itemA = itens.find(i => i.id === a.itemId);
            const itemB = itens.find(i => i.id === b.itemId);
            
            const nomeA = fornecedorA ? fornecedorA.nome : '';
            const nomeB = fornecedorB ? fornecedorB.nome : '';
            
            if (nomeA !== nomeB) {
                return nomeA.localeCompare(nomeB, 'pt-BR');
            }
            
            const itemNomeA = itemA ? itemA.nome : '';
            const itemNomeB = itemB ? itemB.nome : '';
            return itemNomeA.localeCompare(itemNomeB, 'pt-BR');
        });
        
        // Aplicar filtros
        const filtroFornecedor = parseInt(document.getElementById('filtroFornecedorPreco').value);
        const filtroItem = parseInt(document.getElementById('filtroItemPreco').value);
        const filtroVigencia = document.getElementById('filtroVigenciaPreco').value;
        
        const precosFiltrados = precos.filter(preco => {
            let matches = true;
            
            if (filtroFornecedor && preco.fornecedorId !== filtroFornecedor) {
                matches = false;
            }
            
            if (filtroItem && preco.itemId !== filtroItem) {
                matches = false;
            }
            
            if (filtroVigencia) {
                const vigenciaStatus = this.getVigenciaStatus(preco);
                
                if (filtroVigencia === 'vigente' && (!vigenciaStatus || vigenciaStatus.color !== 'green')) {
                    matches = false;
                }
                
                if (filtroVigencia === 'vencido' && (!vigenciaStatus || vigenciaStatus.color !== 'red')) {
                    matches = false;
                }
                
                if (filtroVigencia === 'vencimento_proximo' && (!vigenciaStatus || vigenciaStatus.color !== 'orange')) {
                    matches = false;
                }
            }
            
            return matches;
        });
        
        this.renderPrecos(precosFiltrados, fornecedores, itens);
    }

    renderPrecos(precos, fornecedores, itens) {
        const tbody = document.getElementById('precosTableBody');
        tbody.innerHTML = '';

        precos.forEach(preco => {
            const fornecedor = fornecedores.find(f => f.id === preco.fornecedorId);
            const item = itens.find(i => i.id === preco.itemId);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${fornecedor ? fornecedor.nome : 'Fornecedor não encontrado'}</td>
                <td>${item ? item.nome : 'Item não encontrado'}</td>
                <td>${Utils.formatCurrency(preco.preco)}</td>
                <td>${Utils.formatDate(preco.dataAtualizacao)}</td>
                <td>
                    <button class="btn-secondary" onclick="precosManager.viewPreco(${preco.id})">Ver</button>
                    ${window.app && window.app.hasPermission('precos', 'edit') ? `<button class="btn-secondary" onclick="precosManager.editPreco(${preco.id})">Editar</button>` : ''}
                    ${window.app && window.app.hasPermission('precos', 'delete') ? `<button class="btn-danger" onclick="precosManager.deletePreco(${preco.id})">Excluir</button>` : ''}
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    clearFilters() {
        document.getElementById('filtroFornecedorPreco').value = '';
        document.getElementById('filtroItemPreco').value = '';
        document.getElementById('filtroVigenciaPreco').value = '';
        this.applyFilters();
    }

    showNovoPrecoModal() {
        const fornecedores = this.getFornecedores();
        const itens = this.getItens();
        
        const fornecedoresOptions = fornecedores.map(f => 
            `<option value="${f.id}">${f.nome}</option>`
        ).join('');

        const itensOptions = itens.map(i => 
            `<option value="${i.id}">${i.nome} (${i.unidade})</option>`
        ).join('');

        const modalContent = `
            <form id="precoForm">
                <div class="form-group">
                    <label for="fornecedorId">Fornecedor *</label>
                    <select id="fornecedorId" required>
                        <option value="">Selecione um fornecedor</option>
                        ${fornecedoresOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label for="itemId">Item *</label>
                    <select id="itemId" required>
                        <option value="">Selecione um item</option>
                        ${itensOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label for="preco">Preço *</label>
                    <input type="number" id="preco" min="0" step="0.01" required placeholder="0,00">
                </div>
                <div class="form-group">
                    <label for="dataAtualizacao">Data de Atualização *</label>
                    <input type="date" id="dataAtualizacao" required>
                </div>
                <div class="form-group">
                    <label for="dataVigencia">Data de Vigência</label>
                    <input type="date" id="dataVigencia" placeholder="Data até quando o preço é válido">
                </div>
                <div class="form-group">
                    <label for="desconto">Desconto (%)</label>
                    <input type="number" id="desconto" min="0" max="100" step="0.01" placeholder="0,00">
                </div>
                <div class="form-group">
                    <label for="quantidadeMinima">Quantidade Mínima</label>
                    <input type="number" id="quantidadeMinima" min="0" step="0.01" placeholder="Quantidade mínima para este preço">
                </div>
                <div class="form-group">
                    <label for="observacoes">Observações</label>
                    <textarea id="observacoes" rows="3" maxlength="500" placeholder="Condições especiais, prazo de pagamento, etc."></textarea>
                </div>
                
                <div id="precoCalculado" style="margin: 15px 0; padding: 10px; background-color: #f8f9fa; border-radius: 4px;">
                    <strong>Preço com desconto: </strong><span id="precoFinal">R$ 0,00</span>
                </div>
                
                <div class="form-actions">
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">Cancelar</button>
                    <button type="submit" class="btn-primary">Salvar Preço</button>
                </div>
            </form>
        `;

        app.showModal('Novo Preço', modalContent);

        // Configurar data padrão (hoje)
        document.getElementById('dataAtualizacao').valueAsDate = new Date();

        // Configurar cálculo automático do preço com desconto
        this.setupPrecoCalculation();

        // Verificar combinação fornecedor + item existente
        this.setupCombinacaoValidation();

        // Configurar envio do formulário
        document.getElementById('precoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePreco();
        });
    }

    setupPrecoCalculation() {
        const precoInput = document.getElementById('preco');
        const descontoInput = document.getElementById('desconto');
        const precoFinalSpan = document.getElementById('precoFinal');

        const calcularPrecoFinal = () => {
            const preco = parseFloat(precoInput.value) || 0;
            const desconto = parseFloat(descontoInput.value) || 0;
            const precoFinal = preco * (1 - desconto / 100);
            
            precoFinalSpan.textContent = Utils.formatCurrency(precoFinal);
            
            if (desconto > 0) {
                precoFinalSpan.style.color = 'green';
                precoFinalSpan.style.fontWeight = 'bold';
            } else {
                precoFinalSpan.style.color = 'inherit';
                precoFinalSpan.style.fontWeight = 'normal';
            }
        };

        precoInput.addEventListener('input', calcularPrecoFinal);
        descontoInput.addEventListener('input', calcularPrecoFinal);
    }

    setupCombinacaoValidation() {
        const fornecedorSelect = document.getElementById('fornecedorId');
        const itemSelect = document.getElementById('itemId');

        const verificarCombinacao = () => {
            const fornecedorId = parseInt(fornecedorSelect.value);
            const itemId = parseInt(itemSelect.value);

            if (fornecedorId && itemId) {
                const precos = this.getPrecos();
                const existente = precos.find(p => 
                    p.fornecedorId === fornecedorId && p.itemId === itemId
                );

                if (existente) {
                    const warning = document.getElementById('combinacaoWarning');
                    if (warning) warning.remove();

                    const warningDiv = document.createElement('div');
                    warningDiv.id = 'combinacaoWarning';
                    warningDiv.style.cssText = 'background-color: #fff3cd; color: #856404; padding: 10px; border-radius: 4px; margin: 10px 0; border: 1px solid #ffeaa7;';
                    warningDiv.innerHTML = `
                        ⚠️ Já existe um preço cadastrado para esta combinação fornecedor/item. 
                        O preço atual será substituído.
                    `;
                    
                    itemSelect.parentNode.insertAdjacentElement('afterend', warningDiv);
                }
            }
        };

        fornecedorSelect.addEventListener('change', verificarCombinacao);
        itemSelect.addEventListener('change', verificarCombinacao);
    }

    savePreco(precoId = null) {
        const fornecedorId = parseInt(document.getElementById('fornecedorId').value);
        const itemId = parseInt(document.getElementById('itemId').value);
        const preco = parseFloat(document.getElementById('preco').value);
        const dataAtualizacao = document.getElementById('dataAtualizacao').value;
        const dataVigencia = document.getElementById('dataVigencia').value;
        const desconto = parseFloat(document.getElementById('desconto').value) || 0;
        const quantidadeMinima = parseFloat(document.getElementById('quantidadeMinima').value) || 0;
        const observacoes = document.getElementById('observacoes').value.trim();

        // Validações
        if (!fornecedorId || !itemId || !preco || !dataAtualizacao) {
            app.showMessage('Preencha todos os campos obrigatórios.', 'error');
            return;
        }

        if (preco <= 0) {
            app.showMessage('O preço deve ser maior que zero.', 'error');
            return;
        }

        if (desconto < 0 || desconto > 100) {
            app.showMessage('O desconto deve estar entre 0 e 100%.', 'error');
            return;
        }

        // Validar datas
        const dataAtual = new Date();
        const dataAtualizacaoDate = new Date(dataAtualizacao);
        
        if (dataVigencia) {
            const dataVigenciaDate = new Date(dataVigencia);
            if (dataVigenciaDate <= dataAtualizacaoDate) {
                app.showMessage('A data de vigência deve ser posterior à data de atualização.', 'error');
                return;
            }
        }

        const precoFinal = preco * (1 - desconto / 100);

        const precoData = {
            fornecedorId: fornecedorId,
            itemId: itemId,
            preco: preco,
            precoFinal: precoFinal,
            desconto: desconto,
            dataAtualizacao: dataAtualizacao,
            dataVigencia: dataVigencia,
            quantidadeMinima: quantidadeMinima,
            observacoes: Utils.sanitizeInput(observacoes)
        };

        const precos = this.getPrecos();

        if (precoId) {
            // Editar preço existente
            const index = precos.findIndex(p => p.id === precoId);
            if (index !== -1) {
                precos[index] = { ...precos[index], ...precoData };
                precos[index].atualizadoEm = new Date().toISOString();
            }
        } else {
            // Verificar se já existe preço para esta combinação
            const existingIndex = precos.findIndex(p => 
                p.fornecedorId === fornecedorId && p.itemId === itemId
            );

            if (existingIndex !== -1) {
                // Substituir preço existente
                precos[existingIndex] = { ...precos[existingIndex], ...precoData };
                precos[existingIndex].atualizadoEm = new Date().toISOString();
            } else {
                // Novo preço
                precoData.id = this.generateId();
                precoData.criadoEm = new Date().toISOString();
                precos.push(precoData);
            }
        }

        localStorage.setItem('precos', JSON.stringify(precos));
        
        // Log da ação
        if (window.adminManager) {
            const action = precoId ? 'edit' : 'create';
            const fornecedor = this.getFornecedores().find(f => f.id === precoData.fornecedorId);
            const item = this.getItens().find(i => i.id === precoData.itemId);
            const details = `Preço ${action === 'edit' ? 'editado' : 'criado'}: ${item?.nome || 'Item'} - ${fornecedor?.nome || 'Fornecedor'}`;
            window.adminManager.logAction(action, 'precos', details);
        }
        
        app.closeModal();
        this.loadPrecos();
        app.showMessage(
            precoId ? 'Preço atualizado com sucesso!' : 'Preço cadastrado com sucesso!', 
            'success'
        );
    }

    viewPreco(id) {
        const preco = this.getPrecos().find(p => p.id === id);
        const fornecedor = this.getFornecedores().find(f => f.id === preco.fornecedorId);
        const item = this.getItens().find(i => i.id === preco.itemId);

        if (!preco) return;

        const vigenciaStatus = this.getVigenciaStatus(preco);

        const modalContent = `
            <div class="preco-details">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <p><strong>Fornecedor:</strong> ${fornecedor ? fornecedor.nome : 'N/A'}</p>
                        <p><strong>Item:</strong> ${item ? item.nome + ' (' + item.unidade + ')' : 'N/A'}</p>
                        <p><strong>Preço:</strong> ${Utils.formatCurrency(preco.preco)}</p>
                        <p><strong>Desconto:</strong> ${preco.desconto || 0}%</p>
                        <p><strong>Preço Final:</strong> 
                            <span style="font-size: 1.2em; font-weight: bold; color: green;">
                                ${Utils.formatCurrency(preco.precoFinal || preco.preco)}
                            </span>
                        </p>
                    </div>
                    <div>
                        <p><strong>Data Atualização:</strong> ${Utils.formatDate(preco.dataAtualizacao)}</p>
                        <p><strong>Data Vigência:</strong> 
                            ${preco.dataVigencia ? Utils.formatDate(preco.dataVigencia) : 'Indefinida'}
                            ${vigenciaStatus ? `<span style="color: ${vigenciaStatus.color}; margin-left: 10px;">${vigenciaStatus.text}</span>` : ''}
                        </p>
                        <p><strong>Qtd. Mínima:</strong> ${preco.quantidadeMinima || 0} ${item ? item.unidade : ''}</p>
                        <p><strong>Criado em:</strong> ${preco.criadoEm ? Utils.formatDate(preco.criadoEm) : '-'}</p>
                        <p><strong>Atualizado em:</strong> ${preco.atualizadoEm ? Utils.formatDate(preco.atualizadoEm) : '-'}</p>
                    </div>
                </div>
                
                ${preco.observacoes ? `
                    <div style="margin-top: 20px;">
                        <p><strong>Observações:</strong></p>
                        <p style="background-color: #f8f9fa; padding: 10px; border-radius: 4px;">${preco.observacoes}</p>
                    </div>
                ` : ''}
                
                <div class="form-actions">
                    <button type="button" onclick="app.closeModal()" class="btn-secondary">Fechar</button>
                    <button type="button" onclick="precosManager.editPreco(${id})" class="btn-primary">Editar</button>
                </div>
            </div>
        `;

        app.showModal('Detalhes do Preço', modalContent);
    }

    editPreco(id) {
        const preco = this.getPrecos().find(p => p.id === id);
        if (!preco) return;

        this.showNovoPrecoModal();

        // Preencher formulário com dados existentes
        setTimeout(() => {
            document.getElementById('fornecedorId').value = preco.fornecedorId || '';
            document.getElementById('itemId').value = preco.itemId || '';
            document.getElementById('preco').value = preco.preco || '';
            document.getElementById('dataAtualizacao').value = preco.dataAtualizacao || '';
            document.getElementById('dataVigencia').value = preco.dataVigencia || '';
            document.getElementById('desconto').value = preco.desconto || '';
            document.getElementById('quantidadeMinima').value = preco.quantidadeMinima || '';
            document.getElementById('observacoes').value = preco.observacoes || '';

            // Atualizar título do modal
            document.querySelector('.modal-header h3').textContent = 'Editar Preço';

            // Recalcular preço final
            document.getElementById('preco').dispatchEvent(new Event('input'));

            // Atualizar evento de submissão para edição
            const form = document.getElementById('precoForm');
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
            
            // Reconfigurar eventos
            this.setupPrecoCalculation();
            
            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePreco(id);
            });
        }, 100);
    }

    deletePreco(id) {
        if (confirm('Tem certeza que deseja excluir este preço?')) {
            const preco = this.getPrecos().find(p => p.id === id);
            const precos = this.getPrecos().filter(p => p.id !== id);
            localStorage.setItem('precos', JSON.stringify(precos));
            
            // Log da ação
            if (window.adminManager && preco) {
                const fornecedor = this.getFornecedores().find(f => f.id === preco.fornecedorId);
                const item = this.getItens().find(i => i.id === preco.itemId);
                const details = `Preço excluído: ${item?.nome || 'Item'} - ${fornecedor?.nome || 'Fornecedor'}`;
                window.adminManager.logAction('delete', 'precos', details);
            }
            
            this.loadPrecos();
            app.showMessage('Preço excluído com sucesso!', 'success');
        }
    }

    getVigenciaStatus(preco) {
        if (!preco.dataVigencia) return null;

        const hoje = new Date();
        const vigencia = new Date(preco.dataVigencia);
        const diffTime = vigencia - hoje;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { color: 'red', text: 'VENCIDO' };
        } else if (diffDays <= 7) {
            return { color: 'orange', text: `VENCE EM ${diffDays} DIAS` };
        } else {
            return { color: 'green', text: 'VIGENTE' };
        }
    }

    // Método para buscar preços por fornecedor e item
    buscarPreco(fornecedorId, itemId) {
        const precos = this.getPrecos();
        return precos.find(p => p.fornecedorId === fornecedorId && p.itemId === itemId);
    }

    // Método para buscar melhores preços por item
    getMelhoresPrecos(itemId) {
        const precos = this.getPrecos();
        const precosItem = precos.filter(p => p.itemId === itemId);
        
        return precosItem.sort((a, b) => {
            const precoA = a.precoFinal || a.preco;
            const precoB = b.precoFinal || b.preco;
            return precoA - precoB;
        });
    }

    // Método para relatório de preços vencidos
    getPrecosVencidos() {
        const precos = this.getPrecos();
        const hoje = new Date();
        
        return precos.filter(p => {
            if (!p.dataVigencia) return false;
            const vigencia = new Date(p.dataVigencia);
            return vigencia < hoje;
        });
    }

    getPrecos() {
        return JSON.parse(localStorage.getItem('precos') || '[]');
    }

    getFornecedores() {
        return JSON.parse(localStorage.getItem('fornecedores') || '[]');
    }

    getItens() {
        return JSON.parse(localStorage.getItem('itens') || '[]');
    }

    generateId() {
        const precos = this.getPrecos();
        return precos.length > 0 ? Math.max(...precos.map(p => p.id)) + 1 : 1;
    }

    // Método para exportar tabela de preços
    exportPrecos() {
        const precos = this.getPrecos();
        const fornecedores = this.getFornecedores();
        const itens = this.getItens();
        
        const dadosExport = precos.map(preco => {
            const fornecedor = fornecedores.find(f => f.id === preco.fornecedorId);
            const item = itens.find(i => i.id === preco.itemId);
            
            return {
                fornecedor: fornecedor ? fornecedor.nome : 'N/A',
                item: item ? item.nome : 'N/A',
                unidade: item ? item.unidade : 'N/A',
                preco: preco.preco,
                desconto: preco.desconto || 0,
                precoFinal: preco.precoFinal || preco.preco,
                dataAtualizacao: preco.dataAtualizacao,
                dataVigencia: preco.dataVigencia || 'Indefinida',
                quantidadeMinima: preco.quantidadeMinima || 0,
                observacoes: preco.observacoes || ''
            };
        });
        
        const csvContent = this.convertToCSV(dadosExport);
        this.downloadCSV(csvContent, 'tabela-precos.csv');
    }

    convertToCSV(data) {
        const headers = ['Fornecedor', 'Item', 'Unidade', 'Preco', 'Desconto %', 'Preco Final', 'Data Atualizacao', 'Data Vigencia', 'Qtd Minima', 'Observacoes'];
        const csvRows = [headers.join(',')];
        
        data.forEach(row => {
            const csvRow = [
                `"${row.fornecedor}"`,
                `"${row.item}"`,
                `"${row.unidade}"`,
                row.preco,
                row.desconto,
                row.precoFinal,
                `"${row.dataAtualizacao}"`,
                `"${row.dataVigencia}"`,
                row.quantidadeMinima,
                `"${row.observacoes}"`
            ];
            csvRows.push(csvRow.join(','));
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

// Inicializar gerenciador de preços
document.addEventListener('DOMContentLoaded', () => {
    window.precosManager = new PrecosManager();
});
