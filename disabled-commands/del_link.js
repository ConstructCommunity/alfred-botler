/**
 * Created by Armaldio on 11/12/2017.
 */

const Command = require('../bot/Command');
const CONSTANTS = require('../constants');
const Discord = require('discord.js');

module.exports = class del extends Command
{
    constructor (client) {
        super(client, {
            name: 'del',
            description: `Delete a message posted in <#${CONSTANTS.CHANNELS.COLLECTION}>`,
            examples: [ 'del' ],
            permissions: {
                roles: [ CONSTANTS.ROLES.ANY ],
                channels: [ CONSTANTS.CHANNELS.ALFRED_COMMANDS ]
            },
            extraArgs: false,
            deleteCmd: true,
            args: [
                {
                    key: 'id',
                    prompt: 'The id of the message to delete',
                    type: 'string'

                }
            ]
        });
    }

    async run (msg, {id}) {
        let msgToDel;
        try {
            msgToDel = await msg.guild.channels.get(CONSTANTS.CHANNELS.COLLECTION).fetchMessage(id);
        } catch (e) {
            msg.author.send('We cannot find this message. It\'s probably already deleted');
            return ;
        }

        if (msgToDel.mentions.members.first() !== msg.member) {
            let _msg = await msg.author.send('I\'m sorry but that message does not belong to you.');
            return;
        }
        let _msg = await msgToDel.delete();
        msg = await msg.author.send('Your message was successfully deleted.');
    }
};
