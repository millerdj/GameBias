module.exports = dashboardController;

dashboardController.$inject = ['$http']

function dashboardController($http) {

  const vm =this;

  vm.videos = [];
  init()

  function init() {
    $http.get('api/all-videos').then(res => {
      vm.videos.push(res.data)
    })
  }

}
