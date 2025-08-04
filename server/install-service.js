const Service = require('node-windows').Service;
const path = require('path');

// Criar objeto de serviço
const svc = new Service({
    name: 'OptMetrics Server',
    description: 'Servidor de monitoramento para OptMetrics Compras',
    script: path.join(__dirname, 'server.js'),
    nodeOptions: [
        '--harmony',
        '--max_old_space_size=4096'
    ],
    env: [
        {
            name: "NODE_ENV",
            value: "production"
        },
        {
            name: "PORT",
            value: "3000"
        }
    ]
});

// Escutar evento de instalação
svc.on('install', () => {
    console.log('✓ Serviço OptMetrics Server instalado com sucesso!');
    console.log('✓ O servidor será iniciado automaticamente');
    console.log('✓ Ele iniciará automaticamente na inicialização do Windows');
    console.log('');
    console.log('Para gerenciar o serviço:');
    console.log('- services.msc (Gerenciador de Serviços do Windows)');
    console.log('- net start "OptMetrics Server"');
    console.log('- net stop "OptMetrics Server"');
    console.log('');
    console.log('URL do servidor: http://localhost:3000');
    console.log('Dashboard: http://localhost:3000/dashboard');
    
    svc.start();
});

// Escutar evento de erro
svc.on('error', (err) => {
    console.error('Erro ao instalar serviço:', err);
});

// Instalar serviço
console.log('Instalando OptMetrics Server como serviço do Windows...');
svc.install();
