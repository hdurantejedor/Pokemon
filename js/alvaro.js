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

// Corregido para incluir el offset en la URL
function cargarTodosLosPokemons() {
    var offset = (paginaActual - 1) * pokemonesPorPagina;
    var url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pokemonesPorPagina}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            pokemonList = data.results;
            totalPaginas = Math.ceil(data.count / pokemonesPorPagina);
            return Promise.all(pokemonList.map(pokemon => fetch(pokemon.url).then(resp => resp.json())));
        })
        .then(pokemons => {
            pokemonList = pokemons;
            mostrarPokemonsOrdenados();
            actualizarPaginacion();
        })
        .catch(error => console.error("Error al cargar Pokémon: ", error));
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
     // Siempre reinicia a la primera página al aplicar un nuevo filtro
    cargarPokemonsPorTipo(); // Llama a la función de carga ajustada para el filtrado
}



// Asumiendo que ya tienes definidas las variables iniciales y tiposEnIngles.

function cargarPokemonsPorTipo() {
    let url;
    if (filtroActual) {
        url = `https://pokeapi.co/api/v2/type/${tiposEnIngles[filtroActual]}`;
    } else {
        let offset = (paginaActual - 1) * pokemonesPorPagina;
        url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pokemonesPorPagina}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const results = filtroActual ? data.pokemon.map(item => item.pokemon) : data.results;
            totalPaginas = Math.ceil((filtroActual ? results.length : data.count) / pokemonesPorPagina);
            const promises = results.slice(0, pokemonesPorPagina).map(pokemon => fetch(pokemon.url).then(resp => resp.json()));
            return Promise.all(promises);
        })
        .then(pokemons => {
            pokemonList = pokemons;
            mostrarPokemonsOrdenados();
            actualizarPaginacion();
        })
        .catch(error => console.error("Error al cargar Pokémon: ", error));
}

// Revisa la implementación de mostrarPokemonsOrdenados y actualizarPaginacion para asegurar que manejen correctamente los datos y la UI.






window.onload = function() {
    cargarTodosLosPokemons();
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









