// Kids ABC World — Difficulty / Age Levels
// Toddler (2-3) / Beginner (4-5) / Learner (5-6) / Advanced (6-7)

const KAWDifficulty = (function() {
  const LEVELS = {
    toddler: {
      label: '🐣 Toddler',
      ageRange: '2-3 years',
      color: '#22c55e',
      quizChoices: 2,          // only 2 options (easier)
      quizTime: 0,             // no timer
      voiceEnabled: true,      // always reads question aloud
      showHints: true,         // highlight first letter
      letterSet: 'AEIOU',     // vowels only first
      description: '2 choices · No timer · Vowels first',
    },
    beginner: {
      label: '🌱 Beginner',
      ageRange: '4-5 years',
      color: '#3b82f6',
      quizChoices: 3,
      quizTime: 0,
      voiceEnabled: true,
      showHints: false,
      letterSet: 'ABCDEFGHIJKLM',
      description: '3 choices · No timer · A-M letters',
    },
    learner: {
      label: '📚 Learner',
      ageRange: '5-6 years',
      color: '#f59e0b',
      quizChoices: 4,
      quizTime: 20,            // 20 seconds per question
      voiceEnabled: false,
      showHints: false,
      letterSet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      description: '4 choices · 20s timer · All letters',
    },
    advanced: {
      label: '🚀 Advanced',
      ageRange: '6-7 years',
      color: '#ef4444',
      quizChoices: 4,
      quizTime: 10,            // 10 seconds
      voiceEnabled: false,
      showHints: false,
      letterSet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      description: '4 choices · 10s timer · All letters · harder words',
    },
  };

  let current = localStorage.getItem('kaw_difficulty') || 'beginner';

  function get() { return LEVELS[current] || LEVELS.beginner; }
  function getKey() { return current; }

  function set(key) {
    if (!LEVELS[key]) return;
    current = key;
    localStorage.setItem('kaw_difficulty', key);
    window.KAW_DIFFICULTY = LEVELS[key];
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);' +
      `background:${LEVELS[key].color};color:#fff;padding:10px 24px;border-radius:20px;` +
      'font-weight:700;z-index:9999;pointer-events:none';
    t.textContent = LEVELS[key].label + ' mode! ' + LEVELS[key].ageRange;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
  }

  function showModal() {
    let modal = document.getElementById('kaw-diff-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'kaw-diff-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:10000;' +
        'display:flex;align-items:center;justify-content:center';
      document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div style="background:#1a1f2e;border-radius:24px;padding:24px;max-width:360px;width:92%;border:1px solid #30363d">
        <h2 style="color:#a78bfa;text-align:center;margin:0 0 16px">⚙️ Age Level</h2>
        ${Object.entries(LEVELS).map(([key, d]) => `
          <div onclick="KAWDifficulty.set('${key}');document.getElementById('kaw-diff-modal').style.display='none'"
            style="border:2px solid ${current===key?d.color:'#30363d'};border-radius:14px;
              padding:12px 16px;margin-bottom:10px;cursor:pointer;
              background:${current===key?d.color+'22':'transparent'}">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="color:${d.color};font-weight:700;font-size:1rem">${d.label}</span>
              <span style="color:#8b949e;font-size:0.78rem">👶 ${d.ageRange}</span>
            </div>
            <div style="color:#8b949e;font-size:0.8rem;margin-top:3px">${d.description}</div>
          </div>`).join('')}
        <button onclick="document.getElementById('kaw-diff-modal').style.display='none'"
          style="width:100%;background:rgba(255,255,255,0.1);color:#fff;border:none;
            padding:10px;border-radius:10px;cursor:pointer;margin-top:4px">Close</button>
      </div>`;
  }

  window.KAW_DIFFICULTY = LEVELS[current];
  return { get, getKey, set, showModal, LEVELS };
})();

window.KAWDifficulty = KAWDifficulty;
