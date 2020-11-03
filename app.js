import Commando, { CommandoClient } from 'discord.js-commando';
import path from 'path';
import {
  checkC3Updates, checkC2Updates, checkBlogPosts, checkMessageForSafety,
  checkForNotificationBot, checkToolsHasLink, checkForNewUsers, addReactions,
} from './bot-utils';
import CONSTANTS from './constants';
import rollbar from './rollbar';
// import Socket from './socket';

const isDev = process.env.NODE_ENV === 'development';
console.log('isDev', isDev);
// let socket = null;

let client = new CommandoClient({
  commandPrefix: isDev ? '.' : '!',
  owner: CONSTANTS.OWNER,
});

process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`);
  client.channels.cache
    .get(CONSTANTS.CHANNELS.MODERATORS)
    .send('Uncaugh exception', err.toString());
  process.exit(1);
});

const getConnectedUsers = () => {
  const guild = client.guilds.cache.get(CONSTANTS.GUILD_ID);

  const guildMembers = guild.members;

  const connectedUsers = guildMembers.cache.filter((member) => (member.presence.status !== 'offline'));

  return connectedUsers.size;
};

const updateStatus = async () => {
  const users = getConnectedUsers();
  await client.user.setActivity(`with ${users} members`, {
    type: 'PLAYING',
  });
};

/* const isOnline = (id) => {
  const user = client.guilds.get(CONSTANTS.GUILD_ID).members.get(id);
  return (user.presence.status !== 'offline');
}; */

client
  .on('error', (e) => {
    rollbar.error(e);
  })
  .on('warn', console.warn);

if (isDev) {
  client = client.on('debug', console.log);
}

client.on('reconnecting', () => {
  console.warn('Reconnecting...');
})
  .on('commandError', (cmd, err) => {
    rollbar.error(err);
    // if (err instanceof Commando.FriendlyError) return;
    console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
  })
  .on('commandBlocked', (msg, reason) => {
    console.log(`
      Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
      blocked; ${reason}`);
  })
  .on('commandPrefixChange', (guild, prefix) => {
    console.log(`
      Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
      ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
  })
  .on('commandStatusChange', (guild, command, enabled) => {
    console.log(`
      Command ${command.groupID}:${command.memberName}
      ${enabled ? 'enabled' : 'disabled'}
      ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
  })
  .on('groupStatusChange', (guild, group, enabled) => {
    console.log(`
      Group ${group.id}
      ${enabled ? 'enabled' : 'disabled'}
      ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
  })

  .on('ready', async () => {
    console.log('Logged in!');

    /* const sock = new Socket(client);
    sock.connect(); */

    await updateStatus();

    if (!isDev) {
      setInterval(() => checkC3Updates(client), 600000);

      setInterval(() => checkC2Updates(client), 600000);

      setInterval(() => checkBlogPosts(client), 600000);
    } else {
      await checkC3Updates(client);
      await checkC2Updates(client);
      await checkBlogPosts(client);
    }
  })
  .on('presenceUpdate', async () => {
    await updateStatus(client);
  })
  .on('guildMemberAdd', async (member) => {
    const role = await member.roles.add('588420010574086146'); // @Member
  })
  .on('guildMemberUpdate', async (oldMember, newMember) => {
    if (oldMember.premiumSince !== newMember.premiumSince) {
      client.channels.cache
        .get(CONSTANTS.CHANNELS.COMMUNITY_ANNOUNCEMENTS)
        .send(`<:purple_heart:768584412514222172> Thanks <@${newMember.id}> for Nitro Boosting the Server!`);
    }
  })
  .on('message', async (message) => {
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

    await checkMessageForSafety(message);

    await checkForNotificationBot(message);
    await checkForNewUsers(message);
    await checkToolsHasLink(message);

    if (
      message.webhookID && message.channel.id === CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS
    ) {
      await addReactions(message, 'server_news');
    }

    try {
      if (
        message.webhookID === null
      && message.author.id !== process.env.ID
      && message.channel.id === CONSTANTS.CHANNELS.CREATIONCLUB
      ) {
        const owner = message.author;
        await owner.send('**Join the Construct Creation Club by visiting the following link:** https://lnk.armaldio.xyz/WebCreationClub');
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

client.registry
  .registerDefaultGroups()
  .registerDefaultTypes()
  .registerDefaultCommands({
    help: false,
    prefix: false,
    eval: false,
    ping: true,
    unknownCommand: false,
    commandState: false,
  })
  .registerGroups([
    ['test', 'Commands available only for testing'],
    ['everyone', 'Commands available to everyone'],
    ['moderation', 'Commands available only to our staff members'],
  ]);

// if (isDev) {
// client.registry.registerCommandsIn(path.join(__dirname, 'commands', 'test'));
// } else {
client.registry.registerCommandsIn(path.join(__dirname, 'commands', 'everyone'));
client.registry.registerCommandsIn(path.join(__dirname, 'commands', 'moderation'));
// }

client.login(process.env.TOKEN);
