const routes = require('express').Router();
const data = require('../helpers/data');
const formidable = require('formidable');
const fs = require('fs');
const async = require('async');
const words = require('../helpers/words');

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
    if(!files.pic.type.includes('image/'))
      files.pic = {
        path: "./public/images/default_pic.jpg",
        type: "image/jpg"
      };
    data.uploadImage(files.pic, id => {
      fields["img_id"] = id;
      data.addItem(fields, id => res.redirect(`/list`));
    });
  });
});

// RETRIEVE ITEM
routes.get('/retrieve/:id', function(req, res) {
  data.retrieveItem(req.params.id, field => {
    data.getImage(field.img_id, img => {
      if(field.bid === 'no') field.duration = null;
      res.render('display', {
        name: field.name,
        desc: field.desc,
        qty: field.qty,
        cat: field.category,
        bid: field.bid,
        duration: field.duration,
        price: field.price,
        img: `data:${img.contentType};base64,${new Buffer(img.data).toString('base64')}`
      });
    });
  });
});

// RETRIEVE IMAGE
routes.get('/img/:id', function(req, res) {
  data.getImage(req.params.id, img => {
    res.contentType(img.contentType);
    res.end(img.data, 'binary');
  });
});

// DISPLAY ALL ITEMS
routes.get('/list', function (req, res) {
  data.getAll(items => {
    var item_arr = [];
    var i = 0;
    for (var key in items) {
      var item = items[key];
      item["id"] = key;
      item_arr.push(item);
      i++;
    };
    res.render('list', { items: item_arr });
  });
})

routes.get('/delete/:id', function (req, res) {
  data.deleteItem(req.params.id, err => {
    console.log(err);
    res.redirect('/list');
  });
})

// UPDATE ITEM
routes.post('/update/:id', function(req, res) {
  data.updateItem(req.params.id, req.body, data => res.send(data));
});

routes.get('/test', function (req, res) {
  data.getAll(items => {
    var item_arr = [];
    var i = 0;

    async.each(items, (item, callback) => {
      data.getImage(item.img_id, img => {
        item["img"] = `data:${img.contentType};base64,${new Buffer(img.data).toString('base64')}`;
        item_arr.push(item);
        i++;
        callback();
      });
    }, () => res.render('test', { items: item_arr }));
    /*
    for (var key in items) {
      data.getImage(items[key].img_id, img => {
        var item = items[key];
        item["img"] = img;
        item_arr.push(item);
        i++;
      });
    }
    console.log(item_arr);
    res.render('test', { items: item_arr });*/
  });
})

routes.get('/predict/:img_id', function (req, res) {
  data.getImage(req.params.img_id, img => {
    words.predict(new Buffer(img.data).toString('base64'), result => res.send(result));
  });
})

module.exports = routes;
