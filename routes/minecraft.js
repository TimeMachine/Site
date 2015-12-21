var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('minecraft/index', {title: 'minecraft', path: '/'});
});

router.get('/index', function(req, res, next) {
  res.render('minecraft/index', {title: 'minecraft', path: '/'});
});

router.get('/examples', function(req, res, next) {
  res.render('minecraft/examples', { title: '安裝', path: '/examples' });
});

router.get('/page', function(req, res, next) {
  res.render('minecraft/page', { title: '遊戲歷程', path: '/page' });
});

router.get('/another_page', function(req, res, next) {
  res.render('minecraft/another_page', { title: '遊戲地圖', path: '/another_page' });
});

module.exports = router;