import { Command, CommandoMessage } from 'discord.js-commando';
import Rules from '../../templates/Announcement_Rules';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';
import { genericError } from '../../errorManagement';
import { Message } from 'discord.js';

export default class rules extends Command {
  constructor(client) {
    super(client, {
      name: 'rules',
      memberName: 'rules',
      group: 'everyone',
			description: 'Lists the meaning of punishments to members and can be posted if to give a general understanding',
      examples: ['rules'],
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
      await msg.delete();
      return msg.channel.send({
        embed: new Rules().embed(),
      });
    } catch (e) {
      console.error(e);
    }
  }
}
