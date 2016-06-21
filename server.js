var express = require('express');
var ejs = require('ejs');
var memjs = require('memjs');
var path = require('path');

var request = require('request');

var app = express();

var mc = memjs.Client.create((process.env.MEMCACHED_1_PORT || '').replace('tcp://', ''))

app.set('view engine', 'ejs');
app.set('views', __dirname);
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

var processGoogleHTML = function(html) {
  return html
  .replace(/<a\s/ig, '<a target="_blank" ')
  .replace(/(<script[\s\S]+?<\/script>)/gi, '')
  .replace(/(<div id="header">[\s\S]+?<\/div>)/, '')
  .replace(/(<div id="footer">[\s\S]+?<\/div>)/, '')
};

var generateIframe = function(hash, callback) {
  request.get({url: 'https://docs.google.com/document/d/'+hash+'/pub', encoding: 'utf-8', followRedirect: false}, function(error, response, body) {
    if (response.statusCode >= 300) {
      return callback(null);
    }
    var result = processGoogleHTML(body);
    mc.set(hash, result, function(err, val) {
      console.log('Wrote', hash);
    }, 30);
    callback(result);
  }).end();
}

var getIframeContent = function(hash, useCache, callback) {
  if (useCache) {
    mc.get(hash, function(err, val) {
      if (val) {
        console.log('Read', hash);
        callback(val.toString())
      } else {
        generateIframe(hash, callback);
      }
    })
  } else {
    generateIframe(hash, callback);
  }
}

app.get('/:hash/raw', function(req, res){
  getIframeContent(req.params.hash, true, function(html){
    res.header('Content-Type', 'text/html; charset=utf-8');
    res.write(html);
    res.end();
  });
});

var blacklist = [
  '1e4AhY4FDrskammCpkd4T2WidrG3LUnh5mSA4Oe8NiSk',
  '19PVPMGZ68gkORN0bbMoU_9xK3KjDUFmdr7KzgaIETG8'
];

app.get('/:hash', function(req, res){
  if (blacklist.indexOf(req.params.hash) === -1) {
    getIframeContent(req.params.hash, true, function(html){
      if (html) {
        res.render('googledoc', {
          title: (html.match(/<title>(.+)<\/title>/i) || [])[0],
          hash: req.params.hash,
        });
      } else {
        res.render('notavailable');
      }
    });
  } else {
    res.render('blacklist');
  }
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});
