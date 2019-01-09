import { CommandoClient } from 'discord.js-commando';
import path from 'path';
import firebase from 'firebase';
import CONSTANTS from './constants.json';

// import Discord    from 'discord.js';
// import {RateLimiter} from 'limiter';
// import prettyms   from 'pretty-ms';

// const isDev = process.env.NODE_ENV === 'development';

const config = {
  apiKey: 'AIzaSyCwfY--Cp_9zrzxKBLpCAqCJUM8LT4fxQo',
  authDomain: 'construct2discord.firebaseapp.com',
  databaseURL: 'https://construct2discord.firebaseio.com',
  storageBucket: 'construct2discord.appspot.com',
  messagingSenderId: '271095494978',
};
firebase.initializeApp(config);

/*
const sms = require('free-mobile-sms-bot');

sms.on('sms:error', e => {
  console.info(e.code + ': ' + e.msg);
});

sms.on('sms:success', data => {
  console.info('Success! :D');
});
*/

const client = new CommandoClient({
  commandPrefix: '!',
  owner: CONSTANTS.OWNER,
  disableEveryone: true,
  unknownCommandResponse: false,
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['general', 'Commands available to everyone'],
    ['moderation', 'Commands available only to our staff members'],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, 'commands'));

const getConnectedUsers = () => {
  const guild = client.guilds.get(CONSTANTS.GUILD_ID);

  const guildMembers = guild.members;

  const connectedUsers = guildMembers.filter(member => (member.presence.status !== 'offline'));

  return connectedUsers.size;
};

const updateStatus = () => {
  const users = getConnectedUsers();
  client.user.setActivity(`${users} users`, {
    type: 'WATCHING',
  });
};

/* const isOnline = (id) => {
  const user = client.guilds.get(CONSTANTS.GUILD_ID).members.get(id);
  return (user.presence.status !== 'offline');
}; */

client
  .on('ready', () => {
    console.log('Logged in!');
    updateStatus();

    // bot.checkBlogsAndUpdates();
    // bot.updateMessage();
    // bot.checkNewPlugins();
  })
  .on('presenceUpdate', () => {
    updateStatus(client);
  })
  .on('unknownCommand', (message) => {
    message.reply('Alfred is currently in maintenance mode. Full features may not be available currently.');
  })
  .on('message', async (message) => {
    // Send sms to me when mentionning and not online
    /* if (message.mentions.users.exists('id', CONSTANTS.OWNER) || message.content.toLowerCase()
      .includes('armaldio')) {
      if (!isOnline(CONSTANTS.OWNER)) {
        const text =
          `[DISCORD] #${message.channel.name} @${message.author.username}
          said: ${message.content.trim()}`;
        sms.account(95222614, 'OWoVbMFNlat344');
        sms.send(encodeURIComponent(text));
      }
    } */

    /*
    try {
      if (message.webhookID === null && message.channel.id === CONSTANTS.CHANNELS.JOBOFFERS) {
        const msgText = message.content;
        const owner = message.author;
        owner.send(`Posting in <#${message.channel.id}> is retricted. Please use the following form: https://cc_jobs.armaldio.xyz/#/new?user=${owner.id}`, {
          embed: {
            title: 'Your previous message:',
            description: msgText,
          },
        });
        await message.delete();
      } else {
        await client.parse(message);
      }
    } catch (err) {
      console.log(err);
    }
    */

    try {
      if (
        message.webhookID === null
        && message.author.id !== CONSTANTS.BOT.ID
        && message.channel.id === CONSTANTS.CHANNELS.CREATIONCLUB
      ) {
        const owner = message.author;
        owner.send('**Join the Construct Creation Club by visiting the following link:** https://lnk.armaldio.xyz/WebCreationClub');
        await message.delete();
      }
    } catch (err) {
      console.log(err);
    }
  })
  .on('disconnect', (closeEvent) => {
    console.info('BOT DISCONNECTING');
    console.info('Close Event : ', closeEvent);
  });

client.login(CONSTANTS.BOT.TOKEN);
