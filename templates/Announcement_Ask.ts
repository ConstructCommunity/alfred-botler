import { MessageEmbed } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class Ask extends Template {
	constructor() {
		super('ask', {}, {});
	}

	// eslint-disable-next-line
	embed() {
		return new MessageEmbed()
			.setDescription('Collection of common practices and help with Construct.')
			.setColor(11962861)
			.setFooter(CONSTANTS.MESSAGE.SCIRRA_FOOTER)
			.setThumbnail(
				`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}//assets/mini/Infoicon.png`
			)
			.setAuthor(
				'TIPS & GUIDES',
				`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordNotifyicon.png`
			)
			.addFields([
				{
					name: CONSTANTS.MESSAGE.SEPARATOR,
					value: '**Things you can do before asking for help:**',
				},
				{
					name: '<:C3:561134796911280128> Construct 3 Manual:',
					value:
						'[Read Manual ➚](https://www.construct.net/make-games/manuals/construct-3)',
					inline: true,
				},
				{
					name: '<:C2:561134777445646336> Construct 2 Manual:',
					value:
						'[Read Manual ➚](https://www.construct.net/construct-2/manuals/construct-2)',
					inline: true,
				},
			])
			.addFields([
				{
					name: CONSTANTS.MESSAGE.SEPARATOR,
					value: '**Tips for getting quick help:**',
				},
				{
					name: 'General Help:',
					value:
						'- Ask directly, no background story needed\n- Provide screenshots or short videos\n- Upload a minimal example project',
				},
				{
					name: 'Bug Reporting:',
					value:
						'- Debug your project using the debugger\n- Check the browser console for errors\n- Identify the bug and try to isolate it\n- Create a minimal project for reproduction\n- Use the `!bug` Discord bot command',
				},
			]);
	}
}
