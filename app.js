var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var random = require('random-key');
var validator = require('validator');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const db = require('./utils/db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//app.use('/',express.static(path.join(__dirname, 'public')) );
app.use('/', usersRouter);
app.post('/shortenMul',function (req,res) {
    if(req.body.urls && req.body.urls.length>0){
        var urls = JSON.parse(req.body.urls);
        console.log(urls);
        var data=[];

        for(var i=0;i<urls.length;i++){
            var url = urls[i];
            if(validator.isURL(url)){
                console.log("Valid URL");
                var http = /^https?:\/\//i;
                if (!http.test(url)) {
                    url = 'http://' + url;
                }
                var model = {
                    longurl:url,
                    code:random.generate(7),
                    time:new Date()
                };
                data.push(model);

            }
            else{
                console.log("Invalid URL");
                var e = createError(404);
                res.render('error', {message:"BAD REQUEST" , error:e});
                //res.send(404);
            }
        }
        console.log(data);
        db.bulkAdd(data,function (response) {
            console.log(response);
            res.redirect("/");
            //res.send(response);
        },function (error) {
            console.log(error);
            res.render('error', {message:"BAD REQUEST",error:error});
        })
    }
    else{
        console.log("Invalid URL");
        var e = createError(404);
        res.render('error', {message:"BAD REQUEST" , error:e});
        //res.send(404);
    }
});
app.post('/shorten', function (req, res) {
    // var url = req.body.url;


    if(req.body.urls) {
        var urls = JSON.parse(req.body.urls);
        console.log(urls);
        if(urls.length==1){
            var url = urls[0];
            if(validator.isURL(url)) {
                console.log("Valid URL");
                var http = /^https?:\/\//i;
                if (!http.test(url)) {
                    url = 'http://' + url;
                }
                var key = random.generate(7);

                console.log(url + "key:-" + key);
                db.addUrl(key, url, function (shortcode, existed, longURL) {
                    console.log("URL added");
                    res.redirect("/")
                }, function (error) {
                    console.log(error);
                    res.render('error', {message:"BAD REQUEST" , error:error});

                });
            }
            else{
                console.log("Invalid URL");
                var e = createError(404);
                res.render('error', {message:"BAD REQUEST" , error:e});

            }
        }
        for (var i = 0; i < urls.length; i++) {
            // res.send("successful!");
            console.log(urls[i]);
            var url = urls[i];
            if(validator.isURL(url)) {
                console.log("Valid URL");
                var http = /^https?:\/\//i;
                if (!http.test(url)) {
                    url = 'http://' + url;
                }
                var key = random.generate(7);

                console.log(url + "key:-" + key);
                db.addUrl(key, url, function (shortcode, existed, longURL) {
                    console.log("URL added");
                    res.redirect("/")
                }, function (error) {
                    console.log(error);
                    res.render('error', {message:"BAD REQUEST" , error:error});

                });
            }
            else{
                console.log("Invalid URL");
                var e = createError(404);
                res.render('error', {message:"BAD REQUEST" , error:e});

            }
            //
        }


        //
        // db.none("insert into entry(key, url) values($1, $2)", [key, url])
        //     .then(function (data) {
        //         res.render('shorten', { link: req.headers.origin + "/" + key });
        //     });
    }
});

app.get('/:shortcode', function (req, res,next) {
    console.log(req);
    if (!req.params.shortcode || req.params.shortcode.length === 0) {
        return next()
    }

    if (req.params.shortcode.length > 9) {
        return next()
    }

    db.fetchUrl(req.params.shortcode,function (URL) {
        if(!URL){
            next();
        }
        else{
            res.redirect(URL);
        }
    }, function (error) {
        console.log(error);
        next();
    });

});

app.post('/expandMultiple',function (req,res,next) {

    console.log(req.body.urls);
    var urls = JSON.parse(req.body.urls);
    console.log(urls);
    db.fetchMultiple(urls,function (data) {
        //console.log(data);
        var array = new Array;
        for(x in data){
            console.log(data[x]);

            array.push(data[x].longurl);
        }
        res.send(array);
    },function (error) {
        console.log(error);
        res.send(404);
    })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
