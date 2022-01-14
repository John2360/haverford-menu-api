//admin.js

const admin = require('firebase-admin');
var serviceAccount = require("./haverford-menu-app-firebase-adminsdk-5uedp-ac2d259c67.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };