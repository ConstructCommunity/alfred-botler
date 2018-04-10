const express = require('express');
const router  = express.Router();

const CONSTANTS = require('../constants');

const passport = require('passport');
const cors     = require('cors');

const whitelist   = ['http://127.0.0.1/', 'https://cc_jobs.armaldio.xyz/', 'https://alfred.armaldio.xyz/'];
const corsOptions = {
  origin : function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST']
};

router.use(cors());
router.options('*', cors());
router.post('/job', cors(/*corsOptions*/), async (req, res, next) => {
  let bot   = res.locals.bot;
  let guild = bot.guilds.get(CONSTANTS.GUILD_ID);

  let channels = guild.channels.array().filter(x => x.type === 'text');
  let users    = guild.members.array();

  console.log(req.body);
  let {body} = req;

  let user = await bot.fetchUser(body.user);

  guild.channels.get('321770336804667413').send({
    embed: {
      'description': body.title,
      'color'      : 11962861,
      'footer'     : {
        'text': 'Create your own offers now by visiting: https://cc_jobs.armaldio.xyz.'
      },
      'thumbnail'  : {
        'url': 'https://cdn.discordapp.com/attachments/244447929400688650/429264763940503552/joboffericon.png'
      },
      'author'     : {
        'name'    : `NEW OFFER BY @${user.username.toUpperCase()}`,
        'icon_url': 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
      },
      'fields'     : [
        {
          'name' : CONSTANTS.MESSAGE.SEPARATOR,
          'value': CONSTANTS.MESSAGE.EMPTY
        },
        {
          'name' : 'Offer Conditions:',
          'value': `- **Type:** ${body.announceType.type}${body.announceType.id === 1 ? ' (' + body.amount + (body.paymentType.id === 0 ? '$)\n' : '%)\n') : '\n'}${body.announceType.id === 1 ? '- **Details:** ' + body.paymentDetails : ''}- **Contact:** ${body.contact}\n
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
});
module.exports = router;
