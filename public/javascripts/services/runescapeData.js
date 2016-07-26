angular.module('services')
.service('runescapeData', function($http, $q, runescapeApi) {
	
	/* ************** */
	/* Dynamic Values */
	/* ************** */
	
	var sets = {
		rune: {
			bar: {id: 2363, price: null, loaded: false},
			ore: {id: 451, price: null, loaded: false},
			plate: {id: 1127, price: null, loaded: false},
			twoHander: {id: 1319, price: null, loaded: false}
		},
		
		addy: {
			bar: {id: 2361, price: null, loaded: false},
			ore: {id: 449, price: null, loaded: false},
			plate: {id: 1123, price: null, loaded: false},
			twoHander: {id: 1317, price: null, loaded: false}
		},
		
		material: {
			coal: {id: 453, price: null, loaded: false},
			nat: {id: 561, price: null, loaded: false},
			forge: {id: 31041, price: null, loaded: false}
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
	}
	function lookupSuccess(result) {
		return result;
	}
	function lookupFailure(message) {
		return null;
	}

	
	this.clearCache = function() {
		for (var item in sets) {
			sets[item]['loaded'] = false;
		}
	}

	
	/* ************** */
	/* Helper Methods */
	/* ************** */
	
	/*
	 * Get prices for a set
	 *
	 * @param set
	 *
	 * @result ex. {rune: {bar: 800, ore: 240}
	 *
	 */
	function lookupSet(set) {
		var deferral = $q.defer();
		var promises = [];
		
		for (var item in set) {
			var promise = lookupItem(set[item]);
			promises.push(promise);
		}
		$q.all(promises).then(function(data) {
			deferral.resolve(set);
		});
		return deferral.promise;
	}
	
	/* 
	 * Get price for an item
	 *
	 * @param item
	 *
	 * @result ex. 1,234
	 *
	 */
	function lookupItem(item) {
		var deferred = $q.defer();
		
		if (isFreshData(item)) {
			// Cache hit
			console.log('cache hit');
			deferred.resolve(item.price);
		} else {
			// Cache miss
			console.log('cache event');
			runescapeApi.getPrice(item.id).then(
				function (price) {
					storeData(item, price);
					deferred.resolve(price);
				},
				function (error) {
					deferred.reject(error);
				}
			);
		}
		return deferred.promise;
	}
	
	/*
	 * Checks for no data, or expired data
	 *
	 */
	var TTL_MINUTES = 5;
	var TIME_TO_LIVE = TTL_MINUTES * 1000 * 60;
	function isFreshData(item) {
		if (item.loaded && new Date() - item.loaded < TIME_TO_LIVE) {
			// Recent data
			return true;
		}
		return false;
	}
	
	/*
	 * Store price in the cache
	 *
	 */
	function storeData(item, price) {
		item.price = price;
		item.loaded = new Date();
	}
	
	
	function isLoading() {
		for (var set in sets) {
			if (!setLoaded(sets[set])) return true;
		}
		return false;
	}
	
	function setLoaded(set) {
		for (var item in set) {
			if (!set[item]['loaded']) return false;
		}
		return true;
	}

});
