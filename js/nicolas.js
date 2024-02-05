function agregarEnlaceNavegacion(container, pokemonId, direccion) {
    var enlaceNavegacion = document.createElement('a');
    enlaceNavegacion.textContent = direccion;
    enlaceNavegacion.href = '#';

    enlaceNavegacion.onclick = function () {
        var siguientePokemonId = (direccion === 'Siguiente') ? pokemonId + 1 : pokemonId - 1;
        mostrarDetalles(siguientePokemonId);
        return false;
    };



    container.appendChild(enlaceNavegacion);
}