const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class OptMetricsServer {
    constructor() {
        this.app = express();
        this.port = 3000;
        this.dbPath = path.join(__dirname, 'monitoring.db');
        this.clients = new Set();
        
        this.setupDatabase();
        this.setupExpress();
        this.setupWebSocket();
    }

    setupDatabase() {
        // Criar diretório se não existir
        const serverDir = path.dirname(this.dbPath);
        if (!fs.existsSync(serverDir)) {
            fs.mkdirSync(serverDir, { recursive: true });
        }

        this.db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                console.error('Erro ao conectar com banco de dados:', err.message);
            } else {
                console.log('✓ Banco de dados conectado com sucesso');
                this.initializeTables();
            }
        });
    }

    initializeTables() {
        // Tabela de atividades
        this.db.run(`
            CREATE TABLE IF NOT EXISTS activities (
                id TEXT PRIMARY KEY,
                userId TEXT NOT NULL,
                userName TEXT NOT NULL,
                action TEXT NOT NULL,
                details TEXT,
                timestamp TEXT NOT NULL,
                computerName TEXT,
                computerInfo TEXT,
                companyId TEXT
            )
        `);

        // Tabela de computadores
        this.db.run(`
            CREATE TABLE IF NOT EXISTS computers (
                id TEXT PRIMARY KEY,
                computerName TEXT NOT NULL,
                lastSeen TEXT NOT NULL,
                userAgent TEXT,
                platform TEXT,
                ip TEXT,
                companyId TEXT
            )
        `);

        // Tabela de usuários online
        this.db.run(`
            CREATE TABLE IF NOT EXISTS online_users (
                userId TEXT PRIMARY KEY,
                userName TEXT NOT NULL,
                computerName TEXT NOT NULL,
                lastSeen TEXT NOT NULL,
                currentPage TEXT,
                companyId TEXT
            )
        `);

        console.log('✓ Tabelas do banco de dados inicializadas');
    }

    setupExpress() {
        // Middleware
        this.app.use(cors());
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.static(path.join(__dirname, 'public')));

        // Middleware de logging
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });

        // Rotas da API
        this.setupRoutes();
    }

    setupRoutes() {
        // Endpoint de saúde
        this.app.get('/health', (req, res) => {
            res.json({ 
                status: 'ok', 
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        });

        // Receber atividades
        this.app.post('/api/activity', (req, res) => {
            const activity = req.body;
            const companyId = req.headers['company-id'] || 'default';
            
            this.saveActivity(activity, companyId);
            this.broadcastActivity(activity, companyId);
            
            res.json({ success: true });
        });

        // Buscar atividades
        this.app.get('/api/activities', (req, res) => {
            const companyId = req.headers['company-id'] || 'default';
            const { user, action, startDate, endDate, limit = 100 } = req.query;
            
            let query = 'SELECT * FROM activities WHERE companyId = ?';
            const params = [companyId];
            
            if (user) {
                query += ' AND userId = ?';
                params.push(user);
            }
            
            if (action) {
                query += ' AND action = ?';
                params.push(action);
            }
            
            if (startDate && endDate) {
                query += ' AND timestamp BETWEEN ? AND ?';
                params.push(startDate, endDate);
            }
            
            query += ' ORDER BY timestamp DESC LIMIT ?';
            params.push(parseInt(limit));
            
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.json(rows);
                }
            });
        });

        // Buscar computadores
        this.app.get('/api/computers', (req, res) => {
            const companyId = req.headers['company-id'] || 'default';
            
            this.db.all(
                'SELECT * FROM computers WHERE companyId = ? ORDER BY lastSeen DESC',
                [companyId],
                (err, rows) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                    } else {
                        res.json(rows);
                    }
                }
            );
        });

        // Buscar usuários online
        this.app.get('/api/online-users', (req, res) => {
            const companyId = req.headers['company-id'] || 'default';
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
            
            this.db.all(
                'SELECT * FROM online_users WHERE companyId = ? AND lastSeen > ? ORDER BY lastSeen DESC',
                [companyId, fiveMinutesAgo],
                (err, rows) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                    } else {
                        res.json(rows);
                    }
                }
            );
        });

        // Heartbeat
        this.app.post('/api/heartbeat', (req, res) => {
            const data = req.body;
            const companyId = req.headers['company-id'] || 'default';
            
            this.updateOnlineUser(data, companyId);
            this.updateComputer(data, companyId);
            
            res.json({ success: true });
        });

        // Estatísticas
        this.app.get('/api/stats', (req, res) => {
            const companyId = req.headers['company-id'] || 'default';
            
            Promise.all([
                this.getUniqueUsers(companyId),
                this.getTotalActivities(companyId),
                this.getActiveComputers(companyId),
                this.getOnlineUsers(companyId)
            ]).then(([uniqueUsers, totalActivities, activeComputers, onlineUsers]) => {
                res.json({
                    uniqueUsers,
                    totalActivities,
                    activeComputers,
                    onlineUsers,
                    timestamp: new Date().toISOString()
                });
            }).catch(err => {
                res.status(500).json({ error: err.message });
            });
        });

        // Dashboard web
        this.app.get('/dashboard', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
        });
    }

    setupWebSocket() {
        this.wss = new WebSocket.Server({ port: 3001 });
        
        this.wss.on('connection', (ws) => {
            console.log('Nova conexão WebSocket estabelecida');
            this.clients.add(ws);
            
            ws.on('close', () => {
                this.clients.delete(ws);
                console.log('Conexão WebSocket fechada');
            });
            
            ws.on('error', (error) => {
                console.error('Erro WebSocket:', error);
                this.clients.delete(ws);
            });
        });
        
        console.log('✓ Servidor WebSocket iniciado na porta 3001');
    }

    saveActivity(activity, companyId) {
        const stmt = this.db.prepare(`
            INSERT INTO activities (id, userId, userName, action, details, timestamp, computerName, computerInfo, companyId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            activity.id || this.generateId(),
            activity.userId,
            activity.userName,
            activity.action,
            JSON.stringify(activity.details || {}),
            activity.timestamp,
            activity.computerInfo?.computerName || 'Desconhecido',
            JSON.stringify(activity.computerInfo || {}),
            companyId
        );
        
        stmt.finalize();
    }

    updateOnlineUser(data, companyId) {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO online_users (userId, userName, computerName, lastSeen, currentPage, companyId)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            data.userId,
            data.userName,
            data.computerInfo?.computerName || 'Desconhecido',
            data.lastSeen || new Date().toISOString(),
            data.currentPage || '',
            companyId
        );
        
        stmt.finalize();
    }

    updateComputer(data, companyId) {
        const computerInfo = data.computerInfo || {};
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO computers (id, computerName, lastSeen, userAgent, platform, ip, companyId)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            computerInfo.computerName || 'Desconhecido',
            computerInfo.computerName || 'Desconhecido',
            new Date().toISOString(),
            computerInfo.userAgent || '',
            computerInfo.platform || '',
            computerInfo.ip || '',
            companyId
        );
        
        stmt.finalize();
    }

    broadcastActivity(activity, companyId) {
        const message = JSON.stringify({
            type: 'activity',
            data: activity,
            companyId: companyId,
            timestamp: new Date().toISOString()
        });
        
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    // Métodos para estatísticas
    getUniqueUsers(companyId) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT COUNT(DISTINCT userId) as count FROM activities WHERE companyId = ?',
                [companyId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row.count);
                }
            );
        });
    }

    getTotalActivities(companyId) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT COUNT(*) as count FROM activities WHERE companyId = ?',
                [companyId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row.count);
                }
            );
        });
    }

    getActiveComputers(companyId) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT COUNT(DISTINCT computerName) as count FROM computers WHERE companyId = ?',
                [companyId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row.count);
                }
            );
        });
    }

    getOnlineUsers(companyId) {
        return new Promise((resolve, reject) => {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
            this.db.get(
                'SELECT COUNT(*) as count FROM online_users WHERE companyId = ? AND lastSeen > ?',
                [companyId, fiveMinutesAgo],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row.count);
                }
            );
        });
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    start() {
        this.app.listen(this.port, () => {
            console.log('');
            console.log('========================================');
            console.log('   OPTMETRICS SERVER INICIADO!');
            console.log('========================================');
            console.log(`🌐 Servidor HTTP: http://localhost:${this.port}`);
            console.log(`📊 Dashboard: http://localhost:${this.port}/dashboard`);
            console.log(`🔌 WebSocket: ws://localhost:3001`);
            console.log(`💾 Banco de dados: ${this.dbPath}`);
            console.log('========================================');
            console.log('');
            console.log('Para configurar os clientes:');
            console.log(`URL do Servidor: http://localhost:${this.port}`);
            console.log('ID da Empresa: EMPRESA_001');
            console.log('');
            console.log('Pressione Ctrl+C para parar o servidor');
            console.log('');
        });
    }

    stop() {
        if (this.db) {
            this.db.close();
        }
        
        if (this.wss) {
            this.wss.close();
        }
        
        console.log('Servidor OptMetrics parado');
    }
}

// Inicializar servidor
const server = new OptMetricsServer();

// Manipuladores de sinal
process.on('SIGINT', () => {
    console.log('\nRecebido SIGINT. Parando servidor...');
    server.stop();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\nRecebido SIGTERM. Parando servidor...');
    server.stop();
    process.exit(0);
});

// Manipulador de erro
process.on('uncaughtException', (error) => {
    console.error('Erro não capturado:', error);
    server.stop();
    process.exit(1);
});

// Iniciar servidor
server.start();

module.exports = OptMetricsServer;
