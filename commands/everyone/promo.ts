import { Command, CommandoMessage } from 'discord.js-commando';
import CONSTANTS from '../../constants';
import {
	hasPermissions,
	duplicateMessage,
	addReactions,
} from '../../bot-utils';
import PromoUp from '../../templates/Announcement_PromoUp';
import { genericError } from '../../errorManagement';
import { Message, TextChannel } from 'discord.js';

export default class promo extends Command {
	constructor(client) {
		super(client, {
			name: 'promo',
			memberName: 'promo',
			group: 'everyone',
			description: 'Promote your content in #promotion',
			examples: ['promo message'],
		});
	}

	// eslint-disable-next-line class-methods-use-this
	onError(err, message, args, fromPattern, result) {
		return genericError(err, message);
	}

	hasPermission(msg) {
		const permissions = {
			roles: [CONSTANTS.ROLES.ANY],
			channels: [CONSTANTS.CHANNELS.ANY],
		};
		return hasPermissions(this.client, permissions, msg);
	}

	// eslint-disable-next-line
	async run(msg: CommandoMessage & Message): Promise<Message> {
		if (
			(msg.attachments.array().length === 0 &&
				// eslint-disable-next-line
				msg.content.search(
					/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
				) === -1) ||
			msg.content.length < 20 ||
			msg.content.search(/(@everyone|@here)/gi) >= 0
		) {
			await msg.author.send(
				'**Your content does not meet one or more requirements!**\n\n__List of requirements:__\n► **1** link/embed or attachment\n► **20** character description minimum\n► No mention'
			);
			return;
		}

		const promoChan = (await msg.client.channels.cache.get(
			CONSTANTS.CHANNELS.PROMO
		)) as TextChannel;

		const sent = await duplicateMessage(msg, promoChan, (content) =>
			content.replace(/!promo ?/gi, '')
		);

		try {
			// send pending approval notification
			await msg.author.send({
				embed: new PromoUp({}).embed(),
			});
		} catch (e) {
			console.log('Message cannot be sent to user (promo)', e);
		}

		await addReactions(sent, 'promo');
	}
}
