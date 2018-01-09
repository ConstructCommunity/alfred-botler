/**
 * Created by Armaldio on 11/12/2017.
 */

const Command = require('../api/Command');
const CONSTANTS = require('../constants');

module.exports = class donate extends Command
{
    constructor (client) {
        super(client, {
            name: 'donate',
            description: 'Donate to support this server',
            examples: [ 'donate' ],
            deleteCmd: true,
            permissions: {
                roles: [ CONSTANTS.ROLES.ANY ],
                channels: [ CONSTANTS.CHANNELS.ANY ]
            }
        });
    }

    async run (msg) {
        msg.author.send({
            embed: {
                'title': "Making a donation help us keep the bot running. Servers have a cost. It also help us value the time spent managing this server.",
                'description': 'Here is how you can donate:',
                'color': 15844367,
                'footer': {
                    'text': CONSTANTS.MESSAGE.SCIRRA_FOOTER
                },
                /*'thumbnail': {
                    'url': 'https://cdn.discordapp.com/attachments/244447929400688650/331776445955309568/ROLEREMiconsmall.png'
                },*/
                'author': {
                    //'name': `Armaldio`,
                    //'icon_url': 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
                },
                'fields': [
                    {
                        'name': CONSTANTS.MESSAGE.EMPTY,
                        'value': 'One time donation:',
                        'inline': false
                    },
                    {
                        'name': 'Paypal',
                        'value': `<${"https://www.paypal.me/armaldio"}>`,
                        'inline': true
                    },
                    {
                        'name': 'Crypto',
                        'value': `<${"https://coingate.com/pay/armaldio"}>`,
                        'inline': true
                    },
                    {
                        'name': CONSTANTS.MESSAGE.EMPTY,
                        'value': 'Recurrent donation:',
                        'inline': false
                    },
                    {
                        'name': 'Liberapay',
                        'value': `<${"https://liberapay.com/armaldio/donate"}>`,
                        'inline': false
                    }
                ]
            }
        });
    }
};