/**
 * Created by Armaldio on 11/12/2017.
 */

import { Command } from 'discord.js-commando';
import CONSTANTS from '../../constants';
import { hasPermissions, duplicateMessage, addReactions } from '../../bot-utils';
import { PromoUp } from '../../templates';

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
    if (msg.attachments.array().length === 0
        // eslint-disable-next-line
        && msg.content.search(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi) === -1
        && msg.content.length < 20) {
      await msg.author.send('Hey you\'re not using that command properly!\nYou should have at least one link, one embed, or one attachment and the associated text must be at least 20 characters long.');
      return;
    }

    await duplicateMessage(msg, CONSTANTS.CHANNELS.PROMO, content => content.replace(/!promo ?/, ''));

    // send pending approval notification
    const sent = await msg.author.send({
      embed: new PromoUp({}).embed(),
    });
    await addReactions(sent, 'promo');
  }
}
