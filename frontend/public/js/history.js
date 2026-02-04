const API_BASE = "https://user-login-check-fullstack.onrender.com";
async function loadHistory() {
  const userId = localStorage.getItem("userId");

  const res = await fetch(`${API_BASE}/api/history/${userId}`);
 const data = await res.json();

  let html = "";
  data.forEach(d => {
    html += `
      <div class="history-item">
        <b>Date:</b> ${d.login_time}<br>
        <b>Browser:</b> ${d.browser} |
        <b>OS:</b> ${d.os} |
        <b>Device:</b> ${d.device_type}<br>
        <b>IP:</b> ${d.ip_address}
      </div>
    `;
  });

  document.getElementById("history").innerHTML = html;
}

function back() {
  window.location.href = "dashboard.html";
}

loadHistory();
