// kids-abc-world — Progress tracking
// Saves completed letters, quiz scores, time played to localStorage

const STORAGE_KEY = 'kaw_progress';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      lettersLearned: [], quizScores: [], totalStars: 0,
      sessionsCount: 0, lastSeen: null, animalsHeard: []
    };
  } catch { return { lettersLearned:[], quizScores:[], totalStars:0, sessionsCount:0, animalsHeard:[] }; }
}

function saveProgress(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
}

function markLetterLearned(letter) {
  const p = loadProgress();
  if (!p.lettersLearned.includes(letter)) {
    p.lettersLearned.push(letter);
    p.lastSeen = new Date().toISOString();
    saveProgress(p);
    updateProgressBar();
  }
}

function saveQuizScore(score, total) {
  const p = loadProgress();
  p.quizScores.push({ score, total, date: new Date().toISOString() });
  if (p.quizScores.length > 20) p.quizScores.shift();
  saveProgress(p);
}

function addProgressStars(n) {
  const p = loadProgress();
  p.totalStars = (p.totalStars || 0) + n;
  saveProgress(p);
  showTotalStars();
}

function showTotalStars() {
  const p = loadProgress();
  const el = document.getElementById('total-stars');
  if (el) el.textContent = '⭐ ' + (p.totalStars || 0);
}

function updateProgressBar() {
  const p = loadProgress();
  const pct = Math.round((p.lettersLearned.length / 26) * 100);
  const bar = document.getElementById('progress-bar');
  const label = document.getElementById('progress-label');
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = p.lettersLearned.length + '/26 letters (' + pct + '%)';
}

function renderParentDashboard() {
  const p = loadProgress();
  const el = document.getElementById('parent-dashboard');
  if (!el) return;

  const avgScore = p.quizScores.length
    ? Math.round(p.quizScores.reduce((a,b) => a + (b.score/b.total*100), 0) / p.quizScores.length)
    : 0;

  const mastered = p.lettersLearned.length;
  const remaining = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    .filter(l => !p.lettersLearned.includes(l));

  el.innerHTML = \`
    <div style="background:#0d1117;border:1px solid #30363d;border-radius:12px;padding:1.5rem;max-width:500px;margin:1rem auto;font-family:sans-serif">
      <h2 style="color:#a78bfa;margin:0 0 1rem">📊 Progress Report</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div style="background:#1a1f2e;border-radius:8px;padding:1rem;text-align:center">
          <div style="font-size:2rem">\${mastered}</div>
          <div style="color:#8b949e;font-size:0.8rem">Letters Learned</div>
        </div>
        <div style="background:#1a1f2e;border-radius:8px;padding:1rem;text-align:center">
          <div style="font-size:2rem">\${p.totalStars || 0}⭐</div>
          <div style="color:#8b949e;font-size:0.8rem">Total Stars</div>
        </div>
        <div style="background:#1a1f2e;border-radius:8px;padding:1rem;text-align:center">
          <div style="font-size:2rem">\${avgScore}%</div>
          <div style="color:#8b949e;font-size:0.8rem">Quiz Average</div>
        </div>
        <div style="background:#1a1f2e;border-radius:8px;padding:1rem;text-align:center">
          <div style="font-size:2rem">\${p.quizScores.length}</div>
          <div style="color:#8b949e;font-size:0.8rem">Quizzes Done</div>
        </div>
      </div>
      \${remaining.length > 0 ? \`<p style="color:#8b949e;font-size:0.85rem">
        Still to learn: \${remaining.join(' ')}
      </p>\` : '<p style="color:#4ade80">🎉 All 26 letters mastered!</p>'}
      <button onclick="if(confirm('Reset all progress?')){localStorage.removeItem('kaw_progress');location.reload();}"
        style="background:#7c3aed;color:white;border:none;padding:0.5rem 1rem;border-radius:6px;cursor:pointer;font-size:0.85rem">
        🗑️ Reset Progress
      </button>
    </div>\`;
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  const p = loadProgress();
  p.sessionsCount = (p.sessionsCount || 0) + 1;
  p.lastSeen = new Date().toISOString();
  saveProgress(p);
  updateProgressBar();
  showTotalStars();
  renderParentDashboard();
});
