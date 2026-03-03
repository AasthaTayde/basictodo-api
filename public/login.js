const form = document.getElementById("loginForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  const msgEl = document.getElementById("loginMessage");
  if (res.ok && data.token) {
    localStorage.setItem("token", data.token); // Save JWT for future requests
    msgEl.style.color = "green";
    msgEl.textContent = "Login successful! You can now access todos.";
  } else {
    msgEl.style.color = "red";
    msgEl.textContent = data.message || data.error;
  }
});