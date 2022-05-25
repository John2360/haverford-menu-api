//index.js
require('dotenv').config()
var http = require('http');
var https = require('https');

// get certs
var privateKey  = process.env.privKey;
var certificate = process.env.pubKey;

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();
var cors = require('cors');
app.use(require('express').json());
app.use(cors());

const {
    getDaysMenus
} = require('./requests/menus')

const {
    updateToken,
    getNotifications,
    updateNotifications
} = require('./requests/accounts')

const {
    sendNotification
} = require('./requests/notifications')

app.get('/menus/:dayNum', getDaysMenus);

app.post('/accounts/token', updateToken);
app.get('/accounts/notifications/:uid', getNotifications);
app.post('/accounts/notifications', updateNotifications);

app.post('/notifications/send', sendNotification);

const port = 3000;

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(port);
httpsServer.listen(8443);