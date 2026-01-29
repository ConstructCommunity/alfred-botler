import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import RoleToggle from '../../templates/Announcement_RoleToggle';
import RoleHelp from '../../templates/Announcement_RoleHelp';
import CONSTANTS from '../../constants';

const roles = Object.values(CONSTANTS.ROLES).filter(
	(role) => !role.hideInList && !role.requireApplication
);

export default {
	data: new SlashCommandBuilder()
		.setName('iam')
		.setDescription('Add or remove roles')
		.addStringOption((option) =>
			option
				.setName('role')
				.setDescription('The role you want')
				.setRequired(true)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		// Permission check (Channel)
		if (
			interaction.channelId !== CONSTANTS.CHANNELS.ALFRED_COMMANDS &&
			interaction.channelId !== CONSTANTS.CHANNELS.TEST &&
			interaction.channelId !== CONSTANTS.CHANNELS.PRIVATE_TESTS
		) {
			await interaction.reply({
				content: `Wrong channel! This command is available only in <#${CONSTANTS.CHANNELS.ALFRED_COMMANDS}>`,
				ephemeral: true,
			});
			return;
		}

		const roleNameArg = interaction.options.getString('role', true);
		const wantedRole = roleNameArg.toLowerCase();

		const fun: string[][] = [
			['god', 'Sorry, Armaldio is our only god ...'],
			['ashley', 'No, Ash is too busy adding features ;)'],
			['armaldio', "No, you are not.\nOr maybe you are. I don't know."],
		];

		let found = false;
		for (const [name, answer] of fun) {
			if (name === wantedRole) {
				await interaction.reply({ content: answer, ephemeral: true });
				found = true;
				break;
			}
		}

		if (found) return;

		const targetRole = roles.find((r) => r.shortName === wantedRole);
		if (typeof targetRole === 'undefined') {
			await interaction.reply({
				embeds: [new RoleHelp({ roles }).embed()],
				ephemeral: true,
			});
			return;
		}

		const member = interaction.member as GuildMember;
		let icon = '';
		let toggleText = '';

		if (member.roles.cache.has(targetRole.id)) {
			await member.roles.remove(targetRole.id);
			icon = 'RoleDelicon';
			toggleText = 'REMOVED';
		} else {
			await member.roles.add(targetRole.id);
			icon = 'RoleGeticon';
			toggleText = 'ADDED';
		}

		const roleDisplayName = Object.values(CONSTANTS.ROLES)
			.find((r) => r.id === targetRole.id)
			?.displayName.toUpperCase();

		await interaction.reply({
			embeds: [
				new RoleToggle({
					icon,
					toggleText,
					roleName: roleDisplayName,
					roles,
				}).embed(),
			],
		});
	},
};