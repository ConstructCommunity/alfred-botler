import got from 'got';
import { Command, CommandoMessage } from 'discord.js-commando';

import { duplicateMessage, hasPermissions } from '../../bot-utils';
import CONSTANTS from '../../constants';
import { genericError } from '../../errorManagement';
import { Message, TextChannel } from 'discord.js';

export default class say extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      group: 'moderation',
      memberName: 'say',
      description: 'Say something inside current channel as Alfred',
      examples: ['say Hello everyone!'],
      args: [
        {
          key: 'text',
          prompt: 'What do you want to say ?',
          type: 'string',
          default: '',
        },
      ],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  onError(err, message, args, fromPattern, result) {
    return genericError(err, message);
  }

  hasPermission(msg) {
    const permissions = {
      roles: [CONSTANTS.ROLES.STAFF],
      channels: [CONSTANTS.CHANNELS.ANY],
    };
    return hasPermissions(this.client, permissions, msg);
  }

  // eslint-disable-next-line
  async run(msg: CommandoMessage, { text }): Promise<Message> {
		await duplicateMessage(msg, (msg.channel as TextChannel), message => {
      return message.replace('!say', '');
    }, true, this.client.users.cache.get(this.client.user.id))
		return msg.delete()
  }
}
