'use strict';
const storage = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
console.log(path.join(__dirname, '..', '/heroku-test-a22764fc49b5'));
const gcs = storage({
  projectId: 'heroku-test',
  keyFilename: path.j
});

//console.log();

function getPublicUrl(bucketName, filename) {
  return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

let ImgUpload = {};

ImgUpload.uploadToGcs = (req, res, next) => {
  if (!req.file) return ReE(res, 'No se encontro imagen', 400);
  console.log(req.url);
  let bucketName = '';
  if (req.url == '/image/companies') {
    bucketName = 'commerce-companies';
  } else if (req.url === '/image/products') {
    bucketName = 'commerce-products';
  }
  const bucket = gcs.bucket(bucketName);

  const gcsname = req.file.originalname;
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on('error', err => {
    ReE(res, 'Error externo: GoogleCloud', 424);
    req.file.cloudStorageError = err;
  });

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    req.file.cloudStoragePublicUrl = getPublicUrl(bucketName, gcsname);
    file
      .makePublic()
      .then(() => {
        if (req.file && req.file.cloudStoragePublicUrl) {
          req.body.imageUrl = req.file.cloudStoragePublicUrl;
        }
        res.send(req.body);
      })
      .catch(e => next(e));
  });

  stream.end(req.file.buffer);
};

module.exports = ImgUpload;
