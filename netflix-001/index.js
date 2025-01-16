// API REST

// IMPORTS EM JAVA
const express = require("express"); // API REST --> NODE JS CON EXPRESS
const { Pool } = require("pg"); // HABLAR BD PG DE AWS

// Configuración de la base de datos
const pool = new Pool({
    user: "postgres",
    host: "netflix-01.cupetnmlumhn.us-east-1.rds.amazonaws.com",
    database: "postgres",
    password: "LUCASLUCAS",
    port: 5432,
});

app.get("/PELICULAS", async (req, res) => {
    const result = pool.query("SELECT * FROM PELICULAS");
    res.json(result.rows);
});

// INSTANCIAR LOS OBJETOS QUE NECESITAMOS 
const app = express();
const port = 3000;
    // CONSULTAR -> SELECT * FROM USUARIOS, PELICULAS
    app.get("/usuarios/", (req, res) =>{
        // req -> no lo necesito
        // res -> si
        res.send('Has solicitado una lista de usuarios')
    }); // CONSULTAR SELECT * FROM USUARIOS, PELICULAS
    //---

    app.get("/usuarios/:id", (req, res) =>{
        const userId=req.params.id;
        res.send('El ID del usuario es: ${userId}');
    });

    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });
    // LOGIN, PELICULAS POR CATEGORIAS
    // ADD -> INSERT
        //app.post("/usuarios/", (req, res)); 
        //app.delete("/usuarios/", (req, res)); // ELIMINAR
        //app.put("/usuarios/", (req, res)); // MODIFICAR