/**
 * Función MODELO para cargar películas según el género
 * @param {string} genero - Género de las películas (ejemplo: 'drama', 'suspense', etc.) // -> este será el parámetro que dependerá del valor. 
 */

/* -------------------------------------------------------------------------   FUNCIÓN POKEMONS ------------------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/**
 * Función para cargar una lista de Pokémon desde la API de Pokémon
 */


function cargarPokemons() {
    // Endpoint de la API de Pokémon para obtener la lista
    const urlObtenerListaPokemon = 'https://pokeapi.co/api/v2/pokemon/';

    // Hacemos la solicitud a la API de Pokémon
    fetch(urlObtenerListaPokemon)
        .then(res => res.json()) // Convertimos la respuesta en formato JSON
        .then(data => {
            // Obtenemos la lista de Pokémon de la respuesta
            const listaPokemon = data.results;

            // Seleccionamos el contenedor específico donde se mostrará la lista de Pokémon
            const pokemonContainer = document.querySelector('.lista-pokemon');
            if (!pokemonContainer) {
                console.error('No se encontró el contenedor con la clase "lista-pokemon"');
                return;
            }

            // Limpiamos el contenido previo del contenedor (por si ya había Pokémon listados)
            pokemonContainer.innerHTML = '';

            // Recorremos la lista de Pokémon y creamos elementos para cada uno
            listaPokemon.forEach(pokemon => {
                // Creamos un elemento <div> para representar al Pokémon
                const pokemonElement = document.createElement('div');
                pokemonElement.className = 'pokemon-item'; // Clase para aplicar estilos a cada Pokémon
                pokemonElement.textContent = pokemon.name; // Asignamos el nombre del Pokémon al texto del elemento
                pokemonContainer.appendChild(pokemonElement); // Agregamos el elemento al contenedor principal
            });
<<<<<<< HEAD
    }


    function cargarPeliculasGenero(genero) {
        const endpoint = `http://127.0.0.1:3000/peliculas/${genero}`;
    
        fetch(endpoint)
            .then(res => res.json()) // Convierte la respuesta en JSON
            .then(peliculas => {
                // Selecciona el contenedor principal de la sección
                const contenedor = document.getElementById(genero);
                if (!contenedor) {
                    console.error(`No se encontró el contenedor con ID "${genero}"`);
                    return;
                }
    
                // Selecciona solo la parte donde se mostrarán las películas -> es decir va a la sección de HTML. 
                let listaPeliculas = contenedor.querySelector('.lista-peliculas');
                if (!listaPeliculas) {
                    // Si no existe el contenedor para las películas, lo creamos
                    listaPeliculas = document.createElement('div');
                    listaPeliculas.className = 'lista-peliculas';
                    contenedor.appendChild(listaPeliculas);
                }
    
                // Limpiamos solo la lista de películas, dejando el título intacto
                listaPeliculas.innerHTML = '';
    
                // Si no hay películas, mostramos un mensaje
                if (peliculas.length === 0) {
                    listaPeliculas.innerHTML = `<p>No hay películas disponibles para el género ${genero}.</p>`;
                    return;
                }
    
                // Añadimos las películas al contenedor de la lista
                peliculas.forEach(pelicula => {
                    const peliculaElemento = document.createElement('div');
                    peliculaElemento.className = 'pelicula-item';
                    peliculaElemento.textContent = `${pelicula.titulo} - ${pelicula.director} (${pelicula.anio})`;
                    listaPeliculas.appendChild(peliculaElemento);
                });
            })
            .catch(err => console.error(`Error al cargar películas del género "${genero}":`, err));
    }
    
    
    
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
=======
        })
        .catch(err => {
            // Capturamos y mostramos errores si ocurre alguno en la solicitud
            console.error('Error al cargar la lista de Pokémon:', err);
        });
}



/* -------------------------------------------------------------------------FUNCIÓN MODELO PELICULAS------------------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

function cargarPeliculasGenero(genero) {
    // Construimos el endpoint dinámico para el género específico
    const endpoint = `http://127.0.0.1:3000/peliculas/${genero}`; // -> EL ENDPOINT ES UNA CONSTANTE QUE TIENE UNA PARTE FIJA http://127.0.0.1:3000/peliculas -> Y UNA 
    // PARTE VARIABLE /${genero} -> esta es la parte que dependerá de lo el request, es decir a dónde quiera ir el usuario generaremos una respuesta yendo a un endpoint u 
    // otro -> luego le asociamos a cada botón la función para que lleve a cabo todo esto que esta sucediendo a continuación: 

    //console.log(`Cargando películas del género: ${genero} desde ${endpoint}`); // ESTO ES SIMPLEMENTE UN MENSAJE QUE SE DA EN LA CONSOLA, PERO PODRIA SOBRAR

    


    // TIRAMOS LA SOLICITUD AL ENDPOINT QUE HEMOS CREADO EN EL BACK , PARA ELLO TENEMOS QUE PONER FETCH (ENDPOINT)
     fetch(endpoint) // -> lo que decía, este endpoint está definido arriba , es una constante tiene una parte fija: http://127.0.0.1:3000/peliculas (en la variable)
     // y una parte que variará dependiendo de la request que tiremos en el servidor -> generando una respuesta u otra (activación de una función u otra y yendo a un   
     // endpoint ó a otro)
        .then(res => res.json()) // Convertimos la respuesta en JSON
        .then(peliculas => {
            console.log(`Películas obtenidas para el género ${genero}:`, peliculas); // esto es simplemente un mensaje que aparece en la consola. 

            // Seleccionamos el contenedor principal de la sección (según el ID del género) -> EL CUAL RECORREREMOS E IREMOS LLENANDO CON EL ARRAY DE LOS DATOS 
            // DE NUESTRA BASE DE DATOS. 
            const contenedor = document.getElementById(genero); // JS -> getElementByID para acceder a un elemento HTML CSS -> # Para acceder. 
            if (!contenedor) {
                console.error(`No se encontró el contenedor con ID "${genero}"`);
                return;
            }

            // Buscamos el contenedor específico para la lista de películas
            let listaPeliculas = contenedor.querySelector('.lista-peliculas');
            if (!listaPeliculas) {
                // Si no existe, creamos el contenedor
                listaPeliculas = document.createElement('div');
                listaPeliculas.className = 'lista-peliculas';
                contenedor.appendChild(listaPeliculas);
            }

            // Limpiamos la lista de películas antes de añadir nuevas
            listaPeliculas.innerHTML = ''; // ESTO LO UNICO QUE HACE ES VACIAR EL HTML ANTES DE LLENARLO CON LAS PELICULAS 

            // Si no hay películas disponibles, mostramos un mensaje -> ESTO PODRÍA SOBRAR PERO TE VACÍA EL HTML Y TE PONE QUE NO HAY PELÍCULAS
            // ES ALGO QUE NO PASARÁ SIEMPRE YA QUE HABRÁN PELÍCULAS LA MAYORÍA DEL TIEMPO. 
            if (peliculas.length === 0) {
                listaPeliculas.innerHTML = `<p>No hay películas disponibles para el género ${genero}.</p>`; 
                return;
            }

            // Recorremos las películas y las añadimos al contenedor de la lista -> aquí lo que estamos haciendo es acceder al contenedor
            // Itera (recorre) el array peliculas que contiene todas las películas obtenidas del backend
            // Crea dinámicamente un nuevo elemento HTML <div> para cada película dentro del contenedor -> pues, cada contenedor tiene elementos. 
            // luego encima le asigna una clase / id CSS para que pueda ser estilizado el elemento ; no ya solo el contenedor , aunque eso se puede hacer a mano también. 

            alert(`CARGANDO PELICULAS DEL GÉNERO: ${genero}`); // yo en este caso pondré una alerta: 
            
            peliculas.forEach(pelicula => {
                const peliculaElemento = document.createElement('div');
                peliculaElemento.className = 'pelicula-item'; // Clase para aplicar estilos
                peliculaElemento.textContent = `${pelicula.titulo} - ${pelicula.director} (${pelicula.anio})`;
                listaPeliculas.appendChild(peliculaElemento); // Agregamos la película a la lista
            });
        })
        .catch(err => {
            // Mostramos cualquier error que ocurra en la consola -> 
            console.error(`Error al cargar películas del género "${genero}":`, err);
        });
}

/* ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
>>>>>>> 4393487e49c93f5763108d7454a964b7744b0e14

    function cargarPeliculasDrama() {
        cargarPeliculasGenero('drama');
    }
    
    function cargarPeliculasSuspense() {
        cargarPeliculasGenero('suspense');
    }
    
    function cargarPeliculasCrimen() {
        cargarPeliculasGenero('crimen');
    }
    
    function cargarPeliculasCienciaficcion() {
        cargarPeliculasGenero('cienciaficcion');
    }
    
    function cargarPeliculasTerror() {
        cargarPeliculasGenero('terror');
    }
    
    
    
       

/**
 * Funciones específicas para cargar cada género.
 * Estas funciones llaman a `cargarPeliculasGenero` con el género correspondiente.
 * EMPLEAN LA FUNCIÓN MODELO cargarPeliculas$genero. -> que ya vemos que es una función dinámica pues no tiene cosas fijas 
 * unicamente el inicio del endpoint pero el final varia dependiendo de la request. 
 */

// Función para cargar películas de Drama
function cargarPeliculasDrama() {
    cargarPeliculasGenero('drama');
}

// Función para cargar películas de Suspense
function cargarPeliculasSuspense() {
    cargarPeliculasGenero('suspense');
}

// Función para cargar películas de Crimen
function cargarPeliculasCrimen() {
    cargarPeliculasGenero('crimen');
}

// Función para cargar películas de Ciencia Ficción
function cargarPeliculasCienciaficcion() {
    cargarPeliculasGenero('cienciaficcion');
}

// Función para cargar películas de Terror
function cargarPeliculasTerror() {
    cargarPeliculasGenero('terror');
}
