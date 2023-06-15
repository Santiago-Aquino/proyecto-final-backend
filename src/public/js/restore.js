const form = document.getElementById('restoreForm');

form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => obj[key] = value);
  fetch('/api/sessions/restore', {
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
      else {
        Swal.fire({
          title: `${json.status}`,
          icon: 'success',
          text: `${json.message}`
        })
      }
    });
});