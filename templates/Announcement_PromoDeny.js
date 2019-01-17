import { RichEmbed } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class PromoDeny extends Template {
  constructor(variables) {
    super('promo-deny', variables, {});
  }

  embed() {
    return new RichEmbed()
      .setDescription('Your content has been rejected and will not be published.')
      .setColor(16711680)
      .setThumbnail('https://raw.githubusercontent.com/Armaldio/alfred-botler/master/assets/mini/Erroricon.png')
      .setAuthor('PROMOTION REJECTED!', 'https://raw.githubusercontent.com/Armaldio/alfred-botler/master/assets/mini/AlfredBotlericon.png', '')
      .addField('──────────────────────────────────', 'ᅠ', false)
      .addField('What are my options?', 'Your content breaks one or more of our channel rules. If you think that it doesn`\'t, use \'!appeal\' in order to request support.', false);
  }
}
