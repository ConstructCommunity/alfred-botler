const express = require('express');
const router = express.Router();

const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');
const HASH = uuidv4();
const request = require('request');
const btoa = require('btoa');
const fetch = require('node-fetch');
const CONSTANTS = require('../constants');

const passport = require('passport');

function isOnServer (user) {
    let i = 0, len = user.guilds.length;
    for (; i < len; i++) {
        if (user.guilds[ i ].id === CONSTANTS.GUILD_ID) {
            return true;
        }
    }
}

router.get('/discord/callback',
    passport.authenticate('discord', {failureRedirect: '/'}), function (req, res) {
        if (isOnServer(req.user)) {
            res.redirect('/dashboard');
        } else {
            res.redirect('https://discord.gg/dZDU7Re');
        }
    }
);
module.exports = router;
