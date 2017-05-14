const Clarifai = require('clarifai');
require('dotenv').config();

// instantiate new Clarifai app
var app = new Clarifai.App(
  process.env.CLARIFAI_ID,
  process.env.CLARIFAI_SECRET
);

function predict(img_64, callback) {
  app.models.predict(Clarifai.GENERAL_MODEL, img_64).then(
    res => {
      console.log(res);
      const outputs = [];
      var concepts;
      for (var i in res.outputs){
        concepts = res.outputs[i].data.concepts;
        var keywords = [];
        concepts.forEach(concept => keywords.push([concept.name, concept.value]));
        return callback(keywords);
      }
    }, err => {
      console.error(console.error(err));
      return callback(null);
    }
  );
}

module.exports = {
  predict
}
