import CONSTANTS from '../constants';
import Template from './Template';

export default class JobOfferCommunity extends Template {
  constructor() {
    super('job-offer-community', {}, {});
  }

  // eslint-disable-next-line
  embed() {
    return {
      description: 'To further encourage developers to post their job offers, we\'ve created a new system that makes things easier than ever before!',
      color: 11962861,
      footer: {
        text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
      },
      thumbnail: {
        url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/master/assets/mini/NewChannelicon.png`,
      },
      author: {
        name: 'NEW JOB OFFER CHANNEL + TOOLS NOW AVAILABLE!',
        icon_url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/master/assets/mini/AlfredBotlericon.png`,
      },
      fields: [
        {
          name: CONSTANTS.MESSAGE.SEPARATOR,
          value: CONSTANTS.MESSAGE.EMPTY,
        },
        {
          name: 'Here are some key features of the new system:',
          value: '**-** Dedicated website to quickly post your offers\n**-** New creation tool which does the work for you\n**-** Better overview and automatically formatted messages\n**-** Directly receive PM notifications for new job offers\nᅠ',
        },
        {
          name: 'Check out the job offers form:',
          value: 'https://cc_jobs.armaldio.xyz/',
        },
        {
          name: CONSTANTS.MESSAGE.EMPTY,
          value: CONSTANTS.MESSAGE.SEPARATOR,
        },
      ],
    };
  }
}
