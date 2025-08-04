# OptMetrics Compras - Aplicativo Desktop para Windows

Sistema completo de gerenciamento de pedidos de compra desenvolvido como aplicativo nativo para Windows.

## 📋 Funcionalidades

### ✅ Gerenciamento Completo
- **Pedidos de Compra**: Criar, editar, visualizar e excluir pedidos
- **Fornecedores**: Cadastro completo com nome, telefone e email  
- **Itens**: Gerenciamento de produtos com categorias e estoque
- **Tabela de Preços**: Preços por fornecedor e item com vigência
- **Sistema de Login**: Autenticação segura com diferentes níveis de acesso

### 🔐 Sistema de Permissões
- **Administrador**: Acesso total ao sistema + painel administrativo
- **Usuário**: Permissões configuráveis por módulo
- **Logs do Sistema**: Rastreamento completo de ações
- **Gestão de Usuários**: Criação e edição de usuários e permissões

### 🎯 Recursos Avançados
- **Filtros Inteligentes**: Busca por qualquer campo em todas as telas
- **Ordenação Automática**: Dados sempre organizados alfabeticamente
- **Backup/Restore**: Exportação e importação completa de dados
- **Interface Moderna**: Design responsivo baseado na OptMetrics
- **Segurança**: Armazenamento local seguro dos dados

## 🚀 Instalação Rápida

### Método 1: Execução Direta (Recomendado)
1. **Duplo clique em `executar.bat`**
2. O sistema irá automaticamente:
   - Verificar dependências
   - Instalar o que for necessário
   - Iniciar a aplicação

### Método 2: Setup Manual
1. **Duplo clique em `setup.bat`**
2. Aguarde a instalação das dependências
3. A aplicação será iniciada automaticamente

## 📦 Criar Instalador

Para distribuir a aplicação:

1. **Duplo clique em `build.bat`**
2. Aguarde a criação do instalador
3. O arquivo `.exe` será criado na pasta `dist\`
4. Distribua o instalador para outros computadores

## 💾 Requisitos do Sistema

- **Windows**: 7, 8, 10 ou 11 (32 ou 64 bits)
- **Node.js**: 14.0 ou superior (instalado automaticamente se necessário)
- **Memória**: 4GB RAM recomendado
- **Espaço**: 500MB de espaço livre

## 🔑 Login Inicial

### Usuário Administrador
- **Usuário**: `admin`
- **Senha**: `admin`

### Criação de Novos Usuários
1. Faça login como administrador
2. Acesse o menu "Administração"
3. Use "Gerenciar Usuários" para criar novos usuários
4. Configure permissões individuais conforme necessário

## 📊 Estrutura de Dados

### Pedidos de Compra
- Data do pedido e entrega
- Fornecedor associado
- Lista de itens com quantidades e preços
- Status (Pendente, Aprovado, Cancelado, Entregue)

### Fornecedores
- Nome, telefone e email
- Histórico de pedidos
- Tabela de preços associada

### Itens
- Nome, categoria e unidade
- Controle de estoque
- Preços por fornecedor

### Tabela de Preços
- Preço por item/fornecedor
- Data de vigência
- Histórico de alterações

## 🛠️ Comandos Disponíveis

```bash
# Executar aplicação
npm start

# Modo desenvolvimento
npm run dev

# Criar instalador Windows
npm run build

# Apenas compilar (sem instalar)
npm run pack
```

## 🔧 Solução de Problemas

### Erro: "Node.js não encontrado"
1. Baixe e instale o Node.js: https://nodejs.org/
2. Reinicie o computador
3. Execute novamente o `setup.bat`

### Erro de Permissões
1. Execute como Administrador
2. Clique com botão direito → "Executar como administrador"

### Aplicação não inicia
1. Execute `setup.bat` novamente
2. Verifique se há antivírus bloqueando
3. Temporarily disable Windows Defender

## 📁 Estrutura de Arquivos

```
OptMetrics Compras/
├── main.js              # Arquivo principal do Electron
├── index.html           # Interface principal
├── package.json         # Configuração do projeto
├── setup.bat           # Script de instalação
├── executar.bat        # Script de execução
├── build.bat           # Script de build
├── assets/             # Recursos (CSS, JS, imagens)
│   ├── css/           # Estilos
│   ├── js/            # Scripts JavaScript
│   └── icons/         # Ícones da aplicação
└── dist/              # Arquivos de distribuição (após build)
```

## 🎨 Personalização

A aplicação pode ser personalizada editando:
- **Cores**: `assets/css/styles.css`
- **Logo**: Substitua arquivos em `assets/icons/`
- **Funcionalidades**: Edite arquivos em `assets/js/`

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique este README
2. Execute os scripts de setup novamente
3. Entre em contato com o suporte técnico

## 📄 Licença

Este software é licenciado sob MIT License.

---

**OptMetrics Compras v1.0.0**  
*Sistema de Gerenciamento de Pedidos de Compra para Windows*
