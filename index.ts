import {
	Client,
	GatewayIntentBits,
	TextChannel,
	ActivityType,
	Partials,
	Collection,
	Events,
} from 'discord.js';
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
import { commandsList } from './commands';

const isDev = process.env.NODE_ENV === 'development';
console.log('isDev', isDev);

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel],
});

const commands = new Collection<string, any>();

for (const command of commandsList) {
	commands.set(command.data.name, command);
}

process.on('uncaughtException', (err) => {
	console.log(`Caught exception: ${err}`);
	const channel = client.channels.cache.get(CONSTANTS.CHANNELS.MODERATORS);
	if (channel && channel.isTextBased()) {
		// @ts-ignore
		channel.send(`Uncaught exception: ${err.toString()}`);
	}
	process.exit(1);
});

// ... (getConnectedUsers and updateStatus) ...

const getConnectedUsers = async () => {
	try {
		const guild = await client.guilds.fetch(CONSTANTS.GUILD_ID);
		// Use cached members. With GuildPresences intent, we should receive updates.
		// Fetching all members triggers Opcode 8 and rate limits if done frequently.
		const connectedUsers = guild.members.cache.filter(
			(member) =>
				member.presence?.status !== 'offline' &&
				member.presence?.status !== undefined
		);

		return connectedUsers.size;
	} catch (e) {
		console.error('error', e);
		return 0;
	}
};

const updateStatus = async () => {
	const users = await getConnectedUsers();
	client.user?.setActivity(`with ${users} members`, {
		type: ActivityType.Playing,
	});
};

client
	.on('error', (e) => {
		console.error(e);
	})
	.on('warn', console.warn);

client.on('clientReady', async () => {
	console.log('Logged in!');

	// Fetch members once on startup to populate cache if needed
	try {
		const guild = await client.guilds.fetch(CONSTANTS.GUILD_ID);
		await guild.members.fetch();
	} catch (e) {
		console.error('Failed to fetch members on ready:', e);
	}

	await updateStatus();

	// Update status periodically instead of on every presence update
	setInterval(() => updateStatus(), 600000); // Every 10 minutes

	if (!isDev) {
		setInterval(() => checkC3Updates(client), 600000);

		setInterval(() => checkBlogPosts(client), 600000);
	} else {
		await checkC3Updates(client);
		await checkBlogPosts(client);
	}
});

// client.on('presenceUpdate', async () => {
// 	await updateStatus();
// });

client.on('guildMemberAdd', async (member) => {
	await member.roles.add('588420010574086146'); // @Member
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
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
});

client.on('messageCreate', async (message) => {
	await checkForNotificationBot(message);
	await checkForNewUsers(message);
	await checkToolsHasLink(message);
	await checkJobOffers(message);
	await crossPost(message);

	if (
		message.webhookId &&
		message.channel.id === CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS
	) {
		await addReactions(message, 'server_news');
	}

	try {
		if (
			message.webhookId === null &&
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
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	}
});

client.login(process.env.TOKEN);
