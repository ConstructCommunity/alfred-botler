/**
 * Created by Armaldio on 11/12/2017.
 */

const Command = require('../api/Command');
const CONSTANTS = require('../constants');

module.exports = class tystats extends Command
{
    constructor (client, database) {
        super(client, {
            name: 'tystats',
            description: 'Show how many people thanked you',
            examples: [ 'tystats' ],
            permissions: {
                roles: [ CONSTANTS.ROLES.ANY ],
                channels: [ CONSTANTS.CHANNELS.ANY ]
            },
            extraArgs: false,
            deleteCmd: true,
            args: []
        }, database);
    }

    async run (msg, {user}) {

        console.log(user);

        let snapshot = await this.database.ref('/thanks/' + msg.author.id).once('value');
        let count = 0;
        if (snapshot.val() !== undefined && snapshot.val() !== null) {
            count = snapshot.val().count;
        }

        msg.author.send('People **thanked you** a total of **' + count + '** times. Keep up the great work!');
    }
};