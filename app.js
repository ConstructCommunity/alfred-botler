/**
 * Created by Armaldio on 11/12/2017.
 */

const Discord = require('discord.js');
const path = require('path');
const CONSTANTS = require('./constants.json');
const Bot = require('./discord.js-cmd/Bot');

const client = new Discord.Client({autoReconnect: true});

const bot = new Bot({
    commandPrefix: '!',
    owner: '107180621981298688',
    disableEveryone: true,
    client: client
});

let getConnectedUsers = function () {
    const guild = client.guilds.get(CONSTANTS.GUILD_ID);

    const guildMembers = guild.members;

    const connectedUsers = guildMembers.filter(member => {
        return (member.presence.status !== 'offline');
    });

    return connectedUsers.size;
};

let updateStatus = function () {
    const users = getConnectedUsers();
    client.user.setPresence({
        game: {
            name: `with ${users} users`
        }
    });
};

client
    .on('presenceUpdate', (oldMember, newMember) => {
        updateStatus();
    })
    .on('message', message => {
        bot.parse(message);
    })
    .on('ready', () => {
        console.log('Logged in!');
        updateStatus();
    });

client.login('Mzg5NTU5MTU5MDc2NDIxNjMz.DQ9U4Q.kQNDk_e_xmSSgpyQmj8103Meto4');
