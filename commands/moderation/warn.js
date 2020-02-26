import { Command } from 'discord.js-commando';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';
import Warn from '../../templates/Announcement_Warn';
import { genericError } from '../../errorManagement';

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
      examples: ['warn @user'],
      argsPromptLimit: 0,
      args: [
        {
          key: 'user',
          prompt: 'What user do you want to warn ?',
          type: 'user',
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
      channels: [CONSTANTS.CHANNELS.MODERATORS],
    };
    return hasPermissions(this.client, permissions, msg);
  }

  /**
   * Run the command
   * @inheritDoc
   * @param msg
   * @param {Discord.ClientUser} user
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line
  async run(msg, { user }) {
    await user.send({
      embed: new Warn({}).embed(),
    });
  }
}
