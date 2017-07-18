var express = require('express');
var router = express.Router();
var runescape = require('runescape-api');

/* ************** */
/* Grand Exchange */
/* ************** */

/* GET categories information */
router.get('/category/:category', function(req, res, next) {
	var _category = req.params.category;
	runescape.rs.ge.category(_category).then(function(data) {
		res.json({message: data});
	});
});

/* GET current price */
router.get('/price/:itemId', function(req, res, next) {
	var _id = req.params.itemId;
	runescape.rs.ge.graphData(_id).then(function(data) {
		
		var obj = data.daily;
		var prices = Object.keys(obj).map(function (key) {return obj[key]});
		var price = prices[prices.length-1];
		
		res.json({message: price});
	});
});

/* GET graph data */
router.get('/graphData/:itemId', function(req, res, next) {
	var _id = req.params.itemId;
	runescape.rs.ge.graphData(_id).then(function(item) {
		res.json({message: item});
	});
});

/* GET item information */
router.get('/itemInformation/:itemId', function(req, res, next) {
	var _id = req.params.itemId;
	runescape.rs.ge.itemInformation(_id).then(function(item) {
		res.json({message: item});
	});
});

module.exports = router;
