import { Command, CommandoClient, CommandoMessage, CommandInfo } from 'discord.js-commando';
import { hasPermissions } from '../../bot-utils';
import { scheduler } from '../../schedule'
import CONSTANTS from '../../constants';
import { genericError } from '../../errorManagement';
import { Channel, Message, TextChannel } from 'discord.js';
import dayjs from 'dayjs';

export const infos: CommandInfo = {
	name: 'remind',
	group: 'moderation',
	memberName: 'remind',
	description: 'Schedule a message',
	examples: ['remind "aaa" "on next sunday"'],
	args: [
		{
			key: 'text',
			label: 'The text you want to say',
			prompt: 'What do you want to say ?',
			type: 'string',
			default: '',
		},
		{
			key: 'schedule',
			prompt: 'When do you want to schedule it',
			type: 'string',
			default: '',
		},

		{
			key: 'channel',
			prompt: 'The channel you want to move messages to',
			type: 'channel',
			default: ''
		},
	],
}

export default class remind extends Command {
  constructor(client: CommandoClient) {
    super(client, infos);
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

	async run(msg: CommandoMessage, { text, schedule, channel }: { text: string, schedule: string, channel: Channel | string }): Promise<Message> {
		try {
			let resolvedChannel: TextChannel;
			if (channel === '') {
				resolvedChannel = msg.channel as TextChannel
			} else {
				resolvedChannel = channel as TextChannel
			}
			console.log('channel.id', resolvedChannel.id)
			const result = await scheduler.add(schedule, text, resolvedChannel.id)
			console.log('result', result)
			msg.reply(`Reminder succesfully added on **${dayjs(result.date).format('DD/MM/YYYY HH:mm:ss')}**
You can cancel this reminder with \`!remind-remove ${result.id}\``)
		} catch (e) {
			console.error(e)
			msg.reply(`Invalid schedule: ${e.message}`)
		}

		return msg
  }
}
