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
    pokemonList.forEach(pokemon => {
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
        // Implementa otros criterios aquí
    }
    mostrarPokemonsOrdenados(); // Actualiza la UI con la lista ordenada
}

function filtrarPorTipo(tipo) {
    filtroActual = tipo; // Establece el filtro actual
    realizarSolicitud(paginaActual); // Carga la página actual con el filtro aplicado
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









