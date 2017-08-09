angular.module('appRoutes', ['ngRoute'])

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
		controllerAs: 'register'
	})

	.when('/login', {	//when user types login, take them to login page
		templateUrl: 'app/views/pages/users/login.html'
	})

	.when('/logout', {
		templateUrl: 'app/views/pages/users/logout.html'
	})

	.when('/profile', {
		templateUrl: 'app/views/pages/users/profile.html'
	})

	.otherwise({ redirectTo: '/'});

	//to remove # symbol from url -use angular nobase (visit: https://docs.angularjs.org/error/$location/nobase)
	$locationProvider.html5Mode({
  		enabled: true,
  		requireBase: false
	});

});
