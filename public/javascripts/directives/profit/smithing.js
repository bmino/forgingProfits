angular.module('directives')
.directive('smithing', function($q, runescapeData) {
	return {
		scope: {},
		link: function(scope, element, attrs) {
			var type = attrs.type;
			var item = attrs.item;
			scope.title = attrs.title;
			
			init();
			
			function init() {
				$q.all({
					type:			runescapeData.getSet(type),
					material:		runescapeData.getSet('material'),
					exp:			runescapeData.getSet('exp'),
					barCount:		runescapeData.getSet('barCount'),
					barSaving:		runescapeData.getSet('barSaving')
				}).then(function(data) {
					scope[type] = data.type;
					scope.material = data.material;
					scope.exp = data.exp;
					scope.barCount = data.barCount;
					scope.barSaving = data.barSaving;
				}).then(createScope);
			}
			
			function createScope() {
				scope.smithing = {
					cycleTime: 24,
					cycleProduced: 5,
					wastelessSmithing: true,
					barsPerItem:			function() {
												var baseBars = scope['barCount'][item];
												if (baseBars >= 3 && scope['smithing']['wastelessSmithing'])
													var savings = scope['barSaving'][type];
												else
													var savings = 0;
												// 10% of each bar being saved
												return (baseBars * 0.9) - savings;
											},
					costPerItem:			function() {
												return scope['smithing'].barsPerItem() * scope[type]['bar']['price'];
											},
					xpPerItem:				function() {
												return scope['exp']['smith'][type][item] * 1.10; // Forge exp boost
											},
					normalItemsPerSec:		function() {
												return scope['smithing']['cycleProduced'] / scope['smithing']['cycleTime'];
											},
					bonusItemsPerSec: 		function() {
												return 0;
											},
					itemsPerSec:			function() {
												return scope['smithing'].normalItemsPerSec() + scope['smithing'].bonusItemsPerSec();
											},
					barCostPerSec:			function() {
												return scope['smithing'].costPerItem() * scope['smithing'].itemsPerSec();
											},
					forgeAmortization:		function() {
												return scope['material']['forge']['price'] / (5*60);
											},
					costPerSec:				function() {
												return scope['smithing'].barCostPerSec() + scope['smithing'].forgeAmortization();
											},
					profitPerItem:			function() {
												return scope[type][item]['price'] - (scope['barCount'][item] * scope[type]['bar']['price']);
											},
					profitPerMin:			function() {
												return ((scope[type][item]['price'] * scope['smithing'].itemsPerSec()) - scope['smithing'].costPerSec()) * 60;
											},
					profitPerHour:			function() {
												return scope['smithing'].profitPerMin() * 60;
											},
					xpPerHour:				function() {
												return (scope['smithing'].xpPerItem() * scope['smithing']['cycleProduced']) / scope['smithing']['cycleTime'] * 60 * 60;
											},
					profitPerXp:			function() {
												return scope['smithing'].profitPerHour() / scope['smithing'].xpPerHour();
											}
				};
			}
			
			
		},
		templateUrl: '/templates/profit/smithingTemplate.html'
	};
});
