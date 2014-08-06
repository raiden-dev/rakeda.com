var connect = require('connect'),
    modRewrite = require('connect-modrewrite');

var args = process.argv.slice(2),
    index = args[1] || 'index.html',
    port = 8043;

var app = connect()
  .use(modRewrite([
    '^(?:(?!.js|.css|.html|.png|.svg|.jpg|.gif|.ico|.woff|.ttf|.eot).)+$ /' + index
  ]))
  .use(connect.static(args[0]))
  .listen(port)
;

console.log('Serving ' + args[0] + ' on port ' + port);
console.log('Using index file ' + index);
