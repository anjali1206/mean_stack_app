var User = require('../models/user'); //importing User model

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
					res.json({ success: true, message:'User authenticated.' });
				}
			}
		});
	});

	return router;	//to return that router object
}