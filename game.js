// game.js — Word-guess game logic
// Primary secret word for letter-guess gameplay: "MOLLIE"
// Accepted full-word answers: MOLLIE, YOU, IMAOBONG
// On successful reveal/guess player is redirected to cause.html

(function () {
  const primaryWord = "MOLLIE"; // used for letter-by-letter reveal
  const acceptedWords = new Set(["MOLLIE", "YOU", "IMAOBONG"]);

  let revealed = Array(primaryWord.length).fill(false);
  const wrongLetters = new Set();

  const wordEl = document.getElementById('word');
  const letterInput = document.getElementById('letter-input');
  const guessBtn = document.getElementById('guess-btn');
  const wordInput = document.getElementById('word-input');
  const tryWordBtn = document.getElementById('try-word-btn');
  const hintBtn = document.getElementById('hint-btn');
  const resetBtn = document.getElementById('reset-btn');
  const wrongEl = document.getElementById('wrong-letters');
  const msgEl = document.getElementById('message');

  function renderWord() {
    wordEl.innerHTML = '';
    for (let i = 0; i < primaryWord.length; i++) {
      const span = document.createElement('div');
      span.className = 'letter';
      span.textContent = revealed[i] ? primaryWord[i] : '';
      span.setAttribute('aria-hidden', revealed[i] ? 'false' : 'true');
      wordEl.appendChild(span);
    }
  }

  function updateWrong() {
    wrongEl.textContent = wrongLetters.size ? 'Wrong letters: ' + Array.from(wrongLetters).join(', ') : '';
  }

  function showMessage(text, success = false) {
    msgEl.textContent = text;
    msgEl.style.color = success ? '#2a7a4a' : '#a23a6a';
  }

  function checkWin() {
    return revealed.every(Boolean);
  }

  function winAndRedirect() {
    showMessage('You revealed the word! Redirecting...', true);
    setTimeout(() => {
      window.location.href = 'cause.html';
    }, 1100);
  }

  function handleLetterGuess(letter) {
    if (!letter || !/^[A-Z]$/.test(letter)) {
      showMessage('Please enter a letter A–Z.');
      return;
    }

    if (revealed.some((v, i) => v && primaryWord[i] === letter) || wrongLetters.has(letter)) {
      showMessage(`You've already tried "${letter}".`);
      return;
    }

    let found = false;
    for (let i = 0; i < primaryWord.length; i++) {
      if (primaryWord[i] === letter) {
        revealed[i] = true;
        found = true;
      }
    }

    if (found) {
      renderWord();
      showMessage(`Nice! "${letter}" is in the word.`);
      if (checkWin()) winAndRedirect();
    } else {
      wrongLetters.add(letter);
      updateWrong();
      showMessage(`Nope — "${letter}" is not in the word.`);
    }
  }

  function handleFullWordTry(input) {
    if (!input) { showMessage('Type a word to try.'); return; }
    const attempt = input.trim().toUpperCase();
    if (acceptedWords.has(attempt)) {
      // If attempt isn't the primaryWord, reveal all letters visually first
      for (let i = 0; i < primaryWord.length; i++) revealed[i] = true;
      renderWord();
      winAndRedirect();
    } else {
      showMessage(`"${attempt}" is not correct. Keep trying!`);
    }
  }

  guessBtn.addEventListener('click', () => {
    const val = letterInput.value.toUpperCase();
    letterInput.value = '';
    letterInput.focus();
    handleLetterGuess(val);
  });

  letterInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') guessBtn.click();
  });

  tryWordBtn.addEventListener('click', () => {
    const val = wordInput.value;
    wordInput.value = '';
    wordInput.focus();
    handleFullWordTry(val);
  });

  wordInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') tryWordBtn.click();
  });

  hintBtn.addEventListener('click', () => {
    const options = [];
    for (let i = 0; i < primaryWord.length; i++) if (!revealed[i]) options.push(i);
    if (options.length === 0) return;
    const idx = options[Math.floor(Math.random() * options.length)];
    const letter = primaryWord[idx];
    revealed[idx] = true;
    renderWord();
    showMessage(`Hint: revealed a letter "${letter}".`);
    if (checkWin()) winAndRedirect();
  });

  resetBtn.addEventListener('click', () => {
    for (let i = 0; i < revealed.length; i++) revealed[i] = false;
    wrongLetters.clear();
    updateWrong();
    renderWord();
    showMessage('Game reset. Try again!');
  });

  // initialize
  (function init() {
    for (let i = 0; i < primaryWord.length; i++) revealed[i] = false;
    renderWord();
    updateWrong();
    letterInput.focus();
    showMessage('Start by guessing a letter or try the full word.');
  })();
})();
