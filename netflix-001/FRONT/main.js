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
    

        function cargarPeliculasDrama(){
            fetch("http://127.0.0.1:3000/peliculas") // ENDPOINT PELICULAS DE DRAMA EN EL BACK Y LUEGO MODIFICAR PARA QUE LO IMPRIMA EN LA CONSOLA Y PONER LOS BOTONES EN EL HTML
                .then(res=>res.json())
                .then(res=>{
                    console.log(res);
                });
        }

        function cargarPeliculasSuspense(){
            fetch("http://127.0.0.1:3000/peliculas") // ENDPOINT PELICULAS DE SUSPENSE EN EL BACK Y LUEGO MODIFICAR PARA QUE LO IMPRIMA EN LA CONSOLA Y PONER LOS BOTONES EN EL HTML.
                .then(res=>res.json())
                .then(res=>{
                    console.log(res);
                });
        }

        function cargarPeliculasCrimen(){
            fetch("http://127.0.0.1:3000/peliculas") // ENDPOINT PELICULAS DE CRIMEN EN EL BACK Y LUEGO MODIFICAR PARA QUE LO IMPRIMA EN LA CONSOLA Y PONER LOS BOTONES EN EL HTML.
                .then(res=>res.json())
                .then(res=>{
                    console.log(res);
                });
        }

        function cargarPeliculasCienciaFiccion(){
            fetch("http://127.0.0.1:3000/peliculas") // ENDPOINT DE PELICULAS DE CIENCIAFICCION EN EL BACK Y LUEGO MODIFICAR PARA QUE LO IMPRIMA EN LA CONSOLA Y PONER LOS BOTONES EN EL HTML.
                .then(res=>res.json())
                .then(res=>{
                    console.log(res);
                });
        }

        function cargarPeliculasTerror(){
            fetch("http://127.0.0.1:3000/peliculas") // ENDPOINT DE PELICULAS DE TERROR EN EL BACK Y LUEGO MODIFICAR PARA QUE LO IMPRIMA EN LA CONSOLA Y PONER LOS BOTONES EN EL HTML.
                .then(res=>res.json())
                .then(res=>{
                    console.log(res);
                });
        }


 
    