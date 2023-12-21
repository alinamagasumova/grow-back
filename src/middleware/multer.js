const multer = require('multer');
const crc32 = require('crc32');
const file_types = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpeg',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = file_types[file.mimetype];
    let uploadError = new Error('invalid image type');
    if (isValid) uploadError = null;
    cb(uploadError, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = crc32(`${file.originalname}-${Date.now()}`);
    const extension = file_types[file.mimetype];
    cb(null, `${filename}.${extension}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
