//factory for all the authentication when user logsin
angular.module('authServices', [])

.factory('Auth', function($http, AuthToken){
	//name the factory
	authFactory = {};

	//Auth.create(regData)
	authFactory.login = function(loginData){
		return $http.post('/api/authenticate', loginData).then(function(data){
			//console.log(data.data.token);
			AuthToken.setToken(data.data.token); //with setToken function, set it in browser
			return data;
		});
	};

	//Auth.isLoggedIn(); //using this funciton in mainCtrl file. when the page loads on UI, I'm gonna invoke this isLoggedIn funciton
	//custom function to see if user is logged in. //know it by getting the token from the storage. if it doesn't return anything, that means user isn't logged in 
	authFactory.isLoggedIn = function(){
		if(AuthToken.getToken()){
			return true;
		} else {
			return false;
		}
	};

	//Auth.facebook(token);
	authFactory.facebook = function(token){
		AuthToken.setToken(token);
	}

	//Auth.getUser();
	authFactory.getUser = function(){
		if(AuthToken.getToken()) {
			return $http.post('/api/currentUser');
		} else {
			$q.reject({ message: 'User has no token.' });
		}
	};

	//LOGOUT funciton//Auth.logout();
	authFactory.logout = function(){
		AuthToken.setToken(); //this will remove token
	};

	return authFactory;
})

//to set and get token(jwt)
.factory('AuthToken', function($window){
	var authTokenFactory = {};

	//AuthToken.setToken(token); //when I invoke it, it's gonna save this token in th local storage on the browser
	//custom function for setting a token
	authTokenFactory.setToken = function(token){
		if(token){	//if token is provide in isLoggedIn() then set it 
			$window.localStorage.setItem('token', token);
		} else{	//otherwise remove token
			$window.localStorage.removeItem('token');
		}
		
	};

	//AuthToken.getToken(); // to get it in order to check users' data
	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	};

	return authTokenFactory;
})

//to attach tokens to every req.
.factory('AuthInterceptors', function(AuthToken) {
	var authInterceptorsFactory = {};

	authInterceptorsFactory.request = function(config) {
		var token = AuthToken.getToken();

		if(token) {
			config.headers['x-access-token'] = token; //to assign tokens to the headers
		}

		return config;
	};


	return authInterceptorsFactory;
});