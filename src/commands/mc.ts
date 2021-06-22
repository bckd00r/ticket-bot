import { ICommand } from "my-module";
import { MessageEmbed } from "discord.js";

const MinecraftCommand: ICommand = {
	name: "mc",
	description: "Shows minecraft your searched minecraft server statics :)",
	argsDefinitions: [
        {
			name: "server",
			default: true,
			type: String,
		},
    ],
	examples: [],
	usage: "?mc <ip adresi>",
	async execute({ client, message, args }) {
		if (!args.server) return message.channel.send('Please set server.')
		const embed = new MessageEmbed()
		.setImage(`http://status.mclive.eu/${args.server as string}/${args.server as string}/25565/banner.png`)
		.setColor('RANDOM')
		.setFooter((args.server as string).toUpperCase(), process.env.ICON)
		return message.channel.send(embed)
	},
};

export default MinecraftCommand;
