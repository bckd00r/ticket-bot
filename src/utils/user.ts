import { Guild, User, GuildMember } from "discord.js";
import { regEscape } from "./util";

export function getUser(
	guild: Guild,
	user: string,
	context?: any[],
	exact?: boolean,
): GuildMember | User {
	let users = [];
	if (context) users = context;
	else users = guild ? [...guild.members.cache.values()] : [];
	if (!users || !users.length) return null;
	const regex = exact ? "<@!?([0-9]+)>$" : "<@!?([0-9]+)>";
	const mentionId = new RegExp(regex, "g").exec(user);
	if (mentionId && mentionId.length > 1)
		return users.find((u: GuildMember) => u.id === mentionId[1]);
	if (user.indexOf("#") > -1) {
		const [name, discrim] = user.split("#");
		const nameDiscrimSearch = users.find(
			(u: GuildMember) => u.user.username === name && u.user.discriminator === discrim,
		);
		if (nameDiscrimSearch) return nameDiscrimSearch;
	}
	if (user.match(/^([0-9]+)$/)) {
		const userIdSearch = users.find((u: GuildMember) => u.id === user);
		if (userIdSearch) return userIdSearch;
	}
	const exactNameSearch = users.find((u: GuildMember) => u.user.username === user);
	if (exactNameSearch) return exactNameSearch;
	if (!exact) {
		const escapedUser = regEscape(user);
		const userNameSearch = users.find(
			(u: GuildMember) =>
				u.user.username.match(new RegExp(`^${escapedUser}.*`, "i")) !=
				undefined,
		);
		if (userNameSearch) return userNameSearch;
	}
	return null;
}

exports = { getUser };
