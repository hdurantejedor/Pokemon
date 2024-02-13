var paginaActual = 1;
var totalPaginas = 0;
var pokemonesPorPagina = 20;
var filtroActual = null;
var pokemonList = [];

const tiposEnIngles = {
    'Fuego': 'fire',
    'Agua': 'water',
    'Planta': 'grass',
    'Bicho': 'bug',
    'Volador': 'flying',
    'Normal': 'normal',
    'Veneno': 'poison',
    'Tierra': 'ground',
    'Hada': 'fairy',
    'Eléctrico': 'electric',
    'Lucha': 'fighting',
    'Hielo': 'ice',
    'Fantasma': 'ghost',
    'Acero': 'steel',
    'Roca': 'rock',
    'Psíquico': 'psychic',
    'Siniestro': 'dark',
    'Dragón': 'dragon'
};

function cargarTodosLosPokemons() {
    return new Promise((resolve, reject) => {
        const limite = pokemonesPorPagina; // Define cuántos Pokémon quieres cargar.
        const url = `https://pokeapi.co/api/v2/pokemon?limit=${limite}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                let promesas = data.results.map(pokemon => fetch(pokemon.url).then(response => response.json()));
                Promise.all(promesas)
                    .then(resultados => {
                        pokemonList = resultados;
                        resolve(resultados); // Resuelve con los resultados obtenidos.
                    })
                    .catch(error => reject(error));
            })
            .catch(error => reject(error));
    });
}

function mostrarPokemonsOrdenados() {
    const contenedor = document.getElementById("capa");
    contenedor.innerHTML = ''; // Limpia el contenedor

    // Calcula el inicio y el fin de los Pokémon para la página actual
    const inicio = (paginaActual - 1) * pokemonesPorPagina;
    const fin = inicio + pokemonesPorPagina;
    const pokemonsPagina = pokemonList.slice(inicio, fin);

    // Muestra solo los Pokémon de la página actual
    pokemonsPagina.forEach(pokemon => {
        const contenedorPokemon = document.createElement("div");
        contenedorPokemon.className = "pokemon-box";
        contenedorPokemon.innerHTML = `
            <p><span style="cursor: pointer; text-decoration: underline;">${pokemon.name} (#${pokemon.id})</span></p>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        `;
        contenedor.appendChild(contenedorPokemon);
    });
}


function sort(criterio) {
    if (pokemonList.length === 0) {
        cargarTodosLosPokemons().then(() => {
            aplicarOrdenamiento(criterio);
        });
    } else {
        aplicarOrdenamiento(criterio);
    }
}

function aplicarOrdenamiento(criterio) {
    switch (criterio) {
        case 'lowerNumber':
            pokemonList.sort((a, b) => a.id - b.id);
            break;
        case 'higherNumber':
            pokemonList.sort((a, b) => b.id - a.id);
            break;
        case 'aToZ':
            pokemonList.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'zToA':
            pokemonList.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }
    mostrarPokemonsOrdenados(); // Actualiza la UI con la lista ordenada
}


function filtrarPorTipo(tipo) {
    filtroActual = tipo; // Establece el filtro actual
    paginaActual = 1; // No reinicia la página actual

    // Asume una función que actualiza pokemonList basada en el filtro
    // y recalcula totalPaginas según sea necesario
    realizarSolicitudConFiltro(paginaActual, filtroActual);
}

function realizarSolicitudConFiltro(pagina, filtro) {
    document.getElementById("capa").innerHTML = "";
    var offset = (pagina - 1) * pokemonesPorPagina;
    let url;

    if (filtro) {
        url = `https://pokeapi.co/api/v2/type/${tiposEnIngles[filtro]}`;
    } else {
        // Si no hay filtro seleccionado, carga la página actual de todos los Pokémon
        url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pokemonesPorPagina}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Ajuste para manejar la carga basada en si hay un filtro de tipo aplicado o no
            if (filtro) {
                // Filtra los Pokémon por tipo y ajusta el total de páginas y la página actual según sea necesario
                let pokemonPorTipo = data.pokemon.map(p => p.pokemon);
                let totalFiltrados = pokemonPorTipo.length;
                totalPaginas = Math.ceil(totalFiltrados / pokemonesPorPagina);
                
                // Ajusta la página actual si es necesario
                if (paginaActual > totalPaginas) {
                    paginaActual = totalPaginas;
                    offset = (paginaActual - 1) * pokemonesPorPagina;
                }

                // Ahora carga los Pokémon para la página actual ajustada
                let promesas = pokemonPorTipo.slice(offset, offset + pokemonesPorPagina).map(pokemon => fetch(pokemon.url).then(response => response.json()));
                Promise.all(promesas)
                    .then(resultados => {
                        pokemonList = resultados;
                        mostrarPokemonsOrdenados();
                        actualizarPaginacion();
                    });
            } else {
                // Procesamiento para la carga general sin filtro
                pokemonList = data.results;
                mostrarPokemonsOrdenados();
                actualizarPaginacion();
            }
        })
        .catch(error => console.error("Error al cargar Pokémon: ", error));
}





window.onload = function() {
    cargarTodosLosPokemons().then(mostrarPokemonsOrdenados);
    botonesTipos();
};



function botonesTipos() {
    var tiposPokemon = [
        'Fuego', 'Agua', 'Planta', 'Bicho', 'Volador',
        'Normal', 'Veneno', 'Tierra', 'Hada', 'Eléctrico',
        'Lucha', 'Hielo', 'Fantasma', 'Acero', 'Roca',
        'Psíquico', 'Siniestro', 'Dragón'
    ];

    var filtroContainer = document.getElementById('filtro');
    var filaActual;
tiposPokemon.forEach((tipo, index) => {
        if (index % 9 === 0) {
            filaActual = document.createElement('div');
            filaActual.className = 'btn-group d-flex justify-content-center align-items-center';
            filtroContainer.appendChild(filaActual);
        }

        var button = document.createElement('button');
        button.textContent = tipo;
        button.className = 'btn btn-primary tipo-' + tipo.toLowerCase();
        button.addEventListener('click', function () {
            filtrarPorTipo(tipo);
        });

        filaActual.appendChild(button);
    });
}

window.onload = function () {
    cargarPagina(paginaActual);
    botonesTipos();
};


function toggleDropdown() {
    document.querySelector('.dropdown-content').classList.toggle('show');
}

// Cierra el menú desplegable si el usuario hace clic fuera de él
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName('dropdown-content');
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}









