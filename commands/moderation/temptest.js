/**
 * Created by Armaldio on 11/12/2017.
 */

import { Command } from 'discord.js-commando';

import { hasPermissions } from '../../bot-utils';
import CONSTANTS from '../../constants';

import * as templates from '../../templates';

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
    Object.keys(templates).forEach((key) => {
      myTemplates.push(new templates[key]());
    });

    const foundTemplate = myTemplates.find(template => template.name === text);
    console.log('foundTemplate', foundTemplate);

    if (foundTemplate) {
      await msg.channel.send({
        embed: foundTemplate.embed(),
      });
    } else {
      await msg.reply(`Cannot find this template. Templates:\n${myTemplates.map(t => t.name).join(', ')}`);
    }
    await msg.delete();
  }
}
