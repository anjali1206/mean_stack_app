angular.module('userControllers', ['userServices'])
	
//registration controller	
.controller('regCtrl', function($location, $timeout, User){
	//to access varible in if else statements.
	var app = this; 

	//on click function to submit data by clicking on Register btn on UI.
	this.regUser = function(regData, valid){	//regData is a name for ng-model. 
		//console.log("form submitted.");

		//anytime the btn is pressed to show the loading... when its necessary
		app.loading = true;
		//to hide the errorMsg while showing successMsg
		app.errorMsg = false;

		//console.log(this.regData);	//to test if the data is coming properly.

		//http post method to connect with backend & store the data in db
		//$http.post('/api/users', this.regData).then(function(data){
		//after adding $http method in userServices(userFactory), I can just user User.create defined in userServices
		if(valid){
			User.create(app.regData).then(function(data){
			//console.log(data.data.success);
			//console.log(data.data.message);

				//defining success, err msgs to show to users on UI
				if(data.data.success){
					//to hide loading once data is entered
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
					app.errorMsg = data.data.message; //create an error msg
				}
			});
		} else {
			app.loading = false;
			app.errorMsg = "Please ensure form fields are filled out properly.";	//create an error msg
		}
	};
})

.controller('facebookCtrl', function(Auth, $routeParams, $location, $window){
	//console.log("testing facebook controller");
	//console.log($routeParams.token); //returns the url with token and token(object) in console.
	var app = this; 

	//set the token only if there is no err
	if($window.location.pathname == '/facebookerror'){
		//show err
		app.errorMsg = 'Facebook email not found in database.';
	} else {
		Auth.facebook($routeParams.token); 
		$location.path('/');	
	}
	
	
})

.controller('twitterCtrl', function(Auth, $routeParams, $location, $window){
	//console.log("testing twitter controller");
	//console.log($routeParams.token); //returns the url with token and token(object) in console.
	var app = this; 

	//set the token only if there is no err
	if($window.location.pathname == '/twittererror'){
		//show err
		app.errorMsg = 'Twitter email not found in database.';
	} else {
		Auth.facebook($routeParams.token); 
		$location.path('/');	
	}
	
	
})

.controller('googleCtrl', function(Auth, $routeParams, $location, $window){
	//console.log("testing google controller");
	//console.log($routeParams.token); //returns the url with token and token(object) in console.
	var app = this; 

	//set the token only if there is no err
	if($window.location.pathname == '/googleerror'){
		//show err
		app.errorMsg = 'Google email not found in database.';
	} else {
		Auth.facebook($routeParams.token); 
		$location.path('/');	
	}
	
	
});







/*
it is very imp. to add all the service componants in ng as args in main controller functions with $ sign
like 
$http - https://docs.angularjs.org/api/ng/service/$http
$location - https://docs.angularjs.org/api/ng/service/$location
$timeout - https://docs.angularjs.org/api/ng/service/$timeout

*/