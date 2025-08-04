# OptMetrics Compras

Sistema de gerenciamento de pedidos de compra desenvolvido em HTML, CSS e JavaScript para Windows.

## 📋 Funcionalidades

### 🔐 Sistema de Login
- Autenticação de usuários
- Cadastro de novas contas
- Dados salvos por usuário
- Usuários padrão: `admin/admin123` e `usuario/123456`

### 📦 Gestão de Pedidos de Compra
- Criar novos pedidos com múltiplos itens
- Definir datas de pedido e entrega
- Associar fornecedores aos pedidos
- Controle de status (Pendente, Aprovado, Cancelado, Entregue)
- Visualização detalhada dos pedidos
- Edição e exclusão de pedidos

### 🏢 Cadastro de Fornecedores
- Cadastro completo com nome, telefone, email
- Informações adicionais: CNPJ, endereço, contato
- Validação de dados (email, CNPJ)
- Máscaras automáticas para telefone e CNPJ
- Controle de fornecedores em uso

### 📦 Gestão de Itens
- Cadastro de itens com descrição detalhada
- Unidades de medida padronizadas
- Categorização de itens
- Controle de estoque com alertas
- Movimentação de estoque (entrada, saída, ajuste)
- Histórico de movimentações

### 💰 Tabela de Preços
- Preços por fornecedor e item
- Sistema de descontos
- Controle de vigência de preços
- Quantidade mínima para preços especiais
- Comparação de preços entre fornecedores
- Alertas para preços vencidos

## 🚀 Como Usar

### Execução Local
1. Faça o download ou clone o projeto
2. Abra o arquivo `index.html` em qualquer navegador moderno
3. Use as credenciais padrão ou crie uma nova conta

### Credenciais Padrão
- **Administrador**: `admin` / `admin123`
- **Usuário**: `usuario` / `123456`

## 📁 Estrutura do Projeto

```
optmetrics-compras/
├── index.html              # Página principal
├── assets/
│   ├── css/
│   │   ├── styles.css      # Estilos principais
│   │   └── login.css       # Estilos do login
│   └── js/
│       ├── app.js          # Aplicação principal
│       ├── auth.js         # Sistema de autenticação
│       ├── pedidos.js      # Gestão de pedidos
│       ├── fornecedores.js # Gestão de fornecedores
│       ├── itens.js        # Gestão de itens
│       └── precos.js       # Tabela de preços
├── components/             # Componentes reutilizáveis
├── data/                   # Dados de exemplo
└── README.md              # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura da aplicação
- **CSS3** - Estilização e layout responsivo
- **JavaScript ES6+** - Lógica da aplicação
- **LocalStorage** - Persistência de dados local
- **Responsive Design** - Compatível com mobile

## 💾 Armazenamento de Dados

Os dados são salvos no LocalStorage do navegador, incluindo:
- Usuários e autenticação
- Pedidos de compra
- Fornecedores cadastrados
- Itens e estoque
- Tabela de preços
- Histórico de movimentações

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (Windows, Mac, Linux)
- Tablets
- Smartphones
- Navegadores modernos (Chrome, Firefox, Edge, Safari)

## 🔧 Funcionalidades Avançadas

### Validações
- Validação de CNPJ
- Validação de email
- Máscaras automáticas para telefone
- Controle de datas
- Verificação de estoque

### Relatórios
- Exportação de dados em CSV
- Relatório de estoque baixo
- Listagem de preços vencidos
- Comparação de preços por item

### Segurança
- Hash de senhas
- Sanitização de inputs
- Controle de acesso por usuário
- Backup e restore de dados

## 🚀 Executando como Aplicativo Desktop

Para usar como aplicativo desktop real:

### Opção 1: Electron (Recomendado)
```bash
npm install electron --save-dev
npm install electron-builder --save-dev
```

### Opção 2: Webview2 (Windows)
- Use ferramentas como WebView2 para empacotar como aplicativo nativo do Windows

### Opção 3: PWA (Progressive Web App)
- O sistema pode ser convertido em PWA para instalação via navegador

## 📋 Próximas Melhorias

- [ ] Sistema de backup automático
- [ ] Relatórios em PDF
- [ ] Gráficos e dashboards
- [ ] Importação de dados via CSV
- [ ] Notificações de estoque baixo
- [ ] Sistema de aprovação de pedidos
- [ ] Integração com APIs de fornecedores
- [ ] Controle de permissões por usuário

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para: suporte@optmetrics.com

---

**OptMetrics Compras** - Sistema de Gestão de Compras v1.0
