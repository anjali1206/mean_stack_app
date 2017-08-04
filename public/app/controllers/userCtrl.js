angular.module('userControllers', ['userServices'])
	
//registration controller	
.controller('regCtrl', function($location, $timeout, User){
	//to access varible in if else statements.
	var app = this; 

	//on click function to submit data by clicking on Register btn on UI.
	this.regUser = function(regData){	//regData is a name for ng-model. 
		//console.log("form submitted.");

		//anytime the btn is pressed to show the loading... when its necessary
		app.loading = true;

		//to hide the errorMsg while showing successMsg
		app.errorMsg = false;

		//console.log(this.regData);	//to test if the data is coming properly.

		//http post method to connect with backend & store the data in db
		//$http.post('/api/users', this.regData).then(function(data){
		//after adding $http method in userServices(userFactory), I can just user User.create defined in userServices
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
				//create an error msg
				app.errorMsg = data.data.message;
			}
		});
	};
});

/*
it is very imp. to add all the service componants in ng as args in main controller functions with $ sign
like 
$http - https://docs.angularjs.org/api/ng/service/$http
$location - https://docs.angularjs.org/api/ng/service/$location
$timeout - https://docs.angularjs.org/api/ng/service/$timeout

*/