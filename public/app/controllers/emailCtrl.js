angular.module('emailController', ['userServices'])
	
	//Controller: emailCtrl is used to activate the user's acc.
	.controller('emailCtrl', function($routeParams, User, $timeout, $location) {
		//console.log($routeParams.token);

		app = this;

		User.activateAccount($routeParams.token).then(function (data){
			//console.log(data);

			app.successMsg = false;
			app.errorMsg  = false;

			if(data.data.success){
				app.successMsg = data.data.message + '...Redirecting.';
				$timeout(function(){
					$location.path('/login');
				}, 2000);
			} else {
				app.errorMsg = data.data.message + '...Redirecting.';
				$timeout(function(){
					$location.path('/login');
				}, 2000);
			}
		});

	})

	.controller('resendCtrl', function(User){

		app = this;

		app.checkCredentials = function(loginData){
			app.disabled = true;
			app.errorMsg = false;
			app.successMsg = false;

			User.checkCredentials(app.loginData).then(function(data){
				//console.log(data);
				if(data.data.success){
					//resending the link
					User.resendLink(app.loginData).then(function(data){
						//console.log(data);
						if(data.data.success){
							app.successMsg = data.data.message;
						}						
					});

				} else{
					app.disabled = false;
					// else sennd msg, it didn't work
					app.errorMsg = data.data.message;
				}
			});
		};

		
	});



	
