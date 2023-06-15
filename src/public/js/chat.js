const socket = io();

const message = document.getElementById("message");
const container = document.getElementById("container");
const button = document.getElementById("button");
const username = document.getElementById("username");
const buttonDelete = document.getElementById("delete");

button.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("message", {
    user: username.innerText.trim(),
    message: message.value,
  });
});

socket.on("returnMessage", (data) => {
  container.innerHTML = "";
  let html = "";
  data.forEach((el) => {
    html += `<p>- ${el.user}: ${el.message}</p>`;
  });
  container.innerHTML = html;
});

buttonDelete.addEventListener("click", (e) => {
  e.preventDefault;
  socket.emit("delete");
});

socket.on("returnDelete", (data) => {
  container.innerHTML = data;
});
