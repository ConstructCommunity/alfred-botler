import CONSTANTS from '../constants';

import Template from './Template';

export default class C3Update extends Template {
  constructor(variables) {
    super('c3-update', variables, {
      description: 'DESCRIPTION',
      version: 'r120',
      icon: 'C3Stableicon',
      link: 'https://',
    });
  }

  embed() {
    return {
      description: this.variables.description,
      color: 2683090,
      footer: {
        text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
      },
      thumbnail: {
        url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/C3icon.png`,
      },
      author: {
        name: `CONSTRUCT 3 UPDATE (${this.variables.version}) IS AVAILABLE!`,
        icon_url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/${this.variables.icon}.png`,
      },
      fields: [
        {
          name: CONSTANTS.MESSAGE.SEPARATOR,
          value: CONSTANTS.MESSAGE.EMPTY,
        },
        {
          name: 'View the complete changelog:',
          value: `${CONSTANTS.MESSAGE.SCIRRA_C3RELEASES_PREFIX}${this.variables.link}`,
        },
      ],
    };
  }
}
