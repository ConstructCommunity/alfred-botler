import { RichEmbed } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class Blog extends Template {
  constructor(variables) {
    super('replace-me', variables, {
      actionHeadline: '',
      actionReason: '',
    });
  }

  embed() {
    return new RichEmbed()
      .setDescription('This is a generated message by the CC Staff.\nPlease do the things mentioned below!')
      .setColor(16711680)
      .setFooter('► Press \'OK\' to confirm the action has been performed.', '')
      .setThumbnail('https://raw.githubusercontent.com/Armaldio/alfred-botler/master/assets/mini/Negativeicon.png')
      .setAuthor('AN ACTION IS REQUIRED!', 'https://raw.githubusercontent.com/Armaldio/alfred-botler/master/assets/mini/AlfredBotlericon.png', '')
      .addField(CONSTANTS.MESSAGE.SEPARATOR, CONSTANTS.MESSAGE.EMPTY)
      .addField(`${this.variables.actionHeadline}`, `${this.variables.actionReason}`);
  }
}
