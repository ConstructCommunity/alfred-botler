/**
 * Created by Armaldio on 11/12/2017.
 */

const Command = require('../discord.js-cmd/command');
const CONSTANTS = require('../constants');

module.exports = class move extends Command
{
    constructor (client) {
        super(client, {
            name: 'move',
            description: 'Move a certain amount of messages from one channel to another',
            examples: [ '!move 10 #off-topic' ],
            extraArgs: false,
            deleteCmd: true,
            args: [
                {
                    key: 'amount',
                    prompt: 'How much messages you want to move',
                    type: 'number'
                },
                {
                    key: 'channel',
                    prompt: 'The channel you want to move messages to',
                    type: 'channel'
                }
            ],
            permissions: {
                roles: [ CONSTANTS.ROLES.STAFF ],
                channels: [ CONSTANTS.CHANNELS.ANY ]
            }
        });
    }

    async run (msg, {amount, channel}) {
        //console.log('Amount: ', amount, 'Channel: ', channel);
        if (amount <= 0) {
            msg.author.send('Amount of message must be greater that 0');
            return;
        }

        let messages = await msg.channel.fetchMessages({limit: amount});
        let fields = [];

        messages.forEach(m => {
            fields.push({
                'name': `${m.author.username}`,
                'value': `${m.cleanContent !== '' ? m.cleanContent : 'Unable to retrieve message content'}`
            });
        });

        fields = fields.reverse();

        console.log(fields);

        try {
            let sent = await msg.author.send({
                // empty string here -> [ᅠ]
                embed: {
                    'title': `This is a preview of the message that will be posted to #${channel.name}`,
                    'description': 'ᅠ',
                    'color': 15844367,
                    'footer': {
                        'text': 'ᅠ'
                    },
                    'thumbnail': {
                        'url': 'https://cdn.discordapp.com/attachments/244447929400688650/331776445955309568/ROLEREMiconsmall.png'
                    },
                    'fields': fields
                }
            });
            sent = await msg.author.send('Do you confirm this ?');
            let message = await msg.author.dmChannel.awaitMessages(response => response.content.match(/yes|no/), {
                max: 1,
                time: 30000,
                errors: [ 'time' ]
            });
            message = message.first();

            if (message.content === 'yes') {
                let text = 'Deleting messages...';
                let x = 0;

                let msg_del = await msg.author.send(text);
                let allDeleted = await Promise.all(messages.map(m => {
                    return m.delete().then(() => {
                        msg_del.edit(text + ` ${++x}/${messages.array().length}`);
                    });
                }));
                let edit = await msg_del.edit(`${messages.array().length} messages successfully deleted.`);
                let sent = await msg.channel.send(`${messages.array().length} message were move to <#${channel.id}>, please continue your discussion here`);
                sent = await channel.send({
                    // empty string here -> [ᅠ]
                    embed: {
                        'title': `Last messages from #${msg.channel.name}`,
                        'description': 'ᅠ',
                        'color': 15844367,
                        'footer': {
                            'text': 'ᅠ'
                        },
                        'thumbnail': {
                            'url': 'https://cdn.discordapp.com/attachments/244447929400688650/331776445955309568/ROLEREMiconsmall.png'
                        },
                        'fields': fields
                    }
                });
            }
        } catch (reason) {
            console.error(reason);
        }
    }
};