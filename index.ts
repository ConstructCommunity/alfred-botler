import 'source-map-support/register'

import * as dotenv from "dotenv";
dotenv.config();

import Commando, { Command, CommandoClient } from 'discord.js-commando';
import path from 'path';
import {
  checkC3Updates, checkBlogPosts, checkMessageForSafety,
	checkForNotificationBot, checkToolsHasLink, checkForNewUsers, addReactions,
	checkJobOffers,
	crossPost,
} from './bot-utils';
import CONSTANTS from './constants';
import rollbar from './rollbar';
import { Intents, TextChannel, CommandInteractionOption, ApplicationCommandData, ApplicationCommandOptionData } from 'discord.js';
import { scheduler } from './schedule'

const isDev = process.env.NODE_ENV === 'development';
console.log('isDev', isDev);

const intents = new Intents([
	Intents.NON_PRIVILEGED,
	"GUILD_MEMBERS",
	"GUILD_PRESENCES"
]);

console.log('commandPrefix:', isDev ? '.' : '!')

let client = new CommandoClient({
  commandPrefix: isDev ? '.' : '!',
	owner: CONSTANTS.OWNER,
	intents: intents,
});

process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`);
	const channel = client.channels.cache.get(CONSTANTS.CHANNELS.MODERATORS)
	if (channel.isText()) {
		channel.send('Uncaugh exception' + err.toString());
	}
  process.exit(1);
});

const getConnectedUsers = async () => {
	try {
		const guild = await client.guilds.fetch(CONSTANTS.GUILD_ID);
		const guildMembers = guild.members;
		const members = await guildMembers.fetch()
    const connectedUsers = members.filter((member) => (member.presence.status !== 'offline'));

		return connectedUsers.size;
	} catch (e) {
		console.error('error', e)
		return 0
	}
};

const updateStatus = async () => {
	const users = await getConnectedUsers();
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
  // client = client.on('debug', console.log);
}
const commands: ApplicationCommandData[] = []

client
	// @ts-ignore
  .on('commandError', (cmd: Command, err: Error) => {
    rollbar.error(err);
    // if (err instanceof Commando.FriendlyError) return;
    console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
  })
  .on('commandBlock', (msg, reason) => {
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

	.on('applicationCommandCreate', () => {

	})
	.on('applicationCommandDelete', () => {

	})
	.on('applicationCommandUpdate', () => {

	})

  .on('ready', async () => {
    console.log('Logged in!');


		try {
			const result = await client.guilds.cache.get(CONSTANTS.GUILD_ID).commands.set(commands);
			// console.log('result', result)
		} catch (e) {
			console.error(e)
		}
    // for await (const command of commands) {
		// 	console.log('registering', command)
    // }
		await updateStatus();

		scheduler.setClient(client)
		await scheduler.fetchSchedules()

    if (!isDev) {
      setInterval(() => checkC3Updates(client), 600000);

      setInterval(() => checkBlogPosts(client), 600000);
    } else {
      await checkC3Updates(client);
      await checkBlogPosts(client);
    }
  })
  .on('presenceUpdate', async () => {
    await updateStatus();
	})
	.on('commandRegister', async (_command) => {
		if (['moderation', 'everyone'].includes(_command.groupID)) {
			// console.log('Command', _command.name)

			const options: ApplicationCommandOptionData[] = []
      _command.argsCollector.args.forEach(arg => {
        // console.log('arg.type.id', arg.type.id.toUpperCase())
				const option: ApplicationCommandOptionData = {
					name: arg.key,
					description: arg.label,
					type: arg.type.id.toUpperCase(),
					required: arg.default === null
				}
				console.log('arg.choices', arg.choices)
				if (arg.choices) {
					arg.choices.forEach(({ name, value }) => {
						option.choices.push({
							name, value
						})
					})
				}

				// console.log('option', option)
				options.push(option)
			})
			const command: ApplicationCommandData = {
				name: _command.name,
				description: _command.description,
				options
			}
			// console.log('command', command)
			commands.push(command)
		}
  })
  .on('guildMemberAdd', async (member) => {
    const role = await member.roles.add('588420010574086146'); // @Member
  })
  .on('guildMemberUpdate', async (oldMember, newMember) => {
    if (
			(
				(newMember.premiumSinceTimestamp && oldMember.premiumSinceTimestamp) &&
				(oldMember.premiumSinceTimestamp !== newMember.premiumSinceTimestamp) // updating nitro
			) ||
				(!oldMember.premiumSinceTimestamp && newMember.premiumSinceTimestamp) // just getting nitro
			) {
      console.log('oldMember.premiumSinceTimestamp', oldMember.premiumSinceTimestamp, oldMember.displayName)
      console.log('newMember.premiumSinceTimestamp', newMember.premiumSinceTimestamp, newMember.displayName)
      const channel = await client.channels.fetch(CONSTANTS.CHANNELS.COMMUNITY_ANNOUNCEMENTS) as TextChannel
			await channel.send(`<:purple_heart:768584412514222172> **Thanks** <@${newMember.id}> for **Nitro Boosting** the Server!`);
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
    await checkJobOffers(message);
		await crossPost(message)

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
        await owner.send('**Join the Construct Creation Club by visiting the following link:** https://lnk.armaldio.xyz/ConstructCommunity');
        await message.delete();
      }
    } catch (err) {
      console.log(err);
    }
	})
	// @ts-ignore
  .on('disconnect', (closeEvent) => {
    console.info('BOT DISCONNECTING');
    console.info('Close Event : ', closeEvent);
  });

client.registry
  .registerDefaultGroups()
  .registerDefaultTypes()
  .registerDefaultCommands({
    help: false,
    prefix: isDev,
    eval: false,
    ping: true,
    unknownCommand: false,
    commandState: isDev,
  })
  .registerGroups([
    ['test', 'Commands available only for testing'],
    ['everyone', 'Commands available to everyone'],
    ['moderation', 'Commands available only to our staff members'],
  ]);

if (isDev) {
	client.registry.registerCommandsIn({
		dirname: path.join(__dirname, 'commands', 'test'),
	});
}
client.registry.registerCommandsIn({
	dirname: path.join(__dirname, 'commands', 'everyone'),
});
client.registry.registerCommandsIn({
	dirname: path.join(__dirname, 'commands', 'moderation'),
});

client.login(process.env.TOKEN);
