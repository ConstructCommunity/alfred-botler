/**
 * Created by Armaldio on 11/12/2017.
 */

import { Command } from 'discord.js-commando';
import { RoleToggle, RoleHelp } from '../../templates';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';

const roles = [
  CONSTANTS.ROLES.EXPERT,
  CONSTANTS.ROLES.DEV,
  CONSTANTS.ROLES.ARTIST,
  CONSTANTS.ROLES.GAME_DESIGNER,
  CONSTANTS.ROLES.SOUND_DESIGNER,
  CONSTANTS.ROLES.MULTIMEDIADEV,
];

export default class iam extends Command {
  constructor(client) {
    super(client, {
      name       : 'iam',
      group      : 'everyone',
      memberName : 'iam',
      description: 'Add or remove roles',
      examples   : [ 'iam dev', 'iam artist' ],
      args       : [
        {
          key   : 'role',
          prompt: 'What role would you like? (Available Roles: Please use the `!rolelist` command.)',
          type  : 'string',
        },
      ],
    });
  }

  hasPermission(msg) {
    const permissions = {
      roles   : [ CONSTANTS.ROLES.ANY ],
      channels: [ CONSTANTS.CHANNELS.ALFRED_COMMANDS ],
    };
    return hasPermissions(this.client, permissions, msg);
  }

  // eslint-disable-next-line
  async run(msg, { role }) {
    const fun = [
      [ 'god', 'Sorry, Armaldio is our only god ...' ],
      [ 'ashley', 'No, Ash is too busy adding features ;)' ],
      [ 'armaldio', 'No, you are not.\nOr maybe you are. I don\'t know.' ],
    ];

    let found = false;
    fun.forEach((entry) => {
      console.log(entry);
      if (entry[ 0 ] === role) {
        msg.reply(entry[ 1 ]);
        found = true;
      }
    });

    if (found) return;

    const targetRole = roles.find(r => r.shortName === role);
    if (typeof targetRole === 'undefined') {
      await msg.channel.send({
        embed: new RoleHelp({
          roles,
        }).embed(),
      });
      return;
    }

    let icon       = '';
    let toggleText = '';

    if (msg.member.roles.has(targetRole.id)) {
      await msg.member.removeRole(targetRole.id);
      icon       = 'RoleDelicon';
      toggleText = 'REMOVED';
    } else {
      await msg.member.addRole(targetRole.id);
      icon       = 'RoleGeticon';
      toggleText = 'ADDED';
    }

    await msg.channel.send({
      embed: new RoleToggle({
        icon,
        toggleText,
        roleName: role.toUpperCase(),
        roles,
      }).embed(),
    });
  }
}
