String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

/**
 * Represents a command
 */
class Command
{
    /**
     * Create the command
     * @param client The client to pass to the command
     * @param infos The infos to pass to the command
     * @param database The (optional) firebase database to pass to the command
     */
    constructor (client, infos, database) {
        this.client = client;
        this.infos = infos;
        this.database = database;
    }

    /**
     * Run the command
     * @param message
     * @param args
     * @returns {Promise<void>}
     */
    async run (message, args) { // eslint-disable-line no-unused-vars, require-await
        throw new Error(`${this.constructor.name} doesn't have a run() method.`);
    }

    /**
     * Show usage of the method
     * @param message
     */
    usage (message) {
        let fields = [];

        fields.push({
            'name': `ᅠ`,
            'value': `ᅠ`
        });

        this.infos.args.forEach((arg, index) => {
            fields.push({
                'name': `${arg.key.capitalize()}: ${arg.type.capitalize()}`,
                'value': `${arg.prompt}`
            });
        });

        fields.push({
            'name': `ᅠ`,
            'value': `ᅠ`
        });

        this.infos.examples.forEach((example, index) => {
            fields.push({
                'name': `Example ${index + 1}:`,
                'value': `${example}`
            });
        });

        message.channel.send({
            embed: {
                'title': `${this.infos.name.toUpperCase()} USAGE`,
                'description': `${this.infos.description}`,
                'color': 15844367,
                'footer': {
                    'text': '  '
                },
                'thumbnail': {
                    'url': 'https://cdn.discordapp.com/attachments/244447929400688650/331776445955309568/ROLEREMiconsmall.png'
                },
                'fields': fields
            }
        });
    }
}

module.exports = Command;