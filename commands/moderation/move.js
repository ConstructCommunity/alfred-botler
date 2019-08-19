/**
 * Created by Armaldio on 11/12/2017.
 */

import { Command } from 'discord.js-commando';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';

export default class move extends Command {
  constructor(client) {
    super(client, {
      name: 'move',
      memberName: 'move',
      group: 'moderation',
      description: 'Move a certain amount of messages from one channel to another',
      examples: ['move 10 <#226376432064921600>'],
      extraArgs: false,
      deleteCmd: true,
      args: [
        {
          key: 'amount',
          prompt: 'How much messages you want to move',
          type: 'integer',
        },
        {
          key: 'channel',
          prompt: 'The channel you want to move messages to',
          type: 'channel',
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
  async run(msg, { amount, channel }) {
    if (amount <= 0) {
      msg.author.send('Amount of message must be greater that 0!');
      return;
    }

    const messages = await msg.channel.fetchMessages({ limit: amount + 1 });

    let fields = [];

    let size = 0;
    messages.forEach((m) => {
      size += m.author.username.length;
      size += m.cleanContent !== '' ? m.cleanContent.length : '📎'.length;
    });

    if (size >= 1800) {
      await msg.author.send({
        embed: {
          title: 'Error!',
          description: 'Too many messages selected, maximum number of characters exceeded! Reduce the number of messages and try again!',
          color: 15844367,
        },
      });

      return;
    }

    messages.forEach((m) => {
      fields.push({
        name: m.author.username,
        value: m.cleanContent !== '' ? m.cleanContent : '📎',
      });
    });

    fields.shift();
    fields = fields.reverse();

    await msg.author.send({
      embed: {
        title: `This is a preview of the message that will be posted to #${channel.name}`,
        description: 'Do you confirm this ? (yes/no)',
        color: 15844367,
        footer: {
          text: CONSTANTS.MESSAGE.EMPTY,
        },
        thumbnail: {
          url: 'https://cdn.discordapp.com/attachments/244447929400688650/331776445955309568/ROLEREMiconsmall.png',
        },
        fields,
      },
    });

    let message = await msg.author.dmChannel.awaitMessages(response => response.content.match(/yes|no/), {
      max: 1,
      time: 60000,
      errors: ['time'],
    });

    message = message.first();

    if (message.content === 'yes') {
      const text = 'Deleting messages...';
      let x = 0;

      const msgDel = await msg.author.send(text);
      await Promise.all(messages.map(m => m.delete().then(() => {
        msgDel.edit(`${text} ${++x}/${messages.array().length}`);
      })));
      await msgDel.edit(`${messages.array().length} messages successfully deleted.`);

      const sent = await msg.channel.send(`${messages.array().length} message(s) were moved to <#${channel.id}>. Please continue the conversation there! <:z_scirra_c3Alfred:278258103474978816>`);
      sent.delete(300000);

      await channel.send({
        embed: {
          title: `Last messages from #${msg.channel.name}`,
          description: CONSTANTS.MESSAGE.EMPTY,
          color: 11962861,
          footer: {
            text: CONSTANTS.MESSAGE.EMPTY,
          },
          thumbnail: {
            url: 'https://cdn.discordapp.com/attachments/244447929400688650/431836205164789765/movemessageicon.png',
          },
          fields,
        },
      });
    }
  }
}
