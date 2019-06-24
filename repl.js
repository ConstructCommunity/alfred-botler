require('dotenv').config();
require('@babel/register');
require('@babel/polyfill');
const CONSTANTS = require('./constants');
const Discord   = require('discord.js');

const bot = new Discord.Client({
  commandPrefix  : '!',
  owner          : CONSTANTS.OWNER,
  disableEveryone: true,
});

bot.on('disconnect', closeEvent => {
  console.info('BOT DISCONNECTING');
  console.info('Close Event : ', closeEvent);
}).on('ready', async () => {
  console.log('Bot ready');

  const guild = bot.guilds.get('116497549237551109');

  await guild.fetchMembers();

  const members = guild.members.filter(member => !member.roles.has('588420010574086146')).array();
  console.log(members.length);
  for (let i = 0; i < members.length; i++) {
    let member = members[ i ];

    console.log(Math.round(i / members.length * 100) + '%');

    if (member.roles.has('588420010574086146')) {
      console.log(member.displayName + ' already have the member role');
    } else {
      try {
        await member.addRole('588420010574086146');
        console.log('Added to ' + member.displayName);
      } catch (e) {
        console.log(e);
      }
    }
  }

  console.log('Done');
  process.exit();
});

bot.login(process.env.TOKEN);
