var express = require('express');
var ejs = require('ejs');
var https = require('https');
var app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname);
app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res){
  res.redirect('/1srdnlG4BarbmjoHYIsHhUbYsTvbAP5t-sgfJKwZ9yrg');
});

app.get('/:hash', function(req, res){
  var replied = false;
  var timeout = setTimeout(function(){
    replied = true;
    res.render('index', {
      title: 'Google Doc Publisher',
      hash: req.params.hash,
    });
  }, 1000);

  https.get('https://docs.google.com/document/d/'+req.params.hash+'/pub', function(crawled) {
    var html = '';
    crawled.on('data', function(data){
      html = html + data.toString();
      var title = (/<title>(.*)<\/title>/.exec(html) || [])[1];
      if (title && !replied) {
        replied = true;
        clearTimeout(timeout);
        res.render('index', {
          title: title,
          hash: req.params.hash,
        });
      }
    });
  }).end();
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});
