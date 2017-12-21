/**
 * Created by Armaldio on 11/12/2017.
 */

const Command = require('../api/Command');
const CONSTANTS = require('../constants');
const request = require('request');
const Raven = require('raven');

module.exports = class say extends Command
{
    constructor (client) {
        super(client, {
            name: 'say',
            description: 'Output text or embed inside a specific channel as Alfred',
            examples: [ 'say + json as attached file', 'say Hello everyone!' ],
            deleteCmd: true,
            permissions: {
                roles: [ CONSTANTS.ROLES.STAFF ],
                channels: [ CONSTANTS.CHANNELS.ANY ]
            },
            extraArgs: true,
            args: [
                {
                    key: 'channel',
                    prompt: 'The channel where to post the message',
                    type: 'channel'
                }
            ]
        });
    }

    run (msg, {channel, _extra}) {
        // exactly one attachment
        if (msg.attachments.array().length === 1) {
            request(msg.attachments.first().url, (error, response, body) => {
                if (error) {
                    console.log(error);
                    msg.author.send('Sorry, there was an error with the embed file');
                    return;
                }

                console.log(msg.attachments.first().url);
                console.log('body', body);
                console.log('response', response);

                let json;
                try {
                    json = JSON.parse(body);
                } catch (e) {
                    console.log(e);
                    Raven.captureException(e);
                    msg.author.send('Sorry, there was an error with the embed file');
                    return;
                }

                if (_extra !== undefined) {
                    channel.send(_extra.join(' '), {embed: json});
                } else {
                    channel.send({embed: json});
                }
            });
        }
        // More than 1 attachment
        else if (msg.attachments.array().length > 1) {
            msg.author.send('Sorry, this command only support 1 attached JSON file');
        }
        // No attachments
        else if (msg.attachments.array().length <= 0) {
            channel.send(_extra.join(' '));
        }
    }
};