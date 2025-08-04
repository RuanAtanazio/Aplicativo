# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

Este é um projeto de aplicativo desktop para Windows desenvolvido com HTML, CSS e JavaScript puro para gerenciamento de pedidos de compra.

## Contexto do Projeto
- **Sistema de Pedidos de Compra**: Aplicativo para gerenciar pedidos com data do pedido e entrega
- **Gestão de Fornecedores**: Cadastro de fornecedores com nome e telefone  
- **Gestão de Itens**: Cadastro e edição de itens
- **Tabela de Preços**: Preços por fornecedor e item
- **Sistema de Login**: Autenticação para salvar dados por usuário
- **Interface**: Baseada no design da Optmetrics com menu lateral

## Arquitetura
- Frontend: HTML5, CSS3, JavaScript ES6+
- Armazenamento: LocalStorage para dados do usuário
- Padrão: MVC com módulos separados
- Interface: Responsiva e moderna

## Estrutura de Pastas
- `src/` - Código fonte
- `assets/` - Recursos (CSS, imagens, fonts)
- `data/` - Arquivos de dados JSON
- `components/` - Componentes reutilizáveis

## Diretrizes de Código
- Use ES6+ features (arrow functions, classes, modules)
- Siga padrões de nomenclatura consistentes
- Implemente validação de dados adequada
- Mantenha responsividade mobile-first
- Use localStorage para persistência local
