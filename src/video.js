module.exports = videoController

videoController.$inject = ['$http', '$routeParams']

function videoController($http, $routeParams) {

  const vm = this

  const video = []

  init();

  function init() {
    $http.get('api/single-video/' + $routeParams.filename ).then(res => {
      console.log(res)
      vm.video = res.data
    })
  }

}
