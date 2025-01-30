const API_URL = "http://127.0.0.1:3000";

const GET_PELICULAS = API_URL + "/peliculas";
const GET_PELICULAS_BY_GENERO = API_URL + ""
const GET_PELICULAS_FAVORITAS = API_URL + ""
const INSERT_PELICULAS = API_URL + "/peliculas/agregar";



function getPeliculas(){

    /* --------MODELO A SEGUIR A LA HORA DE CREAR FUNCIONES------------
    alert("CARGANDO PELÍCULAS...")
    fetch
    .then()
    .then()
    .catch()
    
    */

    alert("CARGANDO PELÍCULAS...")
    fetch(GET_PELICULAS) // ENDPOINT INYECTADO: http://localhost:3000/peliculas --
    .then(response => response.json()) // TRADUCIMOS LA RESPUESTA A 
    .then(
        (data) => { // LET DEFINIR UNA VARIABLE QUE EXISTE EN LA BASE DE DATOS A NIVEL LOCAL 
            let idPelicula = data[0].id; 
            let tituloPelicula = data[0].titulo;
            let descripcionPelicula = data[0].descripcion;
            let anioPelicula = data[0].anio;
        }
    )
    .catch();
}
