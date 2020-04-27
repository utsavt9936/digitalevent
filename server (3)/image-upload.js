const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
//const config = require('../config');

aws.config.update({
  secretAccessKey: '5XpN61IQy2/9sPiR9loUFGpQdDL4ZbhYxFKwxdS0',
  accessKeyId: 'AKIAIEKLICLN2VK4QHMA',
  region: 'us-east-2'
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
}

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: 'elasticbeanstalk-us-east-2-878453456805',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: 'TESTING_METADATA'});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});

module.exports = upload;