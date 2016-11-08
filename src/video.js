const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);
const emojione = require('emojione')

module.exports = videoController

videoController.$inject = ['$http', '$routeParams']

function videoController($http, $routeParams) {

  const vm = this

  const video = {}
  let data = [];

  drawEmoji('joy', ':smile:');
  drawEmoji('sadness', ':sob:');
  drawEmoji('fear', ':fearful:');
  drawEmoji('surprise', ':astonished:');

  function drawEmoji(emotion, action) {
    const emotions = Array.from(document.getElementsByClassName(emotion));
    emotions.forEach(element => {
      let emoji = emojione.shortnameToImage(action)
      let title = '<h5 style="text-align: center;">' + emotion.toUpperCase() + '</h5>';
      let block = emoji + title
      element.innerHTML = block;
    })
  }

  init();
  function init() {
    $http.get('api/single-video/' + $routeParams.filename ).then(res => {
      vm.video = res.data[0]
      setData(vm.video, 'joy', 'yellow');
      setData(vm.video, 'sadness', 'purple');
      setData(vm.video, 'fear', 'red');
      setData(vm.video, 'surprise', 'blue');
    })
  }


  function setData(video, emotion, color){
    data = video.analytics.frames.map((frame) => [
      frame.time,
      frame.people[0].emotions[emotion]
    ])
    createChart(emotion, color);
  }


  function createChart(emotion, color) {
    Highcharts.chart(emotion, {
      chart: {
        type: 'spline'
      },
      title: {
        text: ''
      },
      xAxis: {
        title: {
          text: 'Time (milliseconds)'
        }
      },
      yAxis: {
        title: {
          text: 'Emotional Intensity (0-100)'
        },
        min: 0,
        max: 100
      },
      plotOptions: {
        spline: {
          lineWidth: 4,
          color: color,
          marker: {
            enabled: false
          }
        }
      },
      series: [{
        name: emotion,
        data: data
      }]

    })


  }

}
