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



function filtrarPorTipo(tipo) {
    filtroActual = tipo; // Establece el filtro actual
    realizarSolicitud(paginaActual); // Carga la página actual con el filtro aplicado
}




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
function cargarPokemons() {
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pokemonesPorPagina}`)// Ajusta el límite según sea necesario
        .then(response => response.json())
        .then(data => {
            pokemonList = data.results; // Asegúrate de que esto se ajuste a tus necesidades
            mostrarPokemons(); // Muestra los Pokémon recién cargados
        })
        .catch(error => manejarError(error.message));
}

function sort(criterio) {
    // Asumiendo que pokemonList ya está lleno
    switch (criterio) {
        case 'lowerNumber':
            // Ordenamiento por ID más bajo a más alto
            pokemonList.sort((a, b) => parseInt(a.url.split('/')[6]) - parseInt(b.url.split('/')[6]));
            break;
        case 'higherNumber':
            // Ordenamiento por ID más alto a más bajo
            pokemonList.sort((a, b) => parseInt(b.url.split('/')[6]) - parseInt(a.url.split('/')[6]));
            break;
        // Agregar más casos según sea necesario
    }
    mostrarPokemonsOrdenados(); // Actualiza la UI con la lista ordenada
}

function mostrarPokemonsOrdenados() {
    const contenedor = document.getElementById("capa");
    contenedor.innerHTML = ''; // Limpia el contenedor

    pokemonList.forEach(pokemon => {
        fetch(pokemon.url)
            .then(response => response.json())
            .then(pokemonData => {
                // Suponiendo que procesarPokemon actualiza la UI
                procesarPokemon(pokemonData);
            })
            .catch(error => manejarError(error.message));
    });
}










