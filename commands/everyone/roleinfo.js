import { Command } from 'discord.js-commando';
import { roleinfo } from '../../templates';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';

export default class notice extends Command {
  constructor(client) {
    super(client, {
      name: 'roleinfo',
      memberName: 'roleinfo',
      group: 'everyone',
      description: 'Show the notice in the channel',
      examples: ['roleinfo'],
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
        embed: new roleinfo().embed(),
      });
    } catch (e) {
      console.error(e);
    }
  }
}
