// register.js - with auto-redirect for logged-in users

// --------------- Auto-redirect if already logged in ---------------
const token = localStorage.getItem("token");
if (token) {
  window.location.href = "index.html";
}

// --------------- Registration form logic ---------------
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerationForm");
  const msgEl = document.getElementById("registermessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.status === 201) {
        msgEl.style.color = "green";
        msgEl.textContent = data.message;
        form.reset();

        // Optional: redirect to login page after 1s
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1000);

      } else {
        msgEl.style.color = "red";
        msgEl.textContent = data.error || data.message;
      }

    } catch (err) {
      console.error(err);
      msgEl.style.color = "red";
      msgEl.textContent = "Server error. Please try again.";
    }
  });
});