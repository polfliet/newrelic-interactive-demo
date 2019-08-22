const newrelic = require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const querystring = require('querystring');
const morgan = require('morgan');

var path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.locals.newrelic = newrelic;
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(morgan('combined'));

var cookieMap = {}
var clickSpeed = 1000; // Allow the user to click once every x ms

// Render home page
app.get('/', function (req, res) {
    res.render('index', { title: 'New Relic Kubernetes Demo', message: 'Push!' });
});

// Determines how fast the users can click the button
app.get('/throttle', function (req, res) {
    clickSpeed = req.query.speed;
    res.status(200).send('Click speed set to ' + clickSpeed + ' ms');
});

app.get('/action', function (req, res) {
    var cookie = req['headers']['cookie'];
    cookieMap[cookie] = true;
    console.log(' [x] User id: ' + cookie + ' action triggered');
    console.log(' [x] Total users: ' + getNumberOfUsers());
    checkUserAgent(req);
    lookBusy();
    return res.status(200).send(process.env.MY_POD_NAME + ':' + clickSpeed);
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Frontend ' + process.env.NEW_RELIC_METADATA_KUBERNETES_POD_NAME + ' listening on port 3000!');
});

// Do some heavy calculations
var lookBusy = function() {
    var count = 0;
    for (var i = 0; i < 10000; i++) {
        for (var j = 0; j < 2000; j++) {
            count = count + i + j;
        }
    }
    return count;
};

// Trigger an exception in x% of the Android devices
var checkUserAgent = function(req) {
    var userAgent = req.headers['user-agent'];
    console.log('User agent:' + userAgent);
    if (userAgent.toLowerCase().indexOf('android') != -1) {
        if (Math.random() * 100 < 20) { // 20% of the Android devices
            console.error('Error exception: Failed to parse user-agent "' + userAgent + '"');
            throw Error('Failed parsing user agent');
        }
    }
};

var getNumberOfUsers = function () {
    return Object.keys(cookieMap).length;
};