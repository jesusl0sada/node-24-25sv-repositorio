/*****************************************************
 *         URL de tu API
 *****************************************************/
const BASE_URL = "http://localhost:3000";

/*****************************************************
 *    Variables globales
 *****************************************************/
// Para el Hero (carrusel) con fade
let heroPeliculas = [];
let heroIndex = 0;
let heroInterval = null;

// Para el carrusel de Sagas
let currentSlide = 0;
const visibleCards = 5;

// Para favoritos (desde el servidor)
let userFavorites = []; // Array con las películas favoritas del usuario

// Para el usuario logueado
let currentUser = null; // { id_usuario, username, rol, foto_perfil }

/*****************************************************
 * Evento principal: al cargar el DOM
 *****************************************************/
window.addEventListener("DOMContentLoaded", () => {
  // Revisar si hay un usuario guardado
  checkUserSession();

  // 1) Configurar la barra de búsqueda
  setupSearchBar();

  // 2) Botones de la navbar
  setupNavbarButtons();

  // 3) Cargar géneros
  fetchGeneros();

  // 4) Cargar sagas
  fetchSagas();

  // 5) Hero - Películas
  fetchHeroPeliculas();

  // 6) Películas recomendadas
  fetchPeliculasRecomendadas();

  // 7) Flechas del Hero
  document
    .getElementById("heroPrev")
    .addEventListener("click", () => moveHeroSlide(-1));
  document
    .getElementById("heroNext")
    .addEventListener("click", () => moveHeroSlide(1));

  // 8) Login, logout, registro
  setupAuthModals();

  // 9) Flechas del carrusel de sagas
  setupBrandsCarouselArrows();

  // 10) Botones admin ("Agregar Película", "Borrar Película")
  setupAdminButtons();

  // 11) Botón "Personalizar Perfil"
  setupProfileButton();

  // 12) Menú de perfil
  setupUserIconClick();
});

/*****************************************************
 *    1) BARRA DE BÚSQUEDA
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
 *    2) BOTONES DE LA NAVBAR
 *****************************************************/
function setupNavbarButtons() {
  document
    .getElementById("allMoviesBtn")
    .addEventListener("click", () => {
      fetchPeliculasRecomendadas();
    });

  const genreButton = document.getElementById("genreButton");
  const genreDropdownContent = document.getElementById("genreDropdownContent");
  genreButton.addEventListener("click", () => {
    genreDropdownContent.style.display =
      genreDropdownContent.style.display === "block" ? "none" : "block";
  });

  // Botón de favoritos
  document
    .getElementById("favoritesBtn")
    .addEventListener("click", () => {
      renderFavoriteMoviesServerSide();
    });
}

/*****************************************************
 *    3) GÉNEROS (Dropdown)
 *****************************************************/
async function fetchGeneros() {
  try {
    const response = await fetch(`${BASE_URL}/generos`);
    const generos = await response.json();
    renderGeneroDropdown(generos);
    // Para el select al agregar películas
    fillAddMovieGeneroSelect(generos);
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
      fetchPeliculasByGenero(gen.nombre);
      genreDropdownContent.style.display = "none";
    });
    genreDropdownContent.appendChild(btn);
  });
}

function fillAddMovieGeneroSelect(generos) {
  const selectGenero = document.getElementById("newMovieGenero");
  generos.forEach((g) => {
    const option = document.createElement("option");
    option.value = g.id;
    option.textContent = g.nombre;
    selectGenero.appendChild(option);
  });
}

/*****************************************************
 *    4) SAGAS (Logos)
 *****************************************************/
async function fetchSagas() {
  try {
    const response = await fetch(`${BASE_URL}/sagas`);
    const sagas = await response.json();
    renderSagas(sagas);
    fillAddMovieSagaSelect(sagas);
  } catch (error) {
    console.error("Error al obtener sagas:", error);
  }
}

function renderSagas(sagas) {
  const brandsTrack = document.getElementById("brandsTrack");
  brandsTrack.innerHTML = "";

  // Ejemplo de logos
  const sagaLogos = {
    "Toy Story": "logo-toystory-removebg-preview.png",
    "Piratas del Caribe": "logo-piratasdelcaribe-removebg-preview.png",
    "Star Wars": "logo-starwars-removebg-preview.png",
    Marvel: "logo-marvel-removebg-preview.png",
    Frozen: "logo-frozen-removebg-preview.png",
    "El Rey León": "logo-elreyleon-removebg-preview.png",
    Cars: "logo-cars-removebg-preview.png",
    "Harry Potter": "logo-harrypotter-removebg-preview.png",
    Avatar: "logo-avatar-removebg-preview.png",
    Enredados: "logo-enredados-removebg-preview.png",
    Zootopia: "logo-zootopia-removebg-preview.png",
  };

  sagas.forEach((saga) => {
    const brandCard = document.createElement("div");
    brandCard.classList.add("brand-card");

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

function fillAddMovieSagaSelect(sagas) {
  const selectSaga = document.getElementById("newMovieSaga");
  sagas.forEach((s) => {
    const option = document.createElement("option");
    option.value = s.id;
    option.textContent = s.nombre;
    selectSaga.appendChild(option);
  });
}

function setupBrandsCarouselArrows() {
  document
    .getElementById("brandsPrev")
    .addEventListener("click", () => moveBrandsCarousel(-1));
  document
    .getElementById("brandsNext")
    .addEventListener("click", () => moveBrandsCarousel(1));
}

function moveBrandsCarousel(direction) {
  const brandsTrack = document.getElementById("brandsTrack");
  const totalCards = brandsTrack.querySelectorAll(".brand-card").length;
  currentSlide += direction;

  if (currentSlide < 0) {
    currentSlide = 0;
  }
  if (currentSlide > totalCards - visibleCards) {
    currentSlide = totalCards - visibleCards;
  }

  const cardWidth = 180;
  const gap = 32;
  const itemFullWidth = cardWidth + gap;
  const distance = currentSlide * itemFullWidth;
  brandsTrack.style.transform = `translateX(-${distance}px)`;
}

/*****************************************************
 *    5) HERO (carrusel) con fade
 *****************************************************/
async function fetchHeroPeliculas() {
  try {
    const response = await fetch(`${BASE_URL}/peliculas`);
    const peliculas = await response.json();
    heroPeliculas = peliculas.slice(0, 6);
    renderHeroSlide(heroIndex);

    // Auto-rotación
    if (heroInterval) clearInterval(heroInterval);
    heroInterval = setInterval(() => {
      moveHeroSlide(1);
    }, 5000);
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
      </div>`;
    return;
  }

  if (index < 0) heroIndex = heroPeliculas.length - 1;
  if (index >= heroPeliculas.length) heroIndex = 0;

  // Aplica un fade: poner heroSlide con baja opacidad, cambiar el background y restaurar opacidad
  heroSlide.style.opacity = 0;

  setTimeout(() => {
    const peli = heroPeliculas[heroIndex];
    heroSlide.style.backgroundImage = `url(${
      peli.imagen || "https://via.placeholder.com/1280x720"
    })`;

    heroSlide.innerHTML = `
      <div class="hero-content">
        <h1>${peli.nombre || "Sin nombre"}</h1>
        <p>${peli.director ? "Director: " + peli.director : ""}</p>
        <p>${peli.año ? "Año: " + peli.año : ""}</p>
      </div>
    `;
    heroSlide.style.opacity = 1;
  }, 300);
}

function moveHeroSlide(direction) {
  heroIndex += direction;
  renderHeroSlide(heroIndex);
}

/*****************************************************
 *    6) RECOMENDACIONES (PELÍCULAS)
 *****************************************************/
async function fetchPeliculasRecomendadas() {
  try {
    const response = await fetch(`${BASE_URL}/peliculas`);
    const peliculas = await response.json();
    renderPeliculas(peliculas);
  } catch (error) {
    console.error("Error al obtener películas recomendadas:", error);
  }
}

function renderPeliculas(peliculas) {
  const container = document.getElementById("movieContainer");
  container.innerHTML = "";

  peliculas.forEach((p) => {
    const card = createMovieCard(p);
    container.appendChild(card);
  });
}

/*****************************************************
 *    7) BÚSQUEDA Y FILTROS
 *****************************************************/
async function fetchPeliculasByNombre(nombre) {
  try {
    const resp = await fetch(`${BASE_URL}/peliculas?nombre=${nombre}`);
    const data = await resp.json();
    renderPeliculas(data);
  } catch (error) {
    console.error("Error al buscar películas por nombre:", error);
  }
}

async function fetchPeliculasBySaga(sagaName) {
  try {
    const resp = await fetch(`${BASE_URL}/sagas/${sagaName}`);
    const data = await resp.json();
    renderPeliculas(data);
  } catch (error) {
    console.error(`Error al obtener películas de la saga ${sagaName}:`, error);
  }
}

async function fetchPeliculasByGenero(genreName) {
  try {
    const resp = await fetch(`${BASE_URL}/generos/${genreName}`);
    const data = await resp.json();
    renderPeliculas(data);
  } catch (error) {
    console.error(`Error al obtener películas del género ${genreName}:`, error);
  }
}

/*****************************************************
 *    8) DETALLE (OPCIONAL)
 *****************************************************/
function showMovieDetail(p) {
  const detailSection = document.getElementById("movieDetail");
  const detailTitle = document.getElementById("detailTitle");
  const detailDescription = document.getElementById("detailDescription");
  const detailYear = document.getElementById("detailYear");

  detailTitle.textContent = p.nombre || "Sin nombre";
  detailDescription.textContent = p.director
    ? `Director: ${p.director}`
    : "Director no disponible";
  detailYear.textContent = p.año ? `Año: ${p.año}` : "";

  detailSection.style.display = "block";
}

/*****************************************************
 *    9) LOGIN / LOGOUT / REGISTRO
 *****************************************************/
function setupAuthModals() {
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");

  // Abrir registro
  document
    .getElementById("openRegisterModalLink")
    .addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.style.display = "none";
      registerModal.style.display = "flex";
    });

  // Login
  document
    .getElementById("loginButton")
    .addEventListener("click", loginRequest);

  // Cerrar login
  document
    .getElementById("closeLoginModal")
    .addEventListener("click", () => {
      loginModal.style.display = "none";
    });

  // Registrar
  document
    .getElementById("registerButton")
    .addEventListener("click", registerRequest);

  // Cerrar register
  document
    .getElementById("closeRegisterModal")
    .addEventListener("click", () => {
      registerModal.style.display = "none";
    });

  // Cerrar modal si clic fuera
  window.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      loginModal.style.display = "none";
    }
    if (event.target === registerModal) {
      registerModal.style.display = "none";
    }
  });
}

async function loginRequest() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const loginMessage = document.getElementById("loginMessage");

  if (!username || !password) {
    loginMessage.textContent = "Completa usuario y contraseña.";
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (response.ok) {
      currentUser = {
        id_usuario: data.id_usuario,
        username: data.username,
        rol: data.rol,
        foto_perfil: data.foto_perfil || null,
      };
      localStorage.setItem("user", JSON.stringify(currentUser));

      // Ocultar modal
      document.getElementById("loginModal").style.display = "none";
      document.getElementById("loginUsername").value = "";
      document.getElementById("loginPassword").value = "";
      loginMessage.textContent = "";

      updateUserUI();
      fetchUserFavorites();
      showAdminButtonsIfNeeded();
    } else {
      loginMessage.textContent = data.message || "Credenciales inválidas.";
    }
  } catch (error) {
    console.error("Error en login:", error);
    loginMessage.textContent = "Error de servidor.";
  }
}

async function registerRequest() {
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const photo = document.getElementById("registerPhoto").value.trim();

  const registerMessage = document.getElementById("registerMessage");
  registerMessage.textContent = "";

  if (!username || !password) {
    registerMessage.textContent = "Completa usuario y contraseña.";
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        foto_perfil: photo || null,
      }),
    });
    const data = await response.json();

    if (response.ok) {
      registerMessage.style.color = "lime";
      registerMessage.textContent =
        "Registro exitoso. Ahora inicia sesión.";
    } else {
      registerMessage.style.color = "red";
      registerMessage.textContent = data.message || "Error al registrar.";
    }
  } catch (error) {
    console.error("Error en register:", error);
    registerMessage.textContent = "Error de servidor.";
  }
}

function checkUserSession() {
  const stored = localStorage.getItem("user");
  if (stored) {
    currentUser = JSON.parse(stored);
    updateUserUI();
    fetchUserFavorites();
    showAdminButtonsIfNeeded();
  }
}

/*****************************************************
 *    10) FAVORITOS
 *****************************************************/
async function fetchUserFavorites() {
  if (!currentUser) return;
  try {
    const resp = await fetch(`${BASE_URL}/favoritos/${currentUser.id_usuario}`);
    userFavorites = await resp.json();
  } catch (err) {
    console.error("Error al obtener favoritos:", err);
  }
}

function renderFavoriteMoviesServerSide() {
  const container = document.getElementById("movieContainer");
  container.innerHTML = "";

  if (!currentUser) {
    container.innerHTML = "<p>Necesitas iniciar sesión para ver favoritos.</p>";
    return;
  }

  if (!userFavorites.length) {
    container.innerHTML = "<p>No tienes películas favoritas aún.</p>";
    return;
  }

  userFavorites.forEach((movie) => {
    const card = createMovieCard(movie);
    container.appendChild(card);
  });
}

async function toggleFavoriteServerSide(movie) {
  if (!currentUser) {
    alert("Inicia sesión para favoritos.");
    return;
  }

  const alreadyFav = userFavorites.some((fav) => fav.id === movie.id);
  if (alreadyFav) {
    // Eliminar
    try {
      await fetch(`${BASE_URL}/favoritos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: currentUser.id_usuario,
          id_pelicula: movie.id,
        }),
      });
      userFavorites = userFavorites.filter((f) => f.id !== movie.id);
    } catch (e) {
      console.error("Error al eliminar favorito:", e);
    }
  } else {
    // Agregar
    try {
      await fetch(`${BASE_URL}/favoritos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: currentUser.id_usuario,
          id_pelicula: movie.id,
        }),
      });
      userFavorites.push(movie);
    } catch (e) {
      console.error("Error al agregar favorito:", e);
    }
  }
  fetchPeliculasRecomendadas();
}

/*****************************************************
 *    CREAR MOVIE-CARD (Incluye favorito y trailer)
 *****************************************************/
function createMovieCard(p) {
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
  `;

  const favBtn = document.createElement("button");
  favBtn.classList.add("favorite-btn");
  const isFav = userFavorites.some((f) => f.id === p.id);
  favBtn.textContent = isFav ? "★" : "☆";
  favBtn.addEventListener("click", (ev) => {
    ev.stopPropagation();
    toggleFavoriteServerSide(p);
  });

  const playBtn = document.createElement("button");
  playBtn.classList.add("play-button");
  playBtn.textContent = "▶";
  playBtn.addEventListener("click", (ev) => {
    ev.stopPropagation();
    playTrailer(p.trailer);
  });

  card.appendChild(poster);
  card.appendChild(details);
  card.appendChild(favBtn);
  card.appendChild(playBtn);

  card.addEventListener("click", () => showMovieDetail(p));
  return card;
}

/*****************************************************
 *    TRÁILER
 *****************************************************/
function playTrailer(url) {
  if (!url) {
    alert("No hay tráiler disponible.");
    return;
  }
  const embed = url.replace("watch?v=", "embed/");
  const modal = document.getElementById("trailerModal");
  const iframe = document.getElementById("trailerIframe");

  iframe.src = `${embed}?autoplay=1&rel=0`;
  modal.style.display = "flex";

  document.getElementById("closeTrailer").addEventListener("click", () => {
    closeTrailer();
  });

  modal.addEventListener("click", (ev) => {
    if (ev.target === modal) {
      closeTrailer();
    }
  });
}

function closeTrailer() {
  const modal = document.getElementById("trailerModal");
  const iframe = document.getElementById("trailerIframe");
  modal.style.display = "none";
  iframe.src = "";
}

/*****************************************************
 *    ADMIN: AGREGAR, ELIMINAR PELÍCULAS
 *****************************************************/
function setupAdminButtons() {
  document
    .getElementById("closeAddMovieModal")
    .addEventListener("click", closeAddMovieModal);
  document
    .getElementById("saveMovieButton")
    .addEventListener("click", saveNewMovie);

  const addModal = document.getElementById("addMovieModal");
  window.addEventListener("click", (ev) => {
    if (ev.target === addModal) {
      closeAddMovieModal();
    }
  });

  document
    .getElementById("closeDeleteMovieModal")
    .addEventListener("click", closeDeleteMovieModal);
  document
    .getElementById("confirmDeleteMovieButton")
    .addEventListener("click", deleteMovie);

  const deleteModal = document.getElementById("deleteMovieModal");
  window.addEventListener("click", (ev) => {
    if (ev.target === deleteModal) {
      closeDeleteMovieModal();
    }
  });

  setupDeleteMovieFilter();
  showAdminButtonsIfNeeded();
}

function showAdminButtonsIfNeeded() {
  const existingAdd = document.getElementById("adminAddMovieBtn");
  const existingDel = document.getElementById("adminDeleteMovieBtn");
  if (existingAdd) existingAdd.remove();
  if (existingDel) existingDel.remove();

  if (currentUser && currentUser.rol === "admin") {
    const navLinks = document.querySelector(".nav-links ul");

    const liAdd = document.createElement("li");
    const addLink = document.createElement("a");
    addLink.id = "adminAddMovieBtn";
    addLink.textContent = "Agregar Película";
    addLink.style.cursor = "pointer";
    addLink.addEventListener("click", openAddMovieModal);

    const liDel = document.createElement("li");
    const delLink = document.createElement("a");
    delLink.id = "adminDeleteMovieBtn";
    delLink.textContent = "Borrar Película";
    delLink.style.cursor = "pointer";
    delLink.addEventListener("click", openDeleteMovieModal);

    liAdd.appendChild(addLink);
    liDel.appendChild(delLink);
    navLinks.appendChild(liAdd);
    navLinks.appendChild(liDel);
  }
}

function openAddMovieModal() {
  document.getElementById("addMovieModal").style.display = "flex";
}
function closeAddMovieModal() {
  document.getElementById("addMovieModal").style.display = "none";
}

async function saveNewMovie() {
  if (!currentUser || currentUser.rol !== "admin") {
    alert("No tienes permiso para agregar.");
    return;
  }

  const nombre = document.getElementById("newMovieName").value.trim();
  const director = document.getElementById("newMovieDirector").value.trim();
  const genero_id = document.getElementById("newMovieGenero").value;
  const año = parseInt(document.getElementById("newMovieYear").value, 10);
  const sagaV = document.getElementById("newMovieSaga").value;
  const compañia = document.getElementById("newMovieCompania").value.trim();
  const imagen = document.getElementById("newMovieImagen").value.trim();

  if (!nombre || !director || !genero_id || !año) {
    alert("Los campos nombre, director, género y año son obligatorios.");
    return;
  }

  const saga_id = sagaV ? parseInt(sagaV) : null;
  const imageF = imagen === "" ? null : imagen;

  try {
    const resp = await fetch(`${BASE_URL}/peliculas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        director,
        genero_id: parseInt(genero_id),
        año,
        saga_id,
        compañia: compañia || null,
        imagen: imageF,
      }),
    });

    if (resp.ok) {
      alert("Película agregada con éxito.");
      closeAddMovieModal();
      // Limpieza
      document.getElementById("newMovieName").value = "";
      document.getElementById("newMovieDirector").value = "";
      document.getElementById("newMovieGenero").value = "";
      document.getElementById("newMovieYear").value = "";
      document.getElementById("newMovieSaga").value = "";
      document.getElementById("newMovieCompania").value = "";
      document.getElementById("newMovieImagen").value = "";

      fetchPeliculasRecomendadas();
    } else {
      alert("Error al agregar la película.");
    }
  } catch (e) {
    console.error("Error al insertar pelicula:", e);
    alert("Error de servidor.");
  }
}

function openDeleteMovieModal() {
  fetchAllMoviesForDelete();
  document.getElementById("deleteMovieModal").style.display = "flex";
}
function closeDeleteMovieModal() {
  document.getElementById("deleteMovieModal").style.display = "none";
}

async function fetchAllMoviesForDelete() {
  try {
    const resp = await fetch(`${BASE_URL}/peliculas`);
    const movies = await resp.json();

    const select = document.getElementById("deleteMovieSelect");
    select.innerHTML = "";

    movies.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.nombre;
      select.appendChild(opt);
    });
  } catch (e) {
    console.error("Error al cargar películas para eliminar:", e);
  }
}

function setupDeleteMovieFilter() {
  const input = document.getElementById("deleteMovieSearch");
  const select = document.getElementById("deleteMovieSelect");

  input.addEventListener("input", () => {
    const filter = input.value.toLowerCase().trim();
    const options = select.querySelectorAll("option");
    options.forEach((op) => {
      const text = op.textContent.toLowerCase();
      op.style.display = text.includes(filter) ? "" : "none";
    });
  });
}

async function deleteMovie() {
  if (!currentUser || currentUser.rol !== "admin") {
    alert("No tienes permiso para eliminar.");
    return;
  }
  const select = document.getElementById("deleteMovieSelect");
  const message = document.getElementById("deleteMovieMessage");
  message.textContent = "";

  if (!select.value) {
    message.textContent = "Selecciona una película.";
    return;
  }

  try {
    const resp = await fetch(`${BASE_URL}/peliculas/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valor: select.value }),
    });
    const data = await resp.json();

    if (resp.ok) {
      message.style.color = "lime";
      message.textContent = data.message || "Película eliminada.";
      select.value = "";
      fetchPeliculasRecomendadas();
    } else {
      message.style.color = "red";
      message.textContent = data.message || "No se pudo eliminar.";
    }
  } catch (e) {
    console.error("Error al eliminar:", e);
    message.textContent = "Error de servidor.";
  }
}

/*****************************************************
 *    11) PERSONALIZAR PERFIL
 *****************************************************/
function setupProfileButton() {
  const profileModal = document.getElementById("profileModal");
  const closeBtn = document.getElementById("closeProfileModal");

  closeBtn.addEventListener("click", () => {
    profileModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === profileModal) {
      profileModal.style.display = "none";
    }
  });

  document
    .getElementById("saveProfileButton")
    .addEventListener("click", saveProfileChanges);
}

async function saveProfileChanges() {
  if (!currentUser) return;

  const newUsername = document
    .getElementById("profileNewUsername")
    .value.trim();
  const newPassword = document
    .getElementById("profileNewPassword")
    .value.trim();
  const newPhoto = document
    .getElementById("profileNewPhoto")
    .value.trim();

  const profileMessage = document.getElementById("profileMessage");
  profileMessage.textContent = "";

  if (!newUsername && !newPassword && !newPhoto) {
    profileMessage.textContent = "No hay cambios que guardar.";
    return;
  }

  try {
    const resp = await fetch(`${BASE_URL}/api/users/${currentUser.id_usuario}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newUsername, newPassword, newPhoto }),
    });
    const data = await resp.json();

    if (resp.ok) {
      // Actualiza local
      if (newUsername) currentUser.username = newUsername;
      if (newPhoto) currentUser.foto_perfil = newPhoto;

      localStorage.setItem("user", JSON.stringify(currentUser));

      profileMessage.style.color = "lime";
      profileMessage.textContent = "Perfil actualizado correctamente.";
      updateUserUI();
    } else {
      profileMessage.style.color = "red";
      profileMessage.textContent = data.message || "Error al actualizar.";
    }
  } catch (error) {
    console.error("Error en profile update:", error);
    profileMessage.textContent = "Error de servidor.";
  }
}

/*****************************************************
 *    12) MENÚ DE PERFIL
 *****************************************************/
function setupUserIconClick() {
  const userIcon = document.getElementById("userIcon");
  const profileSubmenu = document.getElementById("profileSubmenu");
  const profileBtn = document.getElementById("profileMenuBtn");
  const logoutBtn = document.getElementById("logoutMenuBtn");

  userIcon.addEventListener("click", () => {
    if (!currentUser) {
      // Si no hay sesión, abre login
      document.getElementById("loginModal").style.display = "flex";
    } else {
      // Si hay sesión, togglear submenú
      profileSubmenu.classList.toggle("show-submenu");
      document.getElementById("sessionLabel").textContent = `Sesión: ${currentUser.username}`;
    }
  });

  // Al hacer click en "Perfil"
  profileBtn.addEventListener("click", () => {
    openProfileModal();
    profileSubmenu.classList.remove("show-submenu");
  });

  // Al hacer click en "Cerrar sesión"
  logoutBtn.addEventListener("click", () => {
    logout();
    profileSubmenu.classList.remove("show-submenu");
  });

  // Cerrar submenú al hacer click fuera
  window.addEventListener("click", (event) => {
    if (
      !userIcon.contains(event.target) &&
      !profileSubmenu.contains(event.target)
    ) {
      profileSubmenu.classList.remove("show-submenu");
    }
  });
}

function openProfileModal() {
  if (!currentUser) return;
  document.getElementById("profileModal").style.display = "flex";
}

function logout() {
  localStorage.removeItem("user");
  currentUser = null;
  location.reload();
}

/**
 * Actualiza la imagen de usuario y quita el submenu
 */
function updateUserUI() {
  const userIconImg = document.getElementById("userIconImg");
  const profileSubmenu = document.getElementById("profileSubmenu");
  profileSubmenu.classList.remove("show-submenu");

  if (currentUser) {
    if (currentUser.foto_perfil) {
      userIconImg.src = currentUser.foto_perfil;
    } else {
      userIconImg.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    }
  } else {
    userIconImg.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
  }
}
