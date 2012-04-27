var express = require('express'),
    public = __dirname + '/public';

var controllers = require('./controllers');

var app = module.exports = express.createServer();

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.compiler({ src: public, enable: ['less']}));
    app.use(express.static(public));
});

app.get('/',controllers.home.index);
app.get('/s',controllers.home.index);
app.get('/s/:term',controllers.home.index);

app.post('/',controllers.home.index);

// 17178
app.listen(process.argv.length > 2 ? parseInt(process.argv[2]) : 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);