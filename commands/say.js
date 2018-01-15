/**
 * Created by Armaldio on 11/12/2017.
 */

const Command = require('../api/Command');
const CONSTANTS = require('../constants');
const request = require('request');
const Raven = require('raven');

module.exports = class say extends Command
{
    constructor (client) {
        super(client, {
            name: 'say2',
            description: 'Output text or embed inside a specific channel as Alfred',
            examples: [ 'say + json as attached file', 'say Hello everyone!' ],
            deleteCmd: false,
            permissions: {
                roles: [ CONSTANTS.ROLES.STAFF ],
                channels: [ CONSTANTS.CHANNELS.ANY ]
            },
            extraArgs: true,
            args: [
                {
                    key: 'channel',
                    prompt: 'The channel where to post the message',
                    type: 'channel'
                }
            ]
        });
    }

    async run (msg, {channel, _extra}) {
		// exactly one attachment
		if (msg.attachments.array().length === 1) {
			request(msg.attachments.first().url, async (error, response, body) => {
				if (error) {
					console.log(error);
					let _ = await msg.author.send('Sorry, there was an error with the embed file');
					msg.delete();
					return;
				}

				console.log(msg.attachments.first().url);
				console.log('body', body);
				console.log('response', response);

				let json;
				try {
					json = JSON.parse(body);
				} catch (e) {
					console.log(e);
					Raven.captureException(e);
					let _ = await msg.author.send('Sorry, there was an error with the JSON of your file');
					msg.delete();
					return;
				}

				try {
					if (_extra !== undefined) {
						let _ = await channel.send(_extra.join(' '), {embed: json});
						msg.delete();
					} else {
						let _ = await channel.send({embed: json});
						msg.delete();
					}
				} catch (e) {
					let _ = await msg.send(`There is an error with the message: ${e.message}`)
                    msg.delete();
				}
			});
		}
		// More than 1 attachment
		else if (msg.attachments.array().length > 1) {
			let _ = await msg.author.send('Sorry, this command only support 1 attached JSON file');
			msg.delete();
		}
		// No attachments
		else if (msg.attachments.array().length <= 0) {
			let _ = await channel.send(_extra.join(' '));
			msg.delete();
		}
	}
};