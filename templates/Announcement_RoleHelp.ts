import { EmbedBuilder } from 'discord.js';
import CONSTANTS from '../constants';

import Template from './Template';

export default class RoleHelp extends Template {
	constructor(variables) {
		super('role-help', variables, {
			roles: {
				role1: '111',
				role2: '222',
			},
		});
	}

	// eslint-disable-next-line class-methods-use-this
	embed() {
		return new EmbedBuilder()
			.setDescription(CONSTANTS.MESSAGE.SEPARATOR)
			.setColor(11962861)
			.setThumbnail(
				`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/Infoicon.png`
			)
			.setAuthor({
				name: 'ROLE HELPER',
				iconURL: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordNotifyicon.png`,
			})
			.addFields([
				{
					name: 'Step By Step Guide:',
					value:
						"**1.** Select any available role\n**2.** Write the command '!iam' in the messagebox\n**3.** Add an empty space followed by the role\nᅠ",
				},
				{
					name: 'Example:',
					value: '`!iam designer`\nᅠ',
				},
				{
					name: 'Available Roles:',
					value: '`!rolelist`\nᅠ',
				},
			])
			.setFooter({
				text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
			});
	}
}
