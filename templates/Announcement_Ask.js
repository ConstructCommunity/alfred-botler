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
      .setDescription('If you found a bug that needs reporting, check out the links below.')
      .setColor(11962861)
      .setFooter(CONSTANTS.MESSAGE.SCIRRA_FOOTER)
      .setThumbnail(`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}//assets/mini/Infoicon.png`)
      .setAuthor('BUG REPORTING LINKS', `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordNotifyicon.png`)
      .addFields([
        { name: CONSTANTS.MESSAGE.SEPARATOR, value: CONSTANTS.MESSAGE.EMPTY },
        { name: '<:C3:561134796911280128> Construct 3 Editor:', value: 'http://bit.ly/C3EditorBugs' },
        { name: '<:C3:561134796911280128> Construct 3 Website:', value: 'http://bit.ly/C3WebsiteBugs' },
        { name: '<:C2:561134777445646336> Construct 2:', value: 'http://bit.ly/C2Bugs' },
        { name: '<:C1:561134200896487424> Construct 1:', value: 'http://bit.ly/C1Bugs' },
      ]);
  }
}
