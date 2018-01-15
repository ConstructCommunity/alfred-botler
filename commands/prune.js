/**
 * Created by Armaldio on 11/12/2017.
 */

const Command = require('../api/Command');
const CONSTANTS = require('../constants');
const Raven = require('raven');

module.exports = class prune extends Command
{
	constructor (client) {
		super(client, {
			name: 'prune',
			description: 'Prune a certain amount of messages from the current channel',
			examples: [ `prune 10` ],
			extraArgs: false,
			deleteCmd: true,
			args: [
				{
					key: 'amount',
					prompt: 'How much messages you want to prune',
					type: 'number'
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
				'value': `${m.cleanContent !== '' ? m.cleanContent : '[Message content]'}`
			});
		});

		fields = fields.reverse();

		console.log('fields', fields);

		let _sent = await msg.author.send({
			embed: {
				'title': `This is a preview of the message that will be deleted from #${msg.channel.name}`,
				'description': 'Do you confirm this ? (yes/no)',
				'color': 15844367,
				'footer': {
					'text': CONSTANTS.MESSAGE.EMPTY
				},
				'thumbnail': {
					'url': 'https://cdn.discordapp.com/attachments/244447929400688650/331776445955309568/ROLEREMiconsmall.png'
				},
				'fields': fields
			}
		});

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
			let sent = await msg.guild.channels.get(CONSTANTS.CHANNELS.BIN).send({
				embed: {
					'title': `Messages deleted from #${msg.channel.name}`,
					'description': CONSTANTS.MESSAGE.EMPTY,
					'color': 15844367,
					'footer': {
						'text': CONSTANTS.MESSAGE.EMPTY
					},
					'thumbnail': {
						'url': 'https://cdn.discordapp.com/attachments/244447929400688650/331776445955309568/ROLEREMiconsmall.png'
					},
					'fields': fields
				}
			});
		}
	}
};