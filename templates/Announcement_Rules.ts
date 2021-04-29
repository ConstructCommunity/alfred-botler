import { MessageEmbed } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class Bug extends Template {
  constructor() {
    super('bug', {}, {});
  }

  // eslint-disable-next-line
  embed() {
    return new MessageEmbed()
      .setDescription('Overview of the Construct Community rules.')
      .setColor(11962861)
      .setFooter(CONSTANTS.MESSAGE.SCIRRA_FOOTER)
      .setThumbnail(`${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}//assets/mini/Infoicon.png`)
      .setAuthor('Rules Info', `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordNotifyicon.png`)
      .addFields([
      { name: CONSTANTS.MESSAGE.SEPARATOR, value: CONSTANTS.MESSAGE.EMPTY },
      {
        name: ':scroll: Rules & Acknowledgements:',
        value: '[Open Link ➚](https://docs.google.com/document/d/1zc8W61ntVOw4OTbmFIOASjmL_EYh8RpyNhoFesUknks/edit)',
      },
      { 
        name: ':closed_book: Punishment Ladder:',
        value: '**1. Warning**\n- No imposed chat limitations \n- Affects standing on Punishment Ladder\n**2. Timeout**\n- No chatting for 24h \n- Affects standing on Punishment Ladder\n**3. Mute**\n- No chatting for 7 days \n- Affects standing on Punishment Ladder\n**4. Permamute**\n- Permanent chatting block (read-only) \n- Affects standing on Punishment Ladder\n**5. Forced Ban**\n- Discord server IP ban. \n- Only used for extreme cases'
      },
      ]);
  }
}
