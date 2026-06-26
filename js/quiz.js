// Issue #9: Quiz mode for Kids ABC World
(function(){
  const LETTER_WORDS = {
    A:['Apple','Ant','Astronaut'],B:['Bear','Ball','Boat'],C:['Cat','Car','Cake'],
    D:['Dog','Duck','Door'],E:['Elephant','Egg','Ear'],F:['Fish','Frog','Fire'],
    G:['Goat','Girl','Grapes'],H:['Hat','Horse','House'],I:['Ice','Insect','Igloo'],
    J:['Juice','Jar','Jellyfish'],K:['Kite','King','Koala'],L:['Lion','Lamp','Leaf'],
    M:['Moon','Mouse','Mango'],N:['Nest','Nose','Nut'],O:['Owl','Orange','Ocean'],
    P:['Pig','Pen','Pear'],Q:['Queen','Quilt','Quiz'],R:['Rain','Rabbit','Ring'],
    S:['Sun','Snake','Star'],T:['Tree','Tiger','Toy'],U:['Umbrella','Under','Up'],
    V:['Van','Violin','Volcano'],W:['Water','Wolf','Wind'],X:['X-ray','Xylophone','Fox'],
    Y:['Yarn','Yak','Yellow'],Z:['Zebra','Zoo','Zero']
  };

  let score=0, total=0, currentQuestion=null;

  function randomLetter() {
    const keys = Object.keys(LETTER_WORDS);
    return keys[Math.floor(Math.random()*keys.length)];
  }

  function generateQuestion() {
    const letter = randomLetter();
    const correct = LETTER_WORDS[letter][Math.floor(Math.random()*3)];
    // 3 distractors from other letters
    const wrong = [];
    while(wrong.length < 3) {
      const w = randomLetter();
      if(w !== letter) wrong.push(LETTER_WORDS[w][0]);
    }
    const choices = [correct,...wrong].sort(()=>Math.random()-.5);
    return {letter, correct, choices};
  }

  function showQuiz() {
    let modal = document.getElementById('quiz-modal');
    if(!modal) {
      modal = document.createElement('div');
      modal.id = 'quiz-modal';
      modal.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(255,240,250,.95);z-index:9996;overflow-y:auto;padding:20px;display:flex;align-items:center;justify-content:center';
      document.body.appendChild(modal);
    }

    currentQuestion = generateQuestion();
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div style="background:#fff;border-radius:24px;padding:32px;max-width:400px;width:100%;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,.15)">
        <div style="display:flex;justify-content:space-between;margin-bottom:16px">
          <span style="font-size:.85rem;color:#9ca3af">Score: <b style="color:#7c3aed">${score}/${total}</b></span>
          <button onclick="document.getElementById('quiz-modal').style.display='none'"
            style="background:none;border:none;color:#9ca3af;cursor:pointer;font-size:1.1rem">✕</button>
        </div>
        <div style="font-size:.85rem;color:#6b7280;margin-bottom:8px">Which word starts with...</div>
        <div style="font-size:6rem;font-weight:900;color:#7c3aed;margin:8px 0;line-height:1">${currentQuestion.letter}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px">
          ${currentQuestion.choices.map(w=>`
            <button onclick="checkAnswer('${w}')"
              style="padding:14px;border-radius:14px;border:2px solid #e5e7eb;background:#fff;font-size:1rem;font-weight:700;cursor:pointer;transition:all .15s"
              onmouseover="this.style.borderColor='#7c3aed';this.style.background='#f5f3ff'"
              onmouseout="this.style.borderColor='#e5e7eb';this.style.background='#fff'">
              ${w}
            </button>`).join('')}
        </div>
        <div id="quiz-feedback" style="min-height:40px;margin-top:12px;font-size:1rem;font-weight:700"></div>
      </div>`;
  }

  window.checkAnswer = function(word) {
    total++;
    const fb = document.getElementById('quiz-feedback');
    if(!fb) return;
    if(word === currentQuestion.correct) {
      score++;
      fb.style.color = '#22c55e';
      fb.textContent = '🎉 Correct! ' + word + ' starts with ' + currentQuestion.letter + '!';
    } else {
      fb.style.color = '#ef4444';
      fb.textContent = '❌ Not quite! ' + currentQuestion.correct + ' starts with ' + currentQuestion.letter;
    }
    if('speechSynthesis' in window){
      const u = new SpeechSynthesisUtterance(word);
      u.lang='en-US'; speechSynthesis.speak(u);
    }
    setTimeout(showQuiz, 1600);
  };

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.createElement('button');
    btn.innerHTML = '🎯 Quiz';
    btn.style.cssText = 'position:fixed;bottom:16px;right:96px;z-index:998;padding:10px 18px;background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;border:none;border-radius:50px;cursor:pointer;font-size:.9rem;font-weight:800;box-shadow:0 4px 14px rgba(124,58,237,.4)';
    btn.onclick = showQuiz;
    document.body.appendChild(btn);
  });

  window.ABCQuiz = {start: showQuiz};
})();
