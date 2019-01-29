import { RichEmbed } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class Warn extends Template {
  constructor(variables) {
    super('warn', variables, {});
  }

  embed() {
    return new RichEmbed()
      .setDescription('This is a warning message sent because of your recent activities.')
      .setColor(16711680)
      .setFooter('©Scirra Ltd 2019 | Donations: https://go.armaldio.xyz/donation', '')
      .setThumbnail('https://raw.githubusercontent.com/Armaldio/alfred-botler/master/assets/mini/Negativeicon.png')
      .setAuthor('YOU JUST RECEIVED A WARNING!', 'https://raw.githubusercontent.com/Armaldio/alfred-botler/master/assets/mini/AlfredBotlericon.png', '')
      .addField('──────────────────────────────────', 'ᅠ', false)
      .addField('What are my options?', 'You can ask for support by contacting the CC Staff', false);
  }
}
