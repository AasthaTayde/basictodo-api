const form = document.getElementById("registerForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  const msgEl = document.getElementById("registerMessage");
  if (res.status === 201) {
    msgEl.style.color = "green";
    msgEl.textContent = data.message;
  } else {
    msgEl.style.color = "red";
    msgEl.textContent = data.error || data.message;
  }
});