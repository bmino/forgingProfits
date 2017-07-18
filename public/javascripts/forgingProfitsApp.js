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
			templateUrl: '/partials/home.html'
		})
		.when('/profit/smithing', {
			templateUrl: '/partials/profit/smithing.html'
		})
		.otherwise({
			redirectTo: '/'
		});

}]);