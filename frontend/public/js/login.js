async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  msg.innerText = "";

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      msg.innerText = data.message || "Login failed";
      return;
    }

    if (data.otpRequired) {
  localStorage.setItem("userId", data.userId);

  // ✅ SHOW DEMO OTP
  if (data.demoOtp) {
    alert("Demo OTP (for testing): " + data.demoOtp);
  }

  window.location.href = "otp.html";
}
 else {
      localStorage.setItem("userId", data.userId);
      window.location.href = "dashboard.html";
    }

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    msg.innerText = "Server not responding. Try again.";
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