const path = require('path');
const fs = require('fs');
const CONSTANTS = require('../constants');
const Discord = require('discord.js');

const firebase = require('firebase');

const config = {
    apiKey: 'AIzaSyCwfY--Cp_9zrzxKBLpCAqCJUM8LT4fxQo',
    authDomain: 'construct2discord.firebaseapp.com',
    databaseURL: 'https://construct2discord.firebaseio.com',
    storageBucket: 'construct2discord.appspot.com',
    messagingSenderId: '271095494978'
};
firebase.initializeApp(config);

module.exports = class Bot extends Discord.Client
{
    constructor (data) {
        super();

        this.commandPrefix = data.commandPrefix;
        this.owner = data.owner;
        this.disableEveryone = data.disableEveryone;
        this.commandsPath = path.join(__dirname, '..', 'commands');
        this.commands = [];

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
            return;
        }

        this.message = message;

        let content = this.message.content.split(' ');

        let length = content[ 0 ].length;
        let name = content.shift().substr(1, length);
        let _args = [ ...content ];

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

                cmd.infos.args.some((arg, index) => {
                    let res = this.resolve(arg.type, fakeCmd._args[ index ]);

                    if (res !== null) {
                        fakeCmd.args[ arg.key ] = res;
                    } else {
                        this.message.reply(`Argument "${fakeCmd._args[ index ]}" is not resolvable to "${arg.type}"`);
                        return true;
                    }
                    i++;
                });
                //}

                //Add rest of arguments inside extra
                if (i < fakeCmd._args.length) {
                    fakeCmd.args[ '_extra' ] = [];
                    for (let j = i; j < fakeCmd._args.length; j++) {
                        fakeCmd.args[ '_extra' ].push(fakeCmd._args[ j ]);
                    }
                }

                let hasRole = false;
                let goodChannel = false;

                if (!cmd.infos.permissions || !cmd.infos.permissions.roles || !cmd.infos.permissions.channels) {
                    this.message.reply('Permissions are not set for this command. Please refer to a Staff member to notify about the problem. Thanks.');
                    return true;
                }

                cmd.infos.permissions.roles.some(role => {
                    if (role === CONSTANTS.ROLES.ANY ||
                        this.message.member.roles.has(role)) {
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

                                cmd.run(this.message, fakeCmd.args);
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
                    }).join(',')}}`);
                }

                return true;
            }
        });
    }

    resolve (type, value) {
        let isArray = false;
        console.log('Checking if ' + value + ' is type of ' + type);

        if (value === undefined || value === null)
            return false;

        //https://komada.js.org/classes_Resolver.js.html

        if (type[ 0 ] === '#') {
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
            channel: /^(?:<#)?(\d{17,21})>?$/,
            role: /^(?:<@&)?(\d{17,21})>?$/,
            snowflake: /^(\d{17,21})/
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
                    return this.channels.get(regex.channel.exec(value)[ 1 ]);
                }
                break;

            case 'user':
                if (typeof value === 'string' && regex.userOrMember.test(value)) {
                    return this.users.get(regex.userOrMember.exec(value)[ 1 ]);
                }
                break;

            default:
                break;
        }
        return false;
    }
};