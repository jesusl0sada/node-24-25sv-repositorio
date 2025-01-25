/* ------------------------------------------------------------------------ */
/* ------------------------- FUNCIÓN: POKÉMON ----------------------------- */
/* ------------------------------------------------------------------------ */

/**
 * Función para cargar una lista de Pokémon desde la API de Pokémon
 */
function cargarPokemons() {
    // URL del endpoint de la API de Pokémon
    const urlObtenerListaPokemon = 'https://pokeapi.co/api/v2/pokemon/';

    // Realizamos la solicitud a la API
    fetch(urlObtenerListaPokemon)
        .then(res => res.json()) // Convertimos la respuesta en JSON
        .then(data => {
            // Obtenemos la lista de Pokémon desde la respuesta
            const listaPokemon = data.results;

            // Seleccionamos el contenedor donde se mostrarán los Pokémon
            const pokemonContainer = document.querySelector('.lista-pokemon');
            if (!pokemonContainer) {
                console.error('No se encontró el contenedor con la clase "lista-pokemon"');
                return;
            }

            // Limpiamos el contenido previo del contenedor
            pokemonContainer.innerHTML = '';

            // Recorremos la lista y añadimos los Pokémon al contenedor
            listaPokemon.forEach(pokemon => {
                const pokemonElement = document.createElement('div');
                pokemonElement.className = 'pokemon-item'; // Clase para aplicar estilos
                pokemonElement.textContent = pokemon.name; // Nombre del Pokémon
                pokemonContainer.appendChild(pokemonElement); // Añadimos al DOM
            });
        })
        .catch(err => {
            console.error('Error al cargar la lista de Pokémon:', err);
        });
}

/* ------------------------------------------------------------------------ */
/* ------------------------ FUNCIÓN: PELÍCULAS ---------------------------- */
/* ------------------------------------------------------------------------ */

/* IMPORTANTE: LO QUE HEMOS HECHO TAMBIÉN EN LA FUNCIÓN MODELO ES PONER UN IDENTIFICADOR DINÁMICO DEL CONTENEDOR HTML DEPENDIENDO DEL CONTENEDOR QUE TENGA    
ASOCIADO CADA GÉNERO PARA IR ALLÍ 

POR EJEMPLO: SI QUEREMOS VER LAS PELÍCULAS DEL GÉNERO DRAMA ; ENTONCES TENDRÁMOS QUE IR A http://127.0.0.1:3000/peliculas/drama ESE DRAMA ES EL FINAL DEL 
ENDPOINT ${genero} -> ENTONCES CAMBIARÍA EL ENDPOINT AL QUE VAMOS Y TAMBIÉN CAMBIARÍA EL CONTENEDOR HTML -> YENDO A UN CONTENEDOR QUE SE LLAME genero: 
*/
    /* AQUÍ LO QUE ESTAMOS HACIENDO ES CREAR UNA FUNCIÓN QUE VARIARÁ DEPENDIENDO DEL GÉNERO QUE ESTAMOS 
    BUSCANDO EN LA API, PARA LUEGO MOSTRARLOS EN EL HTML POR ESO TENEMOS UNA VARIABLE QUE ES ${genero}, EN LA QUE PUEDE IR CUALQUIER COSA, Y IRÁ HACIENDO REFERENCIA A 
    CADA ENDPOINT, PUES:
    EL ENDPOINT MODELO ES: http://127.0.0.1:3000/peliculas/${genero} -> ESTE GÉNERO LO HEMOS DEJADO DEFINIDO PREVIAMENTE, YENDO A LOS ENDPOINTS DEPENDIENDO DEL GÉNERO. 
    ASÍ EN EL BACK:
    app.get("/peliculas/drama
    app.get("/peliculas/crimen
    app.get("/peliculas/suspense
    app.get("/peliculas/cienciaficcion
    app.get("/peliculas/terror
    TAMBIÉN SE PODRÍA HACER UN ENDPOINT MODELO ASÍ COMO ESTA FUNCIÓN MODELO QUE ACUDE A UN ENDPOINT U OTRO DEPENDIENDO DEL GÉNERO QUE QUERAMOS BUSCAR.
    */

// FUNCIONES MUCHO MÁS OPTIMIZADAS QUE USAN UNA FUNCIÓN MODELO PERO SOLO CAMBIAN EL PARÁMETRO DE ENTRADA (genero) QUE LUEGO MODIFICAN EL ENDPOINT PUES ESTÁ CONSUMIENDO
// UN ENDPOINT DEL BACKEND QUE ES DIFERENTE SEGÚN EL GÉNERO QUE QUERAMOS BUSCAR. : 

/**
 * Función modelo para cargar películas desde un backend según el género
 * @param {string} genero - Género de las películas (ejemplo: 'drama', 'suspense', etc.)
 */
function cargarPeliculasGenero(genero) {
    // Construimos el endpoint dinámico basado en el género
    const endpoint = `http://127.0.0.1:3000/peliculas/${genero}`;

    // Realizamos la solicitud al backend
    fetch(endpoint)
        .then(res => res.json()) // Convertimos la respuesta a JSON
        .then(peliculas => {
            // Seleccionamos el contenedor principal basado en el ID
            const contenedor = document.getElementById(genero);
            if (!contenedor) {
                console.error(`No se encontró el contenedor con ID "${genero}"`);
                return;
            }

            // Seleccionamos o creamos el contenedor para la lista de películas
            let listaPeliculas = contenedor.querySelector('.lista-peliculas');
            if (!listaPeliculas) {
                listaPeliculas = document.createElement('div');
                listaPeliculas.className = 'lista-peliculas';
                contenedor.appendChild(listaPeliculas);
            }

            // Limpiamos el contenido previo
            listaPeliculas.innerHTML = '';

            // Si no hay películas, mostramos un mensaje
            if (peliculas.length === 0) {
                listaPeliculas.innerHTML = `<p>No hay películas disponibles para el género ${genero}.</p>`;
                return;
            }

            // Añadimos las películas al contenedor
            peliculas.forEach(pelicula => {
                const peliculaElemento = document.createElement('div');
                peliculaElemento.className = 'pelicula-item'; // Clase para estilos
                peliculaElemento.textContent = `${pelicula.titulo} - ${pelicula.director} (${pelicula.anio})`;
                listaPeliculas.appendChild(peliculaElemento);
            });
        })
        .catch(err => {
            console.error(`Error al cargar películas del género "${genero}":`, err);
        });
}

/**
 * Funciones específicas para cargar cada género.
 * Estas funciones llaman a `cargarPeliculasGenero` con el género correspondiente.
 * EMPLEAN LA FUNCIÓN MODELO cargarPeliculas$genero. -> que ya vemos que es una función dinámica pues no tiene cosas fijas 
 * unicamente el inicio del endpoint pero el final varia dependiendo de la request. 
 */

function cargarPeliculasDrama() { cargarPeliculasGenero('drama'); }
function cargarPeliculasSuspense() { cargarPeliculasGenero('suspense'); }
function cargarPeliculasCrimen() { cargarPeliculasGenero('crimen'); }
function cargarPeliculasCienciaficcion() { cargarPeliculasGenero('cienciaficcion'); }
function cargarPeliculasTerror() { cargarPeliculasGenero('terror'); }
