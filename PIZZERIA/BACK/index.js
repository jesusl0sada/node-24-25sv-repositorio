
// IMPORTACIÓN DE LIBRERIAS EMPLEADAS EN EL NODE. 
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db.js");
const app = express();

// ENDPOINTS

app.get("/peliculas", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM peliculas");
      res.json(result.rows);
    } catch (error) {
      console.error("Error al obtener películas:", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  });

  // BUSCAR POR EL GENERO QUE ME DIGAN

  app.get/("/genero/:nombre", async (req,res) =>{
    // PARAMS: Con 2 PUNTOS
    const param1 = req.params.nombre;
    try{
        const consulta = 
            `SELECT * FROM PELICULAS p 
            INNER JOIN GENERO g
            ON p.genero_id = g.id
            WHERE UPPER(g.titulo) 'LIKE %$1%'
            `;
            const endSql = " '% " + param1 + " %' "  // SI EL PARAMETRO NO COINCIDE ENTONCES EL GENERO NO EXISTE ENTONCES CREAMOS OTRA CONSTANTE
            const result = await pool.query(consulta, [endSql]);  // LE PEGARÁ LA CONSULTA Y LO QUE METE EL USUARIO - > ES ENDSQL. 
        res.json(result.rows);
    }catch (error) {
        console.error("Error al obtener géneros:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
  })
  
