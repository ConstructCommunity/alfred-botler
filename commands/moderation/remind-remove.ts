import { Command, CommandoClient, CommandoMessage, CommandInfo } from 'discord.js-commando';
import { hasPermissions } from '../../bot-utils';
import { scheduler } from '../../schedule'
import CONSTANTS from '../../constants';
import { genericError } from '../../errorManagement';
import { Channel, Message } from 'discord.js';
import dayjs from 'dayjs';

export default class remindRemove extends Command {
  constructor(client: CommandoClient) {
		super(client, {
			name: 'remind-remove',
			group: 'moderation',
			memberName: 'remind-remove',
			description: 'Remove a reminder',
			examples: ['remind-remove <id>'],
			args: [
				{
					key: 'id',
					label: 'The id you want to remove',
					prompt: 'What do you want to remove ?',
					type: 'string',
					default: '',
				},
			],
		});
  }

  onError(err, message) {
    return genericError(err, message);
  }

  hasPermission(msg: Message) {
    const permissions = {
      roles: [CONSTANTS.ROLES.STAFF],
      channels: [CONSTANTS.CHANNELS.ANY],
    };
    return hasPermissions(this.client, permissions, msg);
	}

	async run(msg: CommandoMessage, { id }: { id: string }): Promise<Message> {
		try {
			const result = await scheduler.remove(id)
			msg.reply(`Reminder succesfully removed`)
		} catch (e) {
			msg.reply(`Error while removing schedule: ${e.message}`)
		}

		return msg
  }
}
