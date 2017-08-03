angular.module('userServices', []) 

.factory('User', function($http){
	//name the factory
	userFactory = {};

	//User.create(regData)
	userFactory.create = function(regData){
		return $http.post('/api/users', regData);
	}
	return userFactory;
});