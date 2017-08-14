var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var session = require('express-session'); //expressjs session
var jwt = require('jsonwebtoken'); //jsonwebtoken
var secret = 'aryastark'; //simple secret created(to provide extra security to token. So, it should be complex)


module.exports = function(app, passport) {
	
	//In a Connect or Express-based application, passport.initialize() middleware is required to initialize Passport.
  	app.use(passport.initialize());
  	app.use(passport.session());
  	app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false } }));

  	//In order to support login sessions, Passport will serialize and deserialize user instances to and from the session
	passport.serializeUser(function(user, done) {
		//using the token variable created in api.js
		token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h'} );//after 24 hrs, this token expires
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			console.log(user);

	    	done(err, user);
	  	});
	});

	//got the FB ID & secret by creating an app on FB Developers page once I'm loggedIn on FB
	passport.use(new FacebookStrategy({
    	clientID: '222598778266689',
    	clientSecret: '7bdc7c27764ad16febc6ed41a55b25f7',
    	callbackURL: "http://localhost:8080/auth/facebook/callback",
    	profileFields: ['id', 'displayName', 'photos', 'email']
  		},
	  	function(accessToken, refreshToken, profile, done) {
	  		//console.log("coming from FB");
	  		//console.log(profile);
	  		User.findOne({ email:profile._json.email }).select('username password email').exec(function(err, user){
	  			if(err) done(err); //handle errors
	  			
	  			if(user && user !== null){	//to check if there is a user & with the verified email on FB
	  				done(null, user);
	  			} else {	//else there is user on fb but not in our mongo db.
	  				//done(err);
	  				var newUser = new User();

	  				newUser.username = profile._json.name;
	  				newUser.password = accessToken;
	  				newUser.email = profile._json.email;

	  				newUser.save(function(err){
	  					if(err){
	  						console.log(err);
	  						//done(err);
	  					} else{
	  						console.log("saving new user...");
	  						done(null, newUser);
	  					}
	  				});
	  			}
	  		});

	  		//below done will return FB profile but I need the profile from database. So, just delete it
	    	//done(null, profile); //its done, null means there was no err & profile is the profile we get from the FB.
	  	}
	));

	/* Facebook will redirect the user to this URL after approval.  Finish the
		authentication process by attempting to obtain an access token.  If
		access was granted, the user will be logged in.  Otherwise,
		authentication has failed.
	*/
	app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/log' }), function(req, res){
		res.redirect('/facebook/' + token); //successRedirect to 
	});

	// just need email from uesr for special authentication from FB
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' } ));


	return passport;
}


/*
visit http://passportjs.org/docs/facebook more more details about FB authentication with passport.js
*/