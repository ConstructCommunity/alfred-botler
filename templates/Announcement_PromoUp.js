import { MessageEmbed } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class PromoUp extends Template {
  constructor(variables) {
    super('promo-up', variables, {});
  }

  // eslint-disable-next-line
  embed() {
    return new MessageEmbed()
      .setDescription(`Your content is now available inside the <#${CONSTANTS.CHANNELS.PROMO}> channel.`)
      .setColor(11962861)
      .setThumbnail(`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/UploadIcon.png`)
      .setAuthor('PROMOTION SUBMISSION SUCCESSFUL!', `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordNotifyicon.png`, '')
      .addFields(CONSTANTS.MESSAGE.SEPARATOR, CONSTANTS.MESSAGE.EMPTY)
      .addFields('Did something go wrong?', 'Request removal of your promoted content by contacting CC Staff.');
  }
}
