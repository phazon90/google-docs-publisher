var express = require('express');
var ejs = require('ejs');
var app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname);
app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res){
  res.redirect('/1srdnlG4BarbmjoHYIsHhUbYsTvbAP5t-sgfJKwZ9yrg');
});

app.get('/:hash', function(req, res){
  res.render('index', {hash: req.params.hash})
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});
