/**
 * Created by Armaldio on 11/12/2017.
 */

const Command = require('../bot/Command');
const CONSTANTS = require('../constants');
const os = require('os');

module.exports = class info extends Command
{
	constructor (client) {
		super(client, {
			name: 'info',
			description: 'Get infos about the current running instance',
			examples: [ 'info' ],
			permissions: {
				roles: [ CONSTANTS.ROLES.STAFF ],
				channels: [ CONSTANTS.CHANNELS.ANY ]
			}
		});
	}

	async run (msg) {
		msg.channel.send({
			embed: {
				color: 3447003,
				description: 'Here are some infos about me:',
				fields: [
					{
						name: 'Arch:',
						value: os.arch(),
						inline: true
					},
					{
						name: 'CPUs',
						value: os.cpus().length,
						inline: true
					},
					{
						name: 'Home dir',
						value: os.homedir(),
						inline: true
					},
					{
						name: 'Hostname',
						value: os.hostname(),
						inline: true
					},
					{
						name: 'Platform',
						value: os.platform(),
						inline: true
					},
					{
						name: 'Uptime',
						value: os.uptime().toString(),
						inline: true
					}
				]
			}
		});
	}
};
