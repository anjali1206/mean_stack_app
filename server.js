var express = require('express');	//importing express module 
var app = express();	//Creates an Express application
var morgan =require('morgan');	//middleware - HTTP request logger middleware for node.js Read more at https://www.npmjs.com/package/morgan
//some websites to deploy this app(like heroku), require more config. for port. so, add process.env.PORT || 8080 instead of just 8080
var port = process.env.PORT || 8080; //use 8080 server or if the env.,which I'm deploying to, has a specific server that requires, use that.
var mongoose = require('mongoose');
var User = require('./app/models/user'); //importing User model
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/* Just for the test purpose
//create a simple route and test it first on browser.
app.get('/', function(req, res){	//user puts a get req with '/'(default), it will call a function with req.
	res.send("hello, world!");		//respond with sending hello, world! msg
});
*/

//read more abot dev at https://www.npmjs.com/package/morgan#dev
app.use(morgan('dev')); //app.use() -to use all the middlewares in express

mongoose.connect('mongodb://localhost:27017/meanusers', function(err){
	if(err){
		console.log("Not connected to the database: " + err);
	} else{
		console.log("Successfully connected to MongoDB.");
	}
});

//register route - http://localhost:8080/users 
app.post('/users', function(req, res){
	//res.send("Testing users route."); //just to test it- open POSTMAN & enter this url with POST method & hit send. It should show 'Testing users route' msg
	var user = new User();
	user.username = req.body.username;
	user.password = req.body.password;
	user.email = req.body.email;

	user.save();

	res.send("User created.")
});

app.listen(port, function(){	
	console.log("Server running at port " + port);
});