/**
 * Created by Armaldio on 11/12/2017.
 */

const Command = require('../discord.js-cmd/command');
const CONSTANTS = require('../constants');

module.exports = class ping extends Command
{
    constructor (client) {
        super(client, {
            name: '_template',
            description: 'This is a template command',
            examples: [ 'template' ],
            permissions: {
                roles: [ CONSTANTS.ROLES.ANY ],
                channels: [ CONSTANTS.CHANNELS.ANY ]
            },
            extraArgs: false,
            deleteCmd: true,
            args: [
                {
                    key: 'role',
                    prompt: 'A string representing a role',
                    type: 'string'
                }
            ],
        });
    }

    run (msg) {
        msg.reply('NO');
    }
};