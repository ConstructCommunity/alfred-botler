import got from 'got';
import { Command, CommandoMessage } from 'discord.js-commando';

import { hasPermissions } from '../../bot-utils';
import CONSTANTS from '../../constants';
import { genericError } from '../../errorManagement';
import { Message } from 'discord.js';

export default class say extends Command {
  constructor(client) {
    super(client, {
      name: 'kill',
      group: 'moderation',
      memberName: 'kill',
      description: 'Kill the bot',
      examples: ['kill']
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
  async run(msg: CommandoMessage): Promise<Message> {
		const message =  await msg.channel.send(`${msg.member.displayName} requested to kill the bot. Killing...`)
		this.client.destroy()
		return message
  }
}
