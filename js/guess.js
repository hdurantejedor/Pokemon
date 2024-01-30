// guess.js

// Obtén referencias a elementos del DOM
const startButton = document.getElementById('start');
const gameContainer = document.querySelector('.game-container');
const userScore = document.querySelector('.user-score');
const modal = document.querySelector('.modal');

// Variables del juego
let score = 0;
let pokemonData; // Datos del Pokémon actual

// Función para iniciar el juego
async function startGame() {
  // Restablecer la puntuación
  score = 0;

  // Ocultar el botón de inicio
  startButton.style.display = 'none';

  // Mostrar el contenedor del juego
  gameContainer.classList.remove('hide');

  // Mostrar la primera imagen de Pokémon
  await showPokemon();
}

// Función para mostrar la ventana modal con opciones de nombres
async function showPokemonGuessModal(correctPokemonName) {
  // Mostrar la ventana modal
  modal.style.display = 'block';

  // Obtener referencias a elementos del DOM
  const modalContent = document.querySelector('.modal-content');
  const exitButton = document.createElement('button');
  exitButton.textContent = 'Salir';
  exitButton.addEventListener('click', () => {
    // Ocultar la ventana modal al hacer clic en "Salir"
    modal.style.display = 'none';
  });
  modalContent.innerHTML = '';
  modalContent.appendChild(exitButton);

  // Mostrar la imagen del Pokémon
  const pokemonImage = document.createElement('img');
  pokemonImage.src = pokemonData.sprites.front_default;
  pokemonImage.alt = 'Pokemon';
  modalContent.appendChild(pokemonImage);

  // Crear y mostrar botones de opciones
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'options-container';

  // Crear un array de opciones (nombres de Pokémon)
  const options = [];
  options.push(correctPokemonName);

  // Obtener tres nombres de Pokémon adicionales aleatorios (incorrectos)
  for (let i = 0; i < 3; i++) {
    let randomPokemonId;
    do {
      randomPokemonId = Math.floor(Math.random() * 898) + 1;
    } while (options.includes(randomPokemonId)); // Evitar nombres duplicados
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);
    const randomPokemonData = await response.json();
    options.push(randomPokemonData.name);
  }

  // Barajar el array de opciones
  options.sort(() => Math.random() - 0.5);

  // Crear botones de opciones
  options.forEach((option) => {
    const optionButton = document.createElement('button');
    optionButton.textContent = option;
    optionButton.addEventListener('click', () => checkAnswer(option, correctPokemonName));
    optionsContainer.appendChild(optionButton);
  });

  modalContent.appendChild(optionsContainer);
}

// Función para mostrar una imagen de Pokémon aleatoria
async function showPokemon() {
  try {
    const randomPokemonId = Math.floor(Math.random() * 898) + 1; // Hay 898 Pokémon en total
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);
    pokemonData = await response.json();

    // Mostrar la ventana modal con opciones de nombres
    showPokemonGuessModal(pokemonData.name);
  } catch (error) {
    console.error('Error al obtener la imagen del Pokémon:', error);
  }
}

// Función para verificar la respuesta seleccionada
function checkAnswer(selectedOption, correctPokemonName) {
  if (selectedOption === correctPokemonName) {
    // Respuesta correcta
    score++;
    alert('¡Respuesta correcta!');
  } else {
    // Respuesta incorrecta
    alert(`Respuesta incorrecta. El Pokémon es ${correctPokemonName}.`);
  }

  // Ocultar la ventana modal y mostrar la siguiente imagen de Pokémon
  modal.style.display = 'none';
  showPokemon();
}

// Función para finalizar el juego
function endGame() {
  // Ocultar el contenedor del juego
  gameContainer.classList.add('hide');

  // Mostrar la puntuación del usuario
  userScore.textContent = `Puntuación: ${score}`;
}

// Manejador de clic para el botón de inicio
startButton.addEventListener('click', startGame);
