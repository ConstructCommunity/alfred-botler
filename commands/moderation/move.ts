import { Command, CommandoMessage } from 'discord.js-commando';
import { Message, TextChannel } from 'discord.js';
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
    return genericError(err, message);
  }

  hasPermission(msg) {
    const permissions = {
      roles: [CONSTANTS.ROLES.STAFF],
      channels: [CONSTANTS.CHANNELS.ANY],
    };
    return hasPermissions(this.client, permissions, msg);
  }

  async run(msg: CommandoMessage, { amount, channel }): Promise<Message> {
    if (amount <= 0) {
      await msg.author.send('Amount of message must be greater than 0!');
      return;
    }
    if (amount > 100) {
      await msg.author.send('Amount of message must be less than 100!');
      return;
    }

    const originalChannel = msg.channel as TextChannel;
    const adminChannel = msg.author;
    const adminDM = await msg.author.createDM();

    await msg.delete();

    let messagesToDelete = await originalChannel.messages.fetch({ limit: amount });
    messagesToDelete = messagesToDelete
      // .filter((m) => m.id !== messagesToDelete.first().id)
      .sort((a, b) => a.createdTimestamp - b.createdTimestamp);
    // messages.shift();
    // messages = messages.reverse();

    await adminChannel.send({
      embed: {
        title: 'Do you confirm this ? (yes/no)',
        description: `**Will be copied to #${channel}**

From:
**"${messagesToDelete.first().cleanContent}"**
To:
**"${messagesToDelete.last().cleanContent}"**`,
        color: 15844367,
        footer: {
          text: CONSTANTS.MESSAGE.EMPTY,
        },
        thumbnail: {
          url: 'https://cdn.discordapp.com/attachments/244447929400688650/331776445955309568/ROLEREMiconsmall.png',
        },
      },
    });

		const awaitedMessages = await adminDM.awaitMessages((response) => /yes|no/.test(response.content), {
      max: 1,
      time: 60000,
      errors: ['time'],
    });

    const answer = awaitedMessages.first();

		if (answer.content === 'yes') {
      console.log(`Copying ${messagesToDelete.size} messages`);
      for (let m of messagesToDelete.values()) {
				try {
					await duplicateMessage(m, channel, (content) => content);
					console.log(m.cleanContent);
				} catch (e) {
					console.error('Unable to duplicate message', e)
				}
      }

      const text = 'Deleting messages...';
      const { size } = messagesToDelete;

			const msgDel = await adminChannel.send(text);
			try {
				await originalChannel.bulkDelete(messagesToDelete);
			} catch (e) {
				console.error('Unable to duplicate message', e)
			}
      await msgDel.edit(`${size} messages successfully deleted.`);

			const sent = await originalChannel.send(`${size} message(s) were moved to <#${channel.id}>. Please continue the conversation there! <:z_scirra_c3Alfred:278258103474978816>`);
			try {
				setTimeout(async () => {
					await sent.delete();
				})
			} catch (e) {
				console.error('Unable to duplicate message', e)
			}
    }
  }
}
