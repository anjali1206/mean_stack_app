// This is the main angular config file. the name of the module is 'userApp' followed by dependencies like routes,animation, coockies etc.
// in this main configuration file, I can inject all of the other angular files. 
//So, I'll just need to connect this file in the body tag of index.html as ng-app="userApp"
angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices'])

.config(function($httpProvider) { //configuring app to intercept all http req. with 'AuthInterceptors' factory I created, which basically assigns tokens to the header
	$httpProvider.interceptors.push('AuthInterceptors');
});

