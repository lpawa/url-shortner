var express = require('express');
var router = express.Router();
const db = require('../utils/db');
/* GET users listing. */
router.get('/', function(req, res, next) {
    var pages = 1;
    if(req.query.page) {
        pages = req.query.page;

    }
        var page = {page: pages, size: 3};
        db.urlStats(page).then(function (url) {
            // console.log(url);
            // console.log(url.urls);
            res.render('index', {data: url});
        });


});

module.exports = router;
