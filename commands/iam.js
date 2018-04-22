/**
 * Created by Armaldio on 11/12/2017.
 */

const Command   = require('../api/Command');
const CONSTANTS = require('../constants');
const roles     = {
  expert       : CONSTANTS.ROLES.EXPERT,
  dev          : CONSTANTS.ROLES.DEV,
  artist       : CONSTANTS.ROLES.ARTIST,
  gamedesigner : CONSTANTS.ROLES.GAME_DESIGNER,
  sounddesigner: CONSTANTS.ROLES.SOUND_DESIGNER,
  multimediadev: CONSTANTS.ROLES.SOUND_DESIGNER,
};

module.exports = class iam extends Command {
  constructor (client) {
    super(client, {
      name       : 'iam',
      description: 'Add or remove a user from a role\nFor more infos, check https://lnk.armaldio.xyz/cc_roles',
      examples   : ['iam dev', 'iam artist'],
      extraArgs  : false,
      args       : [
        {
          key   : 'role',
          prompt: 'A string representing a role',
          type  : 'string'
        }
      ],
      permissions: {
        roles   : [CONSTANTS.ROLES.ANY],
        channels: [CONSTANTS.CHANNELS.ALFRED_COMMANDS]
      }
    });
  }

  run (msg, {role}) {
    switch (role) {
      case 'god':
        return msg.reply('Sorry, Armaldio is our only god ...');

      case 'ashley':
        return msg.reply('Oh, glad to see you here');

      case 'armaldio':
        return msg.reply('No, you are not.\nOr maybe you are. I don\'t know.');

      case 'helper':
        return msg.reply('Helper role is an important thing. You must request it to a Staff member.');

      case 'a dog':
        return msg.reply('You should ask <@155322717422354432> to be sure');
      default:
        if (typeof roles[role] === 'undefined') {
          return msg.reply('Sorry, this role is invalid');
        } else if (msg.member.roles.has(roles[role])) {
          msg.member.removeRole(roles[role]);
          return msg.channel.send({
            embed: {
              'description': CONSTANTS.MESSAGE.EMPTY,
              'color'      : 15844367,
              'footer'     : {
                'text': '(Request custom roles by mentioning or PMing a staff member!)'
              },
              'thumbnail'  : {
                'url': 'https://cdn.discordapp.com/attachments/244447929400688650/331776445955309568/ROLEREMiconsmall.png'
              },
              'author'     : {
                'name'    : `YOU NO LONGER HAVE THE ${role.toUpperCase()} ROLE!`,
                'icon_url': 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
              },
              'fields'     : [
                {
                  'name' : 'Available Roles (https://lnk.armaldio.xyz/cc_roles):',
                  'value': Object.keys(roles).join(', ')
                }
              ]
            }
          });
        } else {
          msg.member.addRole(roles[role]);
          return msg.channel.send({
            embed: {
              'description': CONSTANTS.MESSAGE.EMPTY,
              'color'      : 15844367,
              'thumbnail'  : {
                'url': 'https://cdn.discordapp.com/attachments/244447929400688650/331776445947052042/ROLEGETiconsmall.png'
              },
              'author'     : {
                'name'    : `YOU NOW HAVE THE ${role.toUpperCase()} ROLE!`,
                'icon_url': 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
              },
              'fields'     : [
                {
                  'name' : 'Available Roles (https://lnk.armaldio.xyz/cc_roles):',
                  'value': Object.keys(roles).join(', ')
                }
              ]
            }
          });
        }
    }
  }
};