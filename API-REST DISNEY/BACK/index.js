const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

// Permitir archivos estáticos (para imágenes locales):
// Esto asume que tus PNG están en la MISMA carpeta que server.js.
// Si las guardas en /images, usar: express.static(path.join(__dirname, "images"))
app.use(express.static(__dirname));

// CORS y JSON
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "disney-gft.cpqciwyqap3v.us-east-1.rds.amazonaws.com",
  database: "postgres",
  password: "Ganadores2025",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Arranque del servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

/*****************************************************
 *                   ENDPOINTS
 *****************************************************/

// 1) Obtener todas las sagas
app.get("/sagas", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM saga");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener sagas:", error);
    res.status(500).send("Error al obtener sagas.");
  }
});

// 2) Obtener todas las películas (posible filtro por nombre)
app.get("/peliculas", async (req, res) => {
  try {
    const { nombre } = req.query; // leemos ?nombre=...
    let queryStr = "SELECT * FROM pelicula";
    const values = [];

    // Si ?nombre= algo, filtramos por nombre
    if (nombre) {
      queryStr += " WHERE LOWER(nombre) LIKE LOWER($1)";
      values.push(`%${nombre}%`);
    }

    const { rows } = await pool.query(queryStr, values);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener peliculas:", error);
    res.status(500).send("Error al obtener peliculas.");
  }
});

// 3) Obtener todos los géneros
app.get("/generos", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM genero");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener géneros:", error);
    res.status(500).send("Error al obtener géneros.");
  }
});

// 4) Obtener todos los directores (únicos)
app.get("/directores", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT DISTINCT director FROM pelicula ORDER BY director ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener directores:", error);
    res.status(500).send("Error al obtener directores.");
  }
});

// 5) Obtener todas las compañías (únicas)
app.get("/companias", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT DISTINCT compañia FROM pelicula ORDER BY compañia ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener compañías:", error);
    res.status(500).send("Error al obtener compañías.");
  }
});

// 6) Buscar películas por saga
app.get("/sagas/:nombre", async (req, res) => {
  try {
    const { nombre } = req.params;
    const { rows } = await pool.query(`
      SELECT p.* FROM pelicula p
      JOIN saga s ON p.saga_id = s.id
      WHERE s.nombre ILIKE $1
    `, [nombre]);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener películas de la saga:", error);
    res.status(500).send("Error al obtener películas de la saga.");
  }
});

// 7) Buscar películas por género
app.get("/generos/:nombre", async (req, res) => {
  try {
    const { nombre } = req.params;
    const { rows } = await pool.query(`
      SELECT p.* FROM pelicula p
      JOIN genero g ON p.genero_id = g.id
      WHERE g.nombre ILIKE $1
    `, [nombre]);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener películas por género:", error);
    res.status(500).send("Error al obtener películas por género.");
  }
});

// 8) Buscar películas por director
app.get("/directores/:nombre", async (req, res) => {
  try {
    const { nombre } = req.params;
    const { rows } = await pool.query(`
      SELECT * FROM pelicula 
      WHERE LOWER(director) = LOWER($1)
    `, [nombre]);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener películas por director:", error);
    res.status(500).send("Error al obtener películas por director.");
  }
});

// 9) Buscar películas por compañía
app.get("/companias/:nombre", async (req, res) => {
  try {
    const { nombre } = req.params;
    const { rows } = await pool.query(`
      SELECT * FROM pelicula 
      WHERE LOWER(compañia) = LOWER($1)
    `, [nombre]);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener películas por compañía:", error);
    res.status(500).send("Error al obtener películas por compañía.");
  }
});

// 10) Buscar películas por año de lanzamiento
app.get("/peliculas/ano/:year", async (req, res) => {
  try {
    const { year } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM pelicula WHERE año = $1",
      [year]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener películas por año:", error);
    res.status(500).send("Error al obtener películas por año.");
  }
});
