import * as cheerio from "cheerio";
import Discord, { Message, TextChannel } from "discord.js";
import dayjs from "dayjs";
import rollbar from "./rollbar";
import CONSTANTS from "./constants";
import Blog from "./templates/Announcement_Blog";
import C3Update from "./templates/Announcement_C3";
import { database } from "./firebase";
import { ref, get, set, child } from "firebase/database";

// const isDev = process.env.NODE_ENV === 'development';

export const truncate = (str: string, max: number) =>
	str.length > max ? `${str.substring(0, max)}...` : str;

export const removeDuplicates = (arr: string[]): string[] =>
	arr.reduce((x, y) => (x.includes(y) ? x : [...x, y]), []);

export const duplicateMessage = async (
	msg: Message,
	toChannel: TextChannel,
	contentEditor: (str: string) => string,
	includeAttachments = true,
	customUser = msg.author,
) => {
	let wb;
	const wbs = await toChannel.fetchWebhooks();
	if (wbs.size < 20) wb = await toChannel.createWebhook("Message duplication");

	try {
		const options = {
			username: customUser.username,
			avatarURL: customUser.avatarURL(),
			embeds: undefined,
			files: undefined,
		};

		if (includeAttachments) {
			if (msg.embeds !== null) options.embeds = msg.embeds;
			if (msg.attachments.array().length > 0) {
				options.files = [
					new Discord.MessageAttachment(
						msg.attachments.first().url,
						msg.attachments.first().name,
					),
				];
			}
		}

		const message = await wb.send(contentEditor(msg.content || ""), options);
		await wb.delete("Message duplicated successfully");
		return message;
	} catch (e) {
		await wb.delete("Message not duplicated!");
		rollbar.error(e);
		console.error(e);
		return null;
	}
};

export const censor = async (msg: Message) => {
	console.log("match search: ", msg.content);

	// remove message in public channel
	await duplicateMessage(
		msg,
		msg.channel as TextChannel,
		() => "[Message removed by Alfred]",
		false,
	);

	// send a message to dm of author
	await msg.author.send(`Your message was removed because:
- You have to be a member for at least 24h before posting links
- You posted NSFW content or content with blacklisted words

If this is a false positive, please let the CCStaff know. We'll be happy to help.`);

	const bin = msg.guild.channels.cache.get(
		CONSTANTS.CHANNELS.BIN,
	) as TextChannel;

	// make a duplicate without removing initial message inside #bin
	bin.send("Censored message below:");
	bin.send(CONSTANTS.MESSAGE.SEPARATOR);
	await duplicateMessage(msg, bin, (content) => content);
	bin.send(CONSTANTS.MESSAGE.SEPARATOR);

	// delete the original message
	await msg.delete();
};

/**
 *
 * @param {Discord.Message} msg
 * @return {Promise<void>}
 */
export const checkMessageForSafety = async (msg: Message) => {
	if (msg.author.id === CONSTANTS.BOT) return;
	if (msg.webhookID !== null) return;
	if (!msg.member) return;
	// if (msg.channel.id !== CONSTANTS.CHANNELS.PRIVATE_TESTS) return;

	const t = dayjs().diff(dayjs(msg.member.joinedTimestamp), "hour");
	// URL && <6h inside the server
	if (
		t < 48 &&
		msg.content.match(/https?:\/\/(www\.)?.*\s/gim) &&
		msg.content.match(
			/(sex|gambling|porn|dating|service|essay|hentai|𝒸𝓊𝓂|cum|steancomunnity|dliscord|dlscord|disordgifts|discordn|nitro)\b/gim,
		)
	) {
		await censor(msg);
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
		.array()
		.some((role) => permissions.roles.map((r) => r.id).includes(role.id)); // stop and return true if predicate match
	const isInChannel =
		permissions.channels.includes(CONSTANTS.CHANNELS.ANY) ||
		permissions.channels.includes(msg.channel.id) ||
		msg.channel.id === CONSTANTS.CHANNELS.PRIVATE_TESTS ||
		msg.channel.id === CONSTANTS.CHANNELS.TEST;

	console.log("isInChannel", isInChannel);

	if (hasRole && isInChannel) return true;
	if (!hasRole) return "You are not permitted to use this command!";
	if (!isInChannel)
		return `Wrong channel! This command is available only in ${permissions.channels.map((chan) => `<#${chan}>`)}`;
	console.log("Another error happened");
	return false;
};

/**
 *
 * @param {Discord.Message} sent
 * @param type
 * @return {Promise<void>}
 */
export const addReactions = async (sent, type = "dismiss") => {
	try {
		const voteUp = sent.guild.emojis.resolve("276908986744438794");
		const alfred = sent.guild.emojis.resolve("626417707373428750");
		const princess = sent.guild.emojis.resolve("626417707373428750");

		await sent.react(voteUp);

		if (type === "c3") {
			await sent.react(alfred);
		} else if (type === "promo") {
			//
		} else if (type === "server_news") {
			//
		} else {
			await sent.react(princess);
		}
	} catch (e) {
		console.error("Cannot add reactions", e);
	}
};

export const checkBlogPosts = async (client) => {
	const scirraStaff = ["Laura_D", "Ashley", "Tom"];

	try {
		const resp = await fetch("https://www.construct.net/en/blogs/posts");
		const body = await resp.text();

		const $ = cheerio.load(body);
		const common = $(
			"form#form1 div:nth-child(3) > div:nth-child(1) > div > div",
		);
		const newTitle = common
			.find(".titleOuterWrap > div > div.right > a")
			.text()
			.trim();
		const author = common
			.find(".statWrap .detailCol .usernameTextWrap a > span:nth-child(1)")
			.text();
		// .text().trim();
		const timeToRead = common
			.find(".statWrap > div:nth-child(1) > div > ul > li:nth-child(2)")
			.text()
			.replace(/<img(.*)>/, "")
			.replace("read time", "")
			.trim();
		const link = common
			.find(".titleOuterWrap > div > div.right > a")
			.attr("href")
			.trim()
			.replace(/^(.*?)\/blogs/, "https://www.construct.net/blogs");
		const image = common.find(".statWrap .avatarWrap > img").attr("src");

		const newPostId = link.split("?")[0].split("/").pop().split("-").pop();

		const dbRef = ref(database);
		get(child(dbRef, "blog"))
			.then(async (snapshot) => {
				const postId = snapshot.val();

				const isScirra = scirraStaff.includes(author);

				// prevent posts that are not from scirra to prevent spam
				if (postId !== newPostId && newTitle !== "" && isScirra) {
					const sent = await client.channels.cache
						.get(
							isScirra
								? CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS
								: CONSTANTS.CHANNELS.PROMO,
						)
						.send(isScirra ? "@here" : "", {
							embed: new Blog({
								title: newTitle,
								author,
								timeToRead,
								link,
								image,
							}).embed(),
						});

					await addReactions(sent, "blog");

					set(ref(database, "blog"), newPostId);
				}
			});
	} catch (e) {
		console.error(e);
	}
};

export const checkC3Updates = async (client) => {
	try {
		console.log("Checking C3 updates");

		const resp = await fetch("https://editor.construct.net/versions.json");
		const data = await resp.json();

		const branches = ["Beta", "Stable", "LTS"];
		let latestRelease = null;

		// Iterate through all releases and identify the latest release based on publishDate
		for (const release of data) {
			const branch = release.channel;
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
			console.log("No releases found");
			return;
		}

		const snapshot = await get(child(ref(database), "c3release"));
		const lastRelease = snapshot.val();

		const snap = await get(child(ref(database), "releases"));
		const listReleases = snap.val();

		const newVersion = latestRelease.releaseName;
		const description = latestRelease.releaseNotes;
		const url = latestRelease.downloadUrl;
		const branch = latestRelease.channel;

		console.log("last release:", lastRelease, "new version", newVersion);

		//  release different from latest, not empty,          not already posted
		if (
			lastRelease !== newVersion &&
			newVersion !== "" &&
			!listReleases[newVersion]
		) {
			console.log("New C3 release available");
			const sent = await client.channels.cache
				.get(CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS)
				.send("@here", {
					embed: new C3Update({
						description,
						version: newVersion,
						link: url,
						icon: branch === "stable" ? "C3Stableicon" : "C3Betaicon",
					}).embed(),
				});

			await addReactions(sent, "c3");

			await set(ref(database, "c3release"), newVersion);

			listReleases[newVersion] = branch;
			await set(ref(database, "releases"), listReleases);
		}
	} catch (error) {
		console.log(error);
		//= > 'Internal server error ...'
	}
};

export const checkForNotificationBot = async (message: Message) => {
	if (message.channel.id === CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS) {
		// sent from the "notification" bot
		await addReactions(message, "notification");
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
		await message.react(":wave:");
	}
};

export const checkToolsHasLink = async (message: Message) => {
	const toolsChan = CONSTANTS.CHANNELS.TOOLS;
	if (message.channel.id === toolsChan) {
		if (
			message.content.search(
				/[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi,
			) === -1
		) {
			await message.delete();
			await message.author.send(
				"**Your content does not meet one or more requirements!**\n\n__List of requirements:__\n► **1** Link/embed or attachment",
			);
		}
	}
};

export const checkJobOffers = async (message: Message) => {
	return true;
};
