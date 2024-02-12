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
function sort(criterio) {
    switch (criterio) {
        case 'lowerNumber':
            pokemonList.sort((a, b) => a.numero - b.numero);
            console.log("Lista ordenada por número ascendente: ");
            
            break;
        case 'higherNumber':
            pokemonList.sort((a, b) => b.numero - a.numero);
            break;
        case 'aToZ':
            pokemonList.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 'zToA':
            pokemonList.sort((a, b) => b.nombre.localeCompare(a.nombre));
            break;
    }
    
    mostrarPokemonsOrdenados();
}

function mostrarPokemonsOrdenados() {
    const contenedor = document.getElementById("capa");
    contenedor.innerHTML = ""; // Limpia el contenedor de Pokémon para preparar la nueva visualización ordenada

    // Asumiendo que `listaPokemon` es un arreglo de objetos Pokémon que ya ha sido ordenado
    pokemonList.forEach(pokemon => {
        // Crear y añadir un nuevo elemento para cada Pokémon en la lista ordenada
        var contenedorPokemon = document.createElement("div");
        contenedorPokemon.className = "pokemon-box";
        contenedorPokemon.innerHTML = `
            <p><span style="cursor: pointer; text-decoration: underline;">${nombre} (#${id})</span></p>
            <img src="${imagen}" alt="${nombre}">
        `;

        contenedor.appendChild(contenedorPokemon);
    });
}










