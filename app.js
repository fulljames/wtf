var express = require('express');

var controllers = require('./controllers');

var app = module.exports = express.createServer(
    express.static(__dirname + '/public')
);

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
});

app.get('/',controllers.home.index);

app.listen(process.argv.length > 2 ? parseInt(process.argv[2]) : 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

require('./modules/compileCss');