import CONSTANTS from '../../constants';
import Template from './../Template';

export default class JobOfferInfo extends Template {
  constructor(variables) {
    super('job-offer-info', variables, {
      username: 'USERNAME',
    });
  }

  embed() {
    return {
      description: `Hello ${this.variables.username}! We would like to inform you about an upcoming job offers update in the Construct Community.

This update requires your current offer(s) to be migrated over to our new system, below you will find all the instructions.`,
      color: 16719647,
      footer: {
        text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
      },
      // TODO @TheRealDannyyy Old image that is not in our Github
      thumbnail: {
        url: 'https://cdn.discordapp.com/attachments/244447929400688650/431836205164789765/movemessageicon.png',
      },
      author: {
        name: 'JOB OFFERS UPDATE - AN ACTION IS REQUIRED!',
        icon_url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/AlfredBotlericon.png`,
      },
      fields: [
        {
          name: CONSTANTS.MESSAGE.SEPARATOR,
          value: CONSTANTS.MESSAGE.EMPTY,
        },
        {
          name: 'How to migrate current offers into the new system:',
          value: '**1.** Go to the new job offers channel\n**2.** Post inside the new channel and receive a PM by *Alfred Botler*\n**3.** Fill out the job offer form with all the necessary information\n**4.** Confirm your job offer and finish the posting process\n**5.** Remove your old offer(s) inside the old job offers channel\n\n*Thanks for your time and for using our new system!*',
        },
        {
          name: CONSTANTS.MESSAGE.EMPTY,
          value: CONSTANTS.MESSAGE.SEPARATOR,
        },
      ],
    };
  }
}
