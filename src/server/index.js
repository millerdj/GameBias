const express = require('express');
const multer = require('multer');
const s3 = require('s3');
const { json } = require('body-parser');
const { MongoClient } = require('mongodb');
const spawn = require('child_process').spawn

const S3_ACCESS_ID = process.env.S3_ACCESS_ID;
const S3_SECRET_ID = process.env.S3_SECRET_ID;

const PORT = process.env.PORT || 3001;
const MONGO_URI = 'mongodb://localhost:27017/gamebias';
const MONGODB_URI = process.env.MONGODB_URI || MONGO_URI;

const app = express();

console.log(__dirname);

app.use(express.static(__dirname + '/../../public'))

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.mov')
  }
})

const upload = multer({ storage: storage });


app.get('/api/all-videos', (req, res) => {

  MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
      console.err(err);
      process.exit(1);
      db.close();
    }

    const videos = db.collection('videos');

    videos
      .find({}).toArray((err, videos) => {
        res.status(200).json(videos)
        db.close();
      })
  })

})

app.get('/api/single-video/:filename', (req, res) => {

  MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
      console.err(err);
      process.exit(1);
      db.close();
    }
    const videoFile = req.params.filename;
    const videos = db.collection('videos');

    videos
      .find({'file.filename': videoFile }).toArray((err, video) => {
        res.status(200).json(video);
        db.close()
      })

  })

})

app.post('/api/form-upload', upload.single('video'), (req, res) => {


  MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    const video = Object.assign({}, req.body, { source: 'https://s3-us-west-1.amazonaws.com/game-bias-videos/' + req.file.filename },{ analyzed: 'Not Started' }, { file: req.file })
    const videos = db.collection('videos');

    videos
    .insertOne(video, (err, docs) => {
      if (err) return console.log(err)
      res.json(docs);
    })
    db.close();
  })

  const videoPaths = [];
  videoPaths.push(req.file.path)

  const client = s3.createClient({
    maxAsyncS3: 20,
    s3RetryCount: 3,
    s3RetryDelay: 1000,
    multipartUploadThreshold: 125829120,
    multipartUploadSize: 104857600,
    s3Options: {
      accessKeyId: S3_ACCESS_ID,
      secretAccessKey: S3_SECRET_ID,
    },
  })

  const params = {
    localFile: videoPaths[0],

    s3Params : {
      Bucket: "game-bias-videos",
      Key: req.file.filename
    },
  };

  const uploader = client.uploadFile(params);
  uploader.on('error', function(err) {
    console.error("unable to upload:", err.stack);
  });
  uploader.on('progress', function() {
    console.log("progress", uploader.progressMd5Amount,
    uploader.progressAmount, uploader.progressTotal);
  });
  uploader.on('end', function() {
    console.log("done uploading");

    const analyzeChild = spawn('node', ['src/server/analyze.js']);
    analyzeChild.stdout.on('data', function (data) {
      console.log('tail output: ' + data);
    });
    analyzeChild.stderr.on('data', function (data) {
      console.log('err data: ' + data);
    });

  });

  res.status(204);
})

setInterval(getData, 10000);

function getData() {

  const dataChild = spawn('node', ['src/server/get-data.js']);
  dataChild.stdout.on('data', function (data) {
    console.log('tail output: ' + data);
  });
  dataChild.stderr.on('data', function (data) {
    console.log('err data: ' + data);
  });

}

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
})
