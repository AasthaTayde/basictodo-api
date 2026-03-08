document.addEventListener("DOMContentLoaded",function(){
  const form = document.getElementById("registerationForm");
  const msgEl=document.getElementById("registermessage");
  form.addEventListener("submit",async (e) => {
    e.preventDefault();

    const email=document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try{
      const res = await fetch("/register",{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email,password })
      });

      const data = await res.json();
      if(res.status === 201)
      {
        msgEl.style.color = "green";
        msgEl.textContent = data.message;
        form.reset();

        setTimeout(() =>{
          window.location.href = "login.html";
        }, 1500);// wait 1.5 sec so user can see success message
      }
      else
      {
        msgEl.style.color = "red";
        msgEl.textContent = data.error || data.message;
      }
    }
    catch(err)
    {
      msgEl.style.color ="red";
      msgEl.textContent = "Server error. Please try again.";
    }
  });
});