import { ActivityType, PresenceStatusData } from "discord.js";
import { config } from "dotenv";

config();

const CLIENT_ID = process.env.CLIENT_ID as string;

export const CONFIG = {
	TOKEN: process.env.TOKEN as string,
	MONGODB_URI: process.env.MONGODB_URI as string,
	CLIENT_ID,
	Disco_INVITE: `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=applications.commands`,
	DEFAULT_INVITE: `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=bot&permissions=268725328`,
	PRESENCE: {
		activity: {
			name: [
				"Status message 1!",
				"Status message 2!",
			],
			type: ["WATCHING", "LISTENING", "COMPETING"] as ActivityType[],
		},
		status: ["idle", "online", "dnd"] as PresenceStatusData[],
		afk: false,
		shardID: 0,
	},
	DEFAULT_RANK_COLOR: "ffffff",
	SUPPORT_SERVER: "https://discord.gg/BjEJFwh",
	REACTION_MESSAGE_ID: "818148143513206785",
};
