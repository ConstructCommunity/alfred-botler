import { EmbedBuilder } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class RoleToggle extends Template {
	constructor(variables) {
		super('role-toggle', variables, {
			icon: 'RoleDelicon',
			roleName: 'ROLE',
			toggleText: 'ADDED',
			roles: {
				role1: '111',
				role2: '222',
			},
		});
	}

	embed() {
		return new EmbedBuilder()
			.setDescription(CONSTANTS.MESSAGE.SEPARATOR)
			.setColor(15844367)
			.setThumbnail(
				`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/${this.variables.icon}.png`
			)
			.setAuthor({
				name: `${this.variables.roleName} ROLE ${this.variables.toggleText}!`,
				iconURL: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordEditicon.png`,
			})
			.addFields([
				{
					name: 'Available Roles:',
					value: 'Please use the `!rolelist` command.',
				},
			]);
	}
}
