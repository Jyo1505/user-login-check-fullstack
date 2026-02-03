function goHistory() {
  window.location.href = "login-history.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
