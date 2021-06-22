import { IEvent } from "my-module";
import { User, MessageReaction, TextChannel } from "discord.js";
import { addTicket, requestToCloseTicket } from "../../utils/ticket";


const TicketCreateEvent: IEvent = {
	name: "messageReactionAdd",
	async execute(client, reaction: MessageReaction, user: User) {
		if (reaction.message.partial) await reaction.message.fetch();
        if (user.id === client.user.id) return;
        if (!reaction.message.guild) return;
        if (reaction.emoji.name == "🔒") {
            return requestToCloseTicket(reaction.message.channel as TextChannel, user)
        }
        if (reaction.message.id != client.config.REACTION_MESSAGE_ID) return;
        if (reaction.emoji.name === "1️⃣") {
            await reaction.users.remove(user);
            return await addTicket(reaction.message.guild, user, 'option 1');
        } else if (reaction.emoji.name == "2️⃣") {
            await reaction.users.remove(user);
            return await addTicket(reaction.message.guild, user, 'option 2');
        } else if (reaction.emoji.name == "3️⃣") {
            await reaction.users.remove(user);
            return await addTicket(reaction.message.guild, user, 'minecraft');
        } else if (reaction.emoji.name == "4️⃣") {
            await reaction.users.remove(user);
            return await addTicket(reaction.message.guild, user, 'discord.js');
        } else if (reaction.emoji.name == "5️⃣") {
            await reaction.users.remove(user);
            return await addTicket(reaction.message.guild, user, 'question');
        }
	}
};

export default TicketCreateEvent;
