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

// Realiza la solicitud de los pokemones y muestra en la página
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
            // Llama a filtrarPorNombre con keepFilter establecido en true para mantener el filtro en la página actual
            filtrarPorNombre(true);
        })
        .catch(error => manejarError(error.message));
}

// Carga todos los pokemones
function cargarTodosLosPokemons() {
    var offset = (paginaActual - 1) * pokemonesPorPagina;
    var url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pokemonesPorPagina}`;

    return fetch(url)
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

// Muestra los pokemones ordenados
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

// Ordena los pokemones según el criterio especificado
function sort(criterio) {
    if (pokemonList.length === 0) {
        cargarTodosLosPokemons().then(() => {
            aplicarOrdenamiento(criterio);
        });
    } else {
        aplicarOrdenamiento(criterio);
    }
}

// Aplica el ordenamiento a la lista de pokemones
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

// Filtra los pokemones por tipo
function filtrarPorTipo(tipo) {
    filtroActual = tipo; // Establece el filtro actual
    realizarSolicitud(paginaActual); // Vuelve a cargar la página con el nuevo filtro
}

// Inicialización
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

// Cargar página y botones de tipos al cargar la ventana
window.onload = function () {
    cargarPagina(paginaActual);
    botonesTipos();
};

// Variable para almacenar el valor del filtro de búsqueda
var searchFilter = '';

// Función para filtrar por nombre
function filtrarPorNombre(keepFilter) {
    var inputElement = document.getElementById('search-input');
    // Si keepFilter es true, utiliza el valor almacenado en searchFilter, de lo contrario, obtén el nuevo valor del campo de entrada
    var input = keepFilter ? searchFilter : inputElement.value.toLowerCase();
    var capa = document.getElementById('capa');
    var pokemonBoxes = capa.getElementsByClassName('pokemon-box');

    for (var i = 0; i < pokemonBoxes.length; i++) {
        var nombrePokemon = pokemonBoxes[i].getElementsByTagName('p')[0].textContent.toLowerCase();
        if (nombrePokemon.includes(input)) {
            pokemonBoxes[i].style.display = "";
        } else {
            pokemonBoxes[i].style.display = "none";
        }
    }
    // Actualiza searchFilter con el nuevo valor de entrada si no se mantiene el filtro
    if (!keepFilter) {
        searchFilter = input;
        inputElement.value = ''; // Borra el campo de texto
    }
}

// Agregar evento de teclado para buscar al presionar Enter
document.getElementById('search-input').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        filtrarPorNombre(false);
    }
});

// Llamar a la función filtrarPorNombre con keepFilter establecido en true cuando cambias de página
function cargarPagina(pagina) {
    // Reiniciar la página actual y el rango
    paginaActual = pagina;
    rangoActual = Math.ceil(paginaActual / 10);

    document.getElementById("capa").innerHTML = "";
    realizarSolicitud(pagina);
    // Llama a filtrarPorNombre con keepFilter establecido en true para mantener el filtro mientras cambias de página
    filtrarPorNombre(true);
}
// Función para alternar la visualización del menú desplegable
function toggleDropdown() {
    var dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.classList.toggle('show');

    // Verificar si el menú desplegable está abierto
    if (dropdownContent.classList.contains('show')) {

        // Agregar eventos de clic a las opciones del menú desplegable
        var opcionesDesplegable = dropdownContent.querySelectorAll('a');
        opcionesDesplegable.forEach(function(opcion) {
            opcion.addEventListener('click', function() {
                // Eliminar la clase 'selected' de todas las opciones
                opcionesDesplegable.forEach(function(opcion) {
                    opcion.classList.remove('selected');
                });

                // Agregar la clase 'selected' a la opción seleccionada
                this.classList.add('selected');
            });
        });
    }
}

// Cerrar el menú desplegable si el usuario hace clic fuera de él
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
};
