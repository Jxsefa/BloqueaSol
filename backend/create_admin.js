import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const crearAdmin = async () => {
    const username = 'admin';
    const password = 'admin123'; // puedes cambiar la contraseña que quieras

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
        'INSERT INTO usuarios (username, password_hash, rol) VALUES ($1, $2, $3)',
        [username, passwordHash, 'admin']
    );

    console.log(`Usuario admin creado: ${username} / ${password}`);

    await pool.end();
};

crearAdmin();
