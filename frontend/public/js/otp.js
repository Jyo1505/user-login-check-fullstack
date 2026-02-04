document.getElementById("demo").innerText =
  "Demo OTP (testing): " + localStorage.getItem("demoOtp");

  async function verifyOtp() {
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

  window.location.href = "dashboard.html";
}
