/**
 * Created by Armaldio on 11/12/2017.
 */

import { Command } from 'discord.js-commando';
import CONSTANTS from '../../constants';
import { hasPermissions, duplicateMessage } from '../../bot-utils';
import { PromoApp, PromoUp, PromoDeny } from '../../templates';

export default class promo extends Command {
  constructor(client) {
    super(client, {
      name: 'promo',
      memberName: 'promo',
      group: 'everyone',
      description: 'Promote your content in #promotion',
      examples: ['promo message'],
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
    msg.author.send('This command is currently not available. Please try again later.');
  }
}
