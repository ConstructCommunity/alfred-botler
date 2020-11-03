import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import RoleToggle from '../../templates/Announcement_RoleToggle';
import RoleHelp from '../../templates/Announcement_RoleHelp';
import CONSTANTS from '../../constants';
import { hasPermissions } from '../../bot-utils';
import { genericError } from '../../errorManagement';
import { Message, Role } from 'discord.js'

const roles = Object
  .values(CONSTANTS.ROLES)
	.filter((role) => !role.hideInList && !role.requireApplication);

interface CommandParameters {
	role: string
}

export default class iam extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'iam',
      group: 'everyone',
      memberName: 'iam',
      description: 'Add or remove roles',
      examples: ['iam dev', 'iam artist'],
      args: [
        {
          key: 'role',
          prompt: 'What role would you like? (Available Roles: Please use the `!rolelist` command.)',
          type: 'string',
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
      roles: [CONSTANTS.ROLES.ANY],
      channels: [CONSTANTS.CHANNELS.ALFRED_COMMANDS],
    };
    return hasPermissions(this.client, permissions, msg);
  }

  async run(msg: CommandoMessage, { role }: CommandParameters): Promise<Message> {
    const fun: string[][] = [
      ['god', 'Sorry, Armaldio is our only god ...'],
      ['ashley', 'No, Ash is too busy adding features ;)'],
      ['armaldio', 'No, you are not.\nOr maybe you are. I don\'t know.'],
    ];

    let found = false;
    fun.forEach(([name, answer]) => {
      if (name === role) {
        msg.reply(answer);
        found = true;
      }
    });

    if (found) return;

    const targetRole = roles.find((r) => r.shortName === role);
    if (typeof targetRole === 'undefined') {
      await msg.channel.send({
        embed: new RoleHelp({
          roles,
        }).embed(),
      });
      return;
    }

    let icon = '';
    let toggleText = '';

    if (msg.member.roles.cache.has(targetRole.id)) {
      await msg.member.roles.remove(targetRole.id);
      icon = 'RoleDelicon';
      toggleText = 'REMOVED';
    } else {
      await msg.member.roles.add(targetRole.id);
      icon = 'RoleGeticon';
      toggleText = 'ADDED';
    }

    const roleName = Object.values(CONSTANTS.ROLES)
      .find((r) => r.id === targetRole.id)
      .displayName
      .toUpperCase();

    return msg.channel.send({
      embed: new RoleToggle({
        icon,
        toggleText,
        roleName,
        roles,
      }).embed(),
    });
  }
}
