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

// Render home page
app.get('/', function (req, res) {
    res.render('index', { title: 'New Relic Kubernetes Demo', message: 'Click the button' });
});

app.get('/action', function (req, res) {
  console.error(' [x] Perform backend action')
  lookBusy();
  return res.status(200).send('OK');
});

app.listen(process.env.PORT || 3000, function () {
    console.error('Frontend ' + process.env.NEW_RELIC_METADATA_KUBERNETES_POD_NAME + ' listening on port 3000!');
});

// Do some heavy calculations
var lookBusy = function() {
  const end = Date.now() + 500;
  while (Date.now() < end) {
    const doSomethingHeavyInJavaScript = 1 + 2 + 3;
  }
};