const newrelic = require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const querystring = require('querystring');
var path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.locals.newrelic = newrelic;
app.use('/public', express.static(path.join(__dirname, 'public')));

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
    console.error(' [x] Perform backend action');
    var cookie = req['headers']['cookie'];
    cookieMap[cookie] = true;
    console.error(' [x] Cookie ', cookie);
    console.error(' [x] ' + getNumberOfUsers() + ' users identified');
    lookBusy();
    return res.status(200).send(process.env.MY_POD_NAME + ':' + clickSpeed);
});

app.listen(process.env.PORT || 3000, function () {
    console.error('Frontend ' + process.env.NEW_RELIC_METADATA_KUBERNETES_POD_NAME + ' listening on port 3000!');
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

var getNumberOfUsers = function () {
    return Object.keys(cookieMap).length;
};