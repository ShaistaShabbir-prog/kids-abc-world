// Kids ABC World — 2-Player Quiz Battle
// Two children take turns answering letter questions.
// First to 10 correct wins!

const KAWMultiplayer = (function() {
  let active = false;
  let currentPlayer = 1;
  let scores = { 1: 0, 2: 0 };
  let playerNames = { 1: 'Player 1', 2: 'Player 2' };
  const WIN_SCORE = 10;
  const COLORS = { 1: '#7c3aed', 2: '#ec4899' };

  const LETTER_WORDS = {
    A:'Apple',B:'Ball',C:'Cat',D:'Dog',E:'Elephant',F:'Fish',
    G:'Goat',H:'Hat',I:'Igloo',J:'Juice',K:'Kite',L:'Lion',
    M:'Moon',N:'Nest',O:'Owl',P:'Pig',Q:'Queen',R:'Rain',
    S:'Sun',T:'Tree',U:'Umbrella',V:'Van',W:'Water',X:'X-ray',
    Y:'Yarn',Z:'Zebra'
  };

  function randomLetter() {
    const keys = Object.keys(LETTER_WORDS);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  function getWrongOptions(correct, count = 3) {
    const opts = [];
    const allLetters = Object.keys(LETTER_WORDS);
    while (opts.length < count) {
      const l = allLetters[Math.floor(Math.random() * allLetters.length)];
      if (l !== correct && !opts.includes(l)) opts.push(l);
    }
    return opts;
  }

  function start() {
    active = true;
    scores = { 1: 0, 2: 0 };
    currentPlayer = 1;
    showQuestion();
  }

  function stop() {
    active = false;
    const modal = document.getElementById('kaw-mp-modal');
    if (modal) modal.remove();
    const hud = document.getElementById('kaw-mp-hud');
    if (hud) hud.remove();
  }

  function showQuestion() {
    const letter = randomLetter();
    const word = LETTER_WORDS[letter];
    const wrongs = getWrongOptions(letter);
    const choices = [letter, ...wrongs].sort(() => Math.random() - 0.5);
    const playerColor = COLORS[currentPlayer];
    const playerName = playerNames[currentPlayer];

    // Speak the word aloud
    if (window.kidSpeak) {
      setTimeout(() => kidSpeak('Which letter does ' + word + ' start with?'), 200);
    }

    let modal = document.getElementById('kaw-mp-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'kaw-mp-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;' +
        'display:flex;align-items:center;justify-content:center';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div style="background:#1a1f2e;border-radius:24px;padding:28px;max-width:360px;width:92%;text-align:center;border:2px solid ${playerColor}">
        <!-- Scores -->
        <div style="display:flex;justify-content:space-between;margin-bottom:16px">
          ${[1,2].map(p => `
            <div style="flex:1;opacity:${p===currentPlayer?1:0.4}">
              <div style="color:${COLORS[p]};font-weight:700;font-size:0.8rem">${playerNames[p]}</div>
              <div style="font-size:1.6rem;font-weight:900;color:#e6edf3">${scores[p]}</div>
              <div style="font-size:0.7rem;color:#8b949e">/ ${WIN_SCORE}</div>
            </div>`).join('<div style="color:#30363d;font-size:1.2rem">⚔️</div>')}
        </div>

        <!-- Player indicator -->
        <div style="background:${playerColor}22;border:1px solid ${playerColor};border-radius:10px;
          padding:6px 12px;margin-bottom:16px;color:${playerColor};font-weight:700;font-size:0.85rem">
          ${playerName}'s turn! 🎯
        </div>

        <!-- Question -->
        <div style="font-size:2rem;margin-bottom:6px">🖼️ ${word}</div>
        <div style="color:#8b949e;margin-bottom:20px;font-size:0.9rem">
          Which letter does <strong style="color:#e6edf3">${word}</strong> start with?
        </div>

        <!-- Choices -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          ${choices.map(c => `
            <button onclick="KAWMultiplayer.answer('${c}','${letter}')"
              style="padding:16px;border-radius:14px;border:2px solid #30363d;
                background:#0d1117;color:#e6edf3;font-size:1.8rem;font-weight:900;
                cursor:pointer;transition:all 0.15s"
              onmouseover="this.style.borderColor='${playerColor}';this.style.background='${playerColor}22'"
              onmouseout="this.style.borderColor='#30363d';this.style.background='#0d1117'">
              ${c}
            </button>`).join('')}
        </div>

        <button onclick="KAWMultiplayer.stop()"
          style="margin-top:16px;background:transparent;border:none;color:#8b949e;
            cursor:pointer;font-size:0.8rem">✕ Exit game</button>
      </div>`;
  }

  function answer(chosen, correct) {
    const isCorrect = chosen === correct;
    const modal = document.getElementById('kaw-mp-modal');

    if (isCorrect) {
      scores[currentPlayer]++;
      if (window.kidSpeak) kidSpeak('Correct! Well done!');
      if (window.addProgressStars) addProgressStars(1);

      if (scores[currentPlayer] >= WIN_SCORE) {
        endGame();
        return;
      }
    } else {
      if (window.kidSpeak) kidSpeak(correct + ' is for ' + (LETTER_WORDS[correct] || correct));
    }

    // Flash result
    if (modal) {
      const flash = document.createElement('div');
      flash.style.cssText = `position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
        background:${isCorrect?'rgba(34,197,94,0.85)':'rgba(239,68,68,0.85)'};border-radius:24px;
        font-size:4rem;z-index:1`;
      flash.textContent = isCorrect ? '✅' : '❌';
      modal.firstChild.style.position = 'relative';
      modal.firstChild.appendChild(flash);
      setTimeout(() => {
        flash.remove();
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        showQuestion();
      }, 900);
    }
  }

  function endGame() {
    const winner = scores[1] > scores[2] ? 1 : 2;
    const modal = document.getElementById('kaw-mp-modal');
    if (!modal) return;
    if (window.kidSpeak) kidSpeak(playerNames[winner] + ' wins! Amazing!');

    modal.innerHTML = `
      <div style="background:#1a1f2e;border-radius:24px;padding:32px;max-width:340px;
        width:90%;text-align:center;border:2px solid ${COLORS[winner]}">
        <div style="font-size:3rem;margin-bottom:8px">🏆</div>
        <div style="color:${COLORS[winner]};font-size:1.4rem;font-weight:900;margin-bottom:4px">
          ${playerNames[winner]} Wins!
        </div>
        <div style="color:#8b949e;margin-bottom:20px">
          ${scores[1]} — ${scores[2]}
        </div>
        <div style="display:flex;gap:10px;justify-content:center">
          <button onclick="KAWMultiplayer.start()"
            style="background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;border:none;
              padding:10px 20px;border-radius:12px;font-weight:700;cursor:pointer">
            🔄 Play Again
          </button>
          <button onclick="KAWMultiplayer.stop()"
            style="background:rgba(255,255,255,0.1);color:#fff;border:none;
              padding:10px 20px;border-radius:12px;cursor:pointer">
            Exit
          </button>
        </div>
      </div>`;
  }

  function showSetup() {
    let modal = document.getElementById('kaw-mp-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'kaw-mp-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;' +
        'display:flex;align-items:center;justify-content:center';
      document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div style="background:#1a1f2e;border-radius:24px;padding:28px;max-width:340px;width:92%;
        text-align:center;border:1px solid #30363d">
        <div style="font-size:2rem;margin-bottom:8px">👫</div>
        <h2 style="color:#a78bfa;margin:0 0 4px">2-Player Quiz!</h2>
        <p style="color:#8b949e;font-size:0.85rem;margin:0 0 20px">First to ${WIN_SCORE} correct wins!</p>
        <input id="kaw-p1" placeholder="Player 1 name 🟣" maxlength="12"
          style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid #7c3aed;
            background:#0d1117;color:#e6edf3;font-size:0.9rem;margin-bottom:8px;box-sizing:border-box">
        <input id="kaw-p2" placeholder="Player 2 name 🩷" maxlength="12"
          style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid #ec4899;
            background:#0d1117;color:#e6edf3;font-size:0.9rem;margin-bottom:16px;box-sizing:border-box">
        <div style="display:flex;gap:8px;justify-content:center">
          <button onclick="
            KAWMultiplayer.playerNames[1]=document.getElementById('kaw-p1').value.trim()||'Player 1';
            KAWMultiplayer.playerNames[2]=document.getElementById('kaw-p2').value.trim()||'Player 2';
            KAWMultiplayer.start();"
            style="background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;border:none;
              padding:10px 24px;border-radius:12px;font-weight:700;cursor:pointer">
            🎮 Start!
          </button>
          <button onclick="document.getElementById('kaw-mp-modal').style.display='none'"
            style="background:rgba(255,255,255,0.1);color:#fff;border:none;
              padding:10px 16px;border-radius:12px;cursor:pointer">Cancel</button>
        </div>
      </div>`;
  }

  return { start, stop, answer, showSetup,
           playerNames, get scores() { return {...scores}; } };
})();

window.KAWMultiplayer = KAWMultiplayer;
