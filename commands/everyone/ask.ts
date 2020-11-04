import { Command, CommandoMessage } from 'discord.js-commando';
import Ask from '../../templates/Announcement_Ask';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';
import { genericError } from '../../errorManagement';
import { Message } from 'discord.js';

export default class ask extends Command {
  constructor(client) {
    super(client, {
      name: 'ask',
      memberName: 'ask',
      group: 'everyone',
      description: 'Help you getting started asking questions',
      examples: ['ask'],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  onError(err, message, args, fromPattern, result) {
    return genericError(err, message);
  }

  hasPermission(msg) {
    const permissions = {
      roles: [CONSTANTS.ROLES.ANY],
      channels: [CONSTANTS.CHANNELS.ANY],
    };
    return hasPermissions(this.client, permissions, msg);
  }

  // eslint-disable-next-line
  async run(msg: CommandoMessage): Promise<Message> {
    try {
      await msg.channel.send({
        embed: new Ask().embed(),
      });

			await msg.delete();
			return null;
    } catch (e) {
      console.error(e);
    }
  }
}
