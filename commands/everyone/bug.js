import { Command } from 'discord.js-commando';
import { Bug } from '../../templates';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';

export default class bug extends Command {
  constructor(client) {
    super(client, {
      name: 'bug',
      memberName: 'bug',
      group: 'everyone',
      description: 'Show the notice in the channel',
      examples: ['bug'],
      deleteCmd: true,
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
      await msg.delete();
      await msg.channel.send({
        embed: new Bug().embed(),
      });
    } catch (e) {
      console.error(e);
    }
  }
}
