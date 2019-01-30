import { Command } from 'discord.js-commando';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';
import Warn from '../../templates/Announcement_Warn';

/*
► List Of Punishments
  1. Warning (Use !warn command)
  2. Timeout (24h mute)
  3. Mute* (7 days mute)
  4. Perma Mute* (Lifetime mute)
  5. Forced Ban* (Extreme cases only)
 */

export default class warn extends Command {
  constructor(client) {
    super(client, {
      name: 'warn',
      memberName: 'warn',
      group: 'moderation',
      description: 'Warn a user with different level of severity',
      examples: ['warn [@user [punishment [reason]]]'],
      args: [
        {
          key: 'user',
          prompt: 'What user do you want to warn ?',
          type: 'user',
        },
        {
          key: 'punishment',
          prompt: `What is his punishment: 
    1. Warning ('warning')
  2. Timeout (24h mute, 'timeout')
  3. Mute* (7 days mute, 'mute')
  4. Perma Mute* (Lifetime mute, 'permamute')
  5. Forced Ban* (Extreme cases only, 'forcedban')
  
*Require admin agreement`,
          type: 'string',
        },
        {
          key: 'reason',
          prompt: 'What is the reason for this punishment ?',
          type: 'string',
        },
      ],
    });
  }

  hasPermission(msg) {
    const permissions = {
      roles: [CONSTANTS.ROLES.STAFF],
      channels: [CONSTANTS.CHANNELS.MODERATORS],
    };
    return hasPermissions(this.client, permissions, msg);
  }

  /**
   * Run the command
   * @inheritDoc
   * @param msg
   * @param user
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line
  async run(msg, { user, punishment, reason }) {
    console.log(user, punishment, reason);
    const punishments = [
      'warning',
      'timeout',
      'mute',
      'permamute',
      'forcedban',
    ];

    if (punishments.includes(punishment.toLowerCase())) {
      if (punishment === 'warning') {
        // Only notify user if it's a warning
        await user.send({
          embed: new Warn({}).embed(),
        });
      }
      await msg.channel.send(`<@&${CONSTANTS.ROLES.STAFF}>`, {
        embed: {
          title: `@${msg.author.username} warned @${user.username}`,
          description: `Reason: **${reason}**
Sanction: **${punishment}**

Do not forget to report the status via the following form: https://goo.gl/forms/JtUGql92PH3AI6452.`,
          color: 15844367,
        },
      });
    } else {
      await msg.channel.send(`Invalid punishment! Please use:
  1. Warning ('warning')
  2. Timeout (24h mute, 'timeout')
  3. Mute* (7 days mute, 'mute')
  4. Perma Mute* (Lifetime mute, 'permamute')
  5. Forced Ban* (Extreme cases only, 'forcedban')
  
*Require admin agreement`);
    }
  }
}
