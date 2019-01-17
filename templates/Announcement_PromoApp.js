import { RichEmbed } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class PromoApp extends Template {
  constructor(variables) {
    super('promo-app', variables, {});
  }

  embed() {
    return new RichEmbed()
      .setDescription('Your content is pending for approval and will be available soon.')
      .setColor(15844367)
      .setThumbnail('https://raw.githubusercontent.com/Armaldio/alfred-botler/master/assets/mini/Watchericon.png')
      .setAuthor('PROMOTION PENDING APPROVAL!', 'https://raw.githubusercontent.com/Armaldio/alfred-botler/master/assets/mini/AlfredBotlericon.png', '')
      .addField('──────────────────────────────────', 'ᅠ', false)
      .addField('Why the addional approval process?', 'This process ensures that no malicious content is being published. Your content will be up and available after the process is done.', false);
  }
}
