// Issue #4: Parent dashboard — track completed letters
const PROGRESS_KEY = 'abcWorldProgress';

const ParentDash = {
  getProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); }
    catch { return {}; }
  },
  markComplete(letter) {
    const p = this.getProgress();
    p[letter.toUpperCase()] = { completed: true, date: new Date().toISOString() };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  },
  reset() {
    if (confirm('Reset all progress?')) {
      localStorage.removeItem(PROGRESS_KEY);
      this.render();
    }
  },
  render(containerId = 'parent-dashboard') {
    const el = document.getElementById(containerId);
    if (!el) return;
    const p = this.getProgress();
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const done = letters.filter(l => p[l]?.completed).length;
    el.innerHTML = `
      <div style="background:#fff;border-radius:20px;padding:24px;box-shadow:0 4px 16px rgba(0,0,0,.1)">
        <h2 style="color:#7c3aed;margin:0 0 8px">📊 Learning Progress</h2>
        <p style="color:#6b7280;font-size:.9rem;margin:0 0 16px">${done}/26 letters completed (${Math.round(done/26*100)}%)</p>
        <div style="background:#e5e7eb;border-radius:10px;height:10px;margin-bottom:20px">
          <div style="background:linear-gradient(90deg,#7c3aed,#ec4899);height:100%;border-radius:10px;width:${Math.round(done/26*100)}%;transition:width .5s"></div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px">
          ${letters.map(l => `<div onclick="ParentDash.markComplete('${l}')" title="Mark ${l} done"
            style="aspect-ratio:1;border-radius:10px;display:flex;align-items:center;justify-content:center;
            font-size:1.1rem;font-weight:800;cursor:pointer;
            background:${p[l]?.completed?'linear-gradient(135deg,#7c3aed,#ec4899)':'#f3f4f6'};
            color:${p[l]?.completed?'#fff':'#9ca3af'}">${l}</div>`).join('')}
        </div>
        <button onclick="ParentDash.reset()" style="margin-top:16px;padding:8px 16px;border-radius:8px;border:1px solid #e5e7eb;background:#fff;color:#6b7280;cursor:pointer;font-size:.8rem">Reset progress</button>
      </div>`;
  }
};
window.ParentDash = ParentDash;
