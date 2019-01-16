/**
 * Created by Armaldio on 11/12/2017.
 */

import { Command } from 'discord.js-commando';
import { Bug } from '../../templates';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';

export default class promo extends Command {
  constructor(client) {
    super(client, {
      name: 'promo',
      memberName: 'promo',
      group: 'general',
      description: 'Promote your content in #promotion',
      examples: ['promo message'],
      args: [
        {
          key: 'text',
          prompt: 'What do you want to promote ?',
          type: 'string',
        },
      ],
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
  async run(msg, { text }) {
    if (msg.attachments.array().length === 0
        && msg.content.search(/(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*/) === -1) {
      const _ = await msg.reply('Hey you\'re not using that command properly!\nYou should have at least one link, one embed, or one attachement.');
      return;
    }
    const webhook = await msg.guild.channels.get(CONSTANTS.CHANNELS.COLLECTION)
      .createWebhook(msg.member.displayName, msg.author.avatarURL, 'Temp Webhook for displaying message in the collections channel');

    const obj = {};
    if (msg.attachments.array().length !== 0) {
      obj.files = [new Discord.Attachment(msg.attachments.first().url, msg.attachments.first().filename)];
    }

    let _msg = null;
    try {
      _msg = await webhook.send(`${msg.member}, ${_extra.join(' ')}`, obj);
    } catch (e) {
      console.log('Error on sending webhook', e);
    }

    webhook.delete('This webhook fulfilled its goal. It may now turn into ashes.');

    if (_msg) {
      _msg = await msg.author.send(`Hey, I have added your message to <#${CONSTANTS.CHANNELS.COLLECTION}> . Here is that message's code: **__${_msg.id}__**.
You can use \`!del ${_msg.id}\` followed by this id to remove that message if you ever wish to delete it. (Use inside <#${CONSTANTS.CHANNELS.ALFRED_COMMANDS}>!)

Your message was:
\`\`\`${_extra.join(' ')}\`\`\``);
    }
  }
}
