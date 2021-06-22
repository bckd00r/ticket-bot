import { GuildMember, MessageEmbed } from "discord.js";
import { ICommand } from "my-module";
import { getUser } from "../utils/user";
import { TicketModel } from "../models/TicketModel";

const TicketsCommand: ICommand = {
	name: "ticket-list",
	description: "Shows user tickets statistics.",
	argsDefinitions: [
        {
			name: "user",
			default: true,
			type: String,
		},
    ],
	examples: [],
	usage: "",
	async execute({ client, message, args }) {
		const user = args.user ? getUser(message.guild, (args.user as string)) as GuildMember : message.member
        if (!user) return message.channel.send("Member not found.")
        const tickets = await TicketModel.find({
            owner: {
                ownerID: user.id,
            },
        });
        const embed = new MessageEmbed()
        .setDescription(`${tickets.length} Tickets length;`)
        .addField("Answered tickets:", tickets.filter(ticket => ticket.closed == true).length)
        .addField("Active tickets:", tickets.filter(ticket => ticket.closed == false).length)
        .setColor('AQUA')
        .setFooter(`${user?.user.tag}`, process.env.ICON)
        .setTimestamp()
        return message.channel.send(
			`✨ ${user?.user.tag} about of user tickets`,
            embed,
		);
	},
};

export default TicketsCommand;
