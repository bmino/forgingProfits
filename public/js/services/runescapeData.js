angular.module('services')
.service('runescapeData', ['$q', 'runescapeApi', function($q, runescapeApi) {
	
	/* ************** */
	/* Dynamic Values */
	/* ************** */
	
	var sets = {
		rune: {
			bar: {id: 2363, price: null, loaded: false, deferred: null},
			ore: {id: 451, price: null, loaded: false, deferred: null},
			plate: {id: 1127, price: null, loaded: false, deferred: null},
			twoHander: {id: 1319, price: null, loaded: false, deferred: null}
		},
		
		addy: {
			bar: {id: 2361, price: null, loaded: false, deferred: null},
			ore: {id: 449, price: null, loaded: false, deferred: null},
			plate: {id: 1123, price: null, loaded: false, deferred: null},
			twoHander: {id: 1317, price: null, loaded: false, deferred: null}
		},
		
		material: {
			coal: {id: 453, price: null, loaded: false, deferred: null},
			nat: {id: 561, price: null, loaded: false, deferred: null},
			forge: {id: 31041, price: null, loaded: false, deferred: null}
		}
	};
	
	
	
	/* ************* */
	/* Static Values */
	/* ************* */
	var barSaving = {
		rune: 0.05,
		addy: 0.08,
		mith: 0.10
	};
	
	var coalCount = {
		rune: 8,
		addy: 6,
		mith: 4
	};
	
	var barCount = {
		plate: 5,
		legs: 3,
		skirt: 3,
		twoHander: 3
	};
	
	var exp = {
		magic: {
			superheat: 53
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
	
	
	/* ************** */
	/* Getter Methods */
	/* ************** */
	
	this.getSet = function(type) {
		switch (type) {
			// Dynamic
			case 'material':
				return lookupSet(sets.material).then(lookupSuccess, lookupFailure);
				break;
			case 'rune':
				return lookupSet(sets.rune).then(lookupSuccess, lookupFailure);
				break;
			case 'addy':
				return lookupSet(sets.addy).then(lookupSuccess, lookupFailure);
				break;
			// Static
			case 'exp':
				return $q.when(exp);
				break;
			case 'barSaving':
				return $q.when(barSaving);
				break;
			case 'coalCount':
				return $q.when(coalCount);
				break;
			case 'barCount':
				return $q.when(barCount);
			default:
				return $q.when(null);
		}
	};
	function lookupSuccess(result) {
		return result;
	}
	function lookupFailure(message) {
		return null;
	}

	
	this.clearCache = function() {
		console.log('Clearing the entire cache');
		angular.forEach(sets, function(set) {
			angular.forEach(set, function(item) {
                item['loaded'] = false;
			});
		});
	};
	
	this.loadCache = function() {
		console.log('Loading the entire cache');
		var deferral = $q.defer();
		var promises = [];
		angular.forEach(sets, function(set) {
			promises.push(lookupSet(set));
		});
		$q.all(promises).then(function(data) {
			deferral.resolve(true);
		});
		return deferral.promise;
	};

	
	/* ************** */
	/* Helper Methods */
	/* ************** */

    /**
	 * Get prices for a set.
     * @param set
     * @returns {Promise}
	 * @example {rune: {bar: 800, ore: 240}
     */
	function lookupSet(set) {
		var deferral = $q.defer();
        var promise;
		var promises = [];

		angular.forEach(set, function(item) {
			promise = lookupItem(item);
			promises.push(promise);
		});

		$q.all(promises).then(function(data) {
			deferral.resolve(set);
		});
		return deferral.promise;
	}

    /**
	 * Get price for an item.
     * @param item
     * @returns {Promise}
	 * @example 1,234
     */
	function lookupItem(item) {
		var deferred = $q.defer();

		if (isFreshData(item)) {
			console.log('Cache hit');
			return deferred.resolve(getData(item));
		}

		if (item.deferred) {
			console.log('Cache miss - API call already issued.');
			return item.deferred;
		}

		console.log('Cache miss - issuing API call.');
		item.deferred = deferred;
		return runescapeApi.getPrice(item.id).then(
			function (price) {
				storeData(item, price);
				return deferred.resolve(price);
			},
			function (error) {
				console.error('Failed to lookup'+ item);
				console.error(error);
				return deferred.reject(error);
			}
		);
	}

    /**
	 * Checks for empty or expired data.
     * @param item
     */
	var TTL_MINUTES = 5;
	var TIME_TO_LIVE_MS = TTL_MINUTES * 60 * 1000;
	function isFreshData(item) {
		var timeLived = new Date() - item.loaded;
		if (!item.loaded) return false;
		if (timeLived > TIME_TO_LIVE_MS) return false;
		return true;
	}
	

    /**
	 * Store price in the cache.
     * @param item
     * @param price
     */
	function storeData(item, price) {
		item.price = price;
		item.loaded = new Date();
		item.deferred = null;
	}

    /**
	 * Gets price from the cache.
     * @param item
     */
	function getData(item) {
		return item.price;
	}

}]);
