import test from 'ava';

require('dotenv').config();
require('@babel/register');
require('@babel/polyfill');

const client = require('../app.js');

test('require still works', (t) => {
  t.pass();

  const login = client.login(process.env.TOKEN);
  console.log('login', login);
});
