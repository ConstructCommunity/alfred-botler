import cheerio from 'cheerio';
import got from 'got';
import * as firebase from 'firebase';
import CONSTANTS from './constants';
import C3Update from './templates/Announcement_C3';

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

/*
export const checkBlogPosts = async () => {
  const options = {
    method: 'GET',
    url: 'https://www.construct.net/blogs/posts',
    headers: {
      'postman-token': '1b97c5c0-e824-005d-ada1-feb10f276375',
      'cache-control': 'no-cache',
    },
  };

  got(options, (error, response, body) => {
    if (error) {
      throw new Error(error);
    }

    // console.info( body);
    // console.info("Requested");

    const $ = cheerio.load(body);
    const newTitle = $('form#form1 div:nth-child(3) > div:nth-child(1) > div > div.titleOuterWrap > div > div.right > a')
      .text().trim();
    const author = $('form#form1 div:nth-child(3) > div:nth-child(1) > div > div.statWrap > div:nth-child(2) > div > div#Wrapper > ul > li.username > a')
      .text();
    const timeToRead = $('form#form1 div:nth-child(3) > div:nth-child(1) > div > div.statWrap > div:nth-child(1) > div > ul > li:nth-child(2)')
      .text().replace(/<img(.*)>/, '').replace('read time', '')
      .trim();
    const link = $('#form1 > div.bodyWrapper > div > div > div > div:nth-child(3) > div:nth-child(1) > div > div.titleOuterWrap > div > div.right > a')
      .attr('href').trim().replace(/^(.*?)\/blogs/, 'https://www.construct.net/blogs');

    database.ref('blog').once('value').then((snapshot) => {
      let title;
      if (snapshot.val() === undefined) {
        title = '-';
      } else {
        title = snapshot.val();
      }
      if (title !== newTitle && newTitle !== '') {
        this.channels.get(CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS).send('@here', {
          embed: {
            description: `${newTitle}`,
            color: 3593036,
            footer: {
              text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
            },
            thumbnail: {
              url: 'https://cdn.discordapp.com/attachments/244447929400688650/328696208719740929/BLOGiconsmall.png',
            },
            author: {
              name: `A NEW BLOG POST BY ${author.toUpperCase()} JUST WENT LIVE!`,
              icon_url: 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png',
            },
            fields: [
              {
                name: CONSTANTS.MESSAGE.SEPARATOR,
                value: 'ᅠ',
              },
              {
                name: `Read the new blog post (${timeToRead}):`,
                value: `<${link}>`,
              },
            ],
          },
        });

        database.ref('blog').set(newTitle);
        console.info('Set!');
      }
    });
  });
};
*/

/*
export const checkC2Updates = async () => {
  const options = {
    method: 'GET',
    url: 'https://www.scirra.com/construct2/releases',
  };

  got(options, (error, response, body) => {
    if (error) {
      throw new Error(error);
    }

    const $ = cheerio.load(body);

    const newRel = $('#Form1')
      .find('div.content-wrap > div.inner-content-wrap > div.releases-wrapper > table > tbody > tr:nth-child(1) > td.leftcol > a')
      .text().trim()
      .replace('Construct 2 ', '');
    const summary = $('#Form1')
      .find('div.content-wrap > div.inner-content-wrap > div.releases-wrapper > table > tbody > tr:nth-child(1) > td.leftcol > p')
      .text().trim();

    database.ref('c2release').once('value').then((snapshot) => {
      let rel;
      if (snapshot.val() === undefined) {
        rel = '-';
      } else {
        rel = snapshot.val();
      }
      // console.info('Database : \'' + rel + '\' vs Online : \'' + newRel + '\'');
      if (rel !== newRel && newRel !== '') {
        this.channels.get(CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS).send('@here', {
          embed: {
            description: `${summary}`,
            color: 16316662,
            footer: {
              text: CONSTANTS.MESSAGE.SCIRRA_FOOTER,
            },
            thumbnail: {
              url: 'https://cdn.discordapp.com/attachments/244447929400688650/328688092963930112/C2iconsmall.png',
            },
            author: {
              name: truncate(`CONSTRUCT 2 UPDATE (${newRel}) IS AVAILABLE!`, 255),
              icon_url: 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png',
            },
            fields: [
              {
                name: CONSTANTS.MESSAGE.SEPARATOR,
                value: 'ᅠ',
              },
              {
                name: 'View the complete changelog:',
                value: `https://www.scirra.com/construct2/releases/${newRel.toLowerCase()}`,
              },
            ],
          },
        });

        database.ref('c2release').set(newRel);
        console.info('Set!');
      }
    });
  });
};
*/

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
