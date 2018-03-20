const fs        = require('fs');
const path      = require('path');
const Bot       = require('../api/Bot');
const CONSTANTS = require('../constants');
const marked    = require('marked');

const bot = new Bot({
    commandPrefix  : '!',
    owner          : '107180621981298688',
    disableEveryone: true
});

bot.on('ready', () => {
    console.log('Bot ready');
    start();
});

bot.login(CONSTANTS.BOT.TOKEN);

let commandsPath = 'commands';

function generateDoc (commands) {
    let final = '';

    /*

    examples: [ 'warn @user' ],
    extraArgs: false,
    deleteCmd: false,
     */

    commands.forEach(c => {
        let infos = c.infos;

        final += `<div class="section">`;

        final += `**${infos.name}** - ${infos.description} \n\n`;

        final += `Accept extra arguments: ${infos.extraArgs === false || infos.extraArgs === undefined ? 'No' : 'Yes'} \n\n`;
        final += `Delete command        : ${infos.deleteCmd === false || infos.deleteCmd === undefined ? 'No' : 'Yes'} \n\n`;

        if (infos.args !== null && infos.args !== undefined && infos.args.length > 0) {
            final += `Parameters: \n\n`;
            final += `| Name | Type | Description |\n`;
            final += `| :--: |:---: | :---------: |\n`;

            infos.args.forEach(arg => {
                final += `| ${arg.key} | ${arg.type} | ${arg.prompt} | \n`;
            });
        }

        final += `Permissions: \n\n`;
        final += `| Allowed roles | Allowed channels |\n`;
        final += `| :-----------: | :--------------: |\n`;

        let roles = '';
        infos.permissions.roles.forEach(roleID => {
            let name = '';

            if (roleID === '-1') {
                name = 'Any';
            } else {
                name = bot.guilds.get(CONSTANTS.GUILD_ID).roles.get(roleID).name;
            }

            roles += name + ' ';
        });

        let channels = '';
        infos.permissions.channels.forEach(channelID => {
            let name = '';

            if (channelID === '-1') {
                name = 'Any';
            } else {
                name = '#' + bot.guilds.get(CONSTANTS.GUILD_ID).channels.get(channelID).name;
            }

            channels += name + ' ';
        });

        final += `| ${roles} | ${channels} |\n`;

        console.log(infos.examples);
        //if (infos.examples !== null && infos.examples !== undefined && infos.exemples.length > 0) {
        final += `Examples: \n\n`;

        infos.examples.forEach(ex => {
            final += `\`${bot.commandPrefix}${ex}\` \n\n`;
        });

        final += `</div>`;

        final += `<br>`;
    });

    fs.writeFileSync('commands.md', final, 'utf8');
    fs.writeFileSync('commands.html', marked(final), 'utf8');

}

function start () {
    let files    = fs.readdirSync(commandsPath, 'utf8');
    let commands = [];

    files.forEach(file => {
        let Cmd = require(path.join('../', commandsPath, file));
        let cmd = new Cmd();

        commands.push(cmd);
    });

    generateDoc(commands);
    process.exit(0);
}


