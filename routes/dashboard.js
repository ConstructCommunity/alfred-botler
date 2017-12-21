const express = require('express');
const router = express.Router();
const CONSTANTS = require('../constants');
const request = require('request');

router.get('/', function (req, res, next) {
    const userID = req.user.id;
    let bot = res.locals.bot;

    console.log("message", res.locals.message);

    res.render('dashboard', {user: req.user});
});

module.exports = router;
