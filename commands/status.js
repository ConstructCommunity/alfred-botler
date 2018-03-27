/**
 * Created by Armaldio on 11/12/2017.
 */

const Command     = require('../api/Command');
const CONSTANTS   = require('../constants');
const request     = require('request');
const Raven       = require('raven');
const WebSocket   = require('ws');
const isReachable = require('is-reachable');

module.exports = class status extends Command {
    constructor (client) {
        super(client, {
            name       : 'status',
            description: 'Output the current status of the Scirra websites',
            examples   : ['status'],
            deleteCmd  : true,
            permissions: {
                roles   : [CONSTANTS.ROLES.ANY],
                channels: [CONSTANTS.CHANNELS.ALFRED_COMMANDS]
            },
            rate       : { //1 per 5 min
                allow: 1,
                every : 300000
            },
            extraArgs  : false,
            args       : [
                /*{
                    key: 'channel',
                    prompt: 'The channel where to post the message',
                    type: 'channel'
                }*/
            ]
        });
    }

    connect (url_) {
        const SIGNALLING_WEBSOCKET_PROTOCOL = 'c2multiplayer';

        return new Promise((resolve, reject) => {
            const ws = new WebSocket(url_, {protocol: SIGNALLING_WEBSOCKET_PROTOCOL});
            ws.on('open', event => {
                resolve(true);
            });
            ws.on('error', event => {
                // console.info(event);
                resolve(false);
            });
        });
    }

    async run (msg) {
        let signalling = await this.connect('wss://multiplayer.scirra.com');
        let scirra     = await isReachable('https://www.scirra.com');
        let construct  = await isReachable('https://www.construct.net');

        let status = [signalling, scirra, construct];
        let online = 0;
        status.forEach(v => v ? online++ : v);

        if (online === status.length) {
            msg.channel.send({
                embed: {
                    'description': 'All services are online and running.',
                    'color'      : 52480,
                    'footer'     : {
                        'text': 'Status-Checker made by Armaldio • Donations: https://go.armaldio.xyz/donation'
                    },
                    'thumbnail'  : {
                        'url': 'https://cdn.discordapp.com/attachments/244447929400688650/328699716563107840/WATCHERiconsmall.png'
                    },
                    'author'     : {
                        'name'    : 'STATUS CHECKED, EVERYTHING IS ONLINE!',
                        'icon_url': 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
                    },
                    'fields'     : [
                        {
                            'name' : '──────────────────────────────────',
                            'value': 'ᅠ'
                        },
                        {
                            'name' : 'Scirra.com (Website):',
                            'value': 'Status: **ONLINE ✓**'
                        },
                        {
                            'name' : 'Construct.net (Website):',
                            'value': 'Status: **ONLINE ✓**'
                        },
                        {
                            'name' : 'Signaling Server (Multiplayer):',
                            'value': 'Status: **ONLINE ✓**'
                        },
                        {
                            'name' : 'ᅠ',
                            'value': '──────────────────────────────────'
                        }
                    ]
                }
            });
        } else {
            msg.channel.send({
                embed: {
                    'description': `Downtime detected, only ${online}/3 services are online and running.`,
                    'color'      : 16719647,
                    'footer'     : {
                        'text': 'Status-Checker made by Armaldio • Donations: https://go.armaldio.xyz/donation'
                    },
                    'thumbnail'  : {
                        'url': 'https://cdn.discordapp.com/attachments/244447929400688650/328699716563107840/WATCHERiconsmall.png'
                    },
                    'author'     : {
                        'name'    : 'STATUS CHECKED, SOME SERVICES ARE DOWN!',
                        'icon_url': 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
                    },
                    'fields'     : [
                        {
                            'name' : '──────────────────────────────────',
                            'value': 'ᅠ'
                        },
                        {
                            'name' : 'Scirra.com (Website):',
                            'value': `Status: **${scirra ? 'ONLINE ✓' : 'OFFLINE ✘'}**`
                        },
                        {
                            'name' : 'Construct.net (Website):',
                            'value': `Status: **${construct ? 'ONLINE ✓' : 'OFFLINE ✘'}**`
                        },
                        {
                            'name' : 'Signaling Server (Multiplayer):',
                            'value': `Status: **${signalling ? 'ONLINE ✓' : 'OFFLINE ✘'}**`
                        },
                        {
                            'name' : 'ᅠ',
                            'value': '──────────────────────────────────'
                        }
                    ]
                }
            });
        }
    }
};