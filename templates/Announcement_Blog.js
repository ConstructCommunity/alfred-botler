import CONSTANTS from '../constants';

export default variables => ({
  description: variables.title,
  color: 3593036,
  footer: {
    text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
  },
  thumbnail: {
    // url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/Blogicon.png`,
    url: variables.image,
  },
  author: {
    name: `NEW BLOG POST FROM ${variables.author.toUpperCase()} JUST WENT LIVE!`,
    icon_url: `${CONSTANTS.GITHUB.RAW_REPO_URL_PREFIX}/assets/mini/AlfredBotlericon.png`,
  },
  fields: [
    {
      name: CONSTANTS.MESSAGE.SEPARATOR,
      value: CONSTANTS.MESSAGE.EMPTY,
    },
    {
      name: `Read the new blog post (${variables.timeToRead} mins):`,
      value: variables.link,
    },
  ],
});
