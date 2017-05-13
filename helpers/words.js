const clarifai = require('clarifai');
require('dotenv').config();

// instantiate new Clarifai app
var app = new clarifai.App(
  process.env.CLARIFAI_ID,
  process.env.CLARIFAI_SECRET
);

function predict(img_64, callback) {
  app.models.predict(clarifai.GENERAL_MODEL, img_64).then(
    res => {
      return callback(res);
    }, err => {
      console.error(console.error(err));
      return callback(null);
    }
  );
}

module.exports = {
  predict
}
