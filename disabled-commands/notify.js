/**
 * Created by Armaldio on 11/12/2017.
 */

const Command = require('../bot/Command');
const CONSTANTS = require('../constants');

module.exports = class notify extends Command
{
    constructor (client) {
        super(client, {
            name: 'notify',
            description: 'Notify user and waits for their reactions',
            examples: [ 'notify @user1 @user2 message', 'notify Hello @user1 @user2, can you please ...' ],
            extraArgs: true,
            deleteCmd: true,
            args: [],
            permissions: {
                roles: [ CONSTANTS.ROLES.STAFF ],
                channels: [ CONSTANTS.CHANNELS.ANY ]
            }
        });
    }

    async run (msg, {_extra}) {
        let mentions = [];
        _extra.forEach((item) => {
            let user = this.isUserMention(item);
            if (user) {
                mentions.push(user);
            }
        });

        let ids = mentions.map(m => `<@${m.id}>`);

        let footer = 'Please upvote the OK reaction in order to confirm that you\'ve seen this message';
        let embed = {
            'title': this.fixMessage(_extra).join(' '),
            'description': CONSTANTS.MESSAGE.EMPTY,
            'color': 15844367,
            'footer': {
                'text': footer
            }
            /*'thumbnail': {
                'url': 'https://cdn.discordapp.com/attachments/244447929400688650/331776445955309568/ROLEREMiconsmall.png'
            }*/
        };

        let sent = await msg.channel.send(ids.join(', '), {embed});
        let reaction = await sent.react('🆗');
        let waitingReactions = await sent.awaitReactions((e) => {
            let users = e.users.array();

            let mentionIds = mentions.map(m => `${m.id}`);
            let count = 0;
            users.forEach(user => {
                if (mentionIds.includes(user.id)) {
                    count++;
                }
            });

            embed.footer.text = footer + ` (votes: ${count}/${mentionIds.length})`;
            sent.edit(ids.join(', '), {embed});

            if (count === mentionIds.length) {
                sent.delete();
                msg.author.send(`Your message to ${ids.join(', ')} has be succesfully validated by all the concerned users`);
            }

            return true;
        });
    }

    isUserMention (value) {
        const mention = /(?:<@!?)?(\d{17,21})>?/;

        if (typeof value === 'string' && mention.test(value)) {
            return this.client.users.get(mention.exec(value)[ 1 ]);
        }
        return false;
    }

    isChannelMention (value) {
        const mention = /(?:<#)?(\d{17,21})>?/;

        if (typeof value === 'string' && mention.test(value)) {
            return this.client.channels.get(mention.exec(value)[ 1 ]);
        }
        return false;
    }

    fixMessage (messages) {
        messages.forEach((item, index) => {
            let val = this.isUserMention(item);
            if (val) {
                messages[ index ] = `@${val.username}`;
            }

            val = this.isChannelMention(item);
            if (val) {
                messages[ index ] = `#${val.name}`;
            }
        });
        return messages;
    }
};
