import test from 'ava';

require('dotenv').config();
require('@babel/register');
require('@babel/polyfill');

test('require still works', (t) => {
    try {
        require('../app.js');
        t.pass("At least, requiring seems to work");
    } catch (e) {
        t.fail('Failed loading');
    }
});
