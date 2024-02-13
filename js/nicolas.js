function crearBotonVolver() {
    var boton = document.createElement('button');
    boton.innerHTML = "Mi Botón";
boton.id = "mi-boton";
// Agregar el botón al documento
document.body.appendChild(boton);
    boton.textContent = 'Volver';
    boton.addEventListener("click", function () {
        window.location.href = "index.html";
    });
    document.body.appendChild(boton); // Agregar el botón al cuerpo del documento
}

// Función para crear botones de navegación y agregarlos al contenedor especificado
function crearBotonesNavegacion(pokemonId) {
    var contenedorExistente = document.getElementById('botones-navegacion');
    if (contenedorExistente) {
        document.body.removeChild(contenedorExistente);
    }

    var botonesContainer = document.createElement('div');
    botonesContainer.id = 'botones-navegacion';

    // Crear botón "Anterior"
    var botonAnterior = document.createElement('button');
    botonAnterior.textContent = '←';
    botonAnterior.classList.add('boton-navegacion');
    botonAnterior.addEventListener("click", function () {
        if(pokemonId > 1) { // Asumiendo que el ID de Pokémon más bajo es 1
            mostrarDetalles(pokemonId - 1);
        }
    });
    botonesContainer.appendChild(botonAnterior);

    // Crear botón "Siguiente"
    var botonSiguiente = document.createElement('button');
    botonSiguiente.textContent = '→';
    botonSiguiente.classList.add('boton-navegacion');
    botonSiguiente.addEventListener("click", function () {
        // Aquí podrías poner una comprobación para el ID máximo de Pokémon si lo deseas
        mostrarDetalles(pokemonId + 1);
    });
    botonesContainer.appendChild(botonSiguiente);

    // Agregar los botones al cuerpo del documento
    document.body.appendChild(botonesContainer);
}