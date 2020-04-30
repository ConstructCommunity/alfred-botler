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
      .setThumbnail(`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}//assets/mini/Infoicon.png`)
      .setAuthor('TIPS & GUIDES', `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordNotifyicon.png`)
      .addFields([
        { name: CONSTANTS.MESSAGE.SEPARATOR, value: '**Tips for getting quick help:**' },
        { name: 'Test', value: 'TestValue' },
      ])
      .addFields([
        { name: CONSTANTS.MESSAGE.SEPARATOR, value: CONSTANTS.MESSAGE.EMPTY },
        { name: '<:C3:561134796911280128> Construct 3 Editor:', value: 'http://bit.ly/C3EditorBugs' },
        { name: '<:C3:561134796911280128> Construct 3 Website:', value: 'http://bit.ly/C3WebsiteBugs' },
        { name: '<:C2:561134777445646336> Construct 2:', value: 'http://bit.ly/C2Bugs', inline: true },
        { name: '<:C1:561134200896487424> Construct 1:', value: 'http://bit.ly/C1Bugs', inline: true },
      ]);
  }
}
