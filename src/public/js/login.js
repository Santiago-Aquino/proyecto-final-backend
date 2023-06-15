const form = document.getElementById('loginForm');

form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => obj[key] = value);
  fetch('/api/sessions/login', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(result => result.json())
    .then(json => {
      if (json.error) {
        Swal.fire({
          title: `${json.status}`,
          icon: 'error',
          text: `${json.error}`
        })
      }
      else location.assign('/products');
    });
});
