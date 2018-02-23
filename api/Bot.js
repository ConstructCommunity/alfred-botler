const path      = require('path');
const fs        = require('fs');
const CONSTANTS = require('../constants');
const Discord   = require('discord.js');
const Raven     = require('raven');
const request   = require('request');
const WebSocket = require('ws');
const cheerio   = require('cheerio');

const firebase = require('firebase');

const config = {
    apiKey           : 'AIzaSyCwfY--Cp_9zrzxKBLpCAqCJUM8LT4fxQo',
    authDomain       : 'construct2discord.firebaseapp.com',
    databaseURL      : 'https://construct2discord.firebaseio.com',
    storageBucket    : 'construct2discord.appspot.com',
    messagingSenderId: '271095494978'
};
firebase.initializeApp(config);

let database = firebase.database();

const truncate = function (string, n) {
    return string.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
};

module.exports = class Bot extends Discord.Client {
    constructor (data) {
        super();

        this.commandPrefix   = data.commandPrefix;
        this.owner           = data.owner;
        this.disableEveryone = data.disableEveryone;
        this.commandsPath    = path.join(__dirname, '..', 'commands');
        this.commands        = [];

        this.loadCommands();
    }

    loadCommands () {
        let files = fs.readdirSync(this.commandsPath, 'utf8');

        files.forEach(file => {
            let Cmd = require(path.join(this.commandsPath, file));
            let cmd = new Cmd(this, firebase.database());
            console.log(`Command [${cmd.infos.name}] loaded`);
            this.commands.push(cmd);
        });
    }

    parse (message) {
        if (message.channel.type === 'group') {
            return;
        }

        if (message.author === this.user) {
            return;
        }

        if (!message.content.startsWith(this.commandPrefix)) {
            console.log(`#${message.channel.name} @${message.author.username}: ${message.content}`);
            return;
        }

        this.message = message;

        let content = this.message.content.split(' ');

        let length = content[0].length;
        let name   = content.shift().substr(1, length);
        let _args  = [...content];

        this.run({
            _args,
            name
        });
    }

    run (fakeCmd) {
        this.commands.some(cmd => {
            if (cmd.infos.name === fakeCmd.name) {

                fakeCmd.args = {};

                let i = 0;
                //if (cmd.infos.args && cmd.infos.args.length > 0) {

                if (cmd.infos.extraArgs === false && cmd.infos.args.length !== fakeCmd._args.length) {
                    cmd.usage(this.message);
                    return true;
                }

                if (cmd.infos.args && cmd.infos.args.length > 0) {
                    cmd.infos.args.some((arg, index) => {
                        let res = this.resolve(arg.type, fakeCmd._args[index]);

                        if (res !== null) {
                            fakeCmd.args[arg.key] = res;
                        } else {
                            this.message.reply(`Argument "${fakeCmd._args[index]}" is not resolvable to "${arg.type}"`);
                            return true;
                        }
                        i++;
                    });
                }

                //Add rest of arguments inside extra
                if (i < fakeCmd._args.length) {
                    fakeCmd.args['_extra'] = [];
                    for (let j = i; j < fakeCmd._args.length; j++) {
                        fakeCmd.args['_extra'].push(fakeCmd._args[j]);
                    }
                }

                let hasRole     = false;
                let goodChannel = false;

                if (!cmd.infos.permissions || !cmd.infos.permissions.roles || !cmd.infos.permissions.channels) {
                    this.message.reply('Permissions are not set for this command. Please refer to a Staff member to notify about the problem. Thanks.');
                    return true;
                }

                cmd.infos.permissions.roles.some(role => {
                    if (role === CONSTANTS.ROLES.ANY ||
                        (this.message.member.roles && this.message.member.roles.has(role))) {
                        hasRole = true;
                        cmd.infos.permissions.channels.some(async channel => {
                            if (channel === CONSTANTS.CHANNELS.ANY ||
                                this.message.channel.id === channel ||
                                this.message.channel.id === CONSTANTS.CHANNELS.TEST ||
                                this.message.channel.id === CONSTANTS.CHANNELS.PRIVATE_TESTS) {
                                goodChannel = true;

                                let del;
                                if (cmd.infos.deleteCmd) {
                                    del = await
                                        this.message.delete();
                                }

                                try {
                                    let x = await cmd.run(this.message, fakeCmd.args);
                                } catch (e) {
                                    console.log('ERROR', e);
                                    Raven.captureException(e);
                                    return false;
                                }
                                return true;
                            }
                        });
                        return true;
                    }
                });

                if (!hasRole) {
                    this.message.reply('I\'m sorry, you don\'t have enough rights to execute this command.');
                } else if (hasRole && !goodChannel) {
                    this.message.reply(`I\'m sorry, this command is only available in the following channels: ${cmd.infos.permissions.channels.map(elem => {
                        return `<#${elem}>`;
                    }).join(',')}`);
                }

                return true;
            }
        });
    }

    resolve (type, value) {
        let isArray = false;
        console.log('Checking if ' + value + ' is type of ' + type);

        if (value === undefined || value === null) {
            return false;
        }

        //https://komada.js.org/classes_Resolver.js.html

        if (type[0] === '#') {
            type = type.slice(1);
            if (value.split(',').length > 1) {
                isArray = true;
            }
        }

        if (isArray) {
            let array = value.split(',');
            console.log(array);

            let users = [];
            array.every((item) => {
                let clientUser = this.isType(type, item);
                console.log(clientUser.username);

                if (clientUser === null) {
                    users = null;
                    return false;
                }
                users.push(clientUser);
                return true;
            });

            return users;
        } else {
            return this.isType(type, value);
        }
    }

    isType (type, value) {
        const regex = {
            userOrMember: /^(?:<@!?)?(\d{17,21})>?$/,
            channel     : /^(?:<#)?(\d{17,21})>?$/,
            role        : /^(?:<@&)?(\d{17,21})>?$/,
            snowflake   : /^(\d{17,21})/
        };

        switch (type) {
            case 'string':
                if (typeof value === type) {
                    return value;
                }
                break;

            case 'number':
                value = parseFloat(value);
                if (typeof value === type) {
                    return value;
                }
                break;

            case 'channel':
                if (typeof value === 'string' && regex.channel.test(value)) {
                    return this.channels.get(regex.channel.exec(value)[1]);
                }
                break;

            case 'user':
                if (typeof value === 'string' && regex.userOrMember.test(value)) {
                    return this.users.get(regex.userOrMember.exec(value)[1]);
                }
                break;

            default:
                break;
        }
        return false;
    }

    checkSignaling () {
        const SIGNALLING_WEBSOCKET_PROTOCOL = 'c2multiplayer';

        function connect (url_) {
            return new Promise((resolve, reject) => {
                const ws = new WebSocket(url_, {protocol: SIGNALLING_WEBSOCKET_PROTOCOL});
                ws.on('open', event => {
                    resolve(true);
                });
                ws.on('error', event => {
                    // console.info(event);
                    resolve(false);
                });
            });
        }

        setInterval(() => {
            connect('wss://multiplayer.scirra.com').then(ret => {
                // console.info(ret);
                database.ref('signaling').once('value').then(snapshot => {
                    let status;
                    if (snapshot.val() === undefined) {
                        return;
                    }

                    status = snapshot.val();

                    //console.info('Database : \'' + status + '\' vs Online : \'' + ret + '\'');
                    if (status !== ret) {
                        this.channels.get(CONSTANTS.CHANNELS.COMMUNITY_ANNOUNCEMENTS).send({
                            embed: {
                                description: (ret ? `The Scirra signaling server is online` : `The Scirra signaling server is offline`),
                                color      : (ret ? 65280 : 16719647),
                                footer     : {
                                    text: 'Event-Watcher made by Armaldio • (Some events might be delayed!)'
                                },
                                thumbnail  : {
                                    url: 'https://cdn.discordapp.com/attachments/244447929400688650/328699716563107840/WATCHERiconsmall.png'
                                },
                                author     : {
                                    name    : 'WARNING, AN EVENT OCCURRED!',
                                    icon_url: 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
                                },
                                fields     : [
                                    {
                                        name : '----------------------------------',
                                        value: 'ᅠ'
                                    }
                                ]
                            }
                        });

                        database.ref('signaling').set(ret);
                        console.info('Set!');
                    }
                });
            });
        }, 300000);
    }

    checkBlogsAndUpdates () {
        setInterval(() => {
            /**
             * Blog
             */

            let options = {
                method : 'GET',
                url    : 'https://www.scirra.com/blog',
                headers: {
                    'postman-token': '1b97c5c0-e824-005d-ada1-feb10f276375',
                    'cache-control': 'no-cache'
                }
            };

            request(options, (error, response, body) => {
                if (error) {
                    throw new Error(error);
                }

                // console.info( body);
                // console.info("Requested");

                const $         = cheerio.load(body);
                const new_title = $('#Form1 > div.content-wrap > div.inner-content-wrap > h1').text();
                //			Let new_desc = $('meta[property="description"]').attr('content');

                database.ref('blog').once('value').then(snapshot => {
                    let title;
                    if (snapshot.val() === undefined) {
                        title = '-';
                    } else {
                        title = snapshot.val();
                    }
                    //console.info('Database : \'' + title + '\' vs Online : \'' + new_title + '\'');
                    //				console.info("Desc : " + new_desc);
                    if (title !== new_title && new_title !== '') {
                        this.channels.get(CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS).send('@here', {
                            embed: {
                                description: `${new_title}`,
                                color      : 3593036,
                                footer     : {
                                    text: CONSTANTS.MESSAGE.SCIRRA_FOOTER
                                },
                                thumbnail  : {
                                    url: 'https://cdn.discordapp.com/attachments/244447929400688650/328696208719740929/BLOGiconsmall.png'
                                },
                                author     : {
                                    name    : 'A NEW BLOG POST BY SCIRRA JUST WENT LIVE!',
                                    icon_url: 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
                                },
                                fields     : [
                                    {
                                        name : '----------------------------------',
                                        value: 'ᅠ'
                                    },
                                    {
                                        name : 'Read the new blog post:',
                                        value: '<https://www.scirra.com/blog>'
                                    }
                                ]
                            }
                        });

                        database.ref('blog').set(new_title);
                        console.info('Set!');
                    }
                });
            });

            /**
             * Ashley post
             */

            options = {
                method : 'GET',
                url    : 'https://www.scirra.com/blog/ashley',
                headers: {
                    'postman-token': '1b97c5c0-e824-005d-ada1-feb10f276375',
                    'cache-control': 'no-cache'
                }
            };

            request(options, (error, response, body) => {
                if (error) {
                    throw new Error(error);
                }

                // console.info(body);
                // console.info("Requested");

                const $         = cheerio.load(body);
                const new_title = $('#Form1 > div.content-wrap > div.inner-content-wrap > h1').text();
                //			Let new_desc = $('meta[property="description"]').attr('content');

                database.ref('blog-ashley').once('value').then(snapshot => {
                    let title;
                    if (snapshot.val() === undefined) {
                        title = '-';
                    } else {
                        title = snapshot.val();
                    }
                    //console.info('Database : \'' + title + '\' vs Online : \'' + new_title + '\'');
                    //				console.info("Desc : " + new_desc);
                    if (title !== new_title && new_title !== '') {
                        this.channels.get(CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS).send('@here', {
                            embed: {
                                description: `${new_title}`,
                                color      : 3593036,
                                footer     : {
                                    text: CONSTANTS.MESSAGE.SCIRRA_FOOTER
                                },
                                thumbnail  : {
                                    url: 'https://cdn.discordapp.com/attachments/244447929400688650/328696208719740929/BLOGiconsmall.png'
                                },
                                author     : {
                                    name    : 'A NEW BLOG POST BY ASHLEY JUST WENT LIVE!',
                                    icon_url: 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
                                },
                                fields     : [
                                    {
                                        name : '----------------------------------',
                                        value: 'ᅠ'
                                    },
                                    {
                                        name : 'Read the new blog post:',
                                        value: '<https://www.scirra.com/blog/ashley>'
                                    }
                                ]
                            }
                        });

                        database.ref('blog-ashley').set(new_title);
                        console.info('Set!');
                    }
                });
            });

            /**
             * Tom post
             */

            options = {
                method : 'GET',
                url    : 'https://www.scirra.com/blog/tom',
                headers: {
                    'postman-token': '1b97c5c0-e824-005d-ada1-feb10f276375',
                    'cache-control': 'no-cache'
                }
            };

            request(options, (error, response, body) => {
                if (error) {
                    throw new Error(error);
                }

                // console.info(body);
                // console.info("Requested");

                const $         = cheerio.load(body);
                const new_title = $('#Form1 > div.content-wrap > div.inner-content-wrap > h1').text();
                //			Let new_desc = $('meta[property="description"]').attr('content');

                database.ref('blog-tom').once('value').then(snapshot => {
                    let title;
                    if (snapshot.val() === undefined) {
                        title = '-';
                    } else {
                        title = snapshot.val();
                    }
                    //console.info('Database : \'' + title + '\' vs Online : \'' + new_title + '\'');
                    //				console.info("Desc : " + new_desc);
                    if (title !== new_title && new_title !== '') {
                        this.channels.get(CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS).send('@here', {
                            embed: {
                                description: `${new_title}`,
                                color      : 3593036,
                                footer     : {
                                    text: CONSTANTS.MESSAGE.SCIRRA_FOOTER
                                },
                                thumbnail  : {
                                    url: 'https://cdn.discordapp.com/attachments/244447929400688650/328696208719740929/BLOGiconsmall.png'
                                },
                                author     : {
                                    name    : 'A NEW BLOG POST BY TOM JUST WENT LIVE!',
                                    icon_url: 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
                                },
                                fields     : [
                                    {
                                        name : '----------------------------------',
                                        value: 'ᅠ'
                                    },
                                    {
                                        name : 'Read the new blog post:',
                                        value: '<https://www.scirra.com/blog/tom>'
                                    }
                                ]
                            }
                        });

                        database.ref('blog-tom').set(new_title);
                        console.info('Set!');
                    }
                });
            });

            /**
             * C3 releases
             */
            options = {
                method: 'GET',
                url   : 'https://www.construct.net/make-games/releases'
            };

            request(options, (error, response, body) => {
                if (error) {
                    throw new Error(error);
                }

                const $         = cheerio.load(body);
                const $releases = $('.releases');

                const new_rel = $($releases).find('table > tbody > tr:nth-child(1) > td:nth-child(1) > div > a').text()
                                            .trim();
                const branch  = $($releases).find('table > tbody > tr:nth-child(1) > td:nth-child(2) > a').attr('href')
                                            .split('/').pop();
                const summary = $($releases).find('table > tbody > tr:nth-child(1) > td.l > a').text()
                                            .trim();

                database.ref('c3release').once('value').then(snapshot => {
                    let rel;
                    if (snapshot.val() === undefined) {
                        rel = '-';
                    } else {
                        rel = snapshot.val();
                    }
                    //console.info('Database : \'' + rel + '\' vs Online : \'' + new_rel + '\'');
                    //console.log('summary', summary);
                    if (rel !== new_rel && new_rel !== '') {
                        this.channels.get(CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS).send('@here', {
                            embed: {
                                description: `${summary}`,
                                color      : 2683090,
                                footer     : {
                                    text: CONSTANTS.MESSAGE.SCIRRA_FOOTER
                                },
                                thumbnail  : {
                                    url: 'https://cdn.discordapp.com/attachments/244447929400688650/328682485296922626/C3iconsmall.png'
                                },
                                author     : {
                                    name    : truncate(`CONSTRUCT 3 ${branch.toUpperCase()} UPDATE (${new_rel}) IS AVAILABLE!`, 255),
                                    icon_url: 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
                                },
                                fields     : [
                                    {
                                        name : CONSTANTS.MESSAGE.SEPARATOR,
                                        value: 'ᅠ'
                                    },
                                    {
                                        name : 'View the complete changelog:',
                                        value: `https://www.construct.net/make-games/releases/${branch.toLowerCase()}/${new_rel.replace('.', '-')}`
                                    }
                                ]
                            }
                        });

                        database.ref('c3release').set(new_rel);
                        console.info('Set c3 release');
                    }
                });
            });

            /**
             * C2 releases
             */
            options = {
                method: 'GET',
                url   : 'https://www.scirra.com/construct2/releases'
            };

            request(options, (error, response, body) => {
                if (error) {
                    throw new Error(error);
                }

                const $ = cheerio.load(body);

                const new_rel = $('#Form1')
                    .find('div.content-wrap > div.inner-content-wrap > div.releases-wrapper > table > tbody > tr:nth-child(1) > td.leftcol > a')
                    .text().trim().replace('Construct 2 ', '');
                const summary = $('#Form1')
                    .find('div.content-wrap > div.inner-content-wrap > div.releases-wrapper > table > tbody > tr:nth-child(1) > td.leftcol > p')
                    .text().trim();

                database.ref('c2release').once('value').then(snapshot => {
                    let rel;
                    if (snapshot.val() === undefined) {
                        rel = '-';
                    } else {
                        rel = snapshot.val();
                    }
                    //console.info('Database : \'' + rel + '\' vs Online : \'' + new_rel + '\'');
                    if (rel !== new_rel && new_rel !== '') {
                        this.channels.get(CONSTANTS.CHANNELS.SCIRRA_ANNOUNCEMENTS).send('@here', {
                            embed: {
                                description: `${summary}`,
                                color      : 16316662,
                                footer     : {
                                    text: CONSTANTS.MESSAGE.SCIRRA_FOOTER
                                },
                                thumbnail  : {
                                    url: 'https://cdn.discordapp.com/attachments/244447929400688650/328688092963930112/C2iconsmall.png'
                                },
                                author     : {
                                    name    : truncate(`CONSTRUCT 2 UPDATE (${new_rel}) IS AVAILABLE!`, 255),
                                    icon_url: 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
                                },
                                fields     : [
                                    {
                                        name : '----------------------------------',
                                        value: 'ᅠ'
                                    },
                                    {
                                        name : 'View the complete changelog:',
                                        value: `https://www.scirra.com/construct2/releases/${new_rel.toLowerCase()}`
                                    }
                                ]
                            }
                        });

                        database.ref('c2release').set(new_rel);
                        console.info('Set!');
                    }
                });
            });
        }, 600000);
    }

    checkNewPlugins () {
        setInterval(() => {
        /**
         * C3
         */

        let options = {
            method : 'GET',
            url    : 'https://www.construct.net/make-games/addons?sort=0&q=',
            headers: {
                'cache-control': 'no-cache'
            }
        };

        request(options, (error, response, body) => {
            if (error) {
                throw new Error(error);
            }

            const $                = cheerio.load(body);
            const image            = $('#form1 > div.bodyWrapper > div > div > div.twoCol > div:nth-child(2) > div:nth-child(2) > a > img')
                .data('src');
            const new_title        = $('#form1 > div.bodyWrapper > div > div > div.twoCol > div:nth-child(2) > div:nth-child(2) > div.top > a')
                .text().replace('\n', '');
            const link             = $('#form1 > div.bodyWrapper > div > div > div.twoCol > div:nth-child(2) > div:nth-child(2) > div.top > a')
                .attr('href');
            const smallDescription = $('#form1 > div.bodyWrapper > div > div > div.twoCol > div:nth-child(2) > div:nth-child(2) > p')
                .text();

            console.log(image);
            console.log(new_title);
            console.log(smallDescription);
            console.log(link);

            console.log("this is it: ", image.split('.').pop());

            database.ref('lastc3plugin').once('value').then(snapshot => {
                let title;
                if (snapshot.val() === undefined) {
                    title = '-';
                } else {
                    title = snapshot.val();
                }
                if (title !== new_title && new_title !== '') {

                    this.channels.get(CONSTANTS.CHANNELS.PLUGIN_ANNOUNCE).send({
                        embed: {
                            description: `${smallDescription}`,
                            color      : 2683090,
                            footer     : {
                                text: CONSTANTS.MESSAGE.SCIRRA_FOOTER
                            },
                            thumbnail  : {
                                url: image.split('.').pop() === "svg" ? "https://cdn.discordapp.com/attachments/244447929400688650/388355208247246848/channeladdedicon.png" : image
                            },
                            author     : {
                                name    : `${new_title.toUpperCase()} (C3 ADDON) JUST WENT LIVE!`,
                                icon_url: 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
                            },
                            "fields": [
                                {
                                    "name": CONSTANTS.MESSAGE.SEPARATOR,
                                    "value": "ᅠ"
                                },
                                {
                                    "name": "View the addon page:",
                                    "value": `https://www.construct.net${link}`
                                }
                            ]
                        }
                    });

                    database.ref('lastc3plugin').set(new_title);

                }
            });

        });

        /**
         * C2
         */

        options = {
            method : 'GET',
            url    : 'https://www.construct.net/construct-2/addons?sort=0&q=',
            headers: {
                'cache-control': 'no-cache'
            }
        };

        request(options, (error, response, body) => {
            if (error) {
                throw new Error(error);
            }

            const $                = cheerio.load(body);
            const image            = $('#form1 > div.bodyWrapper > div > div > div.twoCol > div:nth-child(2) > div:nth-child(2) > a > img:nth-child(1)')
                .data('src');
            const new_title        = $('#form1 > div.bodyWrapper > div > div > div.twoCol > div:nth-child(2) > div:nth-child(2) > div.top > a')
                .text().replace('\n', '');
            const link             = $('#form1 > div.bodyWrapper > div > div > div.twoCol > div:nth-child(2) > div:nth-child(2) > div.top > a')
                .attr('href');
            const smallDescription = $('#form1 > div.bodyWrapper > div > div > div.twoCol > div:nth-child(2) > div:nth-child(2) > p')
                .text();

            console.log(image);
            console.log(new_title);
            console.log(smallDescription);
            console.log(link);

            database.ref('lastc2plugin').once('value').then(snapshot => {
                let title;
                if (snapshot.val() === undefined) {
                    title = '-';
                } else {
                    title = snapshot.val();
                }
                if (title !== new_title && new_title !== '') {

                    this.channels.get(CONSTANTS.CHANNELS.PLUGIN_ANNOUNCE).send({
                        embed: {
                            description: `${smallDescription}`,
                            color      : 16316662,
                            footer     : {
                                text: CONSTANTS.MESSAGE.SCIRRA_FOOTER
                            },
                            thumbnail  : {
                                url: image.split('.').pop() === "svg" ? "https://cdn.discordapp.com/attachments/244447929400688650/388355208247246848/channeladdedicon.png" : image
                            },
                            author     : {
                                name    : `${new_title.toUpperCase()} (C2 ADDON) JUST WENT LIVE!`,
                                icon_url: 'https://cdn.discordapp.com/attachments/244447929400688650/328647581984882709/AlfredBotlerSmall.png'
                            },
                            "fields": [
                                {
                                    "name": CONSTANTS.MESSAGE.SEPARATOR,
                                    "value": "ᅠ"
                                },
                                {
                                    "name": "View the addon page:",
                                    "value": `https://www.construct.net${link}`
                                }
                            ]
                        }
                    });

                    database.ref('lastc2plugin').set(new_title);

                }
            });

        });
        }, 30000);

    }

    updateMessage () {
        /*setInterval(async () => {
            const os = require('os');

            let messageID = CONSTANTS.AUTO.MESSAGE;
            let channel = CONSTANTS.AUTO.CHANNEL;

            String.prototype.toHHMMSS = function () {
                var sec_num = parseInt(this, 10); // don't forget the second param
                var hours   = Math.floor(sec_num / 3600);
                var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                var seconds = sec_num - (hours * 3600) - (minutes * 60);

                if (hours   < 10) {hours   = "0"+hours;}
                if (minutes < 10) {minutes = "0"+minutes;}
                if (seconds < 10) {seconds = "0"+seconds;}
                return hours+':'+minutes+':'+seconds;
            }

            let message = await this.channels.get(channel).fetchMessage(messageID);

            let _ = await message.edit(os.uptime().toString().toHHMMSS());

        }, 1000);*/
    }
};