import { SlashCommandBuilder, ChatInputCommandInteraction, TextChannel, GuildMember } from 'discord.js';
import CONSTANTS from '../../constants';
import { duplicateMessage } from '../../bot-utils';

export default {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Say something inside current channel as Alfred')
		.addStringOption((option) =>
			option
				.setName('text')
				.setDescription('What do you want to say?')
				.setRequired(true)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		// Permission check (Role)
		const member = interaction.member as GuildMember;
		if (!member.roles.cache.has(CONSTANTS.ROLES.STAFF.id)) {
			await interaction.reply({
				content: 'You are not permitted to use this command!',
				ephemeral: true,
			});
			return;
		}

		const text = interaction.options.getString('text', true);

		const botUser = interaction.client.user;
		if (!botUser) return;

		await duplicateMessage(
			interaction.channel as TextChannel,
			text,
			botUser,
			[]
		);

		await interaction.reply({ content: 'Done', ephemeral: true });
	},
};