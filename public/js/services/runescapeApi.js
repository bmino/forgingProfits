angular.module('services')
.service('runescapeApi', ['$http', function($http) {
	
	this.getPrice = function(itemId) {
		return $http({
			method: "get",
			url: "api/rs/price/"+itemId
		}).then( handleSuccess, handleError );
	};
	
	
	
	function handleSuccess(response) {
		return response.data.message;
	}
	
	function handleError(response) {
		var dummy = document.createElement('body');
		dummy.innerHTML = response.data;
        throw dummy.getElementsByTagName("h1")[0].innerHTML;
	}
	
}]);
