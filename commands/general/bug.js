/**
 * Created by Armaldio on 11/12/2017.
 */

import { Command } from 'discord.js-commando';
import { Bug } from '../../class-templates';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';

export default class notice extends Command {
  constructor(client) {
    super(client, {
      name: 'bug',
      memberName: 'bug',
      group: 'general',
      description: 'Show the notice to the user',
      examples: ['bug'],
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
        embed: new Bug().toEmbed(),
      });
    } catch (e) {
      console.error(e);
    }
  }
}
