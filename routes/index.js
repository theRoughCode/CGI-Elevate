const routes = require('express').Router();
const bodyParser = require('body-parser');
const multer = require('multer');
var upload = multer();

routes.get('/', function(req, res){
  res.render('index');
})

routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: true }));
routes.use(upload.array());
routes.post('/submit', function(req, res){
  console.log(req.body);
  res.send(req.body);
})

module.exports = routes;
