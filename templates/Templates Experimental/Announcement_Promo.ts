import Template from '../Template';

export default class Promo extends Template {
  constructor(variables) {
    super('promo', variables, {
      message: 'Custom message from the author',
      author: 'AUTHOR',
      originalChan: '#feedback',
      profilePicUrl: 'https://cdn.discordapp.com/avatars/107180621981298688/a6e6e49afe3cf7c26b7e31e49266729c.png',
    });
  }

  embed() {
    return {
      title: `NEW PROMOTION FROM ${this.variables.author.toUpperCase()}`,
      description: this.variables.message,
      color: 3593036,
      footer: {
        text: `Message originally posted in #${this.variables.originalChan}`,
      },
      thumbnail: {
        url: this.variables.profilePicUrl,
      },
    };
  }
}
