angular.module('mainController', ['authServices'])

.controller('mainCtrl', function(Auth, $location, $timeout, $rootScope){
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
				//console.log(data.data.username);
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
	});

	this.doLogin = function(loginData){
		//console.log("testing form submitted");
		app.loading = true;
		app.errorMsg = false;

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
				app.loading = false;
				//create an error msg
				app.errorMsg = data.data.message;
			}
		});
	};

	//logout function implementation from authServices.js
	this.logout = function(){
		Auth.logout();
		$location.path('/logout');
		$timeout(function(){
			$location.path('/');
		}, 2000);
	};

});
