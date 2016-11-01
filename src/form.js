module.exports = formController;

function formController() {

  const vm = this;

  vm.uploadVideo = function() {

    const videoForm = document.getElementById('upload-form');
    const video = document.getElementById('video').files[0]
    console.log(video);
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

    vm.clear(videoForm);

    const result = document.createElement('div');
    result.textContent = ('Your video will be added to your library shortly.');
    videoForm.appendChild(result);



  }
  vm.clear = function(target) {
    while(target.firstChild) {
      target.removeChild(target.firstChild)
    }
  }

}
