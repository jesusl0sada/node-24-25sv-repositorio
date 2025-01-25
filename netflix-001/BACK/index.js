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

<<<<<<< HEAD
// ENDPOINTS DE LAS PELICULAS DE CADA GÉNERO

// ENDPOINT PELÍCULAS DRAMA
app.get("/peliculas/drama", async (req, res) => {
    const { rows } = await pool.query(
      "SELECT * FROM peliculas WHERE genero = 'Drama';"
    );
    res.json(rows);
  });

// ENDPOINT PELÍCULAS SUSPENSE

app.get("/peliculas/suspense", async (req, res) => {
    const { rows } = await pool.query(
      "SELECT * FROM peliculas WHERE genero = 'Suspense';"
    );
    res.json(rows);
  });
  
// ENDPOINT PELÍCULAS CRIMEN

app.get("/peliculas/crimen", async (req, res) => {
    const { rows } = await pool.query(
      "SELECT * FROM peliculas WHERE genero = 'Crimen';"
    );
    res.json(rows);
  });

//ENDPOINT PELÍCULAS CIENCIA FICCIÓN

app.get("/peliculas/cienciaficcion", async (req, res) => {
    const { rows } = await pool.query(
      "SELECT * FROM peliculas WHERE genero = 'Ciencia Ficción';"
    );
    res.json(rows);
  });

//ENDPOINT PELÍCULAS TERROR

app.get("/peliculas/terror", async (req, res) => {
    const { rows } = await pool.query(
      "SELECT * FROM peliculas WHERE genero = 'Terror';"
    );
    res.json(rows);
  });
    
 // CONSULTAR -> SELECT * FROM USUARIOS, PELICULAS

app.get("/usuarios/", (req, res) =>{
        // req -> no lo necesito
        // res -> sí
        res.send('Has solicitado una lista de usuarios');
    }); 

    app.get("/usuarios/:id", (req, res) =>{
        const userId = req.params.id;
        res.send(`El ID del usuario es: ${userId}`);
    });

    // ----
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
      });
      
      // ENDPOINT PARA BUSCAR POR PELÍCULAS:
      app.get("/peliculas/buscar", async (req, res) => {

        const titulo = req.query.titulo; // Obtener el parámetro 'titulo' de la URL
        if (!titulo) {
            res.send("Debes proporcionar un título para buscar.");
            return;
        }
    
        // Consulta sencilla para buscar películas
        const { rows } = await pool.query( 
            `SELECT * FROM peliculas WHERE titulo LIKE '%${titulo}%'`);
    
        // Devolver resultados
=======
// **Endpoints para cada género de películas**
app.get("/peliculas/", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM peliculas");
>>>>>>> 4393487e49c93f5763108d7454a964b7744b0e14
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

<<<<<<< HEAD

=======
// Servidor escuchando en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor corriendo en http://127.0.0.1:${port}`);
});
>>>>>>> 4393487e49c93f5763108d7454a964b7744b0e14
