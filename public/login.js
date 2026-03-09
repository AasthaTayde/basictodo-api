// login.js - with auto-redirect for logged-in users

// --------------- Auto-redirect if already logged in ---------------
const token = localStorage.getItem("token");
if (token) {
  window.location.href = "index.html";
}

// --------------- Login form logic ---------------
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const msgEl = document.getElementById("loginMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // Save token
        localStorage.setItem("token", data.token);

        // Show success message
        msgEl.style.color = "green";
        msgEl.textContent = "Login successful! Redirecting...";

        // Redirect to todo page
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);

      } else {
        msgEl.style.color = "red";
        msgEl.textContent = data.message || data.error || "Login failed";
      }

    } catch (err) {
      console.error(err);
      msgEl.style.color = "red";
      msgEl.textContent = "Server error. Please try again.";
    }
  });
});