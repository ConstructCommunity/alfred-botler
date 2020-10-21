/**
 * Created by Armaldio on 11/12/2017.
 */

import { Command } from 'discord.js-commando';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';
import { genericError } from '../../errorManagement';

export default class Generate extends Command {
  constructor(client) {
    super(client, {
      name: 'generate',
      memberName: 'generate',
      group: 'moderation',
      description: 'Generate a certain amount of messages inside a channel',
      examples: ['generate 10 <#226376432064921600>'],
      args: [
        {
          key: 'amount',
          prompt: 'How much messages you want to generate',
          type: 'integer',
        },
      ],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  onError(err, message, args, fromPattern, result) {
    return genericError(err, message, args, fromPattern, result);
  }

  hasPermission(msg) {
    const permissions = {
      roles: [CONSTANTS.ROLES.STAFF],
      channels: [CONSTANTS.CHANNELS.ANY],
    };
    return hasPermissions(this.client, permissions, msg);
  }

  // @ts-ignore
  // eslint-disable-next-line
  async run(msg, { amount }) {
    const texts = Array.from(Array(amount).keys());

    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const text in texts) {
      msg.channel.send(text);
    }
  }
}
