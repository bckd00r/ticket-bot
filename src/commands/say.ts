import { ICommand } from "my-module";
import { Message } from "discord.js";

const SayCommand: ICommand = {
	name: "say",
	description: "send a message :)",
	argsDefinitions: [],
	examples: [],
	usage: "?say",
	async execute({ client, message }) {
		if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Insufficient permission.")
		const filter = (msg: Message) => msg.author.id === message.author.id && !msg.author.bot;
        message.channel.send("Waiting a message...").then((msg) => {
			message.channel.awaitMessages(filter, { max: 1 })
				.then(collected => {
					msg.delete()
					message.channel.send(`${collected.first().content}`);
				})
				.catch(collected => {
					message.channel.send('Uh? I guess time is up.');
				});
		});
	},
};

export default SayCommand;
