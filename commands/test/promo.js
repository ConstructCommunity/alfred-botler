/**
 * Created by Armaldio on 11/12/2017.
 */

import { Command } from 'discord.js-commando';
import Discord from 'discord.js';
import { Promo } from '../../templates';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';

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

  // TODO https://pastebin.com/raw/H8inQcnZ
  // eslint-disable-next-line
  async run(msg) {
    // TODO use webhooks
    const content = msg.content.replace(/!promo ?/, '');

    const final = {};

    let attachments = [];
    if (msg.attachments.array().length > 0) {
      attachments = msg.attachments.array().map(a => a.url);
    }

    /* if (msg.attachments.array().length > 0) {
      let attachments = msg.attachments.array();
      attachments = attachments.map(a => new Discord.Attachment(a.url, a.filename));
      final.files = attachments;
    } */

    final.embed = new Promo({
      message: content,
      author: msg.author.username,
      originalChan: msg.channel.name,
      profilePicUrl: msg.author.avatarURL,
    }).embed();

    const promoEmbed = await msg.guild.channels.get(CONSTANTS.CHANNELS.PRIVATE_TESTS).send(attachments.join('\n'), final);

    await msg.author.send(`Hey, I have added your message to <#${CONSTANTS.CHANNELS.COLLECTION}> . Here is that message's code: **__${promoEmbed.id}__**.
You can use \`!del ${promoEmbed.id}\` to remove that message if you ever wish to delete it. (Use inside <#${CONSTANTS.CHANNELS.ALFRED_COMMANDS}>!)

Your message was:
\`\`\`${content}\`\`\``);
  }
}
