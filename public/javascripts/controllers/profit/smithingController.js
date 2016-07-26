angular.module('controllers')
.controller('smithingController', function($scope, $rootScope) {
	
	init();
	
	function init() {
		$rootScope.pageTitle = 'Smithing';
	}
	
});
