import { IEvent } from "my-module";
import { Message, } from "discord.js";
import { bargs } from "bargs/dist";

const DiscoRegToken = /<\/(\w{3,32}):(\d{17,19})>/g;

const MessageEvent: IEvent = {
	name: "message",
	async execute(client, message: Message) {
		if (!message.content || !message.guild || message.author.bot || message.content.match(DiscoRegToken)) return;

		const prefix = process.env.PREFIX;
		if (!message.content.startsWith(prefix)) return;
		const [name, ...args] = message.content
			.slice(prefix.length)
			.split(/\s+/g);
		const command = client.commands.get(name);
		if (!command) return;

		const isSuccess = await command.execute({
			client,
			message,
			args: bargs(command.argsDefinitions, args),
		});

		if (!isSuccess) {
			console.log(command.name + " " + "Error")
		}

	}
};

export default MessageEvent;
