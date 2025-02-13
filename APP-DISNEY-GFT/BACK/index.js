const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

// Permitir archivos estáticos
app.use(express.static(__dirname));

// CORS y JSON
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "disney.cnanbt27k03l.us-east-1.rds.amazonaws.com",
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
    const { rows } = await pool.query("SELECT * FROM saga ORDER BY id ASC");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener sagas:", error);
    res.status(500).send("Error al obtener sagas.");
  }
});

// 2) Obtener todas las películas (posible filtro por nombre)
app.get("/peliculas", async (req, res) => {
  try {
    const { nombre } = req.query;
    let queryStr = "SELECT * FROM pelicula";
    const values = [];

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
    const { rows } = await pool.query("SELECT * FROM genero ORDER BY id ASC");
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
    const { rows } = await pool.query(
      `
      SELECT p.* FROM pelicula p
      JOIN saga s ON p.saga_id = s.id
      WHERE s.nombre ILIKE $1
    `,
      [nombre]
    );
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
    const { rows } = await pool.query(
      `
      SELECT p.* FROM pelicula p
      JOIN genero g ON p.genero_id = g.id
      WHERE g.nombre ILIKE $1
    `,
      [nombre]
    );
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
    const { rows } = await pool.query(
      `SELECT * FROM pelicula WHERE LOWER(director) = LOWER($1)`,
      [nombre]
    );
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
    const { rows } = await pool.query(
      `SELECT * FROM pelicula WHERE LOWER(compañia) = LOWER($1)`,
      [nombre]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener películas por compañía:", error);
    res.status(500).send("Error al obtener películas por compañía.");
  }
});

// 10) Buscar películas por año
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

/**
 * FAVORITOS
 */
app.get("/favoritos/:id_usuario", async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const query = `
      SELECT p.*
      FROM favoritos f
      JOIN pelicula p ON f.id_pelicula = p.id
      WHERE f.id_usuario = $1
    `;
    const { rows } = await pool.query(query, [id_usuario]);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).send("Error al obtener favoritos");
  }
});

// Agregar a favoritos
app.post("/favoritos", async (req, res) => {
  try {
    const { id_usuario, id_pelicula } = req.body;
    const query = `
      INSERT INTO favoritos (id_usuario, id_pelicula)
      VALUES ($1, $2)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id_usuario, id_pelicula]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error al agregar favorito:", error);
    res.status(500).send("Error al agregar favorito");
  }
});

// Eliminar de favoritos
app.delete("/favoritos", async (req, res) => {
  try {
    const { id_usuario, id_pelicula } = req.body;
    const query = `
      DELETE FROM favoritos
      WHERE id_usuario = $1 AND id_pelicula = $2
    `;
    await pool.query(query, [id_usuario, id_pelicula]);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    res.status(500).send("Error al eliminar favorito");
  }
});

/**
 * LOGIN
 */
app.post("/api/login/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const sqlQuery = `
      SELECT u.id_usuario, u.username, u.password, u.foto_perfil, r.nombre AS rol
      FROM usuario u
      JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.username = $1 AND u.password = $2
    `;
    const result = await pool.query(sqlQuery, [username, password]);
    if (result.rows.length > 0) {
      const userData = result.rows[0];
      return res.json({
        message: "Inicio de sesión exitoso",
        id_usuario: userData.id_usuario,
        username: userData.username,
        rol: userData.rol,
        foto_perfil: userData.foto_perfil,
      });
    } else {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos." });
    }
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

/**
 * REGISTRO (rol invitado = 2)
 */
app.post("/api/register", async (req, res) => {
  const { username, password, foto_perfil } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Faltan campos requeridos." });
  }

  try {
    // Verificar si ya existe
    const checkQuery = `SELECT * FROM usuario WHERE username = $1`;
    const checkResult = await pool.query(checkQuery, [username]);
    if (checkResult.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "El usuario ya existe, elige otro." });
    }

    // Insertar (rol invitado = 2)
    const insertQuery = `
      INSERT INTO usuario (username, password, id_rol, foto_perfil)
      VALUES ($1, $2, 2, $3)
      RETURNING id_usuario, username, foto_perfil
    `;
    const result = await pool.query(insertQuery, [
      username,
      password,
      foto_perfil || null,
    ]);

    return res.status(201).json({
      message: "Registro exitoso",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

/**
 * AGREGAR PELÍCULA
 */
app.post("/peliculas", async (req, res) => {
  const {
    nombre,
    director,
    genero_id,
    año,
    saga_id,
    compañia,
    imagen,
    trailer,
  } = req.body;

  try {
    const insertQuery = `
      INSERT INTO pelicula
      (nombre, director, genero_id, año, saga_id, compañia, imagen, trailer)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      nombre,
      director,
      genero_id,
      año,
      saga_id,
      compañia || null,
      imagen || null,
      trailer || null,
    ];
    const { rows } = await pool.query(insertQuery, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error al insertar pelicula:", error);
    res.status(500).json({ message: "Error al insertar pelicula" });
  }
});

/**
 * ELIMINAR PELÍCULA
 * Se recibe { valor } (puede ser ID o nombre)
 */
app.delete("/peliculas/delete", async (req, res) => {
  const { valor } = req.body;
  if (!valor) {
    return res.status(400).json({ message: "Falta 'valor' para eliminar." });
  }

  try {
    let query = "";
    let params = [];

    if (!isNaN(Number(valor))) {
      // es ID
      query = "DELETE FROM pelicula WHERE id = $1 RETURNING *";
      params = [Number(valor)];
    } else {
      // es un nombre
      query = "DELETE FROM pelicula WHERE LOWER(nombre) = LOWER($1) RETURNING *";
      params = [valor];
    }

    const result = await pool.query(query, params);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró la película para eliminar." });
    }

    res.json({ message: "Película eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar pelicula:", error);
    res.status(500).json({ message: "Error al eliminar pelicula" });
  }
});

/**
 * EDITAR PERFIL (username, password, foto_perfil)
 */
app.put("/api/users/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  const { newUsername, newPassword, newPhoto } = req.body;

  // Revisa si no se indicó ningún cambio
  if (!newUsername && !newPassword && !newPhoto) {
    return res
      .status(400)
      .json({ message: "No se indicó ningún cambio en el perfil." });
  }

  try {
    // Ver si existe
    const checkUser = await pool.query(
      "SELECT * FROM usuario WHERE id_usuario = $1",
      [id_usuario]
    );
    if (checkUser.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No existe el usuario a actualizar." });
    }

    let updateQuery = "UPDATE usuario SET ";
    const updates = [];
    const params = [];
    let index = 1;

    if (newUsername) {
      updates.push(`username = $${index++}`);
      params.push(newUsername);
    }
    if (newPassword) {
      updates.push(`password = $${index++}`);
      params.push(newPassword);
    }
    if (newPhoto) {
      updates.push(`foto_perfil = $${index++}`);
      params.push(newPhoto);
    }

    updateQuery += updates.join(", ");
    updateQuery += ` WHERE id_usuario = $${index} RETURNING *`;
    params.push(id_usuario);

    const result = await pool.query(updateQuery, params);
    return res.json({ message: "Perfil actualizado", user: result.rows[0] });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
});
