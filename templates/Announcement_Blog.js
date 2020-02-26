import { MessageEmbed } from 'discord.js';
import CONSTANTS from '../constants';
import Template from './Template';

export default class Blog extends Template {
  constructor(variables) {
    super('blog', variables, {
      title: '[Title]',
      author: '[Author]',
      timeToRead: '[~ 2/3 min]',
      link: 'https://',
    });
  }

  embed() {
    return new MessageEmbed()
      .setDescription(this.variables.title)
      .setColor(3593036)
      .setFooter(CONSTANTS.MESSAGE.SCIRRA_FOOTER)
      .setThumbnail(this.variables.image)
      .setAuthor(
        `NEW BLOG POST FROM ${this.variables.author.toUpperCase()} JUST WENT LIVE!`,
        `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/C3Blogicon.png`,
      )
      .addFields([
        {
          name: CONSTANTS.MESSAGE.SEPARATOR,
          value: CONSTANTS.MESSAGE.EMPTY,
        },
        {
          name: `Read the new blog post (${this.variables.timeToRead}):`,
          value: this.variables.link,
        },
      ]);
  }
}
