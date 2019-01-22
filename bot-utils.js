import cheerio from 'cheerio';
import got from 'got';
import Discord from 'discord.js';
import * as firebase from 'firebase';
import moment from 'moment';
import CONSTANTS from './constants';
import { Blog, C3Update, C2Update } from './templates';

const database = firebase.database();

// const isDev = process.env.NODE_ENV === 'development';

export const truncate = (string, max) => (string.length > max ? `${string.substring(0, max)}...` : string);

/**
 * @param  {Array} arr
 */
export const removeDuplicates = arr => arr.reduce((x, y) => (x.includes(y) ? x : [...x, y]), []);

export const duplicateMessage = async (msg, toChannelId, contentEditor) => {
  const toChannel = msg.guild.channels.get(toChannelId); // Makes it easier to get the channels rather than doing the msg.mentions.channels thing
  if (!toChannel) {
    console.log('Could not find mentioned channel');
    return;
  }

  let wb;
  const wbs = await toChannel.fetchWebhooks();
  if (wbs.size < 20) wb = await toChannel.createWebhook('Message duplication');

  try {
    const options = {
      username: msg.author.username,
      avatarURL: msg.author.avatarURL,
    };
    if (msg.embeds !== null) options.embeds = msg.embeds;
    if (msg.attachments.array().length > 0) options.files = [new Discord.Attachment(msg.attachments.first().url, msg.attachments.first().filename)];

    const message = await wb.send(contentEditor(msg.content || ''), options);
    await wb.delete('Message duplicated successfully');
    return message;
  } catch (e) {
    await wb.delete('Message duplicated successfully');
    console.log(e);
  }
};

/**
 *
 * @param {Message} msg
 * @return {Promise<void>}
 */
export const checkMessageForSafety = async (msg) => {
  if (msg.author.id === CONSTANTS.BOT) return;
  if (msg.webhookID !== null) return;
  // if (msg.channel.id !== CONSTANTS.CHANNELS.PRIVATE_TESTS) return;

  const t = moment().diff(moment(msg.member.joinedTimestamp), 'hours');
  if (t < 24) {
    if (msg.content.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)) {
      console.log('match url');
      if (msg.content.search(/(sex|gambling|porn)/) !== -1) {
        console.log('match search: ', msg.content);

        // censor message in public channel
        await duplicateMessage(msg, msg.channel.id, () => '[CENSORED]');

        // send a message to dm of author
        await msg.author.send(`You message was censored because:
- It's been less than 24 hours you're part of this server
- You posted content with blacklisted words

If you think it's a false positive, please let the Staff know. We'll be happy to help.`);

        // make a duplicate without censor inside #bin
        await msg.guild.channels.get(CONSTANTS.CHANNELS.BIN).send('Censored message below:');
        await duplicateMessage(msg, CONSTANTS.CHANNELS.BIN, content => content);
        await msg.guild.channels.get(CONSTANTS.CHANNELS.BIN).send(CONSTANTS.MESSAGE.SEPARATOR);

        // delete the original message
        await msg.delete();
      }
    }
  }
};

export const hasPermissions = (client, permissions, msg) => {
  const hasRole = msg.member.roles
    .array()
    .some(
      role => permissions.roles.includes(role.id),
    ); // stop and return true if predicate match
  const isInChannel = (
    permissions.channels.includes(CONSTANTS.CHANNELS.ANY)
    || permissions.channels.includes(msg.channel.id)
    || msg.channel.id === CONSTANTS.CHANNELS.PRIVATE_TESTS
    || msg.channel.id === CONSTANTS.CHANNELS.TEST
  );

  if (hasRole && isInChannel) return true;
  if (!hasRole) return 'You are not pemritted to use this command!';
  if (!isInChannel) return `Wrong channel! This command is available only in ${permissions.channels.map(chan => `<#${chan.id}>`)}`;
  return false;
};

export const checkBlogPosts = async (client) => {
  const scirraStaff = ['Laura_D', 'Ashley', 'Tom'];

  try {
    const { body } = await got('https://www.construct.net/blogs/posts');

    const $ = cheerio.load(body);
    const common = $('form#form1 div:nth-child(3) > div:nth-child(1) > div > div');
    const newTitle = common.find('.titleOuterWrap > div > div.right > a')
      .text().trim();
    const author = common.find('.statWrap > div:nth-child(2) > div > div#Wrapper > ul > li.username > a')
      .text().trim();
    const timeToRead = common.find('.statWrap > div:nth-child(1) > div > ul > li:nth-child(2)')
      .text().replace(/<img(.*)>/, '').replace('read time', '')
      .trim();
    const link = common.find('.titleOuterWrap > div > div.right > a')
      .attr('href').trim()
      .replace(/^(.*?)\/blogs/, 'https://www.construct.net/blogs');
    const image = common.find('.statWrap > div:nth-child(2) > div > div#Wrapper > a > div > div > img')
      .attr('data-src');

    console.log(image);

    database.ref('blog').once('value').then((snapshot) => {
      const title = snapshot.val();

      const isScirra = scirraStaff.includes(author);

      if (title !== newTitle && newTitle !== '') {
        client.channels.get(
          isScirra
            ? CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS
            : CONSTANTS.CHANNELS.COMMUNITY_ANNOUNCEMENTS,
        ).send(isScirra ? '@here' : '', {
          embed: new Blog({
            title: newTitle,
            author,
            timeToRead,
            link,
            image,
          }).embed(),
        });

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
      client.channels.get(CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS).send('@here', {
        embed: new C2Update({
          description: summary,
          version: newVersion,
          link: url,
        }).embed(),
      });

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

    const url = $('.allReleases ul li:first-child > a').attr('href');

    const matches = url.match(/\/en\/make-games\/releases\/(.+)\/(.+)/);

    const branch = matches[1];
    const newVersion = matches[2];
    const description = $('.allReleases ul li:first-child div.contentCol > div > p').text().trim();

    const snapshot = await database.ref('c3release').once('value');
    const lastRelease = snapshot.val();

    if (lastRelease !== newVersion && newVersion !== '') {
      console.log('New C3 release available');
      client.channels.get(CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS).send('@here', {
        embed: new C3Update({
          description,
          version: newVersion,
          link: url,
          icon: branch === 'stable' ? 'C3Stableicon' : 'C3Betaicon',
        }).embed(),
      });

      await database.ref('c3release').set(newVersion);

      const snap = await database.ref('releases').once('value');
      const listReleases = snap.val();
      listReleases[newVersion] = branch;
      await database.ref('releases').set(listReleases);
    }
  } catch (error) {
    console.log(error);
    //= > 'Internal server error ...'
  }
};
