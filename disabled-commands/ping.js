/**
 * Created by Armaldio on 11/12/2017.
 */

const Command = require('../bot/Command');
const CONSTANTS = require('../constants');

module.exports = class ping extends Command
{
    constructor (client) {
        super(client, {
            name: 'ping',
            description: 'Ping the bot',
            examples: [ 'ping' ],
            permissions: {
                roles: [ CONSTANTS.ROLES.ANY ],
                channels: [ CONSTANTS.CHANNELS.ANY ]
            }
        });
    }

    run (msg) {
        msg.reply('I\'m up for you!');
    }
};
