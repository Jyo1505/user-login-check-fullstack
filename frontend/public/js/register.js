

const API_BASE = "https://user-login-check-fullstack.onrender.com";
    document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();
    register();
  });
   document.getElementById("password").addEventListener("input", () => {
    const password = document.getElementById("password").value;
    const msg = checkPasswordStrength(password);
    const strength = document.getElementById("strength");
    strength.innerText = msg;
    strength.style.color = msg.includes("Strong") ? "green" : "red";
  });
});

function validateEmail(email) {
  const allowedDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com"
  ];

  const parts = email.toLowerCase().split("@");
  if (parts.length !== 2) return false;

  return allowedDomains.includes(parts[1]);
}


function checkPasswordStrength(password) {
  if (password.length < 8) return "❌ Minimum 8 characters required";
  if (!/[A-Z]/.test(password)) return "❌ At least one uppercase letter required";
  if (!/[a-z]/.test(password)) return "❌ At least one lowercase letter required";
  if (!/[0-9]/.test(password)) return "❌ At least one number required";
  return "✅ Strong password";
}



async function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const msg = document.getElementById("msg");

  msg.style.color = "red";

  if (!name || !email || !password || !confirmPassword) {
    msg.innerText = "All fields are required";
    return;
  }

  if (!validateEmail(email)) {
   msg.innerText = "Enter a valid email (gmail.com, yahoo.com, etc.)";

    return;
  }

  const strengthMessage = checkPasswordStrength(password);
  if (!strengthMessage.includes("Strong")) {
    msg.innerText = "Password is weak. Follow the rules above.";
    return;
  }

  if (password !== confirmPassword) {
    msg.innerText = "Passwords do not match";
    return;
  }

  try {
  const res = await fetch(`${API_BASE}/api/auth/register`, {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      msg.innerText = data.message || "Registration failed";
      return;
    }

    msg.style.color = "green";
    msg.innerText = "Registered successfully! Redirecting to login...";

    setTimeout(() => {
      window.location.href = "/pages/login.html";
    }, 1500);

  } catch (err) {
  console.log("REGISTER FETCH ERROR:", err);
  msg.innerText = "Server error. Try again.";
}

}



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
