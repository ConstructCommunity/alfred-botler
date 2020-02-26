/**
 * Created by Armaldio on 11/12/2017.
 */

import got from 'got';
import { Command } from 'discord.js-commando';

import { hasPermissions } from '../../bot-utils';
import CONSTANTS from '../../constants';
import { genericError } from '../../errorManagement';

export default class say extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      group: 'moderation',
      memberName: 'say',
      description: 'Output text or embed inside current channel as Alfred',
      examples: ['say + json as attached file', 'say Hello everyone!'],
      args: [
        {
          key: 'text',
          prompt: 'What do you want to say ?',
          type: 'string',
          default: '',
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
    console.log(text);
    // exactly one attachment
    if (msg.attachments.array().length === 1) {
      try {
        const { body } = await got(msg.attachments.first().url);

        console.log(msg.attachments.first().url);
        console.log('body', body);

        let json;
        try {
          json = JSON.parse(body);
        } catch (e) {
          console.log(e);
          await msg.channel.send('Sorry, there was an error with the JSON of your file');
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
    } else if (msg.attachments.array().length <= 0) {
      await msg.channel.send(text);
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
