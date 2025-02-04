/*****************************************************
 *         URL de tu API 
 *****************************************************/
const BASE_URL = "http://localhost:3000";

/*****************************************************
 *    Variables globales para el Hero (carrusel)
 *****************************************************/
let heroPeliculas = [];
let heroIndex = 0;
let heroInterval = null;

/*****************************************************
 *    Variables para el carrusel de Sagas
 *****************************************************/
let currentSlide = 0; // índice de la "primera" saga visible
const visibleCards = 5; // cuántas tarjetas se muestran a la vez

/*****************************************************
 * Evento principal: al cargar el DOM
 *****************************************************/
window.addEventListener("DOMContentLoaded", () => {
  // 1) Configurar la barra de búsqueda
  setupSearchBar();

  // 2) Configurar botones de la navbar
  setupNavbarButtons();

  // 3) Cargar géneros (para el dropdown)
  fetchGeneros();

  // 4) Cargar las sagas (logos) -> se renderiza como carrusel
  fetchSagas();

  // 5) Cargar películas para el Hero
  fetchHeroPeliculas();

  // 6) Cargar películas recomendadas
  fetchPeliculasRecomendadas();

  // 7) Flechas del Hero
  const heroPrev = document.getElementById("heroPrev");
  const heroNext = document.getElementById("heroNext");
  heroPrev.addEventListener("click", () => moveHeroSlide(-1));
  heroNext.addEventListener("click", () => moveHeroSlide(1));

  // 8) Configurar login (si procede)
  setupUserLogin();

  // 9) Configurar flechas del carrusel de sagas
  setupBrandsCarouselArrows();
});

/*****************************************************
 *         1) BARRA DE BÚSQUEDA
 *****************************************************/
function setupSearchBar() {
  const searchIcon = document.getElementById("searchIcon");
  const searchBar = document.getElementById("searchBar");
  const searchButton = document.getElementById("searchButton");
  const searchInput = document.getElementById("searchInput");

  let searchBarVisible = false;
  
  searchIcon.addEventListener("click", () => {
    searchBarVisible = !searchBarVisible;
    searchBar.style.display = searchBarVisible ? "flex" : "none";
  });

  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
      fetchPeliculasByNombre(query);
    }
  });
}

/*****************************************************
 *         2) BOTONES DE LA NAVBAR
 *****************************************************/
function setupNavbarButtons() {
  const allMoviesBtn = document.getElementById("allMoviesBtn");
  allMoviesBtn.addEventListener("click", () => {
    fetchPeliculasRecomendadas(); // Muestra todas
  });

  const genreButton = document.getElementById("genreButton");
  const genreDropdownContent = document.getElementById("genreDropdownContent");
  genreButton.addEventListener("click", () => {
    genreDropdownContent.style.display =
      genreDropdownContent.style.display === "block" ? "none" : "block";
  });
}

/*****************************************************
 *         3) GÉNEROS (Dropdown)
 *****************************************************/
async function fetchGeneros() {
  try {
    const response = await fetch(`${BASE_URL}/generos`);
    const generos = await response.json();
    renderGeneroDropdown(generos);
  } catch (error) {
    console.error("Error al obtener géneros:", error);
  }
}

function renderGeneroDropdown(generos) {
  const genreDropdownContent = document.getElementById("genreDropdownContent");
  genreDropdownContent.innerHTML = "";

  generos.forEach((gen) => {
    const btn = document.createElement("button");
    btn.textContent = gen.nombre;
    btn.addEventListener("click", () => {
      // Al hacer click, filtra por ese género
      fetchPeliculasByGenero(gen.nombre);
      genreDropdownContent.style.display = "none";
    });
    genreDropdownContent.appendChild(btn);
  });
}

/*****************************************************
 *         4) SAGAS (logos) -> se mostrará en carrusel
 *****************************************************/
async function fetchSagas() {
  try {
    const response = await fetch(`${BASE_URL}/sagas`);
    const sagas = await response.json();
    renderSagas(sagas);
  } catch (error) {
    console.error("Error al obtener sagas:", error);
  }
}

function renderSagas(sagas) {
  // En lugar de usar brandsContainer, usamos #brandsTrack
  const brandsTrack = document.getElementById("brandsTrack");
  brandsTrack.innerHTML = "";

  // Mapeo entre el nombre de la saga y el archivo PNG local
  const sagaLogos = {
    "Toy Story": "logo-toystory-removebg-preview.png",
    "Piratas del Caribe": "logo-piratasdelcaribe-removebg-preview.png",
    "Star Wars": "logo-starwars-removebg-preview.png",
    "Marvel": "logo-marvel-removebg-preview.png",
    "Frozen": "logo-frozen-removebg-preview.png",
    "El Rey León": "logo-elreyleon-removebg-preview.png",
    "Cars": "logo-cars-removebg-preview.png",
    "Harry Potter": "logo-harrypotter-removebg-preview.png",
    "Avatar": "logo-avatar-removebg-preview.png",
    "Enredados": "logo-enredados-removebg-preview.png",
    "Zootopia": "logo-zootopia-removebg-preview.png"
  };

  sagas.forEach((saga) => {
    const brandCard = document.createElement("div");
    brandCard.classList.add("brand-card");

    // Si existe el logo en sagaLogos, usarlo; si no, placeholder
    const localFile = sagaLogos[saga.nombre]
      ? sagaLogos[saga.nombre]
      : "https://via.placeholder.com/200x100?text=SIN+LOGO";

    const img = document.createElement("img");
    img.src = localFile;
    img.alt = saga.nombre || "Saga";

    // Al pulsar, filtra películas por saga
    brandCard.addEventListener("click", () => {
      fetchPeliculasBySaga(saga.nombre);
    });

    brandCard.appendChild(img);
    brandsTrack.appendChild(brandCard);
  });
}

/*
  Función que registra las flechas del carrusel 
  y define cómo se mueve la "pista" (#brandsTrack).
*/
function setupBrandsCarouselArrows() {
  const brandsTrack = document.getElementById("brandsTrack");
  const brandsPrev = document.getElementById("brandsPrev");
  const brandsNext = document.getElementById("brandsNext");

  brandsPrev.addEventListener("click", () => moveBrandsCarousel(-1));
  brandsNext.addEventListener("click", () => moveBrandsCarousel(1));

  // Si quieres ajustar el tamaño dinámicamente, puedes hacerlo al renderizar
}

/*
  Mueve el carrusel (brandsTrack) a izquierda/derecha, de modo que
  se vean 5 tarjetas cada vez.

  - direction = +1 (pasar a la "siguiente" vista)
                -1 (pasar a la "anterior" vista)
*/
function moveBrandsCarousel(direction) {
  const brandsTrack = document.getElementById("brandsTrack");
  const totalCards = brandsTrack.querySelectorAll(".brand-card").length;

  // Calculamos el nuevo índice de la primera tarjeta visible
  currentSlide += direction;

  // Límite mínimo (no pasamos de la primera)
  if (currentSlide < 0) {
    currentSlide = 0;
  }
  // Límite máximo (que no se pase del total - visible)
  if (currentSlide > totalCards - visibleCards) {
    currentSlide = totalCards - visibleCards;
  }

  // Ancho aproximado de cada .brand-card (con gap).
  // Ajusta si tu gap cambia, o mídelo dinámicamente con offsetWidth.
  const cardWidth = 180;      // .brand-card width
  const gap = 32;            // 2rem ~ 32px (depende de font-size)
  const itemFullWidth = cardWidth + gap; 

  // Desplazamos la pista
  const distance = currentSlide * itemFullWidth;
  brandsTrack.style.transform = `translateX(-${distance}px)`;
}

/*****************************************************
 *         5) HERO (CARRUSEL)
 *****************************************************/
async function fetchHeroPeliculas() {
  try {
    const response = await fetch(`${BASE_URL}/peliculas`);
    const peliculas = await response.json();

    // Tomamos las primeras 6 como "destacadas"
    heroPeliculas = peliculas.slice(0, 6);

    renderHeroSlide(heroIndex);

    // Auto-rotación cada 4s
    if (heroInterval) clearInterval(heroInterval);
    heroInterval = setInterval(() => {
      moveHeroSlide(1);
    }, 4000);
  } catch (error) {
    console.error("Error al obtener heroPeliculas:", error);
  }
}

function renderHeroSlide(index) {
  const heroSlide = document.getElementById("heroSlide");
  if (!heroPeliculas.length) {
    heroSlide.style.backgroundImage = "none";
    heroSlide.innerHTML = `
      <div class="hero-content">
        <h1>Sin datos</h1>
        <p>No hay películas destacadas</p>
      </div>
    `;
    return;
  }
  if (index < 0) heroIndex = heroPeliculas.length - 1;
  if (index >= heroPeliculas.length) heroIndex = 0;

  const peli = heroPeliculas[heroIndex];
  heroSlide.style.backgroundImage = `url(${peli.banner || "https://via.placeholder.com/1280x720"})`;

  heroSlide.innerHTML = `
    <div class="hero-content">
      <h1>${peli.nombre || "Sin nombre"}</h1>
      <p>${peli.director ? "Director: " + peli.director : ""}</p>
      <p>${peli.año ? "Año: " + peli.año : ""}</p>
    </div>
  `;
}

function moveHeroSlide(direction) {
  heroIndex += direction;
  renderHeroSlide(heroIndex);
}

/*****************************************************
 *         6) RECOMENDACIONES (PELÍCULAS)
 *****************************************************/
async function fetchPeliculasRecomendadas() {
  try {
    const response = await fetch(`${BASE_URL}/peliculas`);
    const peliculas = await response.json();
    renderPeliculasRecomendadas(peliculas);
  } catch (error) {
    console.error("Error al obtener películas:", error);
  }
}

function renderPeliculasRecomendadas(peliculas) {
  const movieContainer = document.getElementById("movieContainer");
  movieContainer.innerHTML = "";

  peliculas.forEach((p) => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    const poster = document.createElement("img");
    poster.src = p.imagen || "https://via.placeholder.com/300x450?text=Sin+Poster";
    poster.alt = p.nombre || "Poster";

    const details = document.createElement("div");
    details.classList.add("movie-details");
    details.innerHTML = `
      <h4>${p.nombre || "Sin nombre"}</h4>
      <p>${p.director ? "Director: " + p.director : ""}</p>
      <p>${p.año ? "Año: " + p.año : ""}</p>
      <p>${p.compañia ? "Compañía: " + p.compañia : ""}</p>
    `;

    card.appendChild(poster);
    card.appendChild(details);

    card.addEventListener("click", () => {
      showMovieDetail(p);
    });

    movieContainer.appendChild(card);
  });
}

/*****************************************************
 *         7) BÚSQUEDA Y FILTROS
 *****************************************************/
// Por nombre
async function fetchPeliculasByNombre(nombre) {
  try {
    const response = await fetch(`${BASE_URL}/peliculas?nombre=${nombre}`);
    const data = await response.json();
    renderPeliculasRecomendadas(data);
  } catch (error) {
    console.error("Error al buscar películas por nombre:", error);
  }
}

// Filtrar por saga
async function fetchPeliculasBySaga(sagaName) {
  try {
    const response = await fetch(`${BASE_URL}/sagas/${sagaName}`);
    const data = await response.json();
    renderPeliculasRecomendadas(data);
  } catch (error) {
    console.error(`Error al obtener películas de la saga ${sagaName}:`, error);
  }
}

// Filtrar por género
async function fetchPeliculasByGenero(genreName) {
  try {
    const response = await fetch(`${BASE_URL}/generos/${genreName}`);
    const data = await response.json();
    renderPeliculasRecomendadas(data);
  } catch (error) {
    console.error(`Error al obtener películas del género ${genreName}:`, error);
  }
}

/*****************************************************
 *         8) DETALLE (OPCIONAL)
 *****************************************************/
function showMovieDetail(pelicula) {
  const detailSection = document.getElementById("movieDetail");
  const detailTitle = document.getElementById("detailTitle");
  const detailDescription = document.getElementById("detailDescription");
  const detailYear = document.getElementById("detailYear");

  detailTitle.textContent = pelicula.nombre || "Sin nombre";
  detailDescription.textContent = pelicula.director
    ? `Director: ${pelicula.director}`
    : "Director no disponible";
  detailYear.textContent = pelicula.año ? `Año: ${pelicula.año}` : "";

  detailSection.style.display = "block";
}

/*****************************************************
 *         9) LOGIN MODAL (SI YA LO TENÍAS)
 *****************************************************/
function setupUserLogin() {
  const userIcon = document.getElementById("userIcon");
  const loginModal = document.getElementById("loginModal");
  const closeLoginModal = document.getElementById("closeLoginModal");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const loginButton = document.getElementById("loginButton");

  userIcon.addEventListener("click", () => {
    loginModal.style.display = "flex";
  });

  closeLoginModal.addEventListener("click", () => {
    loginModal.style.display = "none";
  });

  loginModal.addEventListener("click", (e) => {
    if (!e.target.closest(".login-modal-content")) {
      loginModal.style.display = "none";
    }
  });

  loginButton.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (email && password) {
      alert(`Iniciando sesión con:\nEmail: ${email}\nPassword: ${password}`);
      loginModal.style.display = "none";
      emailInput.value = "";
      passwordInput.value = "";
    } else {
      alert("Por favor, rellena correo y contraseña");
    }
  });
}
