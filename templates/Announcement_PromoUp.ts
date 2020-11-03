import { MessageEmbed } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class PromoUp extends Template {
  constructor(variables) {
    super('promo-up', variables, {});
  }

  // eslint-disable-next-line
  embed() {
    const field1 = { name: CONSTANTS.MESSAGE.SEPARATOR, value: CONSTANTS.MESSAGE.EMPTY };
    const field2 = { name: 'Did something go wrong?', value: 'Request removal of your promoted content by contacting CC Staff.' };

    return new MessageEmbed()
      .setDescription(`Your content is now available inside the <#${CONSTANTS.CHANNELS.PROMO}> channel.`)
      .setColor(11962861)
      .setThumbnail(`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/UploadIcon.png`)
      .setAuthor('PROMOTION SUBMISSION SUCCESSFUL!', `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordNotifyicon.png`, '')
      .addFields([field1, field2]);
  }
}
