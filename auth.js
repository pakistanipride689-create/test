/* ============================================================
   STPL CMS — Shared Auth & Role Logic
   Manager EmpID: 4190123 | Password: admin (fixed, private)
   ============================================================ */

const MANAGER_EMP_ID = '4190123';
const MANAGER_PASSWORD = 'admin';

/* ─── Session Helpers ─── */
function getSession() {
  try { return JSON.parse(sessionStorage.getItem('stpl_session') || 'null'); } catch { return null; }
}
function setSession(data) {
  sessionStorage.setItem('stpl_session', JSON.stringify(data));
}
function clearSession() {
  sessionStorage.removeItem('stpl_session');
}

/* ─── Require login; redirect to login.html if not authenticated ─── */
function requireLogin() {
  const s = getSession();
  if (!s) { window.location.href = 'login.html'; return null; }
  return s;
}

/* ─── Require specific role ─── */
function requireRole(roles) {
  const s = requireLogin();
  if (!s) return null;
  if (!roles.includes(s.role)) {
    window.location.href = 'dashboard.html';
    return null;
  }
  return s;
}

/* ─── Logout ─── */
function logout() {
  clearSession();
  window.location.href = 'login.html';
}

/* ─── LocalStorage helpers for signup requests ─── */
function getPendingRequests() {
  const requests = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('signup_request_')) {
      try {
        const r = JSON.parse(localStorage.getItem(key));
        if (r) requests.push(r);
      } catch {}
    }
  }
  return requests;
}

function getPendingCount() {
  return getPendingRequests().filter(r => r.status === 'pending').length;
}

function getSignupRequest(empId) {
  try { return JSON.parse(localStorage.getItem('signup_request_' + empId) || 'null'); } catch { return null; }
}

function getApprovedUser(empId) {
  try { return JSON.parse(localStorage.getItem('user_' + empId) || 'null'); } catch { return null; }
}

/* ─── Render user info badge ─── */
function renderUserBadge(containerId) {
  const s = getSession();
  if (!s) return;
  const el = document.getElementById(containerId);
  if (!el) return;
  const roleColors = { Manager: '#FCD34D', Admin: '#34D399', Employee: '#60A5FA' };
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:0.6rem;background:rgba(26,10,10,0.7);
      border:1px solid rgba(220,38,38,0.3);border-radius:10px;padding:0.4rem 0.8rem;margin-top:0.5rem;">
      <span style="font-size:1rem;">👤</span>
      <div>
        <div style="font-family:'Orbitron',sans-serif;font-size:0.65rem;letter-spacing:1px;
          color:${roleColors[s.role] || '#EF4444'};">${s.role.toUpperCase()}</div>
        <div style="font-size:0.8rem;color:#F5F5F5;font-weight:600;">${s.fullName}</div>
      </div>
      <button onclick="logout()" style="margin-left:auto;background:rgba(220,38,38,0.2);
        border:1px solid rgba(220,38,38,0.4);color:#EF4444;border-radius:6px;
        padding:0.2rem 0.5rem;cursor:pointer;font-family:'Rajdhani',sans-serif;
        font-size:0.75rem;font-weight:700;letter-spacing:0.5px;transition:all 0.2s;"
        onmouseover="this.style.background='rgba(220,38,38,0.4)'"
        onmouseout="this.style.background='rgba(220,38,38,0.2)'">LOGOUT</button>
    </div>`;
}

/* ─── Register Service Worker ─── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => {}).catch(() => {});
  });
}
