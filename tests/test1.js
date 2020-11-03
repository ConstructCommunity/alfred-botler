const test = require('ava');
const path = require('path');
const { CommandoClient } = require('discord.js-commando');

test.cb('basic', (t) => {
  const client = new CommandoClient();

  client
    .on('error', console.error)

    .on('ready', async () => {
      console.log('ready');
    });

  client.registry
    .registerGroups([
      ['test', 'Commands available only for testing'],
      ['everyone', 'Commands available to everyone'],
      ['moderation', 'Commands available only to our staff members'],
    ]);

  // client.registry.registerCommandsIn(path.join(__dirname, '..', 'commands', 'test'));
  // client.registry.registerCommandsIn(path.join(__dirname, '..', 'commands', 'everyone'));
  // client.registry.registerCommandsIn(path.join(__dirname, '..', 'commands', 'moderation'));

  client.login(process.env.TOKEN).then((res) => {
    console.log('res', res);
    t.pass();
    t.end();
  }).catch((e) => {
    if (e.message === 'An invalid token was provided.') {
      t.pass();
    } else {
      t.fail();
    }
    t.end();
  });
});
