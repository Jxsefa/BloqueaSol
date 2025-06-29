import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.sendStatus(403);
    }
};

// Login
app.post('/loginn', async (req, res) => {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    const user = result.rows[0];
    if (user && await bcrypt.compare(password, user.password_hash)) {
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
    }
});

// POST mediciones (el ESP32 mandará aquí)
app.post('/medicion', async (req, res) => {
    const { dispositivo_id, usos_hoy, promedio_uv, tipo_piel, bloqueador_restante } = req.body;
    await pool.query(`
        INSERT INTO mediciones (dispositivo_id, usos_hoy, promedio_uv, tipo_piel, bloqueador_restante)
        VALUES ($1, $2, $3, $4, $5)
    `, [dispositivo_id, usos_hoy, promedio_uv, tipo_piel, bloqueador_restante]);
    res.json({ status: 'ok' });
});

// GET última medición
app.get('/api/v1/mediciones', authMiddleware, async (req, res) => {
    const result = await pool.query(`
        SELECT * FROM mediciones ORDER BY timestamp DESC LIMIT 1
    `);
    res.json(result.rows[0]);
});

app.get('/api/v1/last-medicion/:id', async (req, res) => {
    console.log('ID param:', req.params.id);

    const { id } = req.params;

    const result = await pool.query(
        `
            SELECT AVG(promedio_uv) as avg
            FROM (
                SELECT promedio_uv
                FROM mediciones
                WHERE dispositivo_id = $1
                ORDER BY timestamp DESC
                LIMIT 5
                ) AS ultimas_5;
        `,
        [id]
    );

    res.json(result.rows[0]);
});



// GET dispositivos (opcional)
app.get('/api/v1/dispositivos', authMiddleware, async (req, res) => {
    const result = await pool.query('SELECT * FROM dispositivos');
    res.json(result.rows);
});

// Arrancar server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
