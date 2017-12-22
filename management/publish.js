/*
@set commit_message=%1
@if %commit_message% == "" (
@   echo "You must specify a commit message!"
@   exit
)

:value
    @set /p count=<version.txt
    @set /a count=%count%+1
    @echo.%count%>version.txt
    @echo.%commit_message%>commit.txt

:push
    @git add .
    @git commit -m %commit_message%
    @git push origin master
*/

const ora = require('ora');
const child_process = require('child_process');
const inquirer = require('inquirer');
let prompt = inquirer.createPromptModule();

const fs = require('fs');
const path = require('path');
const Bot = require('../api/Bot');
const CONSTANTS = require('../constants');

const bot = new Bot({
    commandPrefix: '!',
    owner: '107180621981298688',
    disableEveryone: true
});

bot.on('ready', () => {
    console.log('Bot ready');
    start();
});

bot.login(CONSTANTS.BOT.TOKEN);

let questions = [
    {
        required: true,
        name: 'commit_message',
        type: 'editor',
        message: 'Please, enter your commit message: ',
        default: '-'
    },
    {
        type: 'confirm',
        message: 'Do you want to push to the current branch ?',
        name: 'push'
    },
    {
        type: 'confirm',
        message: 'Show the message to the community ?',
        name: 'publish'
    }
];

function exec (command) {
    return new Promise((resolve, reject) => {
        child_process.exec(command, function (error, stdout, stderr) {
            if (error) {
                reject(error, stderr);
            } else {
                resolve(stdout);
            }
        });
    });
}

async function start_process (answers) {
    const spinner = ora('Removing instances');

    spinner.start();
    try {
        spinner.info(await exec('now rm alfred-botler --y'));
        spinner.succeed('Instances removed');
    } catch (err) {
        console.log('Cannot remove current instances or no active instances');
    }

    spinner.start('Publishing project');
    spinner.info(await exec('now --public'));
    spinner.succeed('Publishing successfull');

    spinner.start('Aliasing project');
    spinner.info(await exec('now alias'));
    spinner.succeed('Aliasing successfull');

    spinner.start('Scaling project');
    spinner.info(await exec('now scale alfred-botler.now.sh 1'));
    spinner.succeed('Scaling successfull');

    let add = await exec('git add .');
    let commit = await exec(`git commit -m "${answers.commit_message}"`);

    if (answers.push) {
        let push = await exec('git push origin master');
    }
    if (answers.publish) {
        let arr = answers.commit_message.split('\n');

        const fields = [];

        arr.some(el => {
            fields.push({
                name: CONSTANTS.MESSAGE.EMPTY,
                value: el
            });
        });

        const text = {
            embed: {
                title: 'Alfred got an update!',
                color: 11962861,
                fields
            }
        };

        console.log('fields', fields);

        bot.guilds.get(CONSTANTS.GUILD_ID).channels.get(CONSTANTS.CHANNELS.ALFRED_COMMANDS).send(text);
    }

}

function start () {
    prompt(questions).then(answers => {
        try {
            start_process(answers).then(_ => {
                process.exit();
            });
        } catch (e) {
            console.log('Error while processing');
        }
    });
}