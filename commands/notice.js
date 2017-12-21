/**
 * Created by Armaldio on 11/12/2017.
 */

const Command = require('../api/Command');
const CONSTANTS = require('../constants');

module.exports = class notice extends Command
{
    constructor (client) {
        super(client, {
            name: 'notice',
            description: 'Show the notice to the user',
            examples: [ 'notice' ],
            permissions: {
                roles: [ CONSTANTS.ROLES.STAFF ],
                channels: [ CONSTANTS.CHANNELS.ANY ]
            },
            extraArgs: false,
            deleteCmd: true,
            args: [
            ],
        });
    }

    run (msg) {
        const text = {
            embed: {
                description: 'Found something weird, perhaps a sneaky bug? Would you like to suggest something? Please check out the links below!',
                color: 11962861,
                footer: {
                    text: CONSTANTS.MESSAGE.SCIRRA_FOOTER
                },
                thumbnail: {
                    url: 'https://cdn.discordapp.com/attachments/244447929400688650/328656074527997953/SmallIcon.png'
                },
                author: {
                    name: 'HELLO THERE, HERE IS A LIST OF USEFUL STUFF!',
                    icon_url: 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
                },
                fields: [
                    {
                        name: CONSTANTS.MESSAGE.SEPARATOR,
                        value: CONSTANTS.MESSAGE.EMPTY
                    },
                    {
                        name: 'Report Construct 3 bugs here:',
                        value: 'https://goo.gl/HKKs1b'
                    },
                    {
                        name: 'Report Construct 2 bugs here:',
                        value: 'https://goo.gl/mGVcUo'
                    },
                    {
                        name: 'Suggest Construct 3 features here:',
                        value: 'https://goo.gl/uuUMTV'
                    },
                    {
                        name: CONSTANTS.MESSAGE.EMPTY,
                        value: CONSTANTS.MESSAGE.SEPARATOR
                    },
                    {
                        name: 'Get started with Construct 3 here:',
                        value: 'https://www.construct.net/'
                    },
                    {
                        name: 'Get started with Construct 2 here:',
                        value: 'https://www.scirra.com/'
                    }
                ]
            }
        };
        msg.channel.send(text);
    }
};