var express = require('express');
var constants = require('./constants');
var router = express.Router();
var isMobile = require('ismobilejs');
var cookieParser = require('cookie-parser');

router.use(cookieParser());
router.get('/', function(req, res, next) {
  res.render('main', {title: '首頁', path: '/'});
});

router.get('/bloodline/index_test', function(req, res, next) {
	if(req.cookies.key === constants.cookie)
		res.render('bloodline/index_test', {title: '暗夜血姬', path: '/' });
	else
		res.render('bloodline/index', {title: '暗夜血姬', path: '/' });
});

router.get('/bloodline/table', function(req, res, next) {
	if(req.cookies.key === constants.cookie)
		res.render('bloodline/table', {title: '暗夜血姬', path: '/table' });
	else
		res.render('bloodline/index', {title: '暗夜血姬', path: '/' });
});

router.get('/bloodline/', function(req, res, next) {
	if(req.cookies.key === constants.cookie)
		res.render('bloodline/announce', {title: '暗夜血姬', path: '/' });
	else
		res.render('bloodline/index', {title: '暗夜血姬', path: '/' });
});

router.get('/bloodline/index', function(req, res, next) {
	if(req.cookies.key === constants.cookie)
		res.render('bloodline/announce', {title: '暗夜血姬', path: '/' });
	else
		res.render('bloodline/index', {title: '暗夜血姬', path: '/' });
});

router.get('/bloodline/setting', function(req, res, next) {
	if(req.cookies.key === constants.cookie)
		res.render('bloodline/setting', {title: '暗夜血姬', path: '/setting' });
	else
		res.render('bloodline/index', {title: '暗夜血姬', path: '/' });
});

router.get('/bloodline/schedule', function(req, res, next) {
	if(req.cookies.key === constants.cookie)
		res.render('bloodline/schedule', {title: '暗夜血姬', path: '/schedule' });
	else
		res.render('bloodline/index', {title: '暗夜血姬', path: '/' });
});
router.get('/bloodline/calculate', function(req, res, next) {
	if(req.cookies.key === constants.cookie)
		res.render('bloodline/calculate', {title: '暗夜血姬', path: '/calculate' });
	else
		res.render('bloodline/index', {title: '暗夜血姬', path: '/' });
});
/*
router.get('/bloodline/second_setting', function(req, res, next) {
  res.render('bloodline/second_setting', {title: '暗夜血姬', path: '/second_setting' });
});

router.get('/bloodline/second_schedule', function(req, res, next) {
  res.render('bloodline/second_schedule', {title: '暗夜血姬', path: '/second_schedule' });
});
*/

module.exports = router;
