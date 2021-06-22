declare module "my-module" {
	export interface ICommand {
		name: string;
		description: string;
		usage: string;
		examples: string[];
		argsDefinitions: import("bargs").OptionDefinitions;
		execute: (
			commandArgs: CommandArgs,
		) => Promise<import("discord.js").Message>;
	}
	export interface CommandArgs {
		client: import("../../struct/Core").Core;
		message: import("discord.js").Message;
		args: import("bargs").Result;
	}

	export interface IEvent {
		name: string;
		execute: (
			client: import("../../struct/Core").Core,
			...args: any[]
		) => Promise<unknown>;
	}

	export interface ITicket {
		collector: import("discord.js-collector").ReactionCollector;
	}
}
