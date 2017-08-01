//packages(modules)
var express = require('express');	//importing express module 
var app = express();	//Creates an Express application
var morgan =require('morgan');	//middleware - HTTP request logger middleware for node.js Read more at https://www.npmjs.com/package/morgan
//some websites to deploy this app(like heroku), require more config. for port. so, add process.env.PORT || 8080 instead of just 8080
var port = process.env.PORT || 8080; //use 8080 server or if the env.,which I'm deploying to, has a specific server that requires, use that.
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router(); //defining to use router with express.
var appRoutes =require('./app/routes/api')(router); //to use the router object with this route file.
var path = require('path'); //importing path

//middleswares :- (order of the middlewares is very important.)
//read more abot dev at https://www.npmjs.com/package/morgan#dev
app.use(morgan('dev')); //app.use() -to use all the middlewares in express
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public')); //this is how front end access the view files. (Serve static content for the app from the “public” directory in the application directory)
app.use('/api', appRoutes); //use the backend route-localhost:8080/api/users

/* Just for the test purpose
//create a simple route and test it first on browser.
app.get('/', function(req, res){	//user puts a get req with '/'(default), it will call a function with req.
	res.send("hello, world!");		//respond with sending hello, world! msg
});
*/

//MongoDB connection
mongoose.connect('mongodb://localhost:27017/meanusers', function(err){
	if(err){
		console.log("Not connected to the database: " + err);
	} else{
		console.log("Successfully connected to MongoDB.");
	}
});

app.get('*', function(req, res){	// instead of default '/', I'm using '*' which means whatever the user types, take them to index page.
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});	

//server port
app.listen(port, function(){	
	console.log("Server running at port " + port);
});