const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");


function getExtention(fileName) {
  if (fileName == "") return "";
  var arrFileName = fileName.split(".");
  console.log(arrFileName);
  return arrFileName[arrFileName.length - 1];
}

const upload = {
  getUpload: function (path) {
    var s3path = "profile/";

    if (path != "") s3path = path;

    const s3 = new AWS.S3({
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_ACCESS_SECRET_KEY,
    });

    const storage = multerS3({
      s3: s3,
      bucket: process.env.S3_BUCKET,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        var ext = getExtention(file.originalname);
        cb(null, {
          fieldName: file.fieldname,
          fileNewName: Date.now().toString() + "." + ext,
          extention: "." + ext,
        });
      },
      key: function (req, file, cb) {
        cb(
          null,
          `${s3path}${Date.now()}.${getExtention(file.originalname)}`
        );
      },
    });

    return multer({ storage: storage });
  },
};

exports.upload = upload;