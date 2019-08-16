import { Command } from 'discord.js-commando';
import { RoleList } from '../../templates';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';

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
      channels: [CONSTANTS.CHANNELS.ANY],
    };
    return hasPermissions(this.client, permissions, msg);
  }

  // eslint-disable-next-line
  async run(msg) {
    try {
      await msg.channel.send({
        embed: new RoleList().embed(),
      });
    } catch (e) {
      console.error(e);
    }
  }
}
