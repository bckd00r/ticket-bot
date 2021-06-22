import { IEvent } from "my-module";
import { GuildChannel } from "discord.js";
import { TicketModel } from "../../models/TicketModel";

const TicketDeleteEvent: IEvent = {
	name: "channelDelete",
	async execute(client, channel: GuildChannel) {
		const ticket = await TicketModel.findOne({
            channelId: channel.id
        });
        if (!ticket) return;
        if (ticket.closed == false) {
            await TicketModel.updateOne({ channelId: channel.id }, {
                closed: true,
            });
            console.log("ticket not closed, i'm closed.")
        }
	}
};

export default TicketDeleteEvent;
