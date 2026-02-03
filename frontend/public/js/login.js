async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://192.168.0.102:5001/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    document.getElementById("msg").innerText = data.message;
    return;
  }

  if (data.otpRequired) {
    localStorage.setItem("userId", data.userId);
    window.location.href = "otp.html";
  } else {
    localStorage.setItem("userId", data.userId || "");
    window.location.href = "dashboard.html";
  }
}


/* ===== PASSWORD TOGGLE ===== */
function togglePassword(id, icon) {
  const input = document.getElementById(id);

  if (input.type === "password") {
    input.type = "text";
    icon.textContent = "🙈";
  } else {
    input.type = "password";
    icon.textContent = "👁";
  }
}