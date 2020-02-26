import { MessageEmbed } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class PromoDeny extends Template {
  constructor(variables) {
    super('promo-deny', variables, {
      reason: '[Reason]',
    });
  }

  embed() {
    return new MessageEmbed()
      .setTitle('Your content has been rejected and will not be published.')
      .setDescription(`Reason: *${this.variables.reason}*`)
      .setColor(16711680)
      .setThumbnail(`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/Erroricon.png`)
      .setAuthor('PROMOTION REJECTED!', `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/AlfredBotlericon.png`, '')
      .addFields(CONSTANTS.MESSAGE.SEPARATOR, CONSTANTS.MESSAGE.EMPTY)
      .addFields('What are my options?', 'Your content breaks one or more of our channel rules. If you think that it doesn\'t, gently ask a member of the staff for more details');
  }
}
