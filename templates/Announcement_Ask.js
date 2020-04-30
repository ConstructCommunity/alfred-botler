import { MessageEmbed } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class Ask extends Template {
  constructor() {
    super('ask', {}, {});
  }

  // eslint-disable-next-line
  embed() {
    return new MessageEmbed()
      .setDescription('Collection of common practices and help with Construct.')
      .setColor(11962861)
      .setFooter(CONSTANTS.MESSAGE.SCIRRA_FOOTER)
      .setThumbnail(`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}//assets/mini/Infoicon.png`)
      .setAuthor('TIPS & GUIDES', `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordNotifyicon.png`)
      .addFields([
        { name: CONSTANTS.MESSAGE.SEPARATOR, value: 'Things you can do before asking for help:' },
        { name: '<:C3:561134796911280128> Construct 3 Manual:', value: 'https://www.construct.net/en/make-games/manuals/construct-3', inline: true },
        { name: '<:C3:561134796911280128> Construct 2 Manual:', value: 'https://www.scirra.com/manual/1/construct-2', inline: true },
        { name: CONSTANTS.MESSAGE.EMPTY, value: CONSTANTS.MESSAGE.EMPTY },
        { name: 'test', value: 'testvalue', inline: true },
        { name: 'test', value: 'testvalue', inline: true },
      ]);
      .addFields([
        { name: CONSTANTS.MESSAGE.SEPARATOR, value: '**Tips for getting quick help:**' },
        { name: 'Test', value: 'TestValue' },
      ]);
  }
}
