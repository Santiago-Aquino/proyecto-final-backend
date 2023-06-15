const buttonRole = document.getElementById("buttonRole");
const buttonEliminar = document.getElementById("buttonEliminar");
const id = document.getElementById("id");

buttonEliminar.addEventListener("click", (e) => {
  e.preventDefault();
  fetch(`/api/users/${id.innerText.trim()}`, {
    method: "DELETE",
    body: "",
    headers: {
      "Content-type": "application/json",
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

buttonRole.addEventListener("click", (e) => {
  e.preventDefault();
  Swal.fire({
    title: "Escriba el role a cambiar",
    text: "usuario / premium / admin",
    input: "text",
    inputValidator: async (value) => {
      if (!value) {
        return "Tiene que escribir un role para cambiar";
      }
      if (value === "usuario" || value === "premium" || value === "admin")
        fetch(`/api/users/change/${id.innerText.trim()}/admin/${value}`, {
          method: "PUT",
          body: "",
          headers: {
            "Content-type": "application/json",
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
      else {
        return "escriba un role valido";
      }
    },
  });
});
