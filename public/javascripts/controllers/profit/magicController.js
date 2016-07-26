angular.module('controllers')
.controller('magicController', function($scope, $rootScope) {
	
	init();
	
	function init() {
		$rootScope.pageTitle = 'Magic';
	}
	
});
