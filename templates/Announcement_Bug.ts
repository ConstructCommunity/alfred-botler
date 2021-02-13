import { MessageEmbed } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class Bug extends Template {
  constructor() {
    super('bug', {}, {});
  }

  // eslint-disable-next-line
  embed() {
    return new MessageEmbed()
      .setDescription('Collection of common bug reporting links.')
      .setColor(11962861)
      .setFooter(CONSTANTS.MESSAGE.SCIRRA_FOOTER)
      .setThumbnail(`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}//assets/mini/Infoicon.png`)
      .setAuthor('BUG REPORTING LINKS', `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordNotifyicon.png`)
      .addFields([
        { name: CONSTANTS.MESSAGE.SEPARATOR, value: CONSTANTS.MESSAGE.EMPTY },
        { name: '<:C3:561134796911280128> Construct 3 Editor:', value: '[Open Link ➚](https://github.com/Scirra/Construct-3-bugs/issues)' },
        { name: '<:C3:561134796911280128> Construct 3 Website:', value: '[Open Link ➚](https://github.com/Scirra/Construct.net-website-bugs/issues)' },
        { name: '<:C2:561134777445646336> Construct 2:', value: '[Open Link ➚](https://www.construct.net/forum/construct-2/bugs-21)' },
        { name: '<:C1:561134200896487424> Construct 1:', value: '[Open Link ➚](https://sourceforge.net/p/construct/bugs/)' },
      ]);
  }
}
