const path = require('path');
const fs = require('fs');

module.exports = class Bot
{
    constructor (data) {
        this.client = data.client;
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
            let cmd = new Cmd(this.client);
            console.log(`Command [${cmd.infos.name}] loaded`);
            this.commands.push(cmd);
        });
    }

    parse (message) {
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
                if (cmd.infos.args && cmd.infos.args.length > 0) {

                    if (cmd.infos.extraArgs === false && cmd.infos.args.length !== fakeCmd._args.length)
                    {
                        cmd.usage(this.message);
                        return true;
                    }

                    cmd.infos.args.forEach((arg, index) => {
                        fakeCmd.args[ arg.key ] = fakeCmd._args[ index ];
                        i++;
                    });
                }

                //Add rest of arguments inside extra
                if (i < fakeCmd._args.length) {
                    fakeCmd.args[ '_extra' ] = [];
                    for (let j = i; j < fakeCmd._args.length; j++) {
                        fakeCmd.args[ '_extra' ].push(fakeCmd._args[ j ]);
                    }
                }

                cmd.run(this.message, fakeCmd.args);
                return true;
            }
        });
    }
};