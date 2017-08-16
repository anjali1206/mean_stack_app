var app = angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){

	//$routeProvider is Used for configuring routes.
	$routeProvider

	.when('/', {	//when user types the default location, take them to home page
		templateUrl: 'app/views/pages/home.html'
	})

	.when('/about', {	//when user types about, take them to about page
		templateUrl: 'app/views/pages/about.html'
	})

	.when('/register', {	//when user types register, take them to register page
		templateUrl: 'app/views/pages/users/register.html',
		controller: 'regCtrl',
		controllerAs: 'register',
		authenticated: false
	})

	.when('/login', {	//when user types login, take them to login page
		templateUrl: 'app/views/pages/users/login.html',
		authenticated: false
	})

	.when('/logout', {
		templateUrl: 'app/views/pages/users/logout.html',
		authenticated: true
	})

	.when('/profile', {
		templateUrl: 'app/views/pages/users/profile.html',
		authenticated: true
	})

	.when('/facebook/:token', {
		templateUrl: 'app/views/pages/users/social/social.html',
		controller: 'facebookCtrl',
		controllerAs: 'facebook',
		authenticated: false
	})

	.when('/twitter/:token', {
		templateUrl: 'app/views/pages/users/social/social.html',
		controller: 'twitterCtrl',
		controllerAs: 'twitter',
		authenticated: false
	})

	.when('/google/:token', {
		templateUrl: 'app/views/pages/users/social/social.html',
		controller: 'googleCtrl',
		controllerAs: 'google',
		authenticated: false
	})

	.when('/facebookerror', {
		templateUrl: 'app/views/pages/users/login.html',
		controller: 'facebookCtrl',
		controllerAs: 'facebook',
		authenticated: false
	})

	.when('/twittererror', {
		templateUrl: 'app/views/pages/users/login.html',
		controller: 'twitterCtrl',
		controllerAs: 'twitter',
		authenticated: false
	})

	.when('/googleerror', {
		templateUrl: 'app/views/pages/users/login.html',
		controller: 'googleCtrl',
		controllerAs: 'google',
		authenticated: false
	})

	.otherwise({ redirectTo: '/'});

	//to remove # symbol from url -use angular nobase (visit: https://docs.angularjs.org/error/$location/nobase)
	$locationProvider.html5Mode({
  		enabled: true,
  		requireBase: false
	});

});

//to prevent users from accessing pages that they are not authorize to view/authorized to go to the urls
app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location){
	$rootScope.$on('$routeChangeStart', function(event, next, current){
		//console.log(Auth.isLoggedIn());
		//console.log(next.$$route.authenticated);

		if(next.$$route.authenticated == true){
			//console.log("needs to be authenticated.");
			if(!Auth.isLoggedIn()){	//if user isn't logged in, they can't see profile or logout pages
				event.preventDefault();
				$location.path('/');
			}
		} else if(next.$$route.authenticated == false) {
			//console.log("should not be authenticated.");
			if(Auth.isLoggedIn()){ //only if the user is logged in, they can see the profile & can't see login or register pgs
				event.preventDefault();
				$location.path('/profile');
			}
		} else {	//just for the testing purpose for the home route. 
			console.log("Authentication doesn't matter");
		}

	});
}]);