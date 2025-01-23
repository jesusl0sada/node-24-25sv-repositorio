/*17-01-2025*/
// listar películas NODE JS CON AWS
// API REST

// IMPORTS EN JAVA
const express = require("express"); // API REST -> NODE JS CON EXPRESS
const { Pool } = require("pg");      // HABLAR BD PG DE AWS
const cors = require("cors")
// INSTANCIAR LOS OBJETOS QUE NECESITAMOS
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
// Configuración de la base de datos
const pool = new Pool({
    user: "postgres",
    host: "netflix-01.c9ws0ag44n5i.us-east-1.rds.amazonaws.com",
    database: "postgres",
    password: "pollagorda25", // Considera usar variables de entorno para gestionar contraseñas
    port: 5432,
    ssl: {
      rejectUnauthorized: false, // Cambia a false si tienes problemas de certificados pero trata de evitarlo por seguridad
      // ca: fs.readFileSync('/path/to/server-ca.pem').toString(),
      // Es posible que AWS RDS requiera parámetros SSL específicos o archivos CA.
      // Comprueba la documentación de AWS RDS para obtener los detalles exactos.
    },
  });

  app.get("/peliculas", async (req, res)=>{
    const {rows} = await pool.query(
        "SELECT * FROM peliculas;"
    );
    res.json(rows);
    // res.send("Bienvenido a mi API DISNEY");
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
        res.json(rows);
    });
    
    // ENDPOINT AÑADIR PELÍCULAS
    app.use(express.json()); // Permite leer datos en JSON desde el cuerpo de la solicitud
app.post("/peliculas/agregar", async (req, res) => {
    const { id, titulo, director, anio, genero } = req.body; // Obtenemos los datos del cuerpo
    // Consulta para insertar directamente
    const query = `INSERT INTO peliculas (id, titulo, director, anio, genero) VALUES (${id}, '${titulo}', '${director}', ${anio}, '${genero}'   )`;
    await pool.query(query); // Ejecutamos la consulta
    res.send("Película añadida correctamente"); // Respondemos al cliente
});

// ENDPOINT PELICULAS DRAMA


//ENDPOINT PELICULAS SUSPENSE


//ENDPOINT PELICULAS CRIMEN


//ENDPOINT PELICULAS CIENCIA FICCIÓN


//ENDPOINT PELICULAS TERROR


    // LOGIN, PELÍCULAS POR CATEGORÍAS
        // ADD -> INSERT
        //     app.post("/usuarios/", (req, res)); 
    // ELIMINAR -> DELETE                            
        // app.delete("/usuarios/", (req, res)); 
    // MODIFICAR -> UPDATE
        // app.put("/usuarios/", (req, res));    