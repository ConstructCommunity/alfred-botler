/**
 * Created by Armaldio on 11/12/2017.
 */

import { Command } from 'discord.js-commando';
import CONSTANTS from '../../constants';
import { hasPermissions, duplicateMessage } from '../../bot-utils';
import { PromoUp } from '../../templates';

export default class promo extends Command {
  constructor(client) {
    super(client, {
      name: 'promo',
      memberName: 'promo',
      group: 'test',
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
        && msg.content.search(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi) === -1) {
      await msg.author.send('Hey you\'re not using that command properly!\nYou should have at least one link, one embed, or one attachment.');
      return;
    }

    await duplicateMessage(msg, CONSTANTS.CHANNELS.PRIVATE_TESTS, content => content.replace(/!promo ?/, ''));

    // send pending approval notification
    await msg.author.send({
      embed: new PromoUp({}).embed(),
    });

    /*
    await newMessage.react('👍');
    await newMessage.react('👎');

    const collected = await newMessage.awaitReactions(async (reaction) => {
      if (reaction.emoji.name === '👍' || reaction.emoji.name === '👎') {
        return true;
      }
      return false;
    }, {
      time: 43200000, // 12h
      max: 2,
    });

    // find the emoji with two votes (alfred + the user
    const emoji = collected.array().find(reaction => reaction.count === 2);

    // if emoji is a thumbsup
    if (emoji && emoji.emoji.name === '👍') {
      try {
        await duplicateMessage(msg, CONSTANTS.CHANNELS.TEST,
        content => content.replace(/!promo ?/, ''));
        await msg.author.send({
          embed: new PromoUp({}).embed(),
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      // if emoji is a thumbsdown
      // ask why
      const whyMessage = await newMessage.channel
        .send('Why ?');

      // wait for messages from the author
      const messages = await newMessage.channel.awaitMessages((message) => {
        if (emoji.users.array().find(u => u.id === message.author.id)) {
          return true;
        }
        return false;
      }, {
        max: 1,
        time: 60000, // 1 min
        errors: ['time'],
      });


      const reason = messages.first();

      await msg.author.send({
        embed: new PromoDeny({
          reason: reason.content,
        }).embed(),
      });
      await whyMessage.delete();
      await reason.delete();
    }
    await newMessage.delete();
  */
  }
}
