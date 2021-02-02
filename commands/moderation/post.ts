import got from 'got';
import { Command, CommandoMessage } from 'discord.js-commando';

import { hasPermissions } from '../../bot-utils';
import CONSTANTS from '../../constants';
import { genericError } from '../../errorManagement';
import { Message } from 'discord.js';

export default class post extends Command {
  constructor(client) {
    super(client, {
      name: 'post',
      group: 'moderation',
      memberName: 'post',
      description: 'Post a JSON file',
      examples: ['post + json as attached file'],
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

  // eslint-disable-next-line
  async run(msg: CommandoMessage, { text }): Promise<Message> {
    // exactly one attachment
    if (msg.attachments.array().length === 1) {
			try {
				console.log('msg.attachments.first()', msg.attachments.first())
        const { body } = await got(msg.attachments.first().url);

        console.log(msg.attachments.first().url);
        console.log('body', body);

        let json;
        try {
          json = JSON.parse(body);
        } catch (e) {
          console.log(e);
          await msg.channel.send('Invalid JSON');
          await msg.delete();
          return;
        }

        try {
          if (text) {
            await msg.channel.send(text, { embed: json });
          } else {
            await msg.channel.send({ embed: json });
          }
        } catch (e) {
          await msg.channel.send(`There is an error with the message: ${e.message}`);
        }
        await msg.delete();
      } catch (e) {
        console.log(e);
        await msg.channel.send('Sorry, there was an error with the embed file');
        await msg.delete();
      }
    } else {
      await msg.reply('Missing JSON file');
      await msg.delete();
    }
    /* if (msg.attachments.array().length > 1) {
      const _ = await msg.author.send('Sorry, this command only support 1 attached JSON file');
      msg.delete();
    }
    // No attachments
    else */
  }
}
