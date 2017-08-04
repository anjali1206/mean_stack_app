angular.module('mainController', ['authServices'])

.controller('mainCtrl', function(Auth, $location, $timeout){
	/* below is the same code (with some changes) I have used in userCtrl */
	var app = this;	//global variable

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
					$location.path('/');
				}, 2000);				
			} else {
				app.loading = false;
				//create an error msg
				app.errorMsg = data.data.message;
			}
		});
	};
});
