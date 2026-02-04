document.addEventListener("DOMContentLoaded", () => {
  const demoOtp = localStorage.getItem("demoOtp");
  document.getElementById("demo").innerText =
    "Demo OTP (testing): " + demoOtp;
});

async function verifyOTP() {
  const otp = document.getElementById("otp").value;
  const userId = localStorage.getItem("userId");

  const res = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, otp })
  });

  const data = await res.json();

  if (!res.ok) {
    document.getElementById("msg").innerText = data.message;
    return;
  }

  // cleanup after success
  localStorage.removeItem("demoOtp");

  window.location.href = "dashboard.html";
}
