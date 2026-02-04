// https://user-login-check-fullstack.onrender.com/
const API_BASE = "https://user-login-check-fullstack.onrender.com";

function goHistory() {
  window.location.href = "login-history.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
