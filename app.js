// import libraries
var express = require('express'),
    ejs     = require('ejs'),
    bodyParser = require('body-parser');

// import routes
var routes = require('./controller/index');
// initialize express web application framework
// http://expressjs.com/
var app = express();

// these two lines replace bodyParser()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// configure static directory
app.use(express.static('public'));

//configure view rendering engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// subtitle values access via the header template
app.set('subtitle', 'StudyBuddy');

//configure routes
app.use('/', routes);

app.set('port', 8012);
app.listen(app.get('port'));
console.log("Express server listening on port", app.get('port'));
