angular.module('forgingProfitsApp', [
	'ngRoute',
	'filters',
	'services',
	'directives',
	'controllers'
])


.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: '/partials/home.html',
			controller: 'homeController'
		})
		.when('/profit/smithing', {
			templateUrl: '/partials/profit/smithing.html',
			controller: 'smithingController'
		})
		.otherwise({
			redirectTo: '/'
		});

});