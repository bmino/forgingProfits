angular.module('forgingProfitsApp', [
	'ngRoute',
	'filters',
	'services',
	'directives',
	'controllers'
])


.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: '/page/home.html'
		})
		.when('/smithing', {
			templateUrl: '/page/smithing.html'
		})
		.otherwise({
			redirectTo: '/'
		});

}]);