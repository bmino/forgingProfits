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
	
	$scope.material = {
		coal: {id: 453, price: null},
		nat: {id: 561, price: null},
		forge: {id: 31041, price: null}
	};
	
	
	$scope.barSaving = {
		rune: 0.05,
		addy: 0.08,
		mith: 0.10
	};
	
	$scope.exp = {
		magic: {
			superheat: 53,
		},
		smith: {
			rune: {
				bar: 50,			/* Does not include forge bonus */
				plate: 375,			/* Does not include forge bonus */
				twoHander: 225		/* Does not include forge bonus */
			},
			addy: {
				bar: 37.5,			/* Does not include forge bonus */
				plate: 312.5,		/* Does not include forge bonus */
				twoHander: 187.5	/* Does not include forge bonus */
			}
		}
	};
	
	$scope.superheat = {
		rune: {
			cycleTime: 18,			/* Model */
			cycleBars: 11,			/* Model */
			materialCostPerBar:		function() {
										return $scope.rune.ore.price + (8 * $scope.material.coal.price);
									},
			xpPerBar:				function() {
										return $scope.exp.magic.superheat + $scope.exp.smith.rune.bar;
									},
			normalBarsPerSec:		function() {
										return $scope.superheat.rune.cycleBars / $scope.superheat.rune.cycleTime;
									},
			bonusBarsPerSec: 		function() {
										return 0;
									},
			barsPerSec:				function() {
										return $scope.superheat.rune.normalBarsPerSec() + $scope.superheat.rune.bonusBarsPerSec();
									},
			oreCostPerSec:			function() {
										return $scope.superheat.rune.materialCostPerBar() * $scope.superheat.rune.normalBarsPerSec();
									},
			natCostPerSec:			function() {
										return $scope.superheat.rune.normalBarsPerSec() * $scope.material.nat.price;
									},
			costPerSec:				function() {
										return $scope.superheat.rune.oreCostPerSec() + $scope.superheat.rune.natCostPerSec();
									},
			profitPerBar:			function() {
										return $scope.rune.bar.price - ($scope.rune.ore.price + 8*$scope.material.coal.price);
									},
			profitPerMin:			function() {
										return (($scope.rune.bar.price * $scope.superheat.rune.barsPerSec()) - $scope.superheat.rune.costPerSec()) * 60;
									},
			profitPerHour:			function() {
										return $scope.superheat.rune.profitPerMin() * 60;
									},
			xpPerHour:				function() {
										return ($scope.superheat.rune.xpPerBar() * $scope.superheat.rune.cycleBars) / $scope.superheat.rune.cycleTime * 60 * 60;
									},
			profitPerXp:			function() {
										return $scope.superheat.rune.profitPerHour() / $scope.superheat.rune.xpPerHour();
									}
		}
	};
	
	$scope.smelt = {
		rune: {
			cycleTime: 18,			/* Model */
			cycleBars: 11,			/* Model */
			materialCostPerBar:		function() {
										return $scope.rune.ore.price + (8 * $scope.material.coal.price);
									},
			xpPerBar:				function() {
										return $scope.exp.smith.addy.bar;
									},
			normalBarsPerSec:		function() {
										return $scope.smelt.rune.cycleBars / $scope.smelt.rune.cycleTime;
									},
			bonusBarsPerSec: 		function() {
										return $scope.smelt.rune.normalBarsPerSec * $scope.barSaving.rune;
									},
			barsPerSec:				function() {
										return $scope.smelt.rune.normalBarsPerSec() + $scope.smelt.rune.bonusBarsPerSec();
									},
			oreCostPerSec:			function() {
										return $scope.smelt.rune.materialCostPerBar() * $scope.smelt.rune.normalBarsPerSec();
									},
			forgeAmortization:		function() {
										return $scope.material.forge.price / (5*60);
									},
			costPerSec:				function() {
										return $scope.smelt.rune.oreCostPerSec() + $scope.smelt.rune.forgeAmortization();
									},
			profitPerBar:			function() {
										return $scope.rune.bar.price - ($scope.rune.ore.price + 8*$scope.material.coal.price + $scope.material.nat.price);
									},
			profitPerMin:			function() {
										return (($scope.rune.bar.price * $scope.smelt.rune.barsPerSec()) - $scope.smelt.rune.costPerSec()) * 60;
									},
			profitPerHour:			function() {
										return $scope.smelt.rune.profitPerMin() * 60;
									},
			xpPerHour:				function() {
										return ($scope.smelt.rune.xpPerBar() * $scope.smelt.rune.cycleBars) / $scope.smelt.rune.cycleTime * 60 * 60;
									},
			profitPerXp:			function() {
										return $scope.smelt.rune.profitPerHour() / $scope.smelt.rune.xpPerHour();
									}
		},
		addy: {
			
		}
	};
	
	$scope.smith = {
		rune: {
			
		},
		addy: {
		
		}
	};
	
	init();
	
	function init() {
		$rootScope.pageTitle = 'Smithing';
		lookup($scope.rune);
		lookup($scope.addy);
		lookup($scope.material);
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
