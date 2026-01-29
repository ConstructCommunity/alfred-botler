import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
import { commandsList } from './commands';
import CONSTANTS from './constants';

dotenv.config();

const commands = [];
for (const command of commandsList) {
	commands.push(command.data.toJSON());
}

const rest = new REST().setToken(process.env.TOKEN!);

(async () => {
	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`
		);

		// Guild commands (instant update)
		await rest.put(
			Routes.applicationGuildCommands(CONSTANTS.BOT, CONSTANTS.GUILD_ID),
			{ body: commands }
		);

		console.log(
			`Successfully reloaded ${commands.length} application (/) commands.`
		);
	} catch (error) {
		console.error(error);
	}
})();
