const Command = require('../api/Command');
const CONSTANTS = require('../constants');
const {Message} = require('discord.js');

function toLitteral (level) {
    switch (level) {
        case 1:
            return 'first';
        case 2:
            return 'second';
        case 3:
            return 'third';
        case 4:
            return 'fourth and last';
    }
}

function getSanction (level) {
    switch (level) {
        case 1:
            return 'Simple warning';
        case 2:
            return 'Mute for 7 days';
        case 3:
            return 'Ban for 7 days';
        case 4:
            return 'Definitive ban';
    }
}

function cleanMessages (msgIds) {
    msgIds.forEach(m => {
        if (m instanceof Message) {
            m.delete();
        } else {
            m.first().delete();
        }
    });
}

/**
 * Class representic the warn command
 * @extends Command
 * @type {module.warn}
 */
class warn extends Command
{
    /**
     * Create a warn command
     * @param client
     */
    constructor (client) {
        super(client, {
            name: 'warn',
            description: 'Warn a user with different level of severity',
            examples: [ 'warn @user' ],
            permissions: {
                roles: [ CONSTANTS.ROLES.STAFF ],
                channels: [ CONSTANTS.CHANNELS.ANY ]
            },
            extraArgs: false,
            deleteCmd: false,
            args: [
                {
                    key: 'user',
                    prompt: 'The user you want to warn',
                    type: 'user'
                }
            ]
        });
    }

    /**
     * Run the command
     * @inheritDoc
     * @param msg
     * @param user
     * @returns {Promise<void>}
     */
    async run (msg, {user}) {

        let msgIds = [];

        msgIds.push(msg);
        // todo show a summary of the user warnings

        //First step ----------------------
        let _sent = await msg.reply('I will guide you through the process of warning. All the messages will be deleted at then end to clean the channel.\n' +
                                    'Please note that in the current state, you have to apply sanctions by yourself\n\n' +
                                    'What is the reason for the warning ?');
        msgIds.push(_sent);
        let message = await _sent.channel.awaitMessages(m => {
                return m.content.match(/(.*?)/) && m.author.id === msg.author.id;
            }, {
                max: 1,
                time: 30000,
                errors: [ 'time' ]
            }
        );
        msgIds.push(message);

        // Second step ---------------------
        _sent = await msg.reply('What is the warning level ?\n' +
                                `Level 1 : ${getSanction(1)} *You don\'t need admin agreement.* \n` +
                                `Level 2 : ${getSanction(2)} *You don\'t need admin agreement.* \n` +
                                `Level 3 : ${getSanction(3)} **Need admin agreement**\n` +
                                `Level 4 : ${getSanction(4)} **Need admin agreement**`);
        msgIds.push(_sent);

        let _level = await _sent.channel.awaitMessages(m => {
            return m.content.match(/(.*?)/) && m.author.id === msg.author.id;
        }, {
            max: 1,
            time: 30000,
            errors: [ 'time' ]
        });
        msgIds.push(_level);
        let level = parseInt(_level.first().content, 10);

        // Third step
        if (level > 0 && level <= 4) {
            let embed = {
                embed: {
                    'title': 'You\'ve been warned!',
                    'description': `Hello ${user.username},

We (the moderators) decided to give you a ${toLitteral(level)} warning based on your recent activity.
Reason: **${message.first().content}**
Sanction: **${getSanction(level)}**

Thank you for your understanding,
**~The Construct Community Crew**`,
                    'color': 15844367
                }
            };
            _sent = await msg.reply('Here is a preview of the message:', embed);
            msgIds.push(_sent);

            _sent = await msg.reply('Send it as is ?');
            msgIds.push(_sent);
            let answer = await _sent.channel.awaitMessages(m => {
                    return m.content.match(/yes|no/) && m.author.id === msg.author.id;
                }, {
                    max: 1,
                    time: 30000,
                    errors: [ 'time' ]
                }
            );
            msgIds.push(answer);

            if (answer.first().content === 'yes') {
                let dmMsg = await user.send(embed);
                msg.channel.send(`<@&${CONSTANTS.ROLES.STAFF}>`, {
                    embed: {
                        'title': `@${msg.author.username} warned @${user.username}`,
                        'description': `Reason: **${message.first().content}**
Sanction: **${getSanction(level)}**`,
                        'color': 15844367
                    }
                });
            } else {
                let abort = await msg.reply('Warning process aborted.');
            }
        } else {
            msg.reply('Wrong level. Warning process aborted.');
        }
        cleanMessages(msgIds);
    }
}

module.exports = warn;