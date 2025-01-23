	// FRONT
    let urlObtenerListaPokemon = 'https://pokeapi.co/api/v2/pokemon/';

    function cargarPokemons() {
        // Llamamos a la API de Pokémon con Fetch
        fetch(urlObtenerListaPokemon) // La URL está definida previamente
            .then(res => res.json())
            .then(res => {
                let listaPokemon = res.results;
    
                // Selecciona el contenedor donde se mostrará la lista
                const pokemonContainer = document.getElementById('pokemons');
                pokemonContainer.innerHTML = ''; // Limpia contenido previo
    
                // Recorre la lista de Pokémon y crea elementos para mostrarlos
                listaPokemon.forEach(pokemon => {
                    const pokemonElement = document.createElement('div');
                    pokemonElement.className = 'pokemon-list'; // Clase para estilizar con CSS
                    pokemonElement.textContent = pokemon.name; // Agrega el nombre del Pokémon
                    pokemonContainer.appendChild(pokemonElement); // Añade al contenedor
                });
            });
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
    
    
    
       

 
    