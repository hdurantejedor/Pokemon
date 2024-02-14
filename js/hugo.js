var paginaActual = 1;
var totalPaginas = 0;
var rangoActual = 1;
var pokemonesPorPagina = 20;

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

function realizarSolicitud(pagina) {
    document.getElementById("capa").innerHTML = "";
    var offset = (pagina - 1) * pokemonesPorPagina;

    // Decide si cargar todos los pokemones o solo los de un tipo específico
    let url;
    if (filtroActual) {
        // Usa el filtro de tipo
        url = `https://pokeapi.co/api/v2/type/${tiposEnIngles[filtroActual]}`;
    } else {
        // Carga general sin filtro
        url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pokemonesPorPagina}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("La solicitud no fue exitosa");
            }
            return response.json();
        })
        .then(data => {
            if (filtroActual) {
                // Manejo especial para cuando se filtra por tipo
                totalPaginas = Math.ceil(data.pokemon.length / pokemonesPorPagina);
                let pokemonPorTipo = data.pokemon.slice(offset, offset + pokemonesPorPagina).map(p => p.pokemon);
                pokemonPorTipo.forEach(pokemon => {
                    fetch(pokemon.url)
                        .then(response => response.json())
                        .then(procesarPokemon)
                        .catch(error => manejarError(error.message));
                });
            } else {
                // Manejo para la carga general sin filtro
                totalPaginas = Math.ceil(data.count / pokemonesPorPagina);
                data.results.forEach(pokemon => {
                    fetch(pokemon.url)
                        .then(response => response.json())
                        .then(procesarPokemon)
                        .catch(error => manejarError(error.message));
                });
            }
            paginaActual = pagina;
            actualizarPaginacion();
        })
        .catch(error => manejarError(error.message));
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



