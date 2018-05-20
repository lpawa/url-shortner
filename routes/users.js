var express = require('express');
var router = express.Router();
const db = require('../utils/db');
/* GET users listing. */
router.get('/', function(req, res, next) {
  var page={page:1,size:10};
  db.urlStats(page).then(function (url) {
      // console.log(url);
      // console.log(url.urls);
      res.render('index',{data:url});
  });

});

module.exports = router;
