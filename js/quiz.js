// Issue #9: Quiz mode — test letter knowledge
const Quiz = {
  letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  words: {
    A:'Apple',B:'Bear',C:'Cat',D:'Dog',E:'Egg',F:'Fish',G:'Goat',H:'Hat',
    I:'Ice',J:'Jam',K:'Kite',L:'Lion',M:'Moon',N:'Nest',O:'Orange',P:'Pig',
    Q:'Queen',R:'Rain',S:'Sun',T:'Tree',U:'Umbrella',V:'Van',W:'Whale',
    X:'Xylophone',Y:'Yarn',Z:'Zebra',
  },
  score: 0, total: 0, currentLetter: '',

  start(containerId = 'quiz-container') {
    this.score = 0; this.total = 0;
    this.el = document.getElementById(containerId);
    this.nextQuestion();
  },

  nextQuestion() {
    this.currentLetter = this.letters[Math.floor(Math.random() * 26)];
    const correct = this.words[this.currentLetter];
    const wrong = this.letters
      .filter(l => l !== this.currentLetter)
      .sort(() => Math.random() - .5)
      .slice(0, 2)
      .map(l => this.words[l]);
    const options = [correct, ...wrong].sort(() => Math.random() - .5);

    if (!this.el) return;
    this.el.innerHTML = `
      <div style="text-align:center;padding:20px">
        <div style="font-size:4rem;margin-bottom:8px">${this.currentLetter}</div>
        <p style="color:#6b7280;margin-bottom:20px">Which word starts with <strong>${this.currentLetter}</strong>?</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:300px;margin:0 auto">
          ${options.map(opt => `
            <button onclick="Quiz.answer('${opt}')"
              style="padding:14px;border-radius:12px;border:2px solid #e5e7eb;background:#fff;
              font-size:1rem;font-weight:700;cursor:pointer;transition:all .15s"
              onmouseover="this.style.borderColor='#7c3aed'" onmouseout="this.style.borderColor='#e5e7eb'">
              ${opt}
            </button>`).join('')}
        </div>
        <div style="margin-top:16px;color:#9ca3af;font-size:.85rem">Score: ${this.score}/${this.total}</div>
      </div>`;
  },

  answer(choice) {
    this.total++;
    const correct = this.words[this.currentLetter];
    if (choice === correct) {
      this.score++;
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(`${correct}! Correct!`);
        u.lang = 'en-US'; speechSynthesis.speak(u);
      }
    }
    if (this.el) {
      this.el.querySelector(`button[onclick="Quiz.answer('${choice}')"]`).style.background =
        choice === correct ? '#dcfce7' : '#fee2e2';
    }
    setTimeout(() => this.nextQuestion(), 1200);
  },
};
window.Quiz = Quiz;
