var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
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
			//console.log(user);
	    	done(err, user);
	  	});
	});

	/*************************** FACEBOOK setup ***************************/
	//got the FB ID & secret by creating an app on FB Developers page once I'm loggedIn on FB
	passport.use(new FacebookStrategy({
    	clientID: '222598778266689',
    	clientSecret: '7bdc7c27764ad16febc6ed41a55b25f7',
    	callbackURL: "http://localhost:8080/auth/facebook/callback",
    	profileFields: ['id', 'displayName', 'photos', 'email']
  		},
	  	function(accessToken, refreshToken, profile, done) {
	  		console.log("User LoggingIn from FB");
	  		//console.log(profile);
	  		//done(null, profile); 
	  		
	  		User.findOne({ email:profile._json.email }).select('name username password email').exec(function(err, user){
	  			if(err) done(err); //handle errors
	  			
	  			if(user && user !== null){	//to check if there is a user & with the verified email on FB
	  				done(null, user);
	  			} else {	//else there is user on fb but not in our mongo db.So, create new user
	  				var newUser = new User();
	  				var uname = profile._json.name.split(" "); //to split FB name and get just first name

	  				newUser.name = profile._json.name; //full name on FB
	  				newUser.username = uname[0]; //Fb name's 0th index is first name
	  				newUser.password = accessToken;
	  				newUser.email = profile._json.email;

	  				newUser.save(function(err){
	  					if(err){
	  						//console.log(err);
	  						done(err);
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

	/*************************** TWITTER setup ***************************/

	passport.use(new TwitterStrategy({
	    consumerKey: "ums45oYUA9D4L8LBsBS7YphpP",
	    consumerSecret: "ouEtroIu09NUgeVkpxQerEcnTg5TmjGDASWnwadMxk4tQ8qHO8",
	    callbackURL: "http://localhost:8080/auth/twitter/callback",
	    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
	  },
	  function(token, tokenSecret, profile, done) {
	  	console.log("User LoggingIn from Twitter");
	  	//console.log(profile);
	  	//done(null, profile);
	  	
	    User.findOne({ email:profile._json.email }).select('name username password email').exec(function(err, user){
	  		if(err) done(err); //handle errors
	  			
	  		if(user && user !== null){	//to check if there is a user & with the verified email on FB
	  			done(null, user);
	  		} else {	//else there is user on fb but not in our mongo db.So, create new user
	  			var newUser = new User();
	  			//var uname = profile._json.name.split(" "); //to split twitter name string and get just first name

	  			newUser.name = profile._json.name; //full name on twitter
	  			newUser.username = profile._json.screen_name; //username on twitter
	  			newUser.password = token;
	  			newUser.email = profile._json.email;

	  			newUser.save(function(err){
	  				if(err){
	  					//console.log(err);
	  					done(err);
	  				} else{
	  					console.log("saving new user...");
	  					done(null, newUser);
	  				}
	  			});
	  		}
	  	});
	  	
	  }
	));

	/*************************** GOOGLE setup ***************************/
	/* Use the GoogleStrategy within Passport. Strategies in Passport require a `verify` function, which accept
	/  credentials (in this case, an accessToken, refreshToken, and Google profile), and invoke a callback with a user object.
	*/
	passport.use(new GoogleStrategy({
	    clientID: '119316387590-8q5uf8raou0ehppnvlm12i88ic15n1cr.apps.googleusercontent.com',
	    clientSecret: 'JPGI5OkItKR4mox00Bj6Mk37',
	    callbackURL: "http://localhost:8080/auth/google/callback"
	  },
	  function(accessToken, refreshToken, profile, done) {
	  	console.log("User LoggingIn from Google");
	  	//console.log(profile);
	  	//done(null, profile);
	  	
	  	User.findOne({ email:profile.emails[0].value }).select('name username password email').exec(function(err, user){
	  		if(err) done(err); //handle errors
	  			
	  		if(user && user !== null){	//to check if there is a user & with the verified email on FB
	  			done(null, user);
	  		} else {	//else there is user on fb but not in our mongo db.So, create new user
	  			var newUser = new User();
	  			//var uname = profile._json.name.split(" "); //to split twitter name string and get just first name

	  			newUser.name = profile._json.displayName; //displayName is full name on google
	  			newUser.username = profile.name.givenName; //givenName(taken as usrname) is first name on google
	  			newUser.password = accessToken;
	  			newUser.email = profile.emails[0].value;

	  			newUser.save(function(err){
	  				if(err){
	  					//console.log(err);
	  					done(err);
	  				} else{
	  					console.log("saving new user...");
	  					done(null, newUser);
	  				}
	  			});
	  		}
	  	});
	  	
	  }
	));

	/* Facebook will redirect the user to this URL after approval. Finish the authentication process by attempting to obtain an access token.  If
		access was granted, the user will be logged in. Otherwise, authentication has failed.
	*/
	app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/facebookerror' }), function(req, res){
		res.redirect('/facebook/' + token); //successRedirect to 
	});

	// just need email from uesr for special authentication from FB  ////Change failureRedirect to /login////
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' } ));

	////Change failureRedirect to /login////
	app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/twittererror' }), function(req, res){
		res.redirect('/twitter/' + token); //successRedirect to 
	}); 
	app.get('/auth/twitter', passport.authenticate('twitter'));

	app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }), function(req, res) {
	    res.redirect('/google/' + token);
	});

	app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));

	return passport;
}


/*
visit http://passportjs.org/docs/facebook more more details about FB authentication with passport.js
*/