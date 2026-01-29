import { SlashCommandBuilder, ChatInputCommandInteraction, TextChannel } from 'discord.js';
import CONSTANTS from '../../constants';
import { duplicateMessage, addReactions } from '../../bot-utils';
import PromoUp from '../../templates/Announcement_PromoUp';

export default {
	data: new SlashCommandBuilder()
		.setName('promo')
		.setDescription('Promote your content in #promotion')
		.addStringOption((option) =>
			option
				.setName('content')
				.setDescription('The text content of your promotion (min 20 chars)')
				.setRequired(true)
		)
		.addAttachmentOption((option) =>
			option.setName('attachment').setDescription('Optional image/file')
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const content = interaction.options.getString('content', true);
		const attachment = interaction.options.getAttachment('attachment');

		// Validation
		const hasLink =
			/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(
				content
			);
		const hasAttachment = !!attachment;

		if (!hasLink && !hasAttachment) {
			await interaction.reply({
				content:
					'**Your content does not meet one or more requirements!**\n\n__List of requirements:__\n► **1** link/embed or attachment\n► **20** character description minimum\n► No mention',
				ephemeral: true,
			});
			return;
		}

		if (content.length < 20) {
			await interaction.reply({
				content:
					'**Your content does not meet one or more requirements!**\n\n__List of requirements:__\n► **1** link/embed or attachment\n► **20** character description minimum\n► No mention',
				ephemeral: true,
			});
			return;
		}

		if (content.search(/(@everyone|@here)/gi) >= 0) {
			await interaction.reply({
				content:
					'**Your content does not meet one or more requirements!**\n\n__List of requirements:__\n► **1** link/embed or attachment\n► **20** character description minimum\n► No mention',
				ephemeral: true,
			});
			return;
		}

		const promoChan = interaction.client.channels.cache.get(
			CONSTANTS.CHANNELS.PROMO
		) as TextChannel;

		const attachments = attachment
			? [{ url: attachment.url, name: attachment.name }]
			: [];

		const sent = await duplicateMessage(
			promoChan,
			content,
			interaction.user,
			attachments
		);

		if (sent) {
			await addReactions(sent, 'promo');
			await interaction.reply({
				embeds: [new PromoUp({}).embed()],
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: 'Failed to post promotion.',
				ephemeral: true,
			});
		}
	},
};