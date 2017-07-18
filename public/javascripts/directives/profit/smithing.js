angular.module('directives')
.directive('smithing', ['$q', 'runescapeData', function($q, runescapeData) {
	return {
		scope: {},
		link: function(scope, element, attrs) {
			var type = attrs.type;
			var item = attrs.item;
			scope.title = attrs.title;
			
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
					scope.loaded = true;
				}).then(createScope);
			}
			
			function createScope() {
				scope.smithing = {
					cycleTime: 24,
					cycleProduced: 5,
					portable: true,
					wastelessSmithing: true,
					togglePortable:			function() {
												scope['smithing']['portable'] = !scope['smithing']['portable'];
											},
					toggleWasteless:		function() {
												scope['smithing']['wastelessSmithing'] = !scope['smithing']['wastelessSmithing'];
											},
					barsPerItem:			function() {
												var baseBars = scope['barCount'][item];
												var savings = baseBars >= 3 && scope['smithing']['wastelessSmithing'] ? scope['barSaving'][type] : 0;
												var multiplier = scope['smithing']['portable'] ? 0.9 : 1; // 10% of each bar being saved with portable
												return (baseBars * multiplier) - savings;
											},
					costPerItem:			function() {
												return scope['smithing'].barsPerItem() * scope[type]['bar']['price'];
											},
					xpPerItem:				function() {
												var multiplier = scope['smithing']['portable'] ? 1.10 : 1;
												return scope['exp']['smith'][type][item] * multiplier; // Forge exp boost
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
												return scope['smithing']['portable'] ? scope['material']['forge']['price'] / (5*60) : 0;
											},
					costPerSec:				function() {
												return scope['smithing'].barCostPerSec() + scope['smithing'].forgeAmortization();
											},
					profitPerItem:			function() {
												return scope[type][item]['price'] - (scope['barCount'][item] * scope[type]['bar']['price']) - (scope['smithing'].forgeAmortization() * scope['smithing'].itemsPerSec());
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
					costPerXp:				function() {
												return (scope['smithing'].profitPerHour() * -1) / scope['smithing'].xpPerHour();
											}
				};
			}

			init();
			
		},
		templateUrl: '/templates/profit/smithingTemplate.html'
	};
}]);
