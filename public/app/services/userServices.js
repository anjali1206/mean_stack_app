//factory for all the custome funtions like registering with uname, email, password
angular.module('userServices', []) 

.factory('User', function($http){
	//name the factory
	var userFactory = {};

	//User.create(regData)
	userFactory.create = function(regData){
		return $http.post('/api/users', regData);
	}

	//User.checkUsername(regData); //use it in usrCtrl
	userFactory.checkUsername = function(regData){	//service to checkusername
		return $http.post('/api/checkusername', regData);
	}

	//User.checkEmail(regData); //use it in usrCtrl
	userFactory.checkEmail = function(regData){	//service to checkemail
		return $http.post('/api/checkemail', regData);
	}

	return userFactory;
});