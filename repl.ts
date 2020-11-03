require('dotenv').config();
const { CommandoClient } = require('discord.js-commando');
const CONSTANTS = require('./constants');

const bot = new CommandoClient({
  commandPrefix: '!',
  owner: CONSTANTS.OWNER,
});

bot.on('disconnect', (closeEvent) => {
  console.info('BOT DISCONNECTING');
  console.info('Close Event : ', closeEvent);
}).on('ready', async () => {
  console.log('Bot ready');

  console.log('Done');
  process.exit();
});

bot.login(process.env.TOKEN);
