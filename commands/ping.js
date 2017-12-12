/**
 * Created by Armaldio on 11/12/2017.
 */

const Command = require('../discord.js-cmd/command');

module.exports = class ping extends Command
{
    constructor (client) {
        super(client, {
            name: 'ping',
            description: 'Ping the bot',
            examples: [ 'ping' ]
        });
    }

    run (msg) {
        msg.reply('I\'m up for you!');
    }
};