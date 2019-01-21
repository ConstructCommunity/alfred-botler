import { RichEmbed } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class Backup extends Template {
  constructor(variables) {
    super('backup', variables, {
      channelName: '[CHANNEL]',
      timestamp: 0,
      users: [],
    });
  }

  embed() {
    return new RichEmbed()
      .setDescription('Message backup for later use.')
      .setColor(11962861)
      .setFooter(CONSTANTS.MESSAGE.SCIRRA_FOOTER)
      .setThumbnail(`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/MoveMsgicon.png`)
      .setAuthor(`BACKUP FROM ${this.variables.channelName} (${this.variables.timestamp})`, 'https://raw.githubusercontent.com/Armaldio/alfred-botler/master/assets/mini/AlfredBotlericon.png', '')
      .addField('──────────────────────────────────', 'ᅠ', false)
      .addField('Backup:', this.variables.users.map(u => `**${u.userName}:** ${u.userMessage}**`));
  }
}
