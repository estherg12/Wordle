const CODE = "1234"; // Código correcto
const targetWord = "HIELO";
const maxAttempts = 6;
let attempts = 0;
let currentGuess = "";
let gameEnded = false;

// Función para verificar el código
function checkCode() {
    const input = document.getElementById("code-input");
    const errorMessage = document.getElementById("error-message");
  
    if (input.value === CODE) {
      document.getElementById("initial-page").style.display = "none";
      document.getElementById("game-container").style.display = "block";
      startGame();
    } else {
      input.classList.add("error");
      errorMessage.style.display = "block";
    }
  }
  
  // Detectar la tecla Enter en la página inicial
  document.getElementById("code-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      checkCode();
    }
  });
  
  // Quitar mensaje de error mientras se escribe
  document.getElementById("code-input").addEventListener("input", () => {
    const input = document.getElementById("code-input");
    const errorMessage = document.getElementById("error-message");
  
    input.classList.remove("error");
    errorMessage.style.display = "none";
  });
  

function startGame() {
    const grid = document.getElementById("grid");
    const endMessage = document.getElementById("end-message");
    const keyboard = document.getElementById("keyboard");

    // Crear el tablero de juego
    for (let i = 0; i < maxAttempts; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            row.appendChild(cell);
        }
        grid.appendChild(row);
    }

    // Crear el teclado virtual con el botón de "Comprobar" a la izquierda de la "Z"
    const letters = "QWERTYUIOPASDFGHJKLÑZXCVBNM".split("");
    letters.forEach((letter, index) => {
        const key = document.createElement("button");
        key.textContent = letter;
        key.classList.add("key");
        key.addEventListener("click", () => handleKeyPress(letter));
        keyboard.appendChild(key);

        if (index === 18) { // Posicionar el botón de "Comprobar" antes de "Z"
            const checkKey = document.createElement("button");
            checkKey.textContent = "✔";
            checkKey.classList.add("key");
            checkKey.addEventListener("click", checkGuess);
            keyboard.appendChild(checkKey);
        }
    });

    // Agregar el botón de retroceso
    const backspaceKey = document.createElement("button");
    backspaceKey.textContent = "←";
    backspaceKey.classList.add("key");
    backspaceKey.addEventListener("click", handleBackspace);
    keyboard.appendChild(backspaceKey);
    

    // Manejo de tecla presionada
    function handleKeyPress(letter) {
        if (!gameEnded && currentGuess.length < 5) {
            currentGuess += letter;
            updateGrid();
        }
    }

    // Manejo del botón de retroceso
    function handleBackspace() {
        if (!gameEnded && currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1); // Elimina la última letra
            updateGrid();
        }
    }

    // Actualizar el grid con el intento actual
    function updateGrid() {
        const row = document.getElementsByClassName("row")[attempts];
        const letters = row.getElementsByClassName("cell");
        for (let i = 0; i < 5; i++) {
            letters[i].textContent = currentGuess[i] || "";
        }
    }

    // Verificar el intento
    function checkGuess() {
        if (currentGuess.length !== 5) {
            endMessage.textContent = "La palabra debe tener 5 letras.";
            return;
        }

        const row = document.getElementsByClassName("row")[attempts];
        const letters = row.getElementsByClassName("cell");

        for (let i = 0; i < 5; i++) {
            const letter = currentGuess[i];
            if (letter === targetWord[i]) {
                letters[i].classList.add("correct");
                updateKeyboard(letter, "correct");
            } else if (targetWord.includes(letter)) {
                letters[i].classList.add("present");
                updateKeyboard(letter, "present");
            } else {
                letters[i].classList.add("absent");
                updateKeyboard(letter, "absent");
            }
        }

        attempts++;
        if (currentGuess === targetWord) {
            endGame(true);
        } else if (attempts === maxAttempts) {
            endGame(false);
        } else {
            currentGuess = "";
            updateGrid();
        }
    }

    // Finalizar el juego y mostrar la pantalla de fin
    function endGame(isWin) {
        gameEnded = true;

        // Muestra el mensaje de fin de juego
        endMessage.classList.add(isWin ? "win" : "lose");
        endMessage.textContent = isWin ? "Adivinaste la palabra! Nos vemos el sábado 21" : `Perdiste. La palabra era: ${targetWord}.`;
        endMessage.style.display = "block";

        if (isWin) {
            // Si el usuario gana, borra todas las letras excepto las de la última fila
            for (let i = 0; i < attempts - 1; i++) { // No borrar la última fila
                const row = document.getElementsByClassName("row")[i];
                const cells = row.getElementsByClassName("cell");
                for (let j = 0; j < 5; j++) {
                    cells[j].textContent = ""; // Borra el texto de cada celda
                }
            }
        }

        // Asegurarse de que las filas no utilizadas permanezcan en gris
        for (let i = attempts; i < maxAttempts; i++) {
            const row = document.getElementsByClassName("row")[i];
            const cells = row.getElementsByClassName("cell");
            for (let j = 0; j < 5; j++) {
                cells[j].className = "cell"; // Resetea cualquier estilo de color
            }
        }

        // Desactivar todos los botones del teclado virtual
        [...keyboard.children].forEach(key => key.disabled = true);

        // Remover eventos de teclado físico
        document.removeEventListener("keydown", handlePhysicalKeyboard);
    }

    // Actualizar el teclado virtual
    function updateKeyboard(letter, status) {
        const key = [...keyboard.children].find(k => k.textContent === letter);
        if (key && !key.classList.contains("correct")) {
            key.classList.add(status);
        }
    }

    // Eventos de entrada del teclado físico

    handlePhysicalKeyboard()
    document.getElementById("keydown").addEventListener("keypress", (e) => {
        if (!gameEnded){
            const letter = e.key.toUpperCase();
            if(letter >= "A" && letter <= "Z" && currentGuess.length < 5) 
                handleKeyPress(letter);
            else if (e.key === "Enter") {
                checkGuess();
            }
            /*
            else if (e.key === "Backspace") {
                handleBackspace();
            }*/            
        }
      });
};
