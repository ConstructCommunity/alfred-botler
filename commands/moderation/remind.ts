import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { hasPermissions } from '../../bot-utils';
import { scheduler } from '../../schedule'
import CONSTANTS from '../../constants';
import { genericError } from '../../errorManagement';
import { Message } from 'discord.js';
import dayjs from 'dayjs';

export default class remind extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'remind',
      group: 'moderation',
      memberName: 'remind',
      description: 'Schedule a message',
      examples: ['reminde "aaa" "on next sunday"'],
      args: [
        {
          key: 'text',
          prompt: 'What do you want to say?',
          type: 'string',
          default: '',
				},
				{
					key: 'schedule',
					prompt: 'When do you want to schedule it?',
					type: 'string',
					default: '',
				},
      ],
    });
  }

  // eslint-disable-next-line class-methods-use-this
	// @ts-ignore
  onError(err, message, args, fromPattern, result) {
    return genericError(err, message);
  }

  hasPermission(msg: Message) {
    const permissions = {
      roles: [CONSTANTS.ROLES.STAFF],
      channels: [CONSTANTS.CHANNELS.ANY],
    };
    return hasPermissions(this.client, permissions, msg);
	}

	async run(msg: CommandoMessage, { text, schedule }: { text: string, schedule: string }): Promise<Message> {
		try {
			const result = await scheduler.add(schedule, text)
			console.log('result', result)
			msg.reply(`Reminder succesfully added on **${dayjs(result).format('DD/MM/YYYY HH:mm:ss')}**`)
		} catch (e) {
			msg.reply(`Invalid schedule: ${e.message}`)
		}

		return msg
  }
}
