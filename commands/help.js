/**
 * Created by Armaldio on 11/12/2017.
 */

const Command = require('../api/Command');
const CONSTANTS = require('../constants');

module.exports = class ping extends Command
{
    constructor (client) {
        super(client, {
            name: 'help',
            description: 'Show help about the bot',
            examples: [ 'help' ],
            permissions: {
                roles: [ CONSTANTS.ROLES.ANY ],
                channels: [ CONSTANTS.CHANNELS.ANY ]
            },
            args: []
        });
    }

    run (msg, {command}) {
        msg.reply('please check your PM\'s for more help! <:z_scirra_c3Edittory:284302679142825984>');
        msg.author.send({
            'embed': {
                'description': CONSTANTS.MESSAGE.EMPTY,
                'color': 11962861,
                'footer': {
                    'text': CONSTANTS.MESSAGE.SCIRRA_FOOTER
                },
                'thumbnail': {
                    'url': 'https://cdn.discordapp.com/attachments/244447929400688650/328656074527997953/SmallIcon.png'
                },
                'author': {
                    'name': 'HELLO THERE, HERE IS A LIST OF THINGS THAT YOU CAN DO!',
                    'icon_url': 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
                },
                'fields': [
                    {
                        'name': 'Visit our websites for a full documentation about Alfred!',
                        'value': 'https://alfred-botler.now.sh'
                    },
                    {
                        'name': '1. Don\'t be shy, introduce yourself:',
                        'value': 'Visit #introduce_yourself and say hi.'
                    },
                    {
                        'name': '2. Get a custom role that suits you:',
                        'value': 'Visit #commands inside alfred\'s corner.'
                    },
                    {
                        'name': '3. Check out one or more channels:',
                        'value': 'Enjoy being part of our Construct Community!'
                    },
                    {
                        'name': CONSTANTS.MESSAGE.EMPTY,
                        'value': CONSTANTS.MESSAGE.SEPARATOR
                    },
                    {
                        'name': 'Get started with Construct 3 here:',
                        'value': 'https://www.construct.net/'
                    },
                    {
                        'name': 'Get started with Construct 2 here:',
                        'value': 'https://www.scirra.com/'
                    }
                ]
            }
        });
    }
};