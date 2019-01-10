import cheerio from 'cheerio';
import got from 'got';
import * as firebase from 'firebase';
import CONSTANTS from './constants';
import { C3Update, C2Update, Blog } from './templates';

const database = firebase.database();

// const isDev = process.env.NODE_ENV === 'development';

// const truncate = (string, max) => (string.length > max ? `${string.substring(0, max)}...` : string);

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

  console.log('hasRole', hasRole);
  console.log('isInChannel', isInChannel);

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
    const image = common.find('.statWrap > div:nth-child(2) > div > div#Wrapper > a > div > div > img:nth-child(3)')
      .attr('data-src');

    console.log(image);

    database.ref('blog').once('value').then((snapshot) => {
      const title = snapshot.val();

      if (title !== newTitle && newTitle !== '') {
        client.channels.get(
          scirraStaff.includes(author)
            ? CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS
            : CONSTANTS.CHANNELS.COMMUNITY_ANNOUNCEMENTS,
        ).send({
          embed: Blog({
            title: newTitle,
            author,
            timeToRead,
            link,
            image,
          }),
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
      client.channels.get(CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS).send({
        embed: C2Update({
          description: summary,
          version: newVersion,
          link: url,
        }),
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
      client.channels.get(CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS).send({
        embed: C3Update({
          description,
          version: newVersion,
          link: url,
          icon: branch === 'stable' ? 'C3Stableicon' : 'C3Betaicon',
        }),
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
