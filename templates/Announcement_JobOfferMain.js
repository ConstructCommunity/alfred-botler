import CONSTANTS from '../constants';
import Template from './Template';

export default class JobOfferMain extends Template {
  constructor(variables) {
    super('job-offer-main', variables, {
      description: 'DESCRIPTION',
      username: 'USERNAME',
      type: 'TYPE',
      payment: 'PAYMENT',
      paymentdetails: 'PAYMENT_DETAILS',
      contactinfo: 'CONTACT_INFO',
      cutomDescription: 'CUSTOM_DESCRIPTION',
    });
  }

  toEmbed() {
    return {
      description: this.variables.description,
      color: 11962861,
      footer: {
        text: 'Create your own offers here: https://cc_jobs.armaldio.xyz.',
      },
      thumbnail: {
        url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/JobOfferPaidicon.png`,
      },
      author: {
        name: `NEW OFFER BY ${this.variables.username}`,
        icon_url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/AlfredBotlericon.png`,
      },
      fields: [
        {
          name: CONSTANTS.MESSAGE.SEPARATOR,
          value: CONSTANTS.MESSAGE.EMPTY,
        },
        {
          name: 'Offer Conditions:',
          value: `- ${this.variables.type}
- ${this.variables.payment}
- ${this.variables.paymentdetails}
- ${this.variables.contactinfo}
ᅠ`,
        },
        {
          name: 'Offer Details:',
          value: this.variables.cutomDescription,
        },
        {
          name: CONSTANTS.MESSAGE.EMPTY,
          value: CONSTANTS.MESSAGE.SEPARATOR,
        },
      ],
    };
  }
}
