/**
 * Created by Armaldio on 11/12/2017.
 */

const path = require('path');
const CONSTANTS = require('./constants.json');
const Bot = require('./discord.js-cmd/Bot');

const bot = new Bot({
    commandPrefix: '!',
    owner: '107180621981298688',
    disableEveryone: true
});

let getConnectedUsers = function () {
    const guild = bot.guilds.get(CONSTANTS.GUILD_ID);

    const guildMembers = guild.members;

    const connectedUsers = guildMembers.filter(member => {
        return (member.presence.status !== 'offline');
    });

    return connectedUsers.size;
};

let updateStatus = function () {
    const users = getConnectedUsers();
    bot.user.setPresence({
        game: {
            name: `with ${users} users`
        }
    });
};

process.on('uncaughtException', err => {
    console.info('Uncaugh');
    console.info('Caught exception: ' + err);
    console.info('Stack : ', err.stack);
    bot.emit('disconnect', {
        code: 1000,
        reason: 'Process: Uncaught exception',
        wasClean: true
    });
    process.exit();
});

bot
    .on('presenceUpdate', (oldMember, newMember) => {
        updateStatus();
    })
    .on('message', message => {
        bot.parse(message);
    })
    .on('disconnect', closeEvent => {
        console.info('BOT DISCONNECTING');
        bot.login(CONSTANTS.BOT_TOKEN);
        console.info('Close Event : ', closeEvent);
    })
    .on('ready', () => {
        console.log('Logged in!');
        updateStatus();
    });

bot.login(CONSTANTS.BOT_TOKEN);
