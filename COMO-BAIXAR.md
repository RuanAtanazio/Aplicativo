# 📥 GUIA COMPLETO: COMO BAIXAR E USAR - OPTMETRICS COMPRAS

## 🎯 **VERSÃO ATUAL: 2.0 EMPRESARIAL COM SISTEMA P2P**

---

## 📋 **PASSO 1: DOWNLOAD**

### **🔗 Link de Download:**
**https://github.com/RuanAtanazio/Aplicativo/archive/refs/heads/main.zip**

### **Como Baixar:**
1. **Clique no link** acima
2. **Aguarde** o download começar automaticamente
3. **Salve** o arquivo `Aplicativo-main.zip` no seu computador

### **Alternativa (Via GitHub):**
1. Acesse: **https://github.com/RuanAtanazio/Aplicativo**
2. Clique no botão **"Code"** (verde)
3. Selecione **"Download ZIP"**

---

## 📂 **PASSO 2: EXTRAÇÃO**

### **Extrair o ZIP:**
1. **Localize** o arquivo `Aplicativo-main.zip` baixado
2. **Clique direito** → **"Extrair aqui"** ou **"Extract here"**
3. **Será criada** uma pasta `Aplicativo-main`
4. **Renomeie** para `OptMetrics Compras` (opcional)

### **Localização Recomendada:**
```
📁 C:\OptMetrics Compras\
📁 C:\Programas\OptMetrics Compras\
📁 Desktop\OptMetrics Compras\
```

---

## ⚙️ **PASSO 3: INSTALAÇÃO**

### **Instalação Automática (Recomendado):**
1. **Abra** a pasta extraída
2. **Duplo clique** em `INSTALAR.bat`
3. **Siga** as instruções na tela
4. **Aguarde** a instalação terminar

### **O que o Instalador Faz:**
- ✅ Verifica dependências
- ✅ Configura aplicativo
- ✅ Cria scripts de conveniência
- ✅ Prepara sistema para uso

---

## �️ **PASSO 4: CRIAR ATALHO (Opcional)**

### **Para Facilitar o Uso:**
1. **Duplo clique** em `criar-atalho.bat`
2. **Aguarde** a criação do atalho
3. **Encontre** o atalho na área de trabalho
4. **Use** o atalho para abrir o sistema

---

## 🚀 **PASSO 5: PRIMEIRO USO**

### **Abrir o Sistema:**
**Opção 1:** Duplo clique no **atalho da área de trabalho**
**Opção 2:** Duplo clique em `executar.bat` na pasta do projeto
**Opção 3:** Abra `index.html` no navegador

### **Fazer Login:**
**Administrador:**
- Usuário: `admin`
- Senha: `admin123`

**Usuário Normal:**
- Usuário: `usuario`
- Senha: `123456`

---

## 👥 **PASSO 6: CONFIGURAR PARA EMPRESA (P2P)**

### **Para Monitoramento Sem Servidor:**

#### **PC do Administrador:**
1. **Instale** o OptMetrics normalmente
2. **Faça login** como `admin`
3. **Pronto!** Agora é o "servidor" da rede

#### **PCs dos Funcionários:**
1. **Instale** o OptMetrics em cada PC
2. **Certifique-se** que estão na mesma rede WiFi
3. **Funcionários fazem login** normalmente
4. **Conexão automática** com o admin

#### **Verificar Funcionamento:**
1. **Admin:** Vá em **"Admin"** no menu
2. **Veja** a seção **"🌐 Servidor P2P Ativo"**
3. **Aparecerão** os usuários conectados automaticamente

---

## �️ **PASSO 7: CONFIGURAR SERVIDOR DEDICADO (Opcional)**

### **Para Empresas Maiores:**

#### **Instalar Node.js:**
1. Baixe de: **https://nodejs.org**
2. Instale a **versão LTS**
3. **Reinicie** o computador

#### **Configurar Servidor:**
1. **Entre** na pasta `server`
2. **Duplo clique** em `INSTALAR-SERVIDOR.bat`
3. **Siga** as instruções
4. **Aguarde** instalação das dependências

#### **Configurar Clientes:**
1. **Admin:** Vá em **"Admin" → "Monitoramento"**
2. **Configure:**
   - URL: `http://IP-DO-SERVIDOR:3000`
   - Empresa: `EMPRESA_001`
3. **Marque** "Ativar Monitoramento"
4. **Salve** configurações

---

## � **PASSO 8: USAR O SISTEMA**

### **Funcionalidades Disponíveis:**

#### **📦 Gestão de Pedidos:**
- **Criar** novos pedidos
- **Editar** pedidos existentes
- **Definir** datas e fornecedores
- **Controlar** status

#### **🏭 Gestão de Fornecedores:**
- **Cadastrar** fornecedores
- **Editar** informações
- **Controlar** telefones

#### **📋 Gestão de Itens:**
- **Cadastrar** produtos
- **Editar** descrições
- **Organizar** catálogo

#### **💰 Tabela de Preços:**
- **Definir** preços por fornecedor
- **Comparar** valores
- **Controlar** custos

#### **👥 Administração (Só Admin):**
- **Ver** usuários online
- **Monitorar** atividades
- **Gerar** relatórios
- **Controlar** permissões

---

## � **PASSO 9: CONFIGURAÇÕES AVANÇADAS**

### **Criar Novos Usuários:**
1. **Admin:** Vá em **"Admin" → "Usuários"**
2. **Clique** "Adicionar Usuário"
3. **Defina** nome, senha e permissões
4. **Salve** o novo usuário

### **Configurar Permissões:**
1. **Selecione** um usuário
2. **Marque/Desmarque** permissões:
   - ✅ Pode ver pedidos
   - ✅ Pode criar pedidos  
   - ✅ Pode editar pedidos
   - ❌ Pode deletar pedidos

### **Backup dos Dados:**
1. **Admin:** Vá em **"Admin" → "Backup"**
2. **Clique** "Exportar Dados"
3. **Salve** o arquivo em local seguro

---

## 🆘 **PASSO 10: SOLUÇÃO DE PROBLEMAS**

### **❓ Aplicativo não abre:**
- **Execute** `INSTALAR.bat` como administrador
- **Verifique** se extraiu o ZIP corretamente
- **Tente** abrir `index.html` diretamente

### **❓ Erro de login:**
- **Verifique** usuário e senha:
  - Admin: `admin` / `admin123`
  - Usuario: `usuario` / `123456`
- **Tente** criar novo usuário

### **❓ P2P não funciona:**
- **Verifique** se estão na mesma rede WiFi
- **Admin** deve fazer login primeiro
- **Teste** fazer logout e login novamente
- **Verifique** firewall/antivírus

### **❓ Dados perdidos:**
- **Use** função de backup regularmente
- **Dados** ficam no navegador (localStorage)
- **Restaure** do backup se necessário

---

## � **CHECKLIST FINAL**

### **✅ Instalação Completa:**
- [ ] Download realizado
- [ ] ZIP extraído
- [ ] `INSTALAR.bat` executado
- [ ] Atalho criado
- [ ] Login funcionando
- [ ] Sistema abrindo normalmente

### **✅ Para Empresas:**
- [ ] Instalado em todos os PCs
- [ ] Admin faz login primeiro
- [ ] Funcionários conectando automaticamente
- [ ] Monitoramento funcionando
- [ ] Backup configurado

---

## 🎯 **RESUMO DOS LINKS:**

### **📥 Download Principal:**
**https://github.com/RuanAtanazio/Aplicativo/archive/refs/heads/main.zip**

### **🌐 Repositório GitHub:**
**https://github.com/RuanAtanazio/Aplicativo**

### **📖 Documentação:**
- `README.md` - Guia geral
- `SISTEMA-P2P.md` - Guia do sistema P2P
- `MONITORAMENTO-EMPRESARIAL.md` - Guia de monitoramento
- `server/README-SERVIDOR.md` - Guia do servidor

---

## � **PRONTO!**

Agora você tem o **OptMetrics Compras versão 2.0 Empresarial** funcionando com:

✅ **Sistema de pedidos completo**
✅ **Monitoramento P2P automático**
✅ **Dashboard administrativo**
✅ **Relatórios em tempo real**
✅ **Backup e restauração**
✅ **Aplicativo desktop**

**🚀 Comece a usar e aproveite todos os recursos!**

---

**📞 Em caso de dúvidas, consulte os arquivos de documentação incluídos no download.**
