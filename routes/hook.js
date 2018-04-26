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

  try {

    let user = await bot.fetchUser(body.user);

    const announce = {
      'description': body.title,
      'color'      : 11962861,
      'thumbnail'  : {
        'url': 'https://cdn.discordapp.com/attachments/244447929400688650/429264763940503552/joboffericon.png'
      },
      'author'     : {
        'name'    : `NEW OFFER BY ${user.username.toUpperCase()}`,
        'icon_url': 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
      },
      'fields'     : [
        {
          'name' : CONSTANTS.MESSAGE.SEPARATOR,
          'value': CONSTANTS.MESSAGE.EMPTY
        },
        {
          'name' : 'Offer Conditions:',
          'value': `- **Type:** ${body.announceType.type}${body.announceType.id !== 0 ? ' - ' + body.amount + (body.announceType.id === 1 /* percentage */ ? '%' : body.currency.symbol + ' (' + body.currency.name + ')') : '\n'}${body.announceType.id === 1 ? '\n- **Details:**\n' + body.paymentDetails + '\n' : ''}\n- **Contact:**\n${body.contact}\n
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
    };

    // Confirmation part

    let confirmation = await user.send(
      `Someone is trying to post an announce inside <#${CONSTANTS.CHANNELS.JOBOFFERS}>. Please confirm this by clicking the emote at the bottom of this message. If it wasn't you, just ignore this message.`,
      {
        embed: announce
      }
    );
    await confirmation.react('🆗');
    const filter = (reaction, usr) => reaction.emoji.name === '🆗' && user.id === usr.id;
    confirmation.awaitReactions(filter, {
      max   : 1,
      time  : 600000,
      errors: ['time']
    }).then(async collected => {
      console.log(collected);

      console.log(`Collected ${collected.size} reactions`, collected);

      // Webhook part
      let webhook = await guild.channels.get(CONSTANTS.CHANNELS.JOBOFFERS)
                               .createWebhook(user.username, user.avatarURL, 'Temp Webhook for sending offer in #job-offers');

      await webhook.send({
        embeds: [announce]
      });

      await webhook.delete('This webhook fulfilled its goal. It may now turn into ashes.');

      user.send('Announce validated!');

      res.sendStatus(200);
    }).catch(error => {
      user.send('Timeout! You must submit again.');

      res.sendStatus(500);
    });

  } catch (e) {
    console.log('Error on sending webhook', e);

    res.status(400).send(e);
  }
});
module.exports = router;
