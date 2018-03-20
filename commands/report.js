/**
 * Created by Armaldio on 11/12/2017.
 */

const Command   = require('../api/Command');
const CONSTANTS = require('../constants');
const doy       = require('day-of-year');

const isDev = process.env.NODE_ENV === 'development';

module.exports = class report extends Command {
    constructor (client, database) {
        super(client, {
            name       : 'report',
            description: 'Anonymously report an individual to the CCStaff for breaking a rule.',
            examples   : ['report @user1 [optional: reason]'],
            extraArgs  : true,
            deleteCmd  : true,
            args       : [{
                key   : 'user',
                prompt: 'The user you want to report',
                type  : 'user'
            }],
            permissions: {
                roles   : [CONSTANTS.ROLES.ANY],
                channels: [CONSTANTS.CHANNELS.ANY]
            }
        }, database);
    }

    timeStamp () {
        // Create a date object with the current time
        var now = new Date();

        // Create an array with the current month, day and time
        var date = [now.getDate(), now.getMonth() + 1, now.getFullYear()];

        // Create an array with the current hour, minute and second
        var time = [now.getHours(), now.getMinutes(), now.getSeconds()];

        // Determine AM or PM suffix based on the hour
        var suffix = (time[0] < 12) ? 'AM' : 'PM';

        // Convert hour from military time
        time[0] = (time[0] < 12) ? time[0] : time[0] - 12;

        // If hour is 0, set it to 12
        time[0] = time[0] || 12;

        // If seconds and minutes are less than 10, add a zero
        for (var i = 1; i < 3; i++) {
            if (time[i] < 10) {
                time[i] = '0' + time[i];
            }
        }

        // Return the formatted string
        return date.join('/') + ' ' + time.join(':') + ' ' + suffix;
    }

    async run (msg, {user, _extra}) {
        if (user.id === CONSTANTS.OWNER || user.id === '168340128622706688' || user.id === msg.author.id || user.id === '172002275412279296' || user.id === '115385224119975941') {
            msg.author.send('Whoops! The user you\'ve tried to report doesn\'t exist or left the server.');
        } else {

            let _ = await msg.author.send('Your report has been submitted and will be reviewed by a staff member shortly! (Please note that wrong or malicious reporting might result in a permanent block from using this command.)');

            let _messages = await msg.channel.fetchMessages({
                limit : 10,
                before: msg.id
            });
            _messages = _messages.array();

            let fields= [];
            for (let i = 0; i < _messages.length; i++) {
                let message = _messages[i];
                fields.push({
                    'name' : message.author.username,
                    'value': message.content === "" ? "[NO CONTENT]" : "        " + message.content
                })
            }

            _ = await msg.guild.channels.get(isDev ? CONSTANTS.CHANNELS.DEVCHANNEL : CONSTANTS.CHANNELS.MODERATORS)
                         .send(`**${msg.author.username}** just reported **${user.username}** inside **<#${msg.channel.id}>** at **${this.timeStamp()}** (reason: **${_extra === undefined ? '[No reason]' : _extra.split(',').join(' ')}**). <@&${CONSTANTS.ROLES.STAFF}> A manual review is required!`, {
                             embed: {
                                 'description': CONSTANTS.MESSAGE.EMPTY,
                                 'title'      : 'Context:',
                                 'color'      : 15844367,
                                 'fields'     : fields
                             }
                         });
        }
    }
};