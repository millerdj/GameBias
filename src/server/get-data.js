const request = require('request');
const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017/gamebias';
const MONGODB_URI = process.env.MONGODB_URI || MONGO_URI;
const KAIROS_API = process.env.KAIROS_API;
const KAIROS_KEY = process.env.KAIROS_KEY;


getData();

function getData() {

  MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
      console.log(err);
    }

    const videos = db.collection('videos');

    videos.findOne({analyzed: 'In Progress'}, (err, video) => {
      if (err) {
        console.log('No New Videos')
        process.exit(1);
        db.close();
      }

      const options = {
        method: 'GET',
        url: 'https://api.kairos.com/v2/media/' + video.status.id,
        json: true,
        headers: {
          'Content-type': 'application/json',
          'app_id': KAIROS_API,
          'app_key': KAIROS_KEY
        }
      }

      function saveData(err, res, body) {
        console.log('Status:', res.statusCode);
        console.log('Headers:', JSON.stringify(res.headers));
        console.log('Response:', body);
        if (body.status_message === 'Analyzing') {
          console.log('Still Analyzing');
          db.close()
        }
        else {
          videos.updateOne({ source: video.source }, {$set: {analytics: body}});
          videos.updateOne({ source: video.source }, {$set: {analyzed: 'Completed'}});
          db.close();
        }
      }

      request(options, saveData)
    })

  })

}
