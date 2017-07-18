angular.module('directives')
.directive('smelting', ['$q', 'runescapeData', function($q, runescapeData) {
	return {
		scope: {},
		link: function(scope, element, attrs) {
			var type = attrs.type;
			scope.title = attrs.title;
			
			function init() {
				$q.all({
					type:			runescapeData.getSet(type),
					material:		runescapeData.getSet('material'),
					exp:			runescapeData.getSet('exp'),
					coalCount:		runescapeData.getSet('coalCount')
				}).then(function(data) {
					scope[type] = data.type;
					scope.material = data.material;
					scope.exp = data.exp;
					scope.coalCount = data.coalCount;
					scope.loaded = true;
				}).then(createScope);
			}
			
			function createScope() {
				scope.smelting = {
					cycleTime: 30,
					cycleBars: 11,
					portable: true,
					togglePortable:			function() {
												scope['smelting']['portable'] = !scope['smelting']['portable'];
											},
					oreCostPerBar:			function() {
												return scope[type]['ore']['price'] + (scope['coalCount'][type] * scope['material']['coal']['price']);
											},
					xpPerBar:				function() {
												var multiplier = scope['smelting']['portable'] ? 1.10 : 1;  // Forge exp boost
												return scope['exp']['smith'][type]['bar'] * multiplier;
											},
					normalBarsPerSec:		function() {
												return scope['smelting']['cycleBars'] / scope['smelting']['cycleTime'];
											},
					bonusBarsPerSec: 		function() {
												var multiplier = scope['smelting']['portable'] ? 0.05 : 0;
												return scope['smelting'].normalBarsPerSec() * multiplier;
											},
					barsPerSec:				function() {
												return scope['smelting'].normalBarsPerSec() + scope['smelting'].bonusBarsPerSec();
											},
					oreCostPerSec:			function() {
												return scope['smelting'].oreCostPerBar() * scope['smelting'].normalBarsPerSec();
											},
					forgeAmortization:		function() {
												return scope['smelting']['portable'] ? scope['material']['forge']['price'] / (5*60) : 0;
											},
					costPerSec:				function() {
												return scope['smelting'].oreCostPerSec() + scope['smelting'].forgeAmortization();
											},
					profitPerBar:			function() {
												//return scope[type]['bar']['price'] - scope['smelting'].oreCostPerBar() - (scope['smelting'].forgeAmortization() * scope['smelting'].barsPerSec());
												return scope['smelting'].profitPerSec() / scope['smelting'].barsPerSec();
											},
					profitPerSec:			function() {
												return (scope['smelting'].barsPerSec() * scope[type]['bar']['price']) - scope['smelting'].costPerSec();
											},					
					profitPerMin:			function() {
												return scope['smelting'].profitPerSec() * 60;
											},
					profitPerHour:			function() {
												return scope['smelting'].profitPerSec() * 60 * 60;
											},
					xpPerHour:				function() {
												return scope['smelting'].xpPerBar() * scope['smelting'].barsPerSec() * 60 * 60;
											},
					costPerXp:				function() {
												return (scope['smelting'].profitPerHour() * -1) / scope['smelting'].xpPerHour();
											}
				};
			}

            init();

		},
		templateUrl: '/templates/profit/smeltingTemplate.html'
	};
}]);
