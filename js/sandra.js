// Función para mostrar detalles de un Pokémon
function mostrarDetalles(pokemonId) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error("La solicitud no fue exitosa");
            }
            return response.json();
        })
        .then(pokemon => {
            // Limpiar el contenido actual
            document.body.innerHTML = '';

            // Crear un contenedor para mostrar los detalles del Pokémon
            var pokemonContainer = document.createElement('div');
            pokemonContainer.id = 'pokemon-details';

            // Crear elementos HTML para cada detalle del Pokémon
            var nameElement = document.createElement('h1');
            nameElement.textContent = pokemon.name;
            nameElement.style.textTransform = 'capitalize';

            var weightElement = document.createElement('p');
            weightElement.textContent = `Peso: ${pokemon.weight} kg`;

            var heightElement = document.createElement('p');
            heightElement.textContent = `Altura: ${pokemon.height} m`;

            var abilitiesElement = document.createElement('p');
            abilitiesElement.textContent = `Habilidades: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}`;

            var statsElement = document.createElement('p');
            statsElement.textContent = `Estadísticas: ${pokemon.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(', ')}`;

            var vacio = document.createElement('div');

            var imageElement = document.createElement('img');
            imageElement.src = pokemon.sprites.front_default;
            imageElement.alt = pokemon.name;

            var galleryElement = document.createElement('div');
            galleryElement.className = 'pokemon-gallery';

            // Galería de imágenes con las distintas posiciones del Pokémon
            for (var key in pokemon.sprites) {
                if (pokemon.sprites[key] && typeof pokemon.sprites[key] === 'string') {
                    var galleryImage = document.createElement('img');
                    galleryImage.src = pokemon.sprites[key];
                    galleryImage.alt = `${pokemon.name} - ${key}`;
                    galleryElement.appendChild(galleryImage);
                }
            }

            // Listado de formas que tiene cada Pokémon
            var formsElement = document.createElement('p');
            formsElement.textContent = `Formas: ${pokemon.forms.map(form => form.name).join(', ')}`;

            // Nombre de la especie
            var speciesElement = document.createElement('p');
            speciesElement.textContent = `Especie: ${pokemon.species.name}`;

            // Tipos de Pokémon a los que pertenece
            var typesElement = document.createElement('p');
            typesElement.textContent = `Tipos: ${pokemon.types.map(type => type.type.name).join(', ')}`;

            // Agregar elementos al contenedor
            pokemonContainer.appendChild(nameElement);
            pokemonContainer.appendChild(weightElement);
            pokemonContainer.appendChild(heightElement);
            pokemonContainer.appendChild(formsElement);
            pokemonContainer.appendChild(speciesElement);
            pokemonContainer.appendChild(typesElement);
            pokemonContainer.appendChild(abilitiesElement);
            pokemonContainer.appendChild(statsElement);
               // Agregar enlaces de navegación
            pokemonContainer.appendChild(vacio);
            pokemonContainer.appendChild(imageElement);
            pokemonContainer.appendChild(galleryElement);




            // Agregar el contenedor al cuerpo del documento
            document.body.appendChild(pokemonContainer);
        })
        .catch(error => manejarError(error.message));
}
