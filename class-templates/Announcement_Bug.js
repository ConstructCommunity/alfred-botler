import CONSTANTS from '../constants';
import Template from './Template';

export default class Blog extends Template {
  constructor() {
    super('bug', {}, {});
  }

  // eslint-disable-next-line
  toEmbed() {
    return {
      description: 'Found something weird, perhaps a sneaky bug? Would you like to suggest something? Please check out the links below!',
      color: 11962861,
      footer: {
        text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
      },
      thumbnail: {
        url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}//assets/mini/Infoicon.png`,
      },
      author: {
        name: 'HELLO THERE, HERE IS A LIST OF USEFUL STUFF!',
        icon_url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/AlfredBotlericon.png`,
      },
      fields: [
        {
          name: CONSTANTS.MESSAGE.SEPARATOR,
          value: CONSTANTS.MESSAGE.EMPTY,
        },
        {
          name: 'Report Construct 3 bugs here:',
          value: 'https://goo.gl/HKKs1b',
        },
        {
          name: 'Report Construct 2 bugs here:',
          value: 'https://goo.gl/mGVcUo',
        },
        {
          name: 'Suggest Construct 3 features here:',
          value: 'https://goo.gl/uuUMTV',
        },
        {
          name: CONSTANTS.MESSAGE.EMPTY,
          value: CONSTANTS.MESSAGE.SEPARATOR,
        },
        {
          name: 'Get started with Construct 3 here:',
          value: 'https://www.construct.net/',
        },
        {
          name: 'Get started with Construct 2 here:',
          value: 'https://www.scirra.com/',
        },
      ],
    };
  }
}
