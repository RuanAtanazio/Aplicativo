# GUIA DE INSTALAÇÃO - SERVIDOR OPTMETRICS

## 📋 PRÉ-REQUISITOS

Antes de instalar o servidor, você precisa ter:

1. **Node.js** (versão 16 ou superior)
   - Baixe em: https://nodejs.org
   - Instale a versão LTS (recomendada)
   - Verifique a instalação: `node --version`

2. **Computador Dedicado** (opcional mas recomendado)
   - Windows 10/11
   - Mínimo 4GB RAM
   - Conexão estável com a internet/rede local

---

## 🚀 INSTALAÇÃO RÁPIDA

### Método 1: Instalação Automática (Recomendado)

1. **Abra a pasta `server`** do projeto
2. **Execute como Administrador:** `INSTALAR-SERVIDOR.bat`
3. **Aguarde** a instalação das dependências
4. **Escolha** se quer iniciar o servidor agora
5. **Pronto!** O servidor estará rodando

### Método 2: Instalação Manual

```bash
# 1. Navegar até a pasta do servidor
cd "server"

# 2. Instalar dependências
npm install

# 3. Iniciar servidor
node server.js
```

---

## ⚙️ CONFIGURAÇÃO

### **URLs do Servidor:**
- **Dashboard:** http://localhost:3000/dashboard
- **API:** http://localhost:3000/api
- **WebSocket:** ws://localhost:3001

### **Configuração nos Clientes:**
1. Abra o OptMetrics Compras como **administrador**
2. Vá em **"Admin" → "Monitoramento"**
3. Configure:
   - **URL do Servidor:** `http://SEU-IP:3000`
   - **ID da Empresa:** `EMPRESA_001`
4. **Marque** "Ativar Monitoramento"
5. **Clique** "Salvar Configurações"

---

## 🖥️ CENÁRIOS DE INSTALAÇÃO

### **Cenário 1: Servidor Local (Mais Simples)**
- Instale em qualquer computador da empresa
- Acesse via `http://localhost:3000`
- Configure clientes para `http://IP-DO-COMPUTADOR:3000`

### **Cenário 2: Servidor Dedicado (Recomendado)**
- Use um computador só para o servidor
- Mantenha sempre ligado
- Melhor performance e disponibilidade

### **Cenário 3: Servidor como Serviço Windows**
- Execute `instalar-servico.bat` **como Administrador**
- Servidor inicia automaticamente com o Windows
- Gerenciar via `services.msc`

---

## 🔧 COMANDOS ÚTEIS

### **Iniciar Servidor:**
```bash
node server.js
# ou
npm start
```

### **Verificar Status:**
- Acesse: http://localhost:3000/health

### **Ver Logs:**
- Os logs aparecem no terminal onde o servidor está rodando

### **Parar Servidor:**
- Pressione `Ctrl + C` no terminal

---

## 📊 FUNCIONALIDADES

### **Dashboard Web:**
- **Estatísticas em tempo real**
- **Usuários online**
- **Atividades recentes**
- **Computadores ativos**

### **API REST:**
- `/api/activities` - Buscar atividades
- `/api/stats` - Estatísticas
- `/api/online-users` - Usuários online
- `/api/computers` - Computadores

### **WebSocket:**
- **Atualizações em tempo real**
- **Notificações instantâneas**
- **Sincronização automática**

---

## 🔐 SEGURANÇA

### **Configurações de Rede:**
- Por padrão, aceita conexões de qualquer IP
- Para maior segurança, configure firewall
- Use HTTPS em produção (certificado SSL)

### **Dados:**
- Armazenados em SQLite local
- Backup automático recomendado
- Limite de logs configurável

---

## 🆘 SOLUÇÃO DE PROBLEMAS

### **Erro: "Node.js não encontrado"**
- Instale Node.js de https://nodejs.org
- Reinicie o terminal após instalação

### **Erro: "Porta 3000 em uso"**
- Pare outros serviços na porta 3000
- Ou altere a porta no arquivo `server.js`

### **Clientes não conectam:**
- Verifique o IP do servidor
- Teste: `ping IP-DO-SERVIDOR`
- Verifique firewall/antivírus

### **Dashboard não carrega:**
- Verifique se servidor está rodando
- Acesse: http://localhost:3000/health
- Verifique logs do servidor

---

## 🔄 ATUALIZAÇÕES

### **Para atualizar:**
1. Pare o servidor (`Ctrl + C`)
2. Substitua os arquivos
3. Execute: `npm install`
4. Reinicie: `node server.js`

---

## 📞 EXEMPLOS DE USO

### **Empresa Pequena (5-10 funcionários):**
```
Servidor: Computador do gerente
Clientes: Todos os PCs da empresa
Configuração: http://IP-GERENTE:3000
```

### **Empresa Média (10-50 funcionários):**
```
Servidor: Computador dedicado
Backup: Diário automático
Configuração: Servidor sempre ligado
```

### **Empresa Grande (50+ funcionários):**
```
Servidor: Máquina robusta
Serviço: Instalado como serviço Windows
Monitoramento: 24/7
```

---

## 🎯 TESTE RÁPIDO

Após instalar, teste assim:

1. **Inicie o servidor**
2. **Abra:** http://localhost:3000/dashboard
3. **Configure um cliente**
4. **Faça login no cliente**
5. **Verifique** se aparece no dashboard

Se aparecer a atividade, está funcionando! 🎉

---

## 📋 CHECKLIST DE INSTALAÇÃO

- [ ] Node.js instalado
- [ ] Servidor rodando sem erros
- [ ] Dashboard acessível
- [ ] Cliente configurado
- [ ] Atividades sendo registradas
- [ ] Firewall configurado
- [ ] Backup configurado (opcional)
- [ ] Serviço Windows instalado (opcional)

---

**🎊 PARABÉNS!** Seu sistema de monitoramento empresarial está pronto!
