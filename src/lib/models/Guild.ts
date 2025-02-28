import { Snowflake } from 'discord.js';
import { DataTypes, Sequelize } from 'sequelize';
import { BushClient } from '../extensions/discord-akairo/BushClient';
import { BaseModel } from './BaseModel';

export interface GuildModel {
	id: Snowflake;
	prefix: string;
	autoPublishChannels: Snowflake[];
	blacklistedChannels: Snowflake[];
	blacklistedUsers: Snowflake[];
	welcomeChannel: Snowflake;
	muteRole: Snowflake;
	punishmentEnding: string;
	disabledCommands: string[];
	lockdownChannels: Snowflake[];
	autoModPhases: string[];
}

export interface GuildModelCreationAttributes {
	id: Snowflake;
	prefix?: string;
	autoPublishChannels?: Snowflake[];
	blacklistedChannels?: Snowflake[];
	blacklistedUsers?: Snowflake[];
	welcomeChannel?: Snowflake;
	muteRole?: Snowflake;
	punishmentEnding?: string;
	disabledCommands?: string[];
	lockdownChannels?: Snowflake[];
	autoModPhases?: string[];
}

export class Guild extends BaseModel<GuildModel, GuildModelCreationAttributes> implements GuildModel {
	/**
	 * The ID of the guild
	 */
	public get id(): Snowflake {
		throw new Error('This should never be executed');
	}
	public set id(_: Snowflake) {
		throw new Error('This should never be executed');
	}

	/**
	 * The bot's prefix for the guild
	 */
	public get prefix(): string {
		throw new Error('This should never be executed');
	}
	public set prefix(_: string) {
		throw new Error('This should never be executed');
	}

	/**
	 * Channels that will have their messages automatically published
	 */
	public get autoPublishChannels(): Snowflake[] {
		throw new Error('This should never be executed');
	}
	public set autoPublishChannels(_: Snowflake[]) {
		throw new Error('This should never be executed');
	}

	/**
	 * Channels where the bot won't respond in.
	 */
	public get blacklistedChannels(): Snowflake[] {
		throw new Error('This should never be executed');
	}
	public set blacklistedChannels(_: Snowflake[]) {
		throw new Error('This should never be executed');
	}

	/**
	 * Users that the bot ignores in this guild
	 */
	public get blacklistedUsers(): Snowflake[] {
		throw new Error('This should never be executed');
	}
	public set blacklistedUsers(_: Snowflake[]) {
		throw new Error('This should never be executed');
	}

	/**
	 * The channels where the welcome messages are sent
	 */
	public get welcomeChannel(): Snowflake {
		throw new Error('This should never be executed');
	}
	public set welcomeChannel(_: Snowflake) {
		throw new Error('This should never be executed');
	}

	/**
	 * The role given out when muting someone
	 */
	public get muteRole(): Snowflake {
		throw new Error('This should never be executed');
	}
	public set muteRole(_: Snowflake) {
		throw new Error('This should never be executed');
	}

	/**
	 * The message that gets sent after someone gets a punishment dm
	 */
	public get punishmentEnding(): string {
		throw new Error('This should never be executed');
	}
	public set punishmentEnding(_: string) {
		throw new Error('This should never be executed');
	}

	/**
	 * Guild specific disabled commands
	 */
	public get disabledCommands(): string[] {
		throw new Error('This should never be executed');
	}
	public set disabledCommands(_: string[]) {
		throw new Error('This should never be executed');
	}

	/**
	 * Channels that should get locked down when the lockdown command gets used.
	 */
	public get lockdownChannels(): Snowflake[] {
		throw new Error('This should never be executed');
	}
	public set lockdownChannels(_: Snowflake[]) {
		throw new Error('This should never be executed');
	}

	/**
	 * Custom automod phases
	 */
	public get autoModPhases(): string[] {
		throw new Error('This should never be executed');
	}
	public set autoModPhases(_: string[]) {
		throw new Error('This should never be executed');
	}

	static initModel(sequelize: Sequelize, client: BushClient): void {
		Guild.init(
			{
				id: {
					type: DataTypes.STRING,
					primaryKey: true
				},
				prefix: {
					type: DataTypes.STRING,
					allowNull: false,
					defaultValue: client.config.prefix
				},
				autoPublishChannels: {
					type: DataTypes.TEXT,
					get: function () {
						return JSON.parse(this.getDataValue('autoPublishChannels') as unknown as string);
					},
					set: function (val: Snowflake[]) {
						return this.setDataValue('autoPublishChannels', JSON.stringify(val) as unknown as Snowflake[]);
					},
					allowNull: false,
					defaultValue: '[]'
				},
				blacklistedChannels: {
					type: DataTypes.TEXT,
					get: function () {
						return JSON.parse(this.getDataValue('blacklistedChannels') as unknown as string);
					},
					set: function (val: Snowflake[]) {
						return this.setDataValue('blacklistedChannels', JSON.stringify(val) as unknown as Snowflake[]);
					},
					allowNull: false,
					defaultValue: '[]'
				},
				blacklistedUsers: {
					type: DataTypes.TEXT,
					get: function () {
						return JSON.parse(this.getDataValue('blacklistedUsers') as unknown as string);
					},
					set: function (val: Snowflake[]) {
						return this.setDataValue('blacklistedUsers', JSON.stringify(val) as unknown as Snowflake[]);
					},
					allowNull: false,
					defaultValue: '[]'
				},
				welcomeChannel: {
					type: DataTypes.STRING,
					allowNull: true
				},
				muteRole: {
					type: DataTypes.STRING,
					allowNull: true
				},
				punishmentEnding: {
					type: DataTypes.TEXT,
					allowNull: true
				},
				disabledCommands: {
					type: DataTypes.TEXT,
					get: function () {
						return JSON.parse(this.getDataValue('disabledCommands') as unknown as string);
					},
					set: function (val: string[]) {
						return this.setDataValue('disabledCommands', JSON.stringify(val) as unknown as string[]);
					},
					allowNull: false,
					defaultValue: '[]'
				},
				lockdownChannels: {
					type: DataTypes.TEXT,
					get: function () {
						return JSON.parse(this.getDataValue('lockdownChannels') as unknown as string);
					},
					set: function (val: Snowflake[]) {
						return this.setDataValue('lockdownChannels', JSON.stringify(val) as unknown as Snowflake[]);
					},
					allowNull: false,
					defaultValue: '[]'
				},
				autoModPhases: {
					type: DataTypes.TEXT,
					get: function () {
						return JSON.parse(this.getDataValue('autoModPhases') as unknown as string);
					},
					set: function (val: string[]) {
						return this.setDataValue('autoModPhases', JSON.stringify(val) as unknown as string[]);
					},
					allowNull: false,
					defaultValue: '[]'
				}
			},
			{ sequelize: sequelize }
		);
	}
}
