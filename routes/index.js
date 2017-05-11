const routes = require('express').Router();

routes.get('/', function(req, res){
  res.render('index');
})

routes.get('', function(req, res){

})

module.exports = routes;
