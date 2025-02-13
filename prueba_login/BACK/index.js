const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: "clase.cnanbt27k03l.us-east-1.rds.amazonaws.com",
    database: 'postgres',
    password: "ClaseClase",
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Endpoint de login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Consulta a la base de datos
        const sqlQuery = `
            SELECT * FROM USUARIOS 
            WHERE USERNAME = $1 
            AND 
            PASSWORD = $2;`
            ;
        const result = await pool.query(sqlQuery, [username, password]);

        // Verificar si hay usuario
        if (result.rows.length > 0) {
            const usuario = result.rows[0].username; // Obtiene el nombre de usuario correcto
            const message = `HAS INICIADO SESIÓN CON ÉXITO CON EL USUARIO ${usuario}`;     

            res.json({ usuario, message });
        } else {
            res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

