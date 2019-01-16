import { CommandoClient } from 'discord.js-commando';
import path from 'path';
import { checkC3Updates, checkC2Updates, checkBlogPosts } from './bot-utils';
import CONSTANTS from './constants';
import Socket from './socket';

const isDev = process.env.NODE_ENV === 'development';
let socket = null;

const client = new CommandoClient({
  commandPrefix: '!',
  owner: CONSTANTS.OWNER,
  disableEveryone: false,
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

  // socket.updateUsers();
};

/* const isOnline = (id) => {
  const user = client.guilds.get(CONSTANTS.GUILD_ID).members.get(id);
  return (user.presence.status !== 'offline');
}; */


client
  .on('ready', async () => {
    console.log('Logged in!');

    const sock = new Socket(client);
    socket = await sock.connect();

    updateStatus();

    if (!isDev) {
      // checkC3Updates(client);
      setInterval(() => checkC3Updates(client), 600000);

      // checkC2Updates(client);
      setInterval(() => checkC2Updates(client), 600000);

      // checkBlogPosts(client);
      setInterval(() => checkBlogPosts(client), 600000);
    }
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
        && message.author.id !== process.env.ID
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

client.login(process.env.TOKEN);
