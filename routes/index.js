const routes = require('express').Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const data = require('../helpers/data');
var upload = multer();

routes.get('/', function(req, res){
  res.render('index');
})

routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: true }));
routes.use(upload.array());
routes.post('/submit', function(req, res){
  data.addItem(req.body, e => res.send(e));
});

routes.get('/retrieve/:id', function(req, res) {
  data.retrieveItem(req.params.id, data => res.send(data));
})

module.exports = routes;
