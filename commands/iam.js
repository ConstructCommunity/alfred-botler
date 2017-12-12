/**
 * Created by Armaldio on 11/12/2017.
 */

const Command = require('../discord.js-cmd/command');
const roles = {
    /*    artist: '166557768193540096',
        programmer: '256383286211772416',
        dev: '256383286211772416',
        expert: '166557865115516928',
        sounddesigner: '258691772430024704',
        gamedesigner: '378168474649755648'*/
    artist: '389712042485088256',
    dev: '389712085157937153'
};

module.exports = class iam extends Command
{
    constructor (client) {
        super(client, {
            name: 'iam',
            description: 'Add or remove a user from a role',
            examples: [ '/iam dev', '/iam artist' ],
            extraArgs: true,
            args: [
                {
                    key: 'role',
                    prompt: 'What role do you want ?',
                    type: 'string'
                }
            ]
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

            case 'a dog':
                return msg.reply('You should ask <@155322717422354432> to be sure');
            default:
                if (typeof roles[ role ] === 'undefined') {
                    return msg.reply('Sorry, this role is invalid');
                } else if (msg.member.roles.has(roles[ role ])) {
                    msg.member.removeRole(roles[ role ]);
                    return msg.channel.send({
                        embed: {
                            'description': 'ᅠ',
                            'color': 15844367,
                            'footer': {
                                'text': '(Request custom roles by mentioning or PMing a staff member!)'
                            },
                            'thumbnail': {
                                'url': 'https://cdn.discordapp.com/attachments/244447929400688650/331776445955309568/ROLEREMiconsmall.png'
                            },
                            'author': {
                                'name': `YOU NO LONGER HAVE THE ${role.toUpperCase()} ROLE!`,
                                'icon_url': 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
                            },
                            'fields': [
                                {
                                    'name': 'Available Roles:',
                                    'value': 'artist, programmer, expert, sounddesigner, gamedesigner.'
                                }
                            ]
                        }
                    });
                } else {
                    msg.member.addRole(roles[ role ]);
                    return msg.channel.send({
                        embed: {
                            'description': 'ᅠ',
                            'color': 15844367,
                            'footer': {
                                'text': '(Request custom roles by mentioning or PMing a staff member!)'
                            },
                            'thumbnail': {
                                'url': 'https://cdn.discordapp.com/attachments/244447929400688650/331776445947052042/ROLEGETiconsmall.png'
                            },
                            'author': {
                                'name': `YOU NOW HAVE THE ${role.toUpperCase()} ROLE!`,
                                'icon_url': 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
                            },
                            'fields': [
                                {
                                    'name': 'Available Roles:',
                                    'value': 'artist, programmer, expert, sounddesigner, gamedesigner.'
                                }
                            ]
                        }
                    });
                }
        }
    }
};