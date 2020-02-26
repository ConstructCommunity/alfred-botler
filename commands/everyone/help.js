/**
 * Created by Armaldio on 11/12/2017.
 */

import { Command } from 'discord.js-commando';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';
import { genericError } from '../../errorManagement';

export default class help extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      memberName: 'help',
      group: 'everyone',
      description: 'Send you help instructions',
      examples: ['help'],
    });
  }

  hasPermission(msg) {
    const permissions = {
      roles: [CONSTANTS.ROLES.ANY],
      channels: [CONSTANTS.CHANNELS.ANY],
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
      await msg.author.send('Please visit https://github.com/Armaldio/alfred-botler/blob/master/README.md for help!');
    } catch (e) {
      console.error(e);
    }
  }
}
