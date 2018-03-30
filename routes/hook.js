const express = require('express');
const router  = express.Router();

const CONSTANTS = require('../constants');

const passport = require('passport');

router.post('/job', (req, res, next) => {
        let bot   = res.locals.bot;
        let guild = bot.guilds.get(CONSTANTS.GUILD_ID);

        let channels = guild.channels.array().filter(x => x.type === 'text');
        let users    = guild.members.array();

        console.log(req.body);
        guild.channels.get('244447929400688650').send(`A NEW JOB BY ${req.body.user} HAS BEEN POSTED`, {
            embed: {
                'description': JSON.stringify(req.body)
            }
        });
        res.sendStatus(200);
    }
);
module.exports = router;
