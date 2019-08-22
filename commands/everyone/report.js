/**
 * Created by Armaldio on 11/12/2017.
 */

import { Command } from 'discord.js-commando';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';

export default class report extends Command {
  constructor(client) {
    super(client, {
      name: 'report',
      group: 'everyone',
      description: 'Report an individual to the CCStaff for breaking a rule.',
      examples: ['report'],
      memberName: 'report',
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
    await msg.author.send('Your report has been submitted and will be reviewed as soon as possible.\n(Please note that wrong or malicious reporting might result in a permanent block from using this command!)');

    let _messages = await msg.channel.fetchMessages({
      limit: 10,
      before: msg.id,
    });
    _messages = _messages.array().reverse();

    const fields = [];
    for (let i = 0; i < _messages.length; i += 1) {
      const message = _messages[i];
      fields.push({
        name: `@${message.author.username}`,
        value: message.content || '[NO CONTENT]',
      });
    }

    await msg.guild.channels.get(CONSTANTS.CHANNELS.EVENTS)
      .send(`**${msg.author.username}** requested a manual review for <#${msg.channel.id}>! <@&${CONSTANTS.ROLES.STAFF.id}>`, {
        embed: {
          description: CONSTANTS.MESSAGE.EMPTY,
          title: 'Context:',
          color: 15844367,
          fields,
        },
      });
    await msg.delete();
  }
}
