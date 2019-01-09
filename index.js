require('dotenv').config();
require('@babel/register');
require('@babel/polyfill');

const firebase = require('firebase');

const config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
};
firebase.initializeApp(config);

require('./app.js');
