const form = document.getElementById("changeForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let token = document.getElementById("token").innerText;
  let password = document.getElementById("password").value;

  const data = {
    token,
    password,
  };

  fetch("/api/sessions/changePassword/", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((json) => {
      if (json.error) {
        Swal.fire({
          title: `${json.status}`,
          icon: "error",
          text: `${json.error}`,
        });
      } else {
        Swal.fire({
          title: `${json.status}`,
          icon: "success",
          text: `${json.message}`,
        });
      }
    });
});
