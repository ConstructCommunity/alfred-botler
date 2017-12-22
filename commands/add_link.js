/**
 * Created by Armaldio on 11/12/2017.
 */

const Command = require('../api/Command');
const CONSTANTS = require('../constants');
const Discord = require('discord.js');

module.exports = class add extends Command
{
    constructor (client) {
        super(client, {
            name: 'add',
            description: 'Share your work in a dedicated, read-only channel',
            examples: [ 'add' ],
            permissions: {
                roles: [ CONSTANTS.ROLES.ANY ],
                channels: [ CONSTANTS.CHANNELS.FEEDBACK ]
            },
            extraArgs: true,
            deleteCmd: false,
            args: []
        });
    }

    async run (msg, {_extra}) {
        if (msg.attachments.array().length === 0 &&
            msg.content.search(/(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*/) === -1) {
            let _ = await msg.reply('Hey you\'re not using that command properly!\nYou should have at least one link, one embed, or one attachement.');
            return;
        }
        let webhook = await msg.guild.channels.get(CONSTANTS.CHANNELS.COLLECTION)
                               .createWebhook(msg.member.displayName, msg.author.avatarURL, 'Temp Webhook for displaying message in the collections channel');

        let obj = {};
        if (msg.attachments.array().length !== 0) {
            obj.files = [ new Discord.Attachment(msg.attachments.first().url, msg.attachments.first().filename) ];
        }

        let _msg = null;
        try {
            _msg = await webhook.send(_extra.join(' '), obj);
        } catch (e) {
            console.log('Error on sending webhook', e);
        }

        webhook.delete('This webhook fulfilled its goal. It may now turn into ashes.');

        if (_msg) {
            _msg = await msg.author.send(`Hey, I have added your message to <#${CONSTANTS.CHANNELS.COLLECTION}> . Here is that message's code: **__${_msg.id}__**.
You can use \`!del ${_msg.id}\` followed by this id to remove that message if you ever wish to delete it. (Use inside <#${CONSTANTS.CHANNELS.ALFRED_COMMANDS}>!)

Your message was:
\`\`\`${_extra.join(' ')}\`\`\``);
        }
    }
};