require('dotenv').config();
require('@babel/register');
require('@babel/polyfill');

const client = require('./app.js');
client.login(process.env.TOKEN);
