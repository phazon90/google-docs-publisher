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

var processGoogleHTML = function(html) {
  return html
    .replace(/(<script[\s\S]+?<\/script>)/gi, '')
    .replace(/(<div id="header">[\s\S]+?<\/div>)/, '')
    .replace(/(<div id="footer">[\s\S]+?<\/div>)/, '')
};

var generateIframe = function(hash, callback) {
  https.get('https://docs.google.com/document/d/'+hash+'/pub', function(crawled) {
    var html = '';
    crawled.on('data', function(data){
      html = html + data.toString();
    });
    crawled.on('end', function(){
      callback(processGoogleHTML(html));
    });
  }).end();
}

app.get('/:hash/raw', function(req, res){
  generateIframe(req.params.hash, function(html){
    res.write(html);
    res.end();
  });
});

app.get('/:hash', function(req, res){
  res.render('index', {
    title: 'Google Doc Publisher',
    hash: req.params.hash,
  });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});
