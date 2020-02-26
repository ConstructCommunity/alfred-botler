import { Command } from 'discord.js-commando';
import { RoleList } from '../../templates';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';
import { genericError } from '../../errorManagement';

export default class rolehelper extends Command {
  constructor(client) {
    super(client, {
      name: 'rolelist',
      memberName: 'rolelist',
      group: 'everyone',
      description: 'Show the rolelist in the channel',
      examples: ['rolelist'],
      deleteCmd: true,
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
    return genericError(err, message, args, fromPattern, result);
  }

  // eslint-disable-next-line
  async run(msg) {
    try {
      await msg.delete();
      await msg.channel.send({
        embed: new RoleList().embed(),
      });
    } catch (e) {
      console.error(e);
    }
  }
}
