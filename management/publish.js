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

let questions = [
    {
        required: true,
        name: 'commit_message',
        type: 'input',
        message: 'Please, enter your commit message: ',
        default: '-'
    },
    {
        type: 'confirm',
        message: 'Do you want to push to the current branch ?',
        name: 'push'
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
}

prompt(questions).then(answers => {
    try {
        start_process(answers);
    } catch (e) {
        console.log('Error while processing');
    }
});