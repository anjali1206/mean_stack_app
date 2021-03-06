angular.module('mainController', ['authServices'])

.controller('mainCtrl', function(Auth, $location, $timeout, $rootScope, $window){
	/* below is the same code (with some changes) I have used in userCtrl */
	var app = this;	//global variable

	app.loadme = false; //hide html until it becomes true - to hide angular stuff on UI

	//to remove username without refreshing pg, once user logs out.
	//anytime a new rout changes or diff.view, its gonna invoke everything with the fucntion
	$rootScope.$on('$routeChangeStart', function() {
		//check to see if user is loggedIn or NOT 
		if(Auth.isLoggedIn()){
			//console.log('Success: User is logged in.');
			app.isLoggedIn = true; //to hide login & register tabs once user logged in
			Auth.getUser().then(function(data){
				//console.log(data);
				//console.log(data.data.username);
				//console.log(data.data.name);
				//app.uname = data.data.name;
				app.username = data.data.username;
				app.useremail = data.data.email;
				app.loadme = true; //to hide angular stuff on UI-once we get all user info. we set loadme to true
			});
		} else{
			//console.log('Failure: User is NOT logged in.');
			app.isLoggedIn = false;	//to show login & register tabs if user isn't logged in
			app.username = null;
			app.loadme = true; //to hide angular stuff on UI -if we don't get the user info., then its fine but afterwards loadme to true
		}

		if($location.hash() == '_=_'){
			$location.hash(null);
		}
	});

	this.facebook = function() {
		//console.log($window.location.host); //localhost:8080
		//console.log($window.location.protocol); //http:
		app.disabled= true;
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
	};

	this.twitter = function() {
		//console.log($window.location.host); //localhost:8080
		//console.log($window.location.protocol); //http:
		app.disabled= true;
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter';
	};

	this.google = function() {
		//console.log($window.location.host); //localhost:8080
		//console.log($window.location.protocol); //http:
		app.disabled= true;
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
	};

	this.doLogin = function(loginData){
		//console.log("testing form submitted");
		app.loading = true;
		app.errorMsg = false;
		app.expired = false;
		app.disabled = true; //after user pressed the login btn, its gonna disable the form

		Auth.login(app.loginData).then(function(data){
			if(data.data.success){
				app.loading = false;
				//create success msg 
				app.successMsg = data.data.message + '... Redirecting to home...';

				//redirect user to home page with little delay in miliseconds
				$timeout(function() { 
					//The $location service parses the URL in the browser address bar
					$location.path('/about');
					app.loginData = null;
					app.successMsg = false;
				}, 2000);				
			} else {
				if(data.data.expired){
					app.expired = true;
					app.loading = false;
					app.errorMsg = data.data.message;
				} else {
					//create an error msg
					app.loading = false;
					app.disabled= false;	//remove disabling if there is an err in form. So, user can try again
					app.errorMsg = data.data.message;
				}
				
			}
		});
	};

	//logout function implementation from authServices.js
	this.logout = function(){
		Auth.logout();
		$location.path('/logout');
		$timeout(function(){
			$location.path('/login');
		}, 2000);
	};

});
