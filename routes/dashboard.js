const express = require('express');
const router = express.Router();
const CONSTANTS = require('../constants');
const request = require('request');

router.get('/', function (req, res, next) {
    const userID = req.user.id;
    let bot = res.locals.bot;

    res.locals.session = req.session;
    req.session[ 'message' ] = '';

    res.render('dashboard', {user: req.user});
});

module.exports = router;
