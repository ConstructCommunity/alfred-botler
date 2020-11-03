import { Command, CommandoMessage } from 'discord.js-commando';
import Bug from '../../templates/Announcement_Bug';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';
import { genericError } from '../../errorManagement';
import { Message } from 'discord.js';

export default class bug extends Command {
  constructor(client) {
    super(client, {
      name: 'bug',
      memberName: 'bug',
      group: 'everyone',
      description: 'Show the notice in the channel',
      examples: ['bug'],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  onError(err, message, args, fromPattern, result) {
    return genericError(err, message, args, fromPattern, result);
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
      await msg.delete();
      return msg.channel.send({
        embed: new Bug().embed(),
      });
    } catch (e) {
      console.error(e);
    }
  }
}
