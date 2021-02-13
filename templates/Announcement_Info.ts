import CONSTANTS from '../constants';
import Template from './Template';

export default class Info extends Template {
  constructor() {
    super('info', {}, {});
  }

  // eslint-disable-next-line
  embed() {
    return {
      color: 11962861,
      author: {
        name: 'WELCOME IN THE CONSTRUCT COMMUNITY!',
        icon_url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/DiscordNotifyicon.png`,
      },
      thumbnail: {
        url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/Discordicon.png`,
      },
      description: 'Dedicated to the game development software **Construct**!\n(This server is __not official__ and run by Community Members!)',
      fields: [{
        name: CONSTANTS.MESSAGE.SEPARATOR,
        value: CONSTANTS.MESSAGE.EMPTY,
      },
      {
        name: ':scroll: Rules & Acknowledgements:',
        value: '[Open Link ➚](https://docs.google.com/document/d/1zc8W61ntVOw4OTbmFIOASjmL_EYh8RpyNhoFesUknks/edit)',
      },
      {
        name: ':alfred: Alfred Botler\'s Commands:',
        value: '[Open Link ➚](https://github.com/WebCreationClub/alfred-botler/blob/master/README.md)',
      },
      {
        name: ':red_envelope: Server Invitation Link:',
        value: 'https://discord.gg/dZDU7Re',
      },
      {
        name: CONSTANTS.MESSAGE.EMPTY,
        value: CONSTANTS.MESSAGE.SEPARATOR,
      },
      {
        name: ':C3: Try Construct 3 Now:',
        value: '[Open Link ➚](https://www.construct.net/)',
      },
      {
        name: ':C3: Purchase Construct 3 Now:',
        value: '[Open Link ➚](https://www.construct.net/make-games/buy-construct)',
      },
      ],
      footer: {
        text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
      },
    };
  }
}
