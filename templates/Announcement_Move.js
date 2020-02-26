import {
  MessageEmbed,
} from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class Move extends Template {
  constructor(variables) {
    super('move', variables, {
      channel_name: '',
      user_name: '',
      usermessage: '',
    });
  }

  embed() {
    return new MessageEmbed()
      .setDescription('Some messages have been moved based on the channel theme.')
      .setColor(11962861)
      .setFooter(CONSTANTS.MESSAGE.SCIRRA_FOOTER)
      .setThumbnail('https://raw.githubusercontent.com/Armaldio/alfred-botler/master/assets/mini/MoveMsgicon.png')
      .setAuthor(`MESSAGES MOVED FROM ${
        this.variables.channel_name
      }`, 'https://raw.githubusercontent.com/Armaldio/alfred-botler/master/assets/mini/DiscordNotifyicon.png', '')
      .addFields(CONSTANTS.MESSAGE.SEPARATOR, CONSTANTS.MESSAGE.EMPTY)
      .addFields('Moved messages:', `**${this.variables.user_name}:** ${this.variables.usermessage}
**${this.variables.user_name}:** ${this.variables.usermessage}
**${this.variables.user_name}:** ${this.variables.usermessage}`);
  }
}
