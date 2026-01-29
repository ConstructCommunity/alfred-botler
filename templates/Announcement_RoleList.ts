import { EmbedBuilder } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

// `**${role.displayName}:** \`!iam ${role.shortName}\``

export default class Rolelist extends Template {
	constructor() {
		super('rolelist', {}, {});
	}

	// eslint-disable-next-line class-methods-use-this
	embed() {
		const everyoneRoles = Object.entries(CONSTANTS.ROLES)
			.filter(([key, value]) => !value.requireApplication && !value.hideInList)
			.map(
				([key, role]) =>
					`${role.prefix ?? ''}**<@&${role.id}>${role.pingable ? '\*' : ''}:** \`!iam ${role.shortName}\``
			)
			.join('\n');
		const applicationRoles = Object.entries(CONSTANTS.ROLES)
			.filter(([key, value]) => value.requireApplication && !value.hideInList)
			.map(
				([key, role]) =>
					`${role.prefix ?? ''}**<@&${role.id}>${role.pingable ? '\*' : ''}:** ${role.description}`
			)
			.join('\n');

		return new EmbedBuilder()
			.setDescription(CONSTANTS.MESSAGE.SEPARATOR)
			.setColor(11962861)
			.setThumbnail(
				`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/Infoicon.png`
			)
			.setAuthor({
				name: 'ROLE LIST',
				iconURL: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordNotifyicon.png`,
			})
			.addFields([
				{
					name: 'Exclusive Roles:',
					value: `${applicationRoles}\nᅠ`,
				},
				{
					name: 'Roles For Members:',
					value: `${everyoneRoles}\nᅠ`,
				},
				{
					name: '**This Role can be mentioned by Members*',
					value: 'ᅠ',
				},
			])
			.setFooter({
				text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
			});
	}
}
