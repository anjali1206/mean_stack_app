//factory for all the authentication when user logsin
angular.module('authServices', [])

.factory('Auth', function($http){
	//name the factory
	authFactory = {};

	//User.create(regData)
	authFactory.login = function(loginData){
		return $http.post('/api/authenticate', loginData);
	}
	return authFactory;
});