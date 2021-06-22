import { ICommand } from "my-module";

const PingCommand: ICommand = {
	name: "ping",
	description: "Shows api delay.",
	argsDefinitions: [],
	examples: [],
	usage: "?ping",
	async execute({ client, message }) {
		return message.channel.send(
			`:ping_pong: Pong! ${client.ws.ping}ms`,
		);
	},
};

export default PingCommand;
