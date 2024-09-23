const mensajeError = document.getElementsByClassName("errormsg")[0];

document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const res = await fetch("http://localhost:4000/api/register", {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      user: e.target.elements.user.value,
      password: e.target.elements.password.value,
      email: e.target.elements.email.value
    })
  });
  if (res.ok) {
    const resJson = await res.json();
    if (resJson.redirect) {
      return window.location.href = resJson.redirect;
    }
  }
  mensajeError.classList.toggle("oculto", false);
})
