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
      .setDescription('Found something weird, perhaps a sneaky bug? Would you like to suggest something? Please check out the links below!')
      .setColor(11962861)
      .setFooter(CONSTANTS.MESSAGE.SCIRRA_FOOTER)
      .setThumbnail(`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}//assets/mini/Infoicon.png`)
      .setAuthor('HELLO THERE, HERE IS A LIST OF USEFUL STUFF!', `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/AlfredBotlericon.png`)
      .addField(CONSTANTS.MESSAGE.SEPARATOR, CONSTANTS.MESSAGE.EMPTY)
      .addField('Report Construct 3 bugs here:', 'https://goo.gl/HKKs1b')
      .addField('Report Construct 2 bugs here:', 'https://goo.gl/mGVcUo')
      .addField('Suggest Construct 3 features here:', 'https://goo.gl/uuUMTV')
      .addField(CONSTANTS.MESSAGE.EMPTY, CONSTANTS.MESSAGE.SEPARATOR)
      .addField('Get started with Construct 3 here:', 'https://www.construct.net/')
      .addField('Get started with Construct 2 here:', 'https://www.scirra.com/');
  }
}
