function crearBotonVolver() {
    var boton = document.createElement('button');
    boton.textContent = 'Volver';
    boton.addEventListener("click", function () {
        window.location.href = "index.html";
    });
    document.body.appendChild(boton); // Agregar el botón al cuerpo del documento
}

// Función para crear botones de navegación y agregarlos al contenedor especificado
function crearBotonesNavegacion(pokemonId) {
    var botonesContainer = document.createElement('div');
    botonesContainer.id = 'botones-navegacion';

    // Crear botón "Anterior"
    var botonAnterior = document.createElement('button');
    botonAnterior.textContent = 'Anterior';
    botonAnterior.addEventListener("click", function () {
        var pokemonAnteriorId = pokemonId - 1;
        mostrarDetalles(pokemonAnteriorId);
    });
    botonesContainer.appendChild(botonAnterior);

    // Crear botón "Siguiente"
    var botonSiguiente = document.createElement('button');
    botonSiguiente.textContent = 'Siguiente';
    botonSiguiente.addEventListener("click", function () {
        var pokemonSiguienteId = pokemonId + 1;
        mostrarDetalles(pokemonSiguienteId);
    });
    botonesContainer.appendChild(botonSiguiente);

    // Agregar los botones al cuerpo del documento
    document.body.appendChild(botonesContainer);
}