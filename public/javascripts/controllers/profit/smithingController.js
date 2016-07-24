angular.module('controllers')
.controller('smithingController', function($scope, $rootScope, runescapeService) {
	
	$scope.rune = {
		bar: {id: 2363, price: null},
		ore: {id: 451, price: null},
		plate: {id: 1127, price: null},
		twoHander: {id: 1319, price: null}
	};
	
	$scope.addy = {
		bar: {id: 2361, price: null},
		ore: {id: 449, price: null},
		plate: {id: 1123, price: null},
		twoHander: {id: 1317, price: null}
	};
	
	$scope.rawMat = {
		coal: {id: 453, price: null},
		nat: {id: 561, price: null},
		forge: {id: 31041, price: null}
	};
	
	var barSaving = {
		rune: 0.05,
		addy: 0.08,
		mith: 0.10
	};
	
	init();
	
	function init() {
		$rootScope.pageTitle = 'Smithing';
		lookup($scope.rune);
		lookup($scope.addy);
		lookup($scope.rawMat);
	}
	
	function lookup(set) {
		var item;
		for (item in set) {
			(function(item) {
				runescapeService.getPrice(set[item]['id']).then(
					function (price) {
						set[item]['price'] = price;
					},
					function (error) {
						console.log(error);
					}
				);
			})(item);
		}
	}
	
});
