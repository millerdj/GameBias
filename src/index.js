const form = document.getElementById('upload-video')

form.addEventListener('submit', theEvent => {
  theEvent.preventDefault();

  const video = document.getElementById('video').files[0]
  const name = document.getElementById('name').value
  const description = document.getElementById('description').value
  const game = document.getElementById('game').value


  const formData = new FormData();
  formData.append('video', video, name)
  formData.append('name', name)
  formData.append('description', description)
  formData.append('game', game)

  fetch('api/form-upload', {
    method: 'POST',
    body: formData
  })

})
