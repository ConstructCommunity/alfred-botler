/**
 * Created by Armaldio on 11/12/2017.
 */

import { Command } from 'discord.js-commando';
import CONSTANTS from '../../constants';
import { hasPermissions, duplicateMessage } from '../../bot-utils';
import { genericError } from '../../errorManagement';

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

  /**
   *
   * @param msg
   * @param amount
   * @param { Discord.TextChannel } channel
   * @return {Promise<void>}
   */
  // eslint-disable-next-line
  async run(msg, { amount, channel }) {
    if (amount <= 0) {
      await msg.author.send('Amount of message must be greater that 0!');
      return;
    }

    let messages = await msg.channel.messages.fetch({ limit: amount + 1 });
    messages = messages
      .filter((m) => m.id !== messages.first().id)
      .sort((a, b) => a.createdTimestamp - b.createdTimestamp);
    // messages.shift();
    // messages = messages.reverse();

    await msg.author.send({
      embed: {
        title: 'Do you confirm this ? (yes/no)',
        description: `**Will be copied to #${channel}**

From:
**"${messages.first().cleanContent}"** 
To:
**"${messages.last().cleanContent}"**`,
        color: 15844367,
        footer: {
          text: CONSTANTS.MESSAGE.EMPTY,
        },
        thumbnail: {
          url: 'https://cdn.discordapp.com/attachments/244447929400688650/331776445955309568/ROLEREMiconsmall.png',
        },
      },
    });

    let message = await msg.author.dmChannel.awaitMessages((response) => response.content.match(/yes|no/), {
      max: 1,
      time: 60000,
      errors: ['time'],
    });

    message = message.first();

    if (message.content === 'yes') {
      console.log(`Copying ${messages.size} messages`);
      // eslint-disable-next-line
      for (let m of messages.values()) {
        // eslint-disable-next-line
        await duplicateMessage(m, channel.id, content => content)
        console.log(m.cleanContent);
      }

      const text = 'Deleting messages...';
      let x = 0;

      const msgDel = await msg.author.send(text);
      await Promise.all(messages.map((m) => m.delete().then(() => {
        // eslint-disable-next-line no-plusplus
        msgDel.edit(`${text} ${++x}/${messages.array().length}`);
      })));
      await msgDel.edit(`${messages.array().length} messages successfully deleted.`);

      const sent = await msg.channel.send(`${messages.array().length} message(s) were moved to <#${channel.id}>. Please continue the conversation there! <:z_scirra_c3Alfred:278258103474978816>`);
      await sent.delete({
        timeout: 300000,
      });
    }

    await msg.delete();
  }
}
