import { MessageEmbed } from 'discord.js';
import CONSTANTS from '../../constants';
import Template from '../Template';

export default class PromoApp extends Template {
	constructor(variables) {
		super('promo-app', variables, {});
	}

	// eslint-disable-next-line
	embed() {
		return new MessageEmbed()
			.setDescription(
				'Your content is pending for approval and will be available soon.'
			)
			.setColor(15844367)
			.setThumbnail(
				`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/Watchericon.png`
			)
			.setAuthor(
				'PROMOTION PENDING APPROVAL!',
				`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/AlfredBotlericon.png`
			)
			.addField(CONSTANTS.MESSAGE.SEPARATOR, CONSTANTS.MESSAGE.EMPTY)
			.addField(
				'Why the addional approval process?',
				'This process ensures that no malicious content is being published. Your content will be up and available after the process is done.'
			);
	}
}
