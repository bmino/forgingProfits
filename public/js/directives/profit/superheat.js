angular.module('directives')
.directive('superheat', ['$q', 'runescapeData', function($q, runescapeData) {
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
				scope.superheat = {
					cycleTime: 18,
					cycleBars: 11,
					materialCostPerBar:		function() {
												return scope[type]['ore']['price'] + (scope['coalCount'][type] * scope['material']['coal']['price']);
											},
					xpPerBar:				function() {
												return scope['exp']['magic']['superheat'] + scope['exp']['smith'][type]['bar'];
											},
					normalBarsPerSec:		function() {
												return scope['superheat']['cycleBars'] / scope['superheat']['cycleTime'];
											},
					bonusBarsPerSec: 		function() {
												return 0;
											},
					barsPerSec:				function() {
												return scope['superheat'].normalBarsPerSec() + scope['superheat'].bonusBarsPerSec();
											},
					oreCostPerSec:			function() {
												return scope['superheat'].materialCostPerBar() * scope['superheat'].normalBarsPerSec();
											},
					natCostPerSec:			function() {
												return scope['superheat'].normalBarsPerSec() * scope['material']['nat']['price'];
											},
					costPerSec:				function() {
												return scope['superheat'].oreCostPerSec() + scope['superheat'].natCostPerSec();
											},
					profitPerBar:			function() {
												return scope[type]['bar']['price'] - (scope[type]['ore']['price'] + scope['coalCount'][type] * scope['material']['coal']['price']);
											},
					profitPerMin:			function() {
												return ((scope[type]['bar']['price'] * scope['superheat'].barsPerSec()) - scope['superheat'].costPerSec()) * 60;
											},
					profitPerHour:			function() {
												return scope['superheat'].profitPerMin() * 60;
											},
					xpPerHour:				function() {
												return (scope['superheat'].xpPerBar() * scope['superheat']['cycleBars']) / scope['superheat']['cycleTime'] * 60 * 60;
											},
					costPerXp:				function() {
												return (scope['superheat'].profitPerHour() * -1) / scope['superheat'].xpPerHour();
											}
				};
			}

			init();
			
		},
		templateUrl: '/templates/profit/superheatTemplate.html'
	};
}]);
