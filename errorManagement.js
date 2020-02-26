import constants from './constants';

export const genericError = (err, message, args, from, Pattern, result) => {
  const text = `**__AN ERROR OCCURED!__**
**Error:** \`${err.message}\`
**Context**: \`${message.content}\`
`;

  if (process.env.NODE_ENV === 'production') {
    return message.guild.channels.cache.get(constants.CHANNELS.EVENTS).send(text);
  }
};
