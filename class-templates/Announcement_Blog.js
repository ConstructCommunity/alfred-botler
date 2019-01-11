import CONSTANTS from '../constants';
import Template from './Template';

export default class Blog extends Template {
  constructor(variables) {
    super('blog', variables, {
      title: 'TITLE',
      author: 'AUTHOR',
      timeToRead: '~ 2/3 min',
      link: 'https://',
    });
  }

  toEmbed() {
    return {
      description: this.variables.title,
      color: 3593036,
      footer: {
        text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
      },
      thumbnail: {
        // url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/Blogicon.png`,
        url: this.variables.image,
      },
      author: {
        name: `NEW BLOG POST FROM ${this.variables.author.toUpperCase()} JUST WENT LIVE!`,
        icon_url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/AlfredBotlericon.png`,
      },
      fields: [
        {
          name: CONSTANTS.MESSAGE.SEPARATOR,
          value: CONSTANTS.MESSAGE.EMPTY,
        },
        {
          name: `Read the new blog post (${this.variables.timeToRead} mins):`,
          value: this.variables.link,
        },
      ],
    };
  }
}
