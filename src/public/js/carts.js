const button = document.getElementById("buttonCompra");
const idUser = document.getElementById("idUser");
const emailUser = document.getElementById("emailUser");

button.addEventListener("click", (e) => {
  e.preventDefault();

  fetch("/api/users")
    .then((result) => result.json())
    .then((json) => {
      const index = json.payload.findIndex(
        (user) => user.email === emailUser.innerText.trim()
      );
      const user = json.payload[index];

      fetch(`/api/carts/${user.cart._id}/purchase`, {
        method: "POST",
        body: "",
        headers: { "Content-Type": "application/json" },
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
              toast: true,
              text: "Carrito con productos comprados",
              position: "top-right",
              showConfirmButton: false,
              timer: 2500,
            });
          }
        });
    });
});
