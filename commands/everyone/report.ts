import { Command, CommandoMessage } from 'discord.js-commando';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';
import { genericError } from '../../errorManagement';
import { Message } from 'discord.js';

export default class report extends Command {
  constructor(client) {
    super(client, {
      name: 'report',
      group: 'everyone',
      description: 'Report an individual to the CCStaff for breaking a rule.',
      examples: ['report'],
      memberName: 'report',
      args: [
        {
          key: 'msg_id',
          prompt: 'Which message to report',
          type: 'string',
          default: '',
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
      roles: [CONSTANTS.ROLES.ANY],
      channels: [CONSTANTS.CHANNELS.ANY],
    };
    return hasPermissions(this.client, permissions, msg);
  }

  // eslint-disable-next-line
  async run(msg: CommandoMessage, { msg_id }): Promise<Message> {
    await msg.author.send('Your report has been submitted and will be reviewed as soon as possible.\n(Please note that wrong or malicious reporting might result in a permanent block from using this command!)');

    let _messages = await msg.channel.messages.fetch({
      limit: 10,
      before: msg.id,
		});
		// @ts-ignore
    _messages = _messages.array().reverse();

		const fields = [];
		// @ts-ignore
    for (let i = 0; i < _messages.length; i += 1) {
      const message = _messages[i];
      fields.push({
        name: `@${message.author.username}`,
        value: message.content || '[NO CONTENT]',
      });
    }

		await msg.guild.channels.cache.get(CONSTANTS.CHANNELS.EVENTS)
		// @ts-ignore
      .send(`**${msg.author.username}** requested a manual review for <#${msg.channel.id}>! <@&${CONSTANTS.ROLES.STAFF.id}>`, {
        embed: {
          description: CONSTANTS.MESSAGE.EMPTY,
          title: `https://discordapp.com/channels/${CONSTANTS.GUILD_ID}/${msg.channel.id}/${msg_id || msg.id}\n\nContext:`,
          color: 15844367,
          fields,
        },
      });

		await msg.delete();
		return null
  }
}
