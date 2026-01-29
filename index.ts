import * as dotenv from 'dotenv';
dotenv.config();

import { Command, CommandoClient } from 'discord.js-commando';
import path from 'path';
import {
	checkC3Updates,
	checkBlogPosts,
	checkForNotificationBot,
	checkToolsHasLink,
	checkForNewUsers,
	addReactions,
	checkJobOffers,
	crossPost,
} from './bot-utils';
import CONSTANTS from './constants';
import { Intents, TextChannel, Client } from 'discord.js';

const isDev = process.env.NODE_ENV === 'development';
console.log('isDev', isDev);

const intents = new Intents([
	Intents.NON_PRIVILEGED,
	'GUILD_MEMBERS',
	'GUILD_PRESENCES',
]);

console.log('commandPrefix:', isDev ? '.' : '!');

let client = new CommandoClient({
	commandPrefix: isDev ? '.' : '!',
	owner: CONSTANTS.OWNER,
	// @ts-expect-error
	ws: { intents },
	fetchAllMembers: true,
}) as CommandoClient;

process.on('uncaughtException', (err) => {
	console.log(`Caught exception: ${err}`);
	(client as Client).channels.cache
		.get(CONSTANTS.CHANNELS.MODERATORS)
		?.send('Uncaugh exception', err.toString());
	process.exit(1);
});

const getConnectedUsers = async () => {
	try {
		const guild = await client.guilds.fetch(CONSTANTS.GUILD_ID);
		const guildMembers = guild.members;
		const members = await guildMembers.fetch();
		const connectedUsers = members.filter(
			(member) => member.presence.status !== 'offline'
		);

		return connectedUsers.size;
	} catch (e) {
		console.error('error', e);
		return 0;
	}
};

const updateStatus = async () => {
	const users = await getConnectedUsers();
	await client.user.setActivity(`with ${users} members`, {
		type: 'PLAYING',
	});
};

client
	.on('error', (e) => {
		console.error(e);
	})
	.on('warn', console.warn);

client
	// @ts-ignore
	.on('commandError', (cmd: Command, err: Error) => {
		console.error(err);
		// if (err instanceof Commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlock', (msg, reason) => {
		console.log(`
      Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
      blocked; ${reason}`);
	})
	.on('commandRun', (msg, cmd) => {
		console.log(`
      Command ${cmd.groupID}:${cmd.memberName}
      ran in ${msg.guild ? `guild ${msg.guild.name} (${msg.guild.id})` : 'DMs'}.`);
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

		await updateStatus();

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
	// @ts-ignore
	.on('commandRegister', async (a) => {
		console.log('command', a.name, 'registered');
	})
	.on('guildMemberAdd', async (member) => {
		await member.roles.add('588420010574086146'); // @Member
	})
	.on('guildMemberUpdate', async (oldMember, newMember) => {
		if (
			(newMember.premiumSinceTimestamp &&
				oldMember.premiumSinceTimestamp &&
				oldMember.premiumSinceTimestamp !== newMember.premiumSinceTimestamp) || // updating nitro
			(!oldMember.premiumSinceTimestamp && newMember.premiumSinceTimestamp) // just getting nitro
		) {
			const channel = (await client.channels.fetch(
				CONSTANTS.CHANNELS.COMMUNITY_ANNOUNCEMENTS
			)) as TextChannel;
			await channel.send(
				`<:purple_heart:768584412514222172> **Thanks** <@${newMember.id}> for **Nitro Boosting** the Server!`
			);
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

		await checkForNotificationBot(message);
		await checkForNewUsers(message);
		await checkToolsHasLink(message);
		await checkJobOffers(message);
		await crossPost(message);

		if (
			message.webhookID &&
			message.channel.id === CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS
		) {
			await addReactions(message, 'server_news');
		}

		try {
			if (
				message.webhookID === null &&
				message.author.id !== process.env.ID &&
				message.channel.id === CONSTANTS.CHANNELS.CREATIONCLUB
			) {
				const owner = message.author;
				await owner.send(
					'**Join the Construct Creation Club by visiting the following link:** https://lnk.armaldio.xyz/ConstructCommunity'
				);
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
		help: true,
		prefix: isDev,
		eval: false,
		ping: true,
		unknownCommand: false,
		commandState: isDev,
	})
	.registerGroups([
		['everyone', 'Commands available to everyone'],
		['moderation', 'Commands available only to our staff members'],
	]);

const dir = path.join(__dirname, 'commands', 'everyone');

console.log('registering commands in', dir);

client.registry.registerCommandsIn({
	dirname: path.join(__dirname, 'commands', 'everyone'),
});
client.registry.registerCommandsIn({
	dirname: path.join(__dirname, 'commands', 'moderation'),
});

client.login(process.env.TOKEN);
