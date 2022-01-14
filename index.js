//index.js

var cors = require('cors');
const app = require('express')();
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

app.listen(port, () => {
    console.log(`API on http://localhost:${port}`)
})