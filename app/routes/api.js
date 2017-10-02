var User = require('../models/user'); //importing User model
var jwt = require('jsonwebtoken'); //jsonwebtoken
var secret = 'aryastark'; //simple secret created(to provide extra security to token. So, it should be complex)
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');


module.exports = function(router){	//function (router)- it's gonna export whatever the route is. 
	//Nodemailer- Sendgrid's configurations to send emails to users
	var options = {
	  	auth: {
	    	api_user: 'anjy103',
	    	api_key: 'anjali123'
	  	}
	}

	var client = nodemailer.createTransport(sgTransport(options));

	//NEW USER REGISTRATION ROUTE - http://localhost:8080/api/users 
	router.post('/users', function(req, res){	//post method - Adding/Creating new things.
		//res.send("Testing users route."); //just to test it- open POSTMAN & enter this url with POST method & hit send. It should show 'Testing users route' msg
		var user = new User();	//a variable to store the new user's info.
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;
		user.email = req.body.email;
		user.temporarytoken = jwt.sign({username: user.username, email: user.email }, secret, { expiresIn: '24h'} );
		
		//check if email, username, pw are valid & not empty, otherwise show err msg.
		if(req.body.name == null || req.body.name == '' || req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == ''){	
			//res.send("All the fields are required.");
			res.json({ success:false, message:'All the fields are required.' });
		} else {
			//console.log(req.body); //to check what fields I'm getting like name, uname, email etc
			user.save(function(err){	//function to check the err
				if(err){			//if err, send the err (this won't create user)
					//res.send(err);	//this will send the actual err to user, which isn't the corrct way
					//res.send("Username or email already exist.");	//instead of sending actual err, this will send an err msg.
					//check if any validation errs exists (from user model)
					if(err.errors != null){
						if(err.errors.name){
							res.json({ success:false, message: err.errors.name.message });
						} else if(err.errors.email){
							res.json({ success:false, message: err.errors.email.message });
						} else if(err.errors.username){
							res.json({ success:false, message: err.errors.username.message });
						} else if(err.errors.password){
							res.json({ success:false, message: err.errors.password.message });
						} else { 
							res.json({ success:false, message: err });
						}
					} else if(err){ //else if the username/email already exist. So, show the err msg
						//res.json({ success:false, message: err.errmsg }); //this will show the big err msg in json format.
						if(err.code === 11000) {
							if(err.errmsg[62] == "e"){
								res.json({ success:false, message:'Email already exist.' });
							} else if(err.errmsg[62] == "u"){
								res.json({ success:false, message:'Username already exist.' });
							} 
						} else {
							res.json({ success: false, message:err });
						}	
					}

				} else {		//else create email object to send to user
					//before registering user, send them acc.activation link email
					var email = {
						from: 'Localhost Support, support@localhost.com',
						to: user.email,
						subject: 'Localhost | Confirm Your Email',
						text: 'Hello ' + user.name + ', Thank you for signing up at localhost.com. Please open the following link to confirm your email and activate your account: http://localhost:8080/activate/' + user.temporarytoken,
						html: 'Hello ' + user.name + ',<br><br>Thank you for signing up at localhost.com. Please click on the link to confirm your email and activate your account:<br><br><a href="http://localhost:8080/activate/'+ user.temporarytoken +'">http://localhost:8080/activate/</a>'
						//text: "Hello " + user.name + ", Thanks for joining! Let's confirm your email address. Please click on the link to activate your account. http://localhost:8080/activate/" + user.temporarytoken,
						//html: "Hello <strong>"+ user.name + "</strong>,<br><br>Thanks for joining! Let's confirm your email address. Please click on the link below to activate your account.<br><br><a href='http://localhost:8080/activate/'" + user.temporarytoken + ">http://localhost:8080/activate/</a>"
					};
					//Send email object to user
					client.sendMail(email, function(err, info){
					    if (err){
					    	console.log(err); // If unable to send e-mail, log error info to console/terminal
					    }
					    else {
					    	console.log(info); //log success msg to console if sent
					    	console.log(user.email); //display email that it was sent to 
					    	console.log('Message sent: ' + info.response); 	
					    }
					});
					
					//res.send("User created.");
					res.json({ success:true, message:'Account registered! Please check your email to activate your account.' });
				}	
			});
		}
	});


	//validation to check if username already exist in db.
	router.post('/checkusername', function(req, res){
		User.findOne({ username: req.body.username }).select('username').exec(function(err, user){
			if(err) throw err;

			if(user){
				res.json({ success:false, message: "That username is taken. Try another."});
			} else{
				res.json({ success:true, message: "Valid username"});
			}
		});
	});

	//validation to check if email already exist in db.
	router.post('/checkemail', function(req, res){
		User.findOne({ email: req.body.email }).select('email').exec(function(err, user){
			if(err) throw err;

			if(user){
				res.json({ success:false, message: "That email is taken. Try another."});
			} else{
				res.json({ success:true, message: "Valid email."});
			}
		});
	});

	//USER LOGIN ROUTE - http://localhost:8080/api/authenticate
	router.post('/authenticate', function(req, res){
		User.findOne({ username: req.body.username }).select('username password email active').exec(function(err, user){
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
				} else if(!user.active){ //validation to check to see if the account is activated by user.
					res.json({ success: false, message:'Account is not yet activated. Please check your email for activation link.', expired: true });
				} else {
					//create token with jwt. After password is validated, give token to the user with name, username & email encrypted. 
					var token = jwt.sign({username: user.username, email: user.email }, secret, { expiresIn: '24h'} );//after 24 hrs, this token expires
					res.json({ success: true, message:'User authenticated.', token: token }); //it will return json object with success, msg and token
				}
			}
		});
	});

	//Route to retutn to the emailCtrl
	router.put('/activate/:token', function(req, res){
		User.findOne({ temporarytoken: req.params.token }, function(err, user) {
			if(err) throw err;	//throw err if can't login
			var token = req.params.token;	//save the token from url for verification

			//to verify if token expired
			jwt.verify(token, secret, function(err, decoded){
				if(err) {	//err if token expired
					res.json({ success:false, message:'Activation link has expired.' });
				} else if(!user) {	//err if token is valid but doesn't match any user in db
					res.json({ success:false, message:'Activation link has expired.' });
				} else{
					user.temporarytoken = false; //remove temporarytoken 
					user.active = true; //change user acc. status to activated

					//use mongo query to save user and send an email to let user know about the acc.acctivation
					user.save(function(err){
						if(err){ //if unable to save user, then log err info
							console.log(err);
						} else {	//if saved, then create email object
							var email = {
								from: 'Localhost Support, support@localhost.com',
								to: user.email,
								subject: 'Localhost | Account Activated',
								text: 'Hey '+ user.name +', Your Localhost account has been activated. You are all ready to go! Thank you. The Localhost Team',
								html: 'Hey '+ user.name + ',<br><br>Your Localhost account has been activated. You are all ready to go!<br><br>Thank you.<br><br>The Localhost Team'
							};

							// Send email to user
							client.sendMail(email, function(err, info){
							    if (err){	//if unable to send email, then log err
							    	console.log(err);
							    }
							    else {	//else response with msg sent
							    	console.log('Message sent: ' + info.response);
							    }
							});
							res.json({ success:true, message:'Account activated!' }); //return success msg
						}
					});					
				}

			});

		});
	});

	//RESEND (ACTIVATION LINK) ROUTE - http://localhost:8080/resend
	router.post('/resend', function(req, res){
		User.findOne({ username: req.body.username }).select('username password active').exec(function(err, user){
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
				} else if(user.active){ 
					res.json({ success: false, message:'Account is already activated.' });
				} else {
					res.json({ success: true, user: user }); //respond with user itself
				}
			}
		});
	});


	//Email to RESEND (ACTIVATION LINK) ROUTE - http://localhost:8080/resend
	router.put('/resend', function(req, res){
		User.findOne({ username: req.body.username }).select('username name email temporarytoken').exec(function(err, user){
			if(err) throw err;

			user.temporarytoken = jwt.sign({username: user.username, email: user.email }, secret, { expiresIn: '24h'} );
			user.save(function(err){
				if (err){
					console.log(err);
				} else {
					var email = {
							from: 'Localhost Support, support@localhost.com',
							to: user.email,
							subject: 'Localhost | Activation link request',
							text: 'Hey '+ user.name +', You recently requested a new account activation link. Please click on the following link to complete your activation: http://localhost:8080/activate/' + user.temporarytoken + ' Thank you. The Localhost Team',
							html: 'Hey '+ user.name + ',<br><br>You recently requested a new account activation link. Please click on the following link to complete your activation:<br><br><a href="http://localhost:8080/activate/'+ user.temporarytoken +'">http://localhost:8080/activate/</a>' + '<br><br>Thank you.<br><br>The Localhost Team'
						};

						// Send email to user
						client.sendMail(email, function(err, info){
						    if (err){	//if unable to send email, then log err
						    	console.log(err);
						    }
						    else {	//else response with msg sent
							   	console.log('Message sent: ' + info.response);
							}
						});
						res.json({ success:true, message: 'Activation link has been sent to ' + user.email })
				}
			})
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
					//decoded sends back the name, username & email bcz thats what is being implemented.
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