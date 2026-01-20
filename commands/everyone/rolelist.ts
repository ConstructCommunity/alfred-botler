import { Command, CommandoMessage } from 'discord.js-commando';
import RoleList from '../../templates/Announcement_RoleList';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';
import { genericError } from '../../errorManagement';
import { Message } from 'discord.js';

export default class rolehelper extends Command {
	constructor(client) {
		super(client, {
			name: 'rolelist',
			memberName: 'rolelist',
			group: 'everyone',
			description: 'Show the rolelist in the channel',
			examples: ['rolelist'],
		});
	}

	hasPermission(msg) {
		const permissions = {
			roles: [CONSTANTS.ROLES.ANY],
			channels: [CONSTANTS.CHANNELS.ALFRED_COMMANDS],
		};
		return hasPermissions(this.client, permissions, msg);
	}

	// eslint-disable-next-line class-methods-use-this
	onError(err, message, args, fromPattern, result) {
		return genericError(err, message);
	}

	// eslint-disable-next-line
	async run(msg: CommandoMessage): Promise<Message> {
		try {
			await msg.delete();
			return msg.channel.send({
				embed: new RoleList().embed(),
			});
		} catch (e) {
			console.error(e);
		}
	}
}
