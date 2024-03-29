var paginaActual = 1;
var totalPaginas = 0;
var rangoActual = 1;
var pokemonesPorPagina = 20;

const pokemonListElement = document.getElementById('pokemonList');
const searchInput = document.getElementById('searchInput');
let currentPage = 1;
let totalPages = 1;
let currentPokemon;

// Function to fetch Pokemon data
async function fetchPokemon(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Pokemon:', error);
    }
}

// Function to save data to localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Function to retrieve data from localStorage
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Function to display Pokemon list
async function displayPokemonList(page) {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${(page - 1) * 20}&limit=20`;
    const cachedData = getData(url); // Attempt to get data from localStorage
    let data;

    if (cachedData) {
        data = cachedData;
    } else {
        data = await fetchPokemon(url);
        saveData(url, data); // Save fetched data to localStorage
    }

    totalPages = Math.ceil(data.count / 20);

    pokemonListElement.innerHTML = '';

    data.results.forEach(async (pokemon) => {
        const pokemonData = await fetchPokemon(pokemon.url);
        const pokemonElement = document.createElement('div');
        pokemonElement.textContent = pokemonData.name; // Placeholder, you can replace it with desired Pokemon data
        pokemonListElement.appendChild(pokemonElement);
    });
}

// Initial display
displayPokemonList(currentPage);


function procesarPokemon(pokemon) {
    var nombre = pokemon.name;
    var imagen = pokemon.sprites.front_default;
    var id = pokemon.id;

    var contenedorPokemon = document.createElement("div");
    contenedorPokemon.className = "pokemon-box";
    contenedorPokemon.innerHTML = `
        <p><span onclick="mostrarDetalles(${id});" style="cursor: pointer; text-decoration: underline;">${nombre} (#${id})</span></p>
        <img src="${imagen}" alt="${nombre}">
    `;

    document.getElementById("capa").appendChild(contenedorPokemon);
}

function manejarError(message) {
    console.error("Ha ocurrido un problema:", message);
}

function cargarPaginaAvanzarRetroceder(offset) {
    rangoActual += offset / 10;
    var inicio = (rangoActual - 1) * 10 * pokemonesPorPagina + 1;
    var fin = Math.min(inicio + 9 * pokemonesPorPagina, totalPaginas * pokemonesPorPagina);
    cargarPaginaRango(inicio, fin);
}

function cargarPagina(pagina) {
    document.getElementById("capa").innerHTML = "";
    realizarSolicitud(pagina);
}

function cargarPaginaRango(inicio, fin) {
    document.getElementById("capa").innerHTML = "";
    for (var i = inicio; i <= fin; i++) {
        realizarSolicitud(i);
    }
}

function actualizarPaginacion() {
    var paginacionContainer = document.getElementById("paginacion-container");
    paginacionContainer.innerHTML = "";

    var retroceder1Button = document.createElement("button");
    retroceder1Button.textContent = "Retroceder 1";
    retroceder1Button.addEventListener("click", function () {
        cargarPagina(paginaActual - 1);
    });
    retroceder1Button.disabled = paginaActual === 1;
    paginacionContainer.appendChild(retroceder1Button);

    var retroceder10Button = document.createElement("button");
    retroceder10Button.textContent = "Retroceder 10";
    retroceder10Button.addEventListener("click", function () {
        cargarPagina(paginaActual - 10);
    });
    retroceder10Button.disabled = paginaActual <= 10;
    paginacionContainer.appendChild(retroceder10Button);

    for (var i = paginaActual; i < paginaActual + 10 && i <= totalPaginas; i++) {
        var paginaButton = document.createElement("button");
        paginaButton.textContent = i;
        paginaButton.addEventListener("click", function () {
            cargarPagina(parseInt(this.textContent));
        });

        if (i === paginaActual) {
            paginaButton.classList.add("active");
        }

        paginacionContainer.appendChild(paginaButton);
    }

    var avanzar1Button = document.createElement("button");
    avanzar1Button.textContent = "Avanzar 1";
    avanzar1Button.addEventListener("click", function () {
        cargarPagina(paginaActual + 1);
    });
    avanzar1Button.disabled = paginaActual === totalPaginas;
    paginacionContainer.appendChild(avanzar1Button);

    var avanzar10Button = document.createElement("button");
    avanzar10Button.textContent = "Avanzar 10";
    avanzar10Button.addEventListener("click", function () {
        cargarPagina(paginaActual + 10);
    });
    avanzar10Button.disabled = paginaActual + 10 > totalPaginas;
    paginacionContainer.appendChild(avanzar10Button);

    var paginaActualSpan = document.createElement("span");
    paginaActualSpan.textContent = `Página ${paginaActual}`;
    paginacionContainer.appendChild(paginaActualSpan);

   
}
