var logger = require('koa-logger');
var serve = require('koa-static');
var parse = require('co-busboy');
var koa = require('koa');
var fs = require('fs');
var app = koa();
var os = require('os');
var path = require('path');


app.use(logger());


app.use(function *(next){
  yield next;
  if (this.body || !this.idempotent) return;
  this.redirect('/404.html');
});


app.use(serve(__dirname + '/public'));

app.use(function *(next){

  if ('POST' != this.method) return yield next;

  var parts = parse(this);
  var part;

  while (part = yield parts) {
    var stream = fs.createWriteStream(path.join(os.tmpdir(), Math.random().toString()));
    part.pipe(stream);
    console.log('uploading %s -> %s', part.filename, stream.path);
  }

  this.redirect('/');
});


app.listen(3000);
console.log('listening on port 3000');
