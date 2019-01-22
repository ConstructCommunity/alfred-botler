import { RichEmbed } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class Notify extends Template {
  constructor(variables) {
    super('notify', variables, {
      message: '[Message]',
    });
  }

  embed() {
    return new RichEmbed()
      .setDescription(this.variables.message)
      .setColor(16711680)
      .setFooter('► Press \'OK\' to confirm the action has been performed.')
      .setThumbnail(`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/Negativeicon.png`)
      .setAuthor('AN ACTION IS REQUIRED!', `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/AlfredBotlericon.png`, '');
    // .addField(CONSTANTS.MESSAGE.SEPARATOR, CONSTANTS.MESSAGE.EMPTY)
    // .addField('This is a generated message by the CC Staff.', 'Please do the things mentioned below!');
  }
}
