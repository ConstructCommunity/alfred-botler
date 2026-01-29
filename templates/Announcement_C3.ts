import { EmbedBuilder } from 'discord.js';
import CONSTANTS from '../constants';

import Template from './Template';

export default class C3Update extends Template {
	constructor(variables) {
		super('c3-update', variables, {
			description: 'DESCRIPTION',
			version: 'r120',
			icon: 'C3Stableicon',
			link: 'https://',
		});
	}

	embed() {
		return new EmbedBuilder()
			.setDescription(this.variables.description)
			.setColor(2683090)
			.setFooter({
				text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
			})
			.setThumbnail(
				`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/C3icon.png`
			)
			.setAuthor({
				name: `CONSTRUCT 3 UPDATE (${this.variables.version}) IS AVAILABLE!`,
				iconURL: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/${this.variables.icon}.png`,
			})
			.addFields([
				{
					name: CONSTANTS.MESSAGE.SEPARATOR,
					value: CONSTANTS.MESSAGE.EMPTY,
				},
				{
					name: 'View the complete changelog:',
					value: this.variables.link,
				},
			]);
	}
}
