/**
 * Created by Armaldio on 11/12/2017.
 */

import { Command } from 'discord.js-commando';

import { hasPermissions } from '../../bot-utils';
import CONSTANTS from '../../constants';

import * as templates from '../../templates';
import { genericError } from '../../errorManagement';

export default class temptest extends Command {
  constructor(client) {
    super(client, {
      name: 'temptest',
      group: 'moderation',
      memberName: 'temptest',
      description: 'Output a predefined template inside current channel as Alfred',
      examples: ['temptest templateName'],
      args: [
        {
          key: 'text',
          prompt: 'What template do you want to check ?',
          type: 'string',
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

  // eslint-disable-next-line
  async run(msg, { text }) {
    const myTemplates = [];
    Object.keys(templates.default).forEach((key) => {
      // eslint-disable-next-line
      myTemplates.push(new templates.default[key].default());
    });

    const foundTemplate = myTemplates.find((template) => template.name === text);

    if (foundTemplate) {
      await msg.channel.send({
        embed: foundTemplate.embed(),
      });
    } else {
      await msg.reply(`Unavailable template. Try on of:\n${myTemplates.map((t) => t.name).join(', ')}`);
    }
    await msg.delete();
  }
}
