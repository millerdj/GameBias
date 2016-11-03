const request = require('request');
const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017/gamebias';
const MONGODB_URI = process.env.MONGODB_URI || MONGO_URI;
const KAIROS_API = process.env.KAIROS_API;
const KAIROS_KEY = process.env.KAIROS_KEY;


checkAnalyzed();

function checkAnalyzed() {

  MongoClient.connect(MONGODB_URI, (err, db) => {

    if (err) {
      console.log(err);
    }

    const videos = db.collection('videos');

    videos.findOne({analyzed: 'Not Started'}, (err, video) => {
      if (err) {
        console.log('No New Videos');
        process.exit(1);
        db.close()
      }


      const options = {
        method: 'POST',
        url: 'https://api.kairos.com/v2/media?source=' + video.source,
        json: true,
        headers: {
          'Content-type': 'application/json',
          'app_id': KAIROS_API,
          'app_key': KAIROS_KEY
        }
      }

      function saveStatus(err, res, body) {
        console.log(err);
        console.log('Status:', res.statusCode);
        console.log('Headers:', JSON.stringify(res.headers));
        console.log('Response:', body);
        videos.updateOne({ source: video.source }, {$set: {status: body}});
        videos.updateOne({ source: video.source }, {$set: {analyzed: 'In Progress'}});
        db.close();
      }

      request(options, saveStatus);

    })

  })

}
