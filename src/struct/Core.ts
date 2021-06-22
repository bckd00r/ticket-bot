import {
	Client,
	Collection,
} from "discord.js";
import { CONFIG } from "../config";
import { readdirSync } from "fs";
import { ICommand, IEvent } from "my-module";
import { resolve } from "path";
import * as pogger from "pogger";
import { connect } from "mongoose";

export class Core extends Client {
	public config = CONFIG;
	public commands = new Collection<string, ICommand>();

	constructor() {
		super({
			presence: {
				activity: {
					name: random(CONFIG.PRESENCE.activity.name),
					type: random(CONFIG.PRESENCE.activity.type),
				},
				status: random(CONFIG.PRESENCE.status),
				afk: CONFIG.PRESENCE.afk,
				shardID: CONFIG.PRESENCE.shardID,
			},
			partials: ["MESSAGE", "USER", "REACTION"],
		});
	}

	private async importCommands(): Promise<void> {
		const files = readdirSync(resolve(__dirname, "..", "commands"));
		for (const file of files) {
			const command = (
				await import(resolve(__dirname, "..", "commands", file))
			).default;
			this.commands.set(command.name, command);
			pogger.info(`Command loaded ${command.name}`);
		}
	}

	private async importEvents(): Promise<void> {
		const files = readdirSync(resolve(__dirname, "..", "events", "client"));
		for (const file of files) {
			const event = (
				await import(resolve(__dirname, "..", "events", "client", file))
			).default;
			this.on(event.name, (...args) => event.execute(this, ...args));
			pogger.info(`Event loaded ${event.name}`);
		}
	}

	public async connect(): Promise<string> {
		pogger.info("Loading files...");
		await this.importEvents();
		await this.importCommands();
		pogger.info("Connecting to MongoDB");
		await connect(CONFIG.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		}).then(() => pogger.success('Database connected!'));
		pogger.info("Connecting to Discord API");
		return await this.login(CONFIG.TOKEN);
	}
}

function random<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}
