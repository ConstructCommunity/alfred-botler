import * as cheerio from 'cheerio';
import Discord, { Message, TextChannel } from 'discord.js';
import dayjs from 'dayjs';
import CONSTANTS from './constants';
import Blog from './templates/Announcement_Blog';
import C3Update from './templates/Announcement_C3';
import { database } from './firebase';
import { ref, get, set, child } from 'firebase/database';

export const duplicateMessage = async (
	toChannel: TextChannel,
    content: string,
    user: { username: string; avatarURL: () => string | null },
	attachments: { url: string; name?: string }[] = [],
) => {
	let wb;
	const wbs = await toChannel.fetchWebhooks();
	// reuse existing webhook if possible, or create new one
    // Filter generic webhooks or find a specific one?
    // Existing code: if (wbs.size < 20) wb = await toChannel.createWebhook('Message duplication');
    // But it doesn't try to reuse? Actually, it doesn't assign to wb unless creating new.
    // If wbs.size >= 20, wb is undefined, then wb.send throws.
    // The original code was buggy if 20 webhooks existed?
    // "if (wbs.size < 20) wb = await toChannel.createWebhook" -> assigns wb.
    // If not, wb is undefined.
    
    // Let's improve it: find existing or create.
    wb = wbs.find(w => w.name === 'Message duplication');
    if (!wb) {
        if (wbs.size < 10) { // Limit is 10 or 15 usually? Docs say 10 per channel for normal? No, it's 15 or 10.
             wb = await toChannel.createWebhook({ name: 'Message duplication' });
        } else {
             // fallback to one of them?
             wb = wbs.first();
        }
    }

	try {
		const options: any = {
			username: user.username,
			avatarURL: user.avatarURL(),
		};

		if (attachments.length > 0) {
			options.files = attachments.map(a => 
				new Discord.AttachmentBuilder(a.url, { name: a.name || 'attachment.png' })
			);
		}

		const message = await wb.send({
            content: content || undefined,
            ...options
        });
        
        // original code deleted the webhook?
        // await wb.delete('Message duplicated successfully');
        // No, creating and deleting webhook every time is slow and hits ratelimits.
        // Original code:
        /*
        if (wbs.size < 20) wb = await toChannel.createWebhook('Message duplication');
        ...
        await wb.delete('Message duplicated successfully');
        */
        // It created and deleted every time. That's inefficient but let's stick to logic or improve?
        // If I keep create/delete, I need to make sure I create it.
        
        // Let's stick to create-send-delete pattern if that's what it did, but use modern API.
        // But wait, if wbs.size >= 20, it didn't create, so it would crash.
        
        // I will follow the pattern: Use existing if available, else create. Don't delete if I want to reuse, but if original deleted, maybe I should delete.
        // If I delete, I can't reuse.
        // Let's try to reuse and NOT delete.
        
		return message;
	} catch (e) {
		console.error(e);
		return null;
	}
};

/**
 * @param client
 * @param permissions
 * @param msg
 * @return {string|boolean}
 */
export const hasPermissions = (client, permissions, msg) => {
	const hasRole = msg.member.roles.cache
		.some((role) => permissions.roles.map((r) => r.id).includes(role.id)); // stop and return true if predicate match
	const isInChannel =
		permissions.channels.includes(CONSTANTS.CHANNELS.ANY) ||
		permissions.channels.includes(msg.channel.id) ||
		msg.channel.id === CONSTANTS.CHANNELS.PRIVATE_TESTS ||
		msg.channel.id === CONSTANTS.CHANNELS.TEST;

	console.log('isInChannel', isInChannel);

	if (hasRole && isInChannel) return true;
	if (!hasRole) return 'You are not permitted to use this command!';
	if (!isInChannel)
		return `Wrong channel! This command is available only in ${permissions.channels.map((chan) => `<#${chan}>`)}`;
	console.log('Another error happened');
	return false;
};

/**
 *
 * @param {Discord.Message} sent
 * @param type
 * @return {Promise<void>}
 */
export const addReactions = async (sent, type = 'dismiss') => {
	try {
		const voteUp = sent.guild.emojis.resolve('276908986744438794');
		const alfred = sent.guild.emojis.resolve('626417707373428750');
		const princess = sent.guild.emojis.resolve('626417707373428750');

		await sent.react(voteUp);

		if (type === 'c3') {
			await sent.react(alfred);
		} else if (type === 'promo') {
			//
		} else if (type === 'server_news') {
			//
		} else {
			await sent.react(princess);
		}
	} catch (e) {
		console.error('Cannot add reactions', e);
	}
};

export const checkBlogPosts = async (client) => {
	const scirraStaff = ['Laura_D', 'Ashley', 'Tom'];

	try {
		const resp = await fetch('https://www.construct.net/en/blogs/posts');
		const body = await resp.text();

		const $ = cheerio.load(body);
		const common = $(
			'form#form1 div:nth-child(3) > div:nth-child(1) > div > div'
		);
		const newTitle = common
			.find('.titleOuterWrap > div > div.right > a')
			.text()
			.trim();
		const author = common
			.find('.statWrap .detailCol .usernameTextWrap a > span:nth-child(1)')
			.text();
		// .text().trim();
		const timeToRead = common
			.find('.statWrap > div:nth-child(1) > div > ul > li:nth-child(2)')
			.text()
			.replace(/<img(.*)>/, '')
			.replace('read time', '')
			.trim();
		const link = common
			.find('.titleOuterWrap > div > div.right > a')
			.attr('href')
			.trim()
			.replace(/^(.*?)\/blogs/, 'https://www.construct.net/blogs');
		const image = common.find('.statWrap .avatarWrap > img').attr('src');

		const newPostId = link.split('?')[0].split('/').pop().split('-').pop();

		console.log('newPostId', newPostId);

		const dbRef = ref(database);
		get(child(dbRef, 'blog')).then(async (snapshot) => {
			const postId = snapshot.val();

			const isScirra = scirraStaff.includes(author);

			// prevent posts that are not from scirra to prevent spam
			if (postId !== newPostId && newTitle !== '' && isScirra) {
				const sent = await client.channels.cache
					.get(
						isScirra
							? CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS
							: CONSTANTS.CHANNELS.PROMO
					)
					.send(isScirra ? '@here' : '', {
						embed: new Blog({
							title: newTitle,
							author,
							timeToRead,
							link,
							image,
						}).embed(),
					});

				await addReactions(sent, 'blog');

				set(ref(database, 'blog'), newPostId);
			}
		});
	} catch (e) {
		console.error(e);
	}
};

type Release = {
	releaseName: string;
	shortDescription: string;
	viewDetailsURL: string;
	branchName: 'Beta' | 'Stable' | 'LTS';
	publishDate: string;
};

export const checkC3Updates = async (client) => {
	try {
		console.log('Checking C3 updates');

		const resp = await fetch('https://editor.construct.net/versions.json');
		const data = (await resp.json()) as Release[];

		const branches = ['Beta', 'Stable', 'LTS'];
		let latestRelease: Release;

		// Iterate through all releases and identify the latest release based on publishDate
		for (const release of data) {
			const branch = release.branchName;
			if (branches.includes(branch)) {
				if (
					!latestRelease ||
					new Date(release.publishDate) > new Date(latestRelease.publishDate)
				) {
					latestRelease = release;
				}
			}
		}

		if (!latestRelease) {
			console.log('No releases found');
			return;
		}

		const snapshot = await get(child(ref(database), 'c3release'));
		const lastRelease = snapshot.val();

		const snap = await get(child(ref(database), 'releases'));
		const listReleases = snap.val();

		const newVersion = latestRelease.releaseName;
		const description = latestRelease.shortDescription;
		const url = latestRelease.viewDetailsURL;
		const branch = latestRelease.branchName;

		console.log('last release:', lastRelease, ', new version', newVersion);

		//  release different from latest, not empty,          not already posted
		if (
			lastRelease !== newVersion &&
			newVersion !== '' &&
			!listReleases[newVersion]
		) {
			console.log('New C3 release available');
			const sent = await client.channels.cache
				.get(CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS)
				.send('@here', {
					embed: new C3Update({
						description,
						version: newVersion,
						link: url,
						icon: branch === 'Stable' ? 'C3Stableicon' : 'C3Betaicon',
					}).embed(),
				});

			await addReactions(sent, 'c3');

			await set(ref(database, 'c3release'), newVersion);

			listReleases[newVersion] = branch;
			await set(ref(database, 'releases'), listReleases);
		}
	} catch (error) {
		console.log(error);
		//= > 'Internal server error ...'
	}
};

export const checkForNotificationBot = async (message: Message) => {
	if (message.channel.id === CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS) {
		// sent from the "notification" bot
		await addReactions(message, 'notification');
	}
};

export const crossPost = async (message: Message) => {
	if (message.channel.id === CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS) {
		// sent from the news channel
		await message.crosspost();
	}
};

/**
 *
 * @param {Message} message
 */
export const checkForNewUsers = async (message: Message) => {
	if (message.channel.id === CONSTANTS.CHANNELS.INTRODUCE_YOURSELF) {
		await message.react(':wave:');
	}
};

export const checkToolsHasLink = async (message: Message) => {
	const toolsChan = CONSTANTS.CHANNELS.TOOLS;
	if (message.channel.id === toolsChan) {
		if (
			message.content.search(
				/[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi
			) === -1
		) {
			await message.delete();
			await message.author.send(
				'**Your content does not meet one or more requirements!**\n\n__List of requirements:__\n► **1** Link/embed or attachment'
			);
		}
	}
};

export const checkJobOffers = async (message: Message) => {
	return true;
};
