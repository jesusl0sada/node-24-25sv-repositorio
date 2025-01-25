// Importamos las librerías necesarias
const express = require("express");
const { Pool } = require("pg"); // Para conectarnos a PostgreSQL
const cors = require("cors"); // Para habilitar CORS

// Creamos la aplicación de Express
const app = express();
const port = 3000; // Puerto en el que correrá el servidor

// Middleware para habilitar CORS y permitir solicitudes JSON
app.use(cors());
app.use(express.json());

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
    user: "postgres",
    host: "netflix-01.c9ws0ag44n5i.us-east-1.rds.amazonaws.com",
    database: "postgres",
    password: "pollagorda25", // Cambia esta contraseña según tu configuración
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // Cambia esto a true si usas certificados válidos
    },
});


// **Endpoints para cada género de películas**
app.get("/peliculas/", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM peliculas");

        res.json(rows);
    } catch (error) {
        console.error("Error al obtener las peliculas", error);
        res.status(500).send("Error al obtener películas.");
    }
});

// ENDPOINT Películas de Drama
app.get("/peliculas/drama", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM peliculas WHERE genero = 'Drama';");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener películas de Drama:", error);
        res.status(500).send("Error al obtener películas de Drama.");
    }
});

// ENDPOINT Películas de Suspense
app.get("/peliculas/suspense", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM peliculas WHERE genero = 'Suspense';");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener películas de Suspense:", error);
        res.status(500).send("Error al obtener películas de Suspense.");
    }
});

// ENDPOINT Películas de Crimen
app.get("/peliculas/crimen", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM peliculas WHERE genero = 'Crimen';");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener películas de Crimen:", error);
        res.status(500).send("Error al obtener películas de Crimen.");
    }
});

// ENDPOINT Películas de Ciencia Ficción
app.get("/peliculas/cienciaficcion", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM peliculas WHERE genero = 'Ciencia Ficción';");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener películas de Ciencia Ficción:", error);
        res.status(500).send("Error al obtener películas de Ciencia Ficción.");
    }
});

// ENDPOINT Películas de Terror
app.get("/peliculas/terror", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM peliculas WHERE genero = 'Terror';");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener películas de Terror:", error);
        res.status(500).send("Error al obtener películas de Terror.");
    }
});

// Endpoint AÑADIR PELÍCULAS
app.post("/peliculas/agregar", async (req, res) => {
    const { id, titulo, director, anio, genero } = req.body; // Obtenemos los datos del cuerpo
    try {
        await pool.query(
            "INSERT INTO peliculas (id, titulo, director, anio, genero) VALUES ($1, $2, $3, $4, $5)",
            [id, titulo, director, anio, genero]
        );
        res.send("Película añadida correctamente");
    } catch (error) {
        console.error("Error al añadir película:", error);
        res.status(500).send("Error al añadir película.");
    }
});

