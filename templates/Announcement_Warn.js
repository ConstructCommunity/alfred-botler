import { RichEmbed } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class Warn extends Template {
  constructor(variables) {
    super('warn', variables, {});
  }

  // eslint-disable-next-line
  embed() {
    return new RichEmbed()
      .setDescription('This is a warning message for your recent activities.')
      .setColor(16711680)
      .setThumbnail(`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/Negativeicon.png`)
      .setAuthor('YOU JUST RECEIVED A WARNING!', `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordWarnicon.png`)
      .addField(CONSTANTS.MESSAGE.SEPARATOR, CONSTANTS.MESSAGE.EMPTY)
      .addField('What are my options?', 'You can ask for support by contacting the CC Staff.', false);
  }
}
