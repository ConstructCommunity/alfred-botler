import { RichEmbed } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class PromoUp extends Template {
  constructor(variables) {
    super('promo-up', variables, {
      message_id: '',
    });
  }

  embed() {
    return new RichEmbed()
      .setDescription('Your content is now available inside the #promotion channel!')
      .setColor(11962861)
      .setThumbnail('https://raw.githubusercontent.com/Armaldio/alfred-botler/master/assets/mini/UploadIcon.png')
      .setAuthor('PROMOTION SUBMISSION SUCCESSFUL!', 'https://raw.githubusercontent.com/Armaldio/alfred-botler/master/assets/mini/AlfredBotlericon.png', '')
      .addField('──────────────────────────────────', 'ᅠ', false)
      .addField(`Message ID: ${this.variables.message_id}#`, 'Remove content using \'!promodel\' followed by your message ID.', false);
  }
}
