import CONSTANTS from '../constants';

import Template from './Template';

export default class C2Update extends Template {
  constructor(variables) {
    super('c2-update', variables, {
      description: 'DESCRIPTION',
      version: 'r120',
      link: 'https://',
    });
  }

  embed() {
    return {
      description: this.variables.description,
      color: 16316662,
      footer: {
        text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
      },
      thumbnail: {
        url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/C2icon.png`,
      },
      author: {
        name: `CONSTRUCT 2 UPDATE (${this.variables.version}) IS AVAILABLE!`,
        icon_url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/AlfredBotlericon.png`,
      },
      fields: [
        {
          name: CONSTANTS.MESSAGE.SEPARATOR,
          value: CONSTANTS.MESSAGE.EMPTY,
        },
        {
          name: 'View the complete changelog:',
          value: this.variables.link,
        },
      ],
    };
  }
}
