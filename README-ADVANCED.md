# OptMetrics Compras - Sistema de Gerenciamento de Pedidos

Sistema completo de gerenciamento de pedidos de compra desenvolvido com HTML, CSS e JavaScript puro para desktop Windows.

## 🚀 Funcionalidades

### 📊 **Módulos do Sistema**
- **Pedidos de Compra**: Criação e gerenciamento de pedidos com data do pedido e entrega
- **Fornecedores**: Cadastro completo com nome e telefone
- **Itens**: Gerenciamento de produtos com categoria e unidade de medida
- **Tabela de Preços**: Controle de preços por fornecedor e item
- **Sistema de Logs**: Registro completo de todas as ações dos usuários
- **Backup/Restore**: Exportação e importação de dados

### 🔐 **Sistema de Permissões Avançado**

#### **Administrador (admin/admin123)**
- ✅ **Acesso total** a todas as funcionalidades
- ✅ **Painel de Administração** completo
- ✅ **Usuários Online**: Visualização em tempo real
- ✅ **Gerenciamento de Usuários**: Criar, editar, excluir
- ✅ **Controle de Permissões**: Granular por módulo e ação
- ✅ **Alteração de Papéis**: Promover/rebaixar usuários
- ✅ **Permissões em Lote**: Aplicar mudanças para múltiplos usuários
- ✅ **Logs do Sistema**: Monitoramento completo
- ✅ **Backup/Restore**: Proteção dos dados

#### **Usuário Regular (usuario/123456)**
- ✅ **Pedidos**: Visualizar, criar e editar (sem excluir)
- ❌ **Fornecedores**: Apenas visualização
- ❌ **Itens**: Apenas visualização  
- ❌ **Preços**: Apenas visualização
- ❌ **Administração**: Sem acesso
- ❌ **Logs**: Sem acesso

### 🎯 **Painel de Administração**

#### **1. Usuários Online**
- **Estatísticas em tempo real**: Total online, admins, usuários
- **Monitoramento**: Tempo online, status, último login
- **Ações rápidas**: Alterar permissões, forçar logout

#### **2. Gerenciamento de Usuários**
- **Filtros avançados**: Por papel, status, nome
- **Seleção múltipla**: Checkbox para ações em lote
- **Alteração de papéis**: Admin ↔ Usuário com um clique
- **Permissões granulares**: Por módulo (view/create/edit/delete)
- **Permissões em lote**: Aplicar mudanças para vários usuários

#### **3. Logs do Sistema**
- **Registro completo**: Login, criação, edição, exclusão
- **Filtros**: Por usuário, tipo de ação, data
- **Exportação**: Histórico completo das ações

#### **4. Backup/Restore**
- **Exportação**: Download em formato JSON
- **Importação**: Restauração completa dos dados
- **Estatísticas**: Contadores do sistema

## 💡 **Principais Recursos**

### **Permissões Intercambiáveis**
- **Mudança de papel**: Admin pode promover usuário ↔ admin
- **Permissões customizadas**: Ajuste fino por módulo
- **Aplicação em lote**: Mudanças para múltiplos usuários simultaneamente

### **Segurança**
- **Proteção do admin principal**: ID 1 não pode ser excluído
- **Validações**: Verificações em cada ação
- **Logs auditáveis**: Rastreamento completo

### **Interface Responsiva**
- **Design moderno**: Baseado no estilo OptMetrics
- **Filtros intuitivos**: Em todos os módulos
- **Ordenação automática**: Alfabética em todas as listas
- **Feedback visual**: Status, indicadores online/offline

## 🔧 **Como Usar**

### **Login Inicial**
```
Administrador:
- Usuário: admin
- Senha: admin123

Usuário Regular:
- Usuário: usuario  
- Senha: 123456
```

### **Criando Novos Usuários**
1. Faça login como administrador
2. Vá para "Administração" → "Gerenciar Usuários"
3. Clique em "Criar Usuário"
4. Defina nome, senha e papel
5. As permissões são aplicadas automaticamente

### **Alterando Permissões**
1. Na lista de usuários, clique em "Permissões"
2. Ajuste as permissões por módulo
3. Ou use "Alterar Papel" para mudança rápida

### **Permissões em Lote**
1. Selecione múltiplos usuários com checkbox
2. Clique em "Permissões em Lote"
3. Escolha a ação (conceder/revogar/promover/rebaixar)

## 📁 **Estrutura do Projeto**

```
📦 optmetrics-compras/
├── 📄 index.html                    # Interface principal
├── 📄 package.json                  # Configurações do projeto
├── 📄 README.md                     # Documentação
├── 📁 assets/
│   ├── 📁 css/
│   │   ├── 📄 login.css            # Estilos de login
│   │   └── 📄 styles.css           # Estilos principais
│   └── 📁 js/
│       ├── 📄 admin.js             # Gerenciador de administração
│       ├── 📄 app.js               # Aplicação principal
│       ├── 📄 auth.js              # Sistema de autenticação
│       ├── 📄 fornecedores.js      # Gerenciador de fornecedores
│       ├── 📄 itens.js             # Gerenciador de itens
│       ├── 📄 pedidos.js           # Gerenciador de pedidos
│       └── 📄 precos.js            # Gerenciador de preços
├── 📁 components/                   # Componentes reutilizáveis
└── 📁 data/                        # Arquivos de dados JSON
```

## ⚡ **Tecnologias Utilizadas**

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Armazenamento**: LocalStorage (dados locais por usuário)
- **Arquitetura**: MVC com módulos separados
- **Design**: Interface responsiva e moderna

## 🎨 **Destaques Visuais**

- **Cards estatísticos**: Usuários online com gradientes
- **Indicadores de status**: Online/offline com cores
- **Tabelas interativas**: Ordenação e filtros
- **Modais responsivos**: Formulários limpos
- **Feedback visual**: Mensagens de sucesso/erro

## 🔄 **Executando o Sistema**

1. **Clone/baixe** os arquivos
2. **Abra** `index.html` em qualquer navegador moderno
3. **Faça login** com as credenciais padrão
4. **Explore** todas as funcionalidades!

---

> **Desenvolvido para Windows** - Interface desktop completa com gerenciamento avançado de usuários e permissões intercambiáveis!
