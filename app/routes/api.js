var User = require('../models/user'); //importing User model
var jwt = require('jsonwebtoken'); //jsonwebtoken
var secret = 'aryastark'; //simple secret created(to provide extra security to token. So, it should be complex)

module.exports = function(router){	//function (router)- it's gonna export whatever the route is. 
	//USER REGISTRATION ROUTE - http://localhost:8080/api/users 
	router.post('/users', function(req, res){	//post method - Adding/Creating new things.
		//res.send("Testing users route."); //just to test it- open POSTMAN & enter this url with POST method & hit send. It should show 'Testing users route' msg
		var user = new User();	//a variable to store the new user's info.
		user.username = req.body.username;
		user.password = req.body.password;
		user.email = req.body.email;

		//if email, username, pw not provided by user then show err msg.
		if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == ''){	
			//res.send("All the fields are required.");
			res.json({ success:false, message:'All the fields are required.' });
		} else {
			user.save(function(err){	//added a funciton to check the err
				if(err){			//if err, send the err (this won't create user)
					//res.send(err);	//this will send the actual err to user, which isn't the corrct way
					//res.send("Username or email already exist.");	//instead of sending actual err, this will send an err msg.
					res.json({ success:false, message:'Username or email already exist.' });
				} else {				//else send 'user created' msg.(this will create the user)
					//res.send("User created.");
					res.json({ success:true, message:'User created successfully.' });
				}
			});
		}
	});

	//USER LOGIN ROUTE - http://localhost:8080/api/authenticate
	router.post('/authenticate', function(req, res){
		User.findOne({ username: req.body.username }).select('email username password').exec(function(err, user){
			if(err) throw err;

			if(!user){
				res.json({ success: false, message:'Could not authenticate user.' });
			} else if(user) {
				if(req.body.password){
					var validPassword = user.comparePassword(req.body.password);	
				} else {
					res.json({ success: false, message:'No password provided.' });
				}
				
				if(!validPassword){
					res.json({ success: false, message:'Could not authenticate password.' });
				} else {
					//create token with jwt. After password is validated, give token to the user with username & email encrypted. 
					var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h'} );//after 24 hrs, this token expires
					res.json({ success: true, message:'User authenticated.', token: token }); //it will return json object with success, msg and token
				}
			}
		});
	});

	//MIDDLEWARE -  to get token bcrypted and send it back to user(currentUser)
	router.use(function(req, res, next){
		// to get the token 3 ways: request or url or headers
		var token = req.body.token || req.body.query || req.headers['x-access-token']; 
		
		if(token){
			//verify token
			jwt.verify(token, secret, function(err, decoded){
				if(err){
					res.json({ success:false, message:'Token invalid' });
				} else{
					//decoded sends back the uname, email bcz thats what is being implemented.
					req.decoded = decoded; //decoded = takes the token,combines with the secret,verifies it & once its good it sends back decoded
					next();
				}
			});
		} else{
			//respond with json obj.
			res.json({ success:false, message:'No token provided.' })
		}
	});

	//CURRENT USER ROUTE - http://localhost:8080/api/currentUser
	router.post('/currentUser', function(req, res){
		res.send(req.decoded);
	})

	return router;	//to return that router object
}