var paginaActual = 1;
var totalPaginas = 0;
var pokemonesPorPagina = 20;
var filtroActual = null;
var pokemonList = [];
var todosLosPokemons = [];


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
            
            filtrarPorNombre(true);
        })
        .catch(error => manejarError(error.message));
}

function cargarNombresPokemons() {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=10000`) // Límite alto para asegurar que se carguen todos
        .then(response => response.json())
        .then(data => {
            todosLosPokemons = data.results; // Guarda solo los nombres y URLs
        })
        .catch(error => console.error("Error cargando todos los Pokémon:", error));
}
function cargarTodosLosPokemons() {
    return new Promise((resolve, reject) => {
        const pokemonsLocal = obtenerPokemonsLocalmente();
        if (pokemonsLocal) {
            pokemonList = pokemonsLocal;
            totalPaginas = Math.ceil(pokemonList.length / pokemonesPorPagina);
            resolve(pokemonList); // Resuelve la promesa con los datos locales
        } else {
            var offset = (paginaActual - 1) * pokemonesPorPagina;
            var url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pokemonesPorPagina}`;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    totalPaginas = Math.ceil(data.count / pokemonesPorPagina);
                    return Promise.all(data.results.map(pokemon => fetch(pokemon.url).then(resp => resp.json())));
                })
                .then(pokemons => {
                    pokemonList = pokemons;
                    almacenarPokemonsLocalmente(pokemonList);
                    resolve(pokemonList); 
                })
                .catch(error => reject(error)); 
        }
    });
}

// function almacenarPokemonsLocalmente(pokemons) {
//     localStorage.setItem('pokemonList', JSON.stringify(pokemons));
// }

// function obtenerPokemonsLocalmente() {
//     const pokemons = localStorage.getItem('pokemonList');
//     return pokemons ? JSON.parse(pokemons) : null;
// }

function buscarPokemonPorNombre(nombre) {
    if (!nombre.trim()) return; // Evita búsquedas vacías

    const resultadosBusqueda = todosLosPokemons.filter(pokemon => pokemon.name.includes(nombre.toLowerCase()));

    const contenedor = document.getElementById("capa");
    contenedor.innerHTML = ''; // Limpia el contenedor antes de mostrar los resultados

    resultadosBusqueda.forEach(pokemon => {
        fetch(pokemon.url)
            .then(response => response.json())
            .then(detallesPokemon => {
                // Aquí asumimos que tienes una función `procesarPokemon` que maneja la creación de elementos HTML para mostrar los detalles del Pokémon
                procesarPokemon(detallesPokemon);
            })
            .catch(error => console.error("Error al cargar detalles del Pokémon:", error));
    });
}
function recargarPagina() {
    window.location.reload();
}



window.onload = function() {
    crearBotonTodosFuera();
    botonesTipos();
};


function filtrarPorTipo(tipo) {
    filtroActual = tipo;
    paginaActual = 1; 
    realizarSolicitud(paginaActual); 
    searchFilter = ''; // Eliminar el filtro de nombre
    document.getElementById('search-input').value = ''; // Limpiar el campo de búsqueda
}
// Inicialización
window.onload = function() {
    cargarTodosLosPokemons();
    botonesTipos();
    crearBotonTodosFuera();
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
    cargarNombresPokemons();
};

// Variable para almacenar el valor del filtro de búsqueda
var searchFilter = '';


function filtrarPorNombre() {
    var inputElement = document.getElementById('search-input');
    var nombre = inputElement.value;
    buscarPokemonPorNombre(nombre);
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

