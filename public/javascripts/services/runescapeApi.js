angular.module('services')
.service('runescapeApi', ['$http', function($http) {
	
	this.getPrice = function(itemId) {
		var request = $http({
			method: "get",
			url: "api/rs/price/"+itemId
		});
		return request.then( handleSuccess, handleError );
	};
	
	
	
	function handleSuccess(response) {
		var successMessage = response.data.message;
		return successMessage;
	}
	
	function handleError(response) {
		var dummy = document.createElement('body');
		dummy.innerHTML = response.data;
		var errorMessage = dummy.getElementsByTagName("h1")[0].innerHTML;
		throw errorMessage;
		return null;
	}
	
}]);
