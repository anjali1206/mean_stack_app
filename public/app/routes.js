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

	.otherwise({ redirectTo: '/'});

	//to remove # symbol from url -use angular nobase (visit: https://docs.angularjs.org/error/$location/nobase)
	$locationProvider.html5Mode({
  		enabled: true,
  		requireBase: false
	});

});
