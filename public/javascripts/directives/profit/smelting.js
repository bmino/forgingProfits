angular.module('directives')
.directive('smelting', function($q, runescapeData) {
	return {
		scope: {},
		link: function(scope, element, attrs) {
			var type = attrs.type;
			scope.title = attrs.title;
			
			init();
			
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
				}).then(createScope);
			}
			
			function createScope() {
				scope.smelting = {
					cycleTime: 30,
					cycleBars: 11,
					materialCostPerBar:		function() {
												return scope[type]['ore']['price'] + (scope['coalCount'][type] * scope['material']['coal']['price']);
											},
					xpPerBar:				function() {
												return scope['exp']['smith'][type]['bar'] * 1.10; // Forge exp boost
											},
					normalBarsPerSec:		function() {
												return scope['smelting']['cycleBars'] / scope['smelting']['cycleTime'];
											},
					bonusBarsPerSec: 		function() {
												return scope['smelting'].normalBarsPerSec() * 0.05;
											},
					barsPerSec:				function() {
												return scope['smelting'].normalBarsPerSec() + scope['smelting'].bonusBarsPerSec();
											},
					oreCostPerSec:			function() {
												return scope['smelting'].materialCostPerBar() * scope['smelting'].normalBarsPerSec();
											},
					forgeAmortization:		function() {
												return scope['material']['forge']['price'] / (5*60);
											},
					costPerSec:				function() {
												return scope['smelting'].oreCostPerSec() + scope['smelting'].forgeAmortization();
											},
					profitPerBar:			function() {
												return scope[type]['bar']['price'] - (scope[type]['ore']['price'] + 8*scope['material']['coal']['price']);
											},
					profitPerMin:			function() {
												return ((scope[type]['bar']['price'] * scope['smelting'].barsPerSec()) - scope['smelting'].costPerSec()) * 60;
											},
					profitPerHour:			function() {
												return scope['smelting'].profitPerMin() * 60;
											},
					xpPerHour:				function() {
												return (scope['smelting'].xpPerBar() * scope['smelting']['cycleBars']) / scope['smelting']['cycleTime'] * 60 * 60;
											},
					profitPerXp:			function() {
												return scope['smelting'].profitPerHour() / scope['smelting'].xpPerHour();
											}
				};
			}
			
			
		},
		templateUrl: '/templates/profit/smeltingTemplate.html'
	};
});
