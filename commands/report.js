/**
 * Created by Armaldio on 11/12/2017.
 */

const Command = require('../api/Command');
const CONSTANTS = require('../constants');
const doy = require('day-of-year');

module.exports = class report extends Command
{
	constructor (client, database) {
		super(client, {
			name: 'report',
			description: 'Report a user to the STAFF',
			examples: 'report @user1',
			extraArgs: false,
			deleteCmd: true,
			args: [ {
				key: 'user',
				prompt: 'The user you want to report',
				type: 'user'
			} ],
			permissions: {
				roles: [ CONSTANTS.ROLES.ANY ],
				channels: [ CONSTANTS.CHANNELS.ANY ]
			}
		}, database);
	}

	async run (msg, {user}) {
		console.log('user', user);

		if (user.id === CONSTANTS.OWNER || user.id === '168340128622706688' || user.id === msg.author.id || user.id === '172002275412279296' || user.id === '115385224119975941') {
			msg.channel.send('Whoops! The user your tried to report doesn\'t exist or left the server.');
		} else {

			let _ = msg.author.send('Your report has been submitted and will be reviewed by a staff member shortly! (Please note that wrong or malicious reporting might result in a permanent block from using this command.)');
			_ = msg.guild.channels.get(CONSTANTS.CHANNELS.MODERATORS)
				   .send(`${msg.author.username} just reported ${user.username} inside ${msg.channel.name}. <@&${CONSTANTS.ROLES.STAFF}> A manual review is required!`);
		}
	}
};