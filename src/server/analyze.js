const request = require('request');
const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017/gamebias';


checkAnalyzed();

function checkAnalyzed() {

  MongoClient.connect(MONGO_URI, (err, db) => {

    if (err) {
      console.log(err);
    }

    const videos = db.collection('videos');

    videos.findOne({analyzed: 'Not Started'}, (err, video) => {
      if (err) {
        console.log('No New Videos')
      }

      videos.updateOne({ source: video.source }, {$set: {analyzed: 'In Progress'}});

      const options = {
        method: 'POST',
        url: 'https://api.kairos.com/v2/media?source=' + video.source,
        json: true,
        headers: {
          'Content-type': 'application/json',
          'app_id': '7aad945d',
          'app_key': 'e221882e267ace7df891a69ec61af27b'
        }
      }

      function saveStatus(err, res, body) {
        console.log(err);
        console.log('Status:', res.statusCode);
        console.log('Headers:', JSON.stringify(res.headers));
        console.log('Response:', body);
        videos.updateOne({ source: video.source }, {$set: {status: body}});
        db.close();
      }

      request(options, saveStatus);

    })

  })

}
