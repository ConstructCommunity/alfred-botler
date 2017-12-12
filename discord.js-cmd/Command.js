String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

class Command
{
    constructor (client, infos) {
        this.client = client;
        this.infos = infos;
    }

    async run (message, args, fromPattern) { // eslint-disable-line no-unused-vars, require-await
        throw new Error(`${this.constructor.name} doesn't have a run() method.`);
    }

    usage (message) {
        let fields = [];

        fields.push({
            'name': `ᅠ`,
            'value': `ᅠ`
        });

        this.infos.args.forEach((arg, index) => {
            fields.push({
                'name': `Argument ${index + 1}:`,
                'value': `${arg.key.capitalize()}: ${arg.type.capitalize()}`
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