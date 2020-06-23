import cheerio from 'cheerio';
import got from 'got';
import Discord from 'discord.js';
import firebase from 'firebase/app';
import moment from 'moment';
import rollbar from './rollbar';
import CONSTANTS from './constants';
import Blog from './templates/Announcement_Blog';
import C3Update from './templates/Announcement_C3';
import C2Update from './templates/Announcement_C2';

import 'firebase/database';

const config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
};
firebase.initializeApp(config);

const database = firebase.database();

// const isDev = process.env.NODE_ENV === 'development';

export const truncate = (string, max) => (string.length > max ? `${string.substring(0, max)}...` : string);

/**
 * @param  {Array} arr
 */
export const removeDuplicates = (arr) => arr.reduce((x, y) => (x.includes(y) ? x : [...x, y]), []);

/**
 * @param {Discord.Message} msg
 * @param {String} toChannelId
 * @param {String} contentEditor
 * @param {Boolean} includeAttachments
 */
export const duplicateMessage = async (
  msg,
  toChannelId,
  contentEditor,
  includeAttachments = true,
) => {
  // Makes it easier to get the channels rather than doing the msg.mentions.channels thing
  const toChannel = msg.guild.channels.cache.get(toChannelId);
  if (!toChannel) {
    console.log('Could not find mentioned channel');
    return null;
  }

  let wb;
  const wbs = await toChannel.fetchWebhooks();
  if (wbs.size < 20) wb = await toChannel.createWebhook('Message duplication');

  try {
    const options = {
      username: msg.author.username,
      avatarURL: msg.author.avatarURL(),
    };

    if (includeAttachments) {
      if (msg.embeds !== null) options.embeds = msg.embeds;
      if (msg.attachments.array().length > 0) {
        options.files = [
          new Discord.MessageAttachment(
            msg.attachments.first().url,
            msg.attachments.first().filename,
          ),
        ];
      }
    }

    const message = await wb.send(contentEditor(msg.content || ''), options);
    await wb.delete('Message duplicated successfully');
    return message;
  } catch (e) {
    await wb.delete('Message not duplicated!');
    rollbar.error(e);
    console.error(e);
    return null;
  }
};

/**
 *
 * @param {Discord.Message} msg
 * @return {Promise<void>}
 */
export const checkMessageForSafety = async (msg) => {
  if (msg.author.id === CONSTANTS.BOT) return;
  if (msg.webhookID !== null) return;
  if (!msg.member) return;
  // if (msg.channel.id !== CONSTANTS.CHANNELS.PRIVATE_TESTS) return;

  const t = moment().diff(moment(msg.member.joinedTimestamp), 'hours');
  if (t < 24) {
    if (msg.content.match(/https?:\/\/(www\.)?.*\s/igm)) {
      console.log('match url');
      if (msg.content.match(/(sex|gambling|porn|dating|service|essay|hentai)/igm)) {
        console.log('match search: ', msg.content);

        // remove message in public channel
        await duplicateMessage(msg, msg.channel.id, () => '[Message removed by Alfred]', false);

        // send a message to dm of author
        await msg.author.send(`Your message was removed because:
- You have to be a member for at least 24h before posting links
- You posted NSFW content or content with blacklisted words

If this is a false positive, please let the CCStaff know. We'll be happy to help.`);

        // make a duplicate without removing initial message inside #bin
        await msg.guild.channels.cache.get(CONSTANTS.CHANNELS.BIN).send('Censored message below:');
        await msg.guild.channels.cache.get(CONSTANTS.CHANNELS.BIN).send(CONSTANTS.MESSAGE.SEPARATOR);
        await duplicateMessage(msg, CONSTANTS.CHANNELS.BIN, (content) => content);
        await msg.guild.channels.cache.get(CONSTANTS.CHANNELS.BIN).send(CONSTANTS.MESSAGE.SEPARATOR);

        // delete the original message
        await msg.delete();
      }
    }
  }
};

/**
 * @param client
 * @param permissions
 * @param msg
 * @return {string|boolean}
 */
export const hasPermissions = (client, permissions, msg) => {
  const hasRole = msg.member.roles
    .cache
    .array()
    .some(
      (role) => permissions.roles.map((r) => r.id).includes(role.id),
    ); // stop and return true if predicate match
  const isInChannel = (
    permissions.channels.includes(CONSTANTS.CHANNELS.ANY)
        || permissions.channels.includes(msg.channel.id)
        || msg.channel.id === CONSTANTS.CHANNELS.PRIVATE_TESTS
        || msg.channel.id === CONSTANTS.CHANNELS.TEST
  );

  if (hasRole && isInChannel) return true;
  if (!hasRole) return 'You are not permitted to use this command!';
  if (!isInChannel) return `Wrong channel! This command is available only in ${permissions.channels.map((chan) => `<#${chan.id}>`)}`;
  if (!isInChannel) return `Wrong channel! This command is available only in ${permissions.channels.map((chan) => `<#${chan}>`)}`;
  return false;
};

/**
 *
 * @param {Discord.Message} sent
 * @param type
 * @return {Promise<void>}
 */
export const addReactions = async (sent, type = 'dismiss') => {
  try {
    const voteUp = sent.guild.emojis.resolve('276908986744438794');
    const alfred = sent.guild.emojis.resolve('626417707373428750');
    const princess = sent.guild.emojis.resolve('626417707373428750');

    await sent.react(voteUp);

    if (type === 'c3') {
      await sent.react(alfred);
    } else if (type === 'promo') {
      //
    } else {
      await sent.react(princess);
    }
  } catch (e) {
    console.error('Cannot add reactions', e);
  }
};

export const checkBlogPosts = async (client) => {
  const scirraStaff = ['Laura_D', 'Ashley', 'Tom'];

  try {
    const { body } = await got('https://www.construct.net/blogs/posts');

    const $ = cheerio.load(body);
    const common = $('form#form1 div:nth-child(3) > div:nth-child(1) > div > div');
    const newTitle = common.find('.titleOuterWrap > div > div.right > a')
      .text().trim();
    const author = common.find('.statWrap .detailCol .usernameTextWrap a > span:nth-child(1)')
      .text();
    // .text().trim();
    const timeToRead = common.find('.statWrap > div:nth-child(1) > div > ul > li:nth-child(2)')
      .text().replace(/<img(.*)>/, '').replace('read time', '')
      .trim();
    const link = common.find('.titleOuterWrap > div > div.right > a')
      .attr('href').trim()
      .replace(/^(.*?)\/blogs/, 'https://www.construct.net/blogs');
    const image = common.find('.statWrap .avatarWrap > img')
      .attr('src');

    console.log({
      title: newTitle,
      author,
      timeToRead,
      link,
      image,
    });

    database.ref('blog').once('value').then(async (snapshot) => {
      const title = snapshot.val();

      const isScirra = scirraStaff.includes(author);

      if (title !== newTitle && newTitle !== '') {
        const sent = await client.channels.cache.get(
          isScirra
            ? CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS
            : CONSTANTS.CHANNELS.PROMO,
        ).send(isScirra ? '@here' : '', {
          embed: new Blog({
            title: newTitle,
            author,
            timeToRead,
            link,
            image,
          }).embed(),
        });

        await addReactions(sent, 'blog');

        database.ref('blog').set(newTitle);
      }
    });
  } catch (e) {
    console.error(e);
  }
};

export const checkC2Updates = async (client) => {
  try {
    console.log('Checking C2 updates');

    const { body } = await got('https://www.scirra.com/construct2/releases');
    const $ = cheerio.load(body);

    const url = $('.leftcol:first-child a').attr('href');

    const matches = url.match(/https:\/\/www\.scirra\.com\/construct2\/releases\/(.+)/);
    const newVersion = matches[1];

    const summary = $('.releases-wrapper tr:nth-child(1) > td.leftcol > p').text().trim();

    const snapshot = await database.ref('c2release').once('value');
    const lastRelease = snapshot.val();

    if (lastRelease !== newVersion && newVersion !== '') {
      console.log('New C2 release available');
      const sent = await client.channels.cache.get(CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS).send('@here', {
        embed: new C2Update({
          description: summary,
          version: newVersion,
          link: url,
        }).embed(),
      });
      await addReactions(sent, 'c2');

      await database.ref('c2release').set(newVersion);
    }
  } catch (error) {
    console.log(error);
    //= > 'Internal server error ...'
  }
};

export const checkC3Updates = async (client) => {
  try {
    console.log('Checking C3 updates');

    const { body } = await got('https://www.construct.net/en/make-games/releases');
    const $ = cheerio.load(body);

    let url = $('.allReleases ul li:first-child > a').attr('href');

    const matches = url.match(/\/en\/make-games\/releases\/(.+)\/(.+)/);

    url = url.replace('/en/make-games', '/make-games');

    const branch = matches[1];
    const newVersion = matches[2];
    const description = $('.allReleases ul li:first-child div.contentCol > div > p').text().trim();

    const snapshot = await database.ref('c3release').once('value');
    const lastRelease = snapshot.val();

    console.log('last release:', lastRelease, 'new version', newVersion);

    const snap = await database.ref('releases').once('value');
    const listReleases = snap.val();

    //  release different from latest, not empty,          not already posted
    if (lastRelease !== newVersion && newVersion !== '' && !listReleases[newVersion]) {
      console.log('New C3 release available');
      const sent = await client.channels.cache.get(CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS).send('@here', {
        embed: new C3Update({
          description,
          version: newVersion,
          link: url,
          icon: branch === 'stable' ? 'C3Stableicon' : 'C3Betaicon',
        }).embed(),
      });

      await addReactions(sent, 'c3');

      await database.ref('c3release').set(newVersion);

      listReleases[newVersion] = branch;
      await database.ref('releases').set(listReleases);
    }
  } catch (error) {
    console.log(error);
    //= > 'Internal server error ...'
  }
};

export const checkForNotificationBot = async (message) => {
  if (message.channel.id === CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS) {
    // sent from the "notification" bot
    await addReactions(message, 'notification');
  }
};

export const checkToolsHasLink = async (message) => {
  const toolsChan = CONSTANTS.CHANNELS.TOOLS;
  if (message.channel.id === toolsChan) {
    if (message.content.search(/[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi) === -1) {
      await message.delete();
      await message.author.send('**Your content does not meet one or more requirements!**\n\n__List of requirements:__\n► **1** link/embed or attachment');
    }
  }
};
