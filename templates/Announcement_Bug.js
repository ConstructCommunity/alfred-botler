import { RichEmbed } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class Bug extends Template {
  constructor() {
    super('bug', {}, {});
  }

  // eslint-disable-next-line
  embed() {
    return new RichEmbed()
      .setDescription('If you found a bug that needs reporting, check out the links below.')
      .setColor(11962861)
      .setFooter(CONSTANTS.MESSAGE.SCIRRA_FOOTER)
      .setThumbnail(`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}//assets/mini/Infoicon.png`)
      .setAuthor('BUG REPORTING LINKS', `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordNotifyicon.png`)
      .addField(CONSTANTS.MESSAGE.SEPARATOR, CONSTANTS.MESSAGE.EMPTY)
      .addField('<:C3:561134796911280128> Construct 3 Editor:', 'http://bit.ly/C3EditorBugs')
      .addField('<:C3:561134796911280128> Construct 3 Website:', 'http://bit.ly/C3WebsiteBugs')
      .addField('<:C2:561134777445646336> Construct 2:', 'http://bit.ly/C2Bugs')
      .addField('<:C1:561134200896487424> Construct 1:', 'http://bit.ly/C1Bugs')
  }
}
