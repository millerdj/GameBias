const express = require('express');
const multer = require('multer')

const upload = multer({ dest: './uploads/'});
const PORT = 3001;

const app = express();

app.post('/api/form-upload', upload.single('video'), (req, res) => {
  res.status(204);
  res.send();
})

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
})
