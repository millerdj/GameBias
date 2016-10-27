const express = require('express');
const multer = require('multer')
const s3 = require('s3')

const upload = multer({ dest: './uploads/'});
const PORT = 3001;

const app = express();

const videoPaths = [];


app.post('/api/form-upload', upload.single('video'), (req, res) => {

  const videoPaths = [];
  videoPaths.push(req.file.path)

  const client = s3.createClient({
    maxAsyncS3: 20,
    s3RetryCount: 3,
    s3RetryDelay: 1000,
    multipartUploadThreshold: 125829120,
    multipartUploadSize: 104857600,
    s3Options: {
      accessKeyId: "",
      secretAccessKey: "",
    },
  })

  const params = {
    localFile: '/Users/derekmiller/project3/' + videoPaths[0],

    s3Params : {
      Bucket: "game-bias-videos",
      Key: req.file.filename
    },
  };

  var uploader = client.uploadFile(params);
  uploader.on('error', function(err) {
    console.error("unable to upload:", err.stack);
  });
  uploader.on('progress', function() {
    console.log("progress", uploader.progressMd5Amount,
    uploader.progressAmount, uploader.progressTotal);
  });
  uploader.on('end', function() {
    console.log("done uploading");
  });


  res.status(204);
  res.send();
})

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
})
