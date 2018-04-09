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
    let { body } = req;

    guild.channels.get('244447929400688650').send(`A NEW JOB BY ${req.body.user} HAS BEEN POSTED`, {
      embed: {
        'description': body.title,
        'color'      : 11962861,
        'footer'     : {
          'text': 'Create your own offers now by visiting: https://cc_forms.armaldio.xyz.'
        },
        'thumbnail'  : {
          'url': 'https://cdn.discordapp.com/attachments/244447929400688650/429264763940503552/joboffericon.png'
        },
        'author'     : {
          'name'    : `NEW OFFER BY ${body.user}`,
          'icon_url': 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
        },
        'fields'     : [
          {
            'name' : CONSTANTS.MESSAGE.SEPARATOR,
            'value': CONSTANTS.MESSAGE.EMPTY
          },
          {
            'name' : 'Offer Conditions:',
            'value': `- ${body.announceType}
- ${body.paymentType}
- ${body.paymentDetails}
- ${body.contact}
ᅠ`
          },
          {
            'name' : 'Offer Details:',
            'value': body.details
          },
          {
            'name' : CONSTANTS.MESSAGE.EMPTY,
            'value': CONSTANTS.MESSAGE.SEPARATOR
          }
        ]
      }
    });
    res.sendStatus(200);
  }
);
module.exports = router;
