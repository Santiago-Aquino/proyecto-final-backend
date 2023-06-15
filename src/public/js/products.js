const idUser = document.getElementById("idUser");
const emailUser = document.getElementById("emailUser");
const buttonComprar = document.getElementById("buttonComprar");

const addToCart = async (productId) => {
  fetch("/api/users")
    .then((result) => result.json())
    .then((json) => {
      const index = json.payload.findIndex(
        (user) => user.email === emailUser.innerText.trim()
      );
      const user = json.payload[index];

      if (!user.cart) {
        fetch(`/api/carts`, {
          method: "POST",
          body: "",
          headers: { "Content-Type": "application/json" },
        })
          .then((result) => result.json())
          .then((json) => {
            fetch(
              `/api/users/${idUser.innerText.trim()}/carts/${json.payload._id}`,
              {
                method: "PUT",
                body: "",
                headers: {
                  "Content-type": "application/json",
                },
              }
            );
          });

        Swal.fire({
          title: "Carrito Agregado",
          text: "presione otra vez el boton para agregar el producto",
          icon: "success",
        });
      } else {
        fetch(`/api/carts/${user.cart._id}/products/${productId}`, {
          method: "POST",
          body: "",
          headers: { "Content-Type": "application/json" },
        });

        Swal.fire({
          toast: true,
          text: "Producto agregado",
          position: "top-right",
          showConfirmButton: false,
          timer: 2500,
        });
      }
    });
};

buttonComprar.addEventListener("click", (e) => {
  e.preventDefault();

  fetch("/api/users")
    .then((result) => result.json())
    .then((json) => {
      const index = json.payload.findIndex(
        (user) => user.email === emailUser.innerText.trim()
      );
      const user = json.payload[index];

      if (!user.cart) {
        Swal.fire({
          title: "No tienes un carrito",
          text: "tienes que seleccionar un producto para generar un carrito",
          icon: "error",
        });
      } else location.assign(`/carts/${user.cart._id}`);
    });
});
