const routes = require('express').Router();
const data = require('../helpers/data');
const formidable = require('formidable');
const fs = require('fs');

routes.get('/', function(req, res){
  res.render('index');
})

// SUBMIT ITEM
routes.post('/submit', function(req, res){
  var form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if(err) return res.send('Error reading form!');
    // if form has image
    // TODO: implement default image
    if(files.pic.type.includes('image/')) {
      data.uploadImage(files.pic, id => {
        fields["img_id"] = id;
        data.addItem(fields, e => res.send(e));
      });
    } else data.addItem(fields, e => res.send(e));
  });
});

// RETRIEVE ITEM
routes.get('/retrieve/:id', function(req, res) {
  data.getImage(req.params.id, img => {
    res.contentType(img.contentType);
    res.end(img.data, 'binary');
  });
});

// UPDATE ITEM
routes.post('/update/:id', function(req, res) {
  data.updateItem(req.params.id, req.body, data => res.send(data));
});

module.exports = routes;
