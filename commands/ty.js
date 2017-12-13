/**
 * Created by Armaldio on 11/12/2017.
 */

const Command = require('../discord.js-cmd/command');
const CONSTANTS = require('../constants');

module.exports = class ty extends Command
{
    constructor (client, database) {
        super(client, {
            name: 'ty',
            description: 'Thank someone for his help',
            examples: [ 'ty @armaldio' ],
            permissions: {
                roles: [ CONSTANTS.ROLES.ANY ],
                channels: [ CONSTANTS.CHANNELS.ANY ]
            },
            extraArgs: false,
            deleteCmd: true,
            args: [
                {
                    key: 'user',
                    prompt: 'A user mention',
                    type: 'user'
                }
            ]
        }, database);
    }

    async run (msg, {user}) {
        if (user.id === this.client.user.id) {
            msg.author.send('Sorry, you can\'t thank Alfred');
        } else if (user.id === msg.author.id) {
            msg.author.send('Sorry, you can\'t thank yourself');
        } else {
            let snapshot = await this.database.ref('/thanks/' + user.id).once('value');
            let count = 0;
            if (snapshot.val() !== undefined && snapshot.val() !== null) {
                count = snapshot.val().count;
            }

            let _set = await this.database.ref('thanks/' + user.id).set({
                count: count + 1
            });
            let _sent = await msg.channel.send({
                embed: {
                    description: `<@${user.id}> already helped out **${count + 1}** people in total.`,
                    color: 15844367,
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/244447929400688650/331750847912476672/THANKSiconsmall.png'
                    },
                    author: {
                        name: `${msg.author.username.toUpperCase()} JUST THANKED ${user.username.toUpperCase()}!`,
                        icon_url: 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
                    }
                }
            });
        }
    }
};