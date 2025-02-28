/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {
	BushArgumentType,
	BushCache,
	BushClient,
	BushConstants,
	BushGuildMember,
	BushGuildMemberResolvable,
	BushGuildResolvable,
	BushMessage,
	BushSlashMessage,
	Global,
	Guild,
	ModLog,
	ModLogType
} from '@lib';
import { exec } from 'child_process';
import { Argument, ArgumentTypeCaster, ClientUtil, Flag, ParsedValuePredicate, TypeResolver } from 'discord-akairo';
import { APIMessage } from 'discord-api-types';
import {
	ButtonInteraction,
	ColorResolvable,
	CommandInteraction,
	Constants,
	GuildMember,
	Message,
	MessageActionRow,
	MessageButton,
	MessageComponentInteraction,
	MessageEditOptions,
	MessageEmbed,
	MessageOptions,
	Snowflake,
	TextChannel,
	User,
	Util
} from 'discord.js';
import got from 'got';
import humanizeDuration from 'humanize-duration';
import moment from 'moment';
import { inspect, InspectOptions, promisify } from 'util';
import { ActivePunishment, ActivePunishmentType } from '../../models/ActivePunishment';
import { BushNewsChannel } from '../discord.js/BushNewsChannel';
import { BushTextChannel } from '../discord.js/BushTextChannel';
import { BushSlashEditMessageType, BushSlashSendMessageType, BushUserResolvable } from './BushClient';

interface hastebinRes {
	key: string;
}

export interface uuidRes {
	uuid: string;
	username: string;
	username_history?: { username: string }[] | null;
	textures: {
		custom: boolean;
		slim: boolean;
		skin: {
			url: string;
			data: string;
		};
		raw: {
			value: string;
			signature: string;
		};
	};
	created_at: string;
}

interface bushColors {
	default: '#1FD8F1';
	error: '#EF4947';
	warn: '#FEBA12';
	success: '#3BB681';
	info: '#3B78FF';
	red: '#ff0000';
	blue: '#0055ff';
	aqua: '#00bbff';
	purple: '#8400ff';
	blurple: '#5440cd';
	pink: '#ff00e6';
	green: '#00ff1e';
	darkGreen: '#008f11';
	gold: '#b59400';
	yellow: '#ffff00';
	white: '#ffffff';
	gray: '#a6a6a6';
	lightGray: '#cfcfcf';
	darkGray: '#7a7a7a';
	black: '#000000';
	orange: '#E86100';
}

interface MojangProfile {
	username: string;
	uuid: string;
}

export class BushClientUtil extends ClientUtil {
	/** The client of this ClientUtil */
	public declare readonly client: BushClient;
	/** The hastebin urls used to post to hastebin, attempts to post in order */
	public hasteURLs: string[] = [
		'https://hst.sh',
		'https://hasteb.in',
		'https://hastebin.com',
		'https://mystb.in',
		'https://haste.clicksminuteper.net',
		'https://paste.pythondiscord.com',
		'https://haste.unbelievaboat.com',
		'https://haste.tyman.tech'
	];
	public paginateEmojis = {
		beginning: '853667381335162910',
		back: '853667410203770881',
		stop: '853667471110570034',
		forward: '853667492680564747',
		end: '853667514915225640'
	};

	/** A simple promise exec method */
	private exec = promisify(exec);

	/**
	 * Creates this client util
	 * @param client The client to initialize with
	 */
	public constructor(client: BushClient) {
		super(client);
	}

	/**
	 * Maps an array of user ids to user objects.
	 * @param ids The list of IDs to map
	 * @returns The list of users mapped
	 */
	public async mapIDs(ids: Snowflake[]): Promise<User[]> {
		return await Promise.all(ids.map((id) => client.users.fetch(id)));
	}

	/**
	 * Capitalizes the first letter of the given text
	 * @param text The text to capitalize
	 * @returns The capitalized text
	 */
	public capitalize(text: string): string {
		return text.charAt(0).toUpperCase() + text.slice(1);
	}

	/**
	 * Runs a shell command and gives the output
	 * @param command The shell command to run
	 * @returns The stdout and stderr of the shell command
	 */
	public async shell(command: string): Promise<{
		stdout: string;
		stderr: string;
	}> {
		return await this.exec(command);
	}

	/**
	 * Posts text to hastebin
	 * @param content The text to post
	 * @returns The url of the posted text
	 */
	public async haste(content: string): Promise<string> {
		for (const url of this.hasteURLs) {
			try {
				const res: hastebinRes = await got.post(`${url}/documents`, { body: content }).json();
				return `${url}/${res.key}`;
			} catch {
				void client.console.error('Haste', `Unable to upload haste to ${url}`);
			}
		}
		return 'Unable to post';
	}

	/**
	 * Resolves a user-provided string into a user object, if possible
	 * @param text The text to try and resolve
	 * @returns The user resolved or null
	 */
	public async resolveUserAsync(text: string): Promise<User | null> {
		const idReg = /\d{17,19}/;
		const idMatch = text.match(idReg);
		if (idMatch) {
			try {
				return await client.users.fetch(text as Snowflake);
			} catch {
				// pass
			}
		}
		const mentionReg = /<@!?(?<id>\d{17,19})>/;
		const mentionMatch = text.match(mentionReg);
		if (mentionMatch) {
			try {
				return await client.users.fetch(mentionMatch.groups.id as Snowflake);
			} catch {
				// pass
			}
		}
		const user = client.users.cache.find((u) => u.username === text);
		if (user) return user;
		return null;
	}

	/**
	 * Appends the correct ordinal to the given number
	 * @param n The number to append an ordinal to
	 * @returns The number with the ordinal
	 */
	public ordinal(n: number): string {
		const s = ['th', 'st', 'nd', 'rd'],
			v = n % 100;
		return n + (s[(v - 20) % 10] || s[v] || s[0]);
	}

	/**
	 * Chunks an array to the specified size
	 * @param arr The array to chunk
	 * @param perChunk The amount of items per chunk
	 * @returns The chunked array
	 */
	public chunk<T>(arr: T[], perChunk: number): T[][] {
		return arr.reduce((all, one, i) => {
			const ch = Math.floor(i / perChunk);
			all[ch] = [].concat(all[ch] || [], one);
			return all;
		}, []);
	}

	/** Commonly Used Colors */
	public colors: bushColors = {
		default: '#1FD8F1',
		error: '#EF4947',
		warn: '#FEBA12',
		success: '#3BB681',
		info: '#3B78FF',
		red: '#ff0000',
		blue: '#0055ff',
		aqua: '#00bbff',
		purple: '#8400ff',
		blurple: '#5440cd',
		pink: '#ff00e6',
		green: '#00ff1e',
		darkGreen: '#008f11',
		gold: '#b59400',
		yellow: '#ffff00',
		white: '#ffffff',
		gray: '#a6a6a6',
		lightGray: '#cfcfcf',
		darkGray: '#7a7a7a',
		black: '#000000',
		orange: '#E86100'
	};

	/** Commonly Used Emojis */
	public emojis = {
		success: '<:checkmark:837109864101707807>',
		warn: '<:warn:848726900876247050>',
		error: '<:error:837123021016924261>',
		successFull: '<:checkmark_full:850118767576088646>',
		warnFull: '<:warn_full:850118767391539312>',
		errorFull: '<:error_full:850118767295201350>',
		mad: '<:mad:783046135392239626>',
		join: '<:join:850198029809614858>',
		leave: '<:leave:850198048205307919>',
		loading: '<a:Loading:853419254619963392>'
	};

	/**
	 * A simple utility to create and embed with the needed style for the bot
	 */
	public createEmbed(color?: ColorResolvable, author?: User | GuildMember): MessageEmbed {
		if (author instanceof GuildMember) {
			author = author.user; // Convert to User if GuildMember
		}
		let embed = new MessageEmbed().setTimestamp();
		if (author)
			embed = embed.setAuthor(
				author.username,
				author.displayAvatarURL({ dynamic: true }),
				`https://discord.com/users/${author.id}`
			);
		if (color) embed = embed.setColor(color);
		return embed;
	}

	public async mcUUID(username: string): Promise<string> {
		const apiRes = (await got.get(`https://api.ashcon.app/mojang/v2/user/${username}`).json()) as uuidRes;
		return apiRes.uuid.replace(/-/g, '');
	}

	/** Paginates an array of embeds using buttons. */
	public async buttonPaginate(
		message: BushMessage | BushSlashMessage,
		embeds: MessageEmbed[],
		text: string | null = null,
		deleteOnExit?: boolean
	): Promise<void> {
		const paginateEmojis = this.paginateEmojis;
		if (deleteOnExit === undefined) deleteOnExit = true;

		if (embeds.length === 1) {
			return this.sendWithDeleteButton(message, { embeds: embeds });
		}

		embeds.forEach((_e, i) => {
			embeds[i] = embeds[i].setFooter(`Page ${i + 1}/${embeds.length}`);
		});

		const style = Constants.MessageButtonStyles.PRIMARY;
		let curPage = 0;
		if (typeof embeds !== 'object') throw new Error('embeds must be an object');
		const msg: Message = await message.util.reply({
			content: text || null,
			embeds: [embeds[curPage]],
			components: [getPaginationRow()]
		});
		const filter = (interaction: ButtonInteraction) =>
			interaction.customId.startsWith('paginate_') && interaction.message == msg;
		const collector = msg.createMessageComponentCollector({ filter, time: 300000 });
		collector.on('collect', async (interaction: MessageComponentInteraction) => {
			if (interaction.user.id == message.author.id || client.config.owners.includes(interaction.user.id)) {
				switch (interaction.customId) {
					case 'paginate_beginning': {
						curPage = 0;
						await edit(interaction);
						break;
					}
					case 'paginate_back': {
						curPage--;
						await edit(interaction);
						break;
					}
					case 'paginate_stop': {
						if (deleteOnExit) {
							await interaction.deferUpdate().catch(() => undefined);
							if (msg.deletable && !msg.deleted) {
								await msg.delete();
							}
						} else {
							await interaction
								?.update({ content: `${text ? text + '\n' : ''}Command closed by user.`, embeds: [], components: [] })
								.catch(() => undefined);
						}
						return;
					}
					case 'paginate_next': {
						curPage++;
						await edit(interaction);
						break;
					}
					case 'paginate_end': {
						curPage = embeds.length - 1;
						await edit(interaction);
						break;
					}
				}
			} else {
				return await interaction?.deferUpdate().catch(() => undefined);
			}
		});

		collector.on('end', async () => {
			await msg.edit({ content: text, embeds: [embeds[curPage]], components: [getPaginationRow(true)] }).catch(() => undefined);
		});

		async function edit(interaction: MessageComponentInteraction): Promise<void> {
			return await interaction
				?.update({ content: text, embeds: [embeds[curPage]], components: [getPaginationRow()] })
				.catch(() => undefined);
		}
		function getPaginationRow(disableAll = false): MessageActionRow {
			return new MessageActionRow().addComponents(
				new MessageButton({
					style,
					customId: 'paginate_beginning',
					emoji: paginateEmojis.beginning,
					disabled: disableAll || curPage == 0
				}),
				new MessageButton({
					style,
					customId: 'paginate_back',
					emoji: paginateEmojis.back,
					disabled: disableAll || curPage == 0
				}),
				new MessageButton({ style, customId: 'paginate_stop', emoji: paginateEmojis.stop, disabled: disableAll }),
				new MessageButton({
					style,
					customId: 'paginate_next',
					emoji: paginateEmojis.forward,
					disabled: disableAll || curPage == embeds.length - 1
				}),
				new MessageButton({
					style,
					customId: 'paginate_end',
					emoji: paginateEmojis.end,
					disabled: disableAll || curPage == embeds.length - 1
				})
			);
		}
	}

	/** Sends a message with a button for the user to delete it. */
	public async sendWithDeleteButton(message: BushMessage | BushSlashMessage, options: MessageOptions): Promise<void> {
		const paginateEmojis = this.paginateEmojis;
		updateOptions();
		const msg = await message.util.reply(options as MessageOptions & { split?: false });
		const filter = (interaction: ButtonInteraction) => interaction.customId == 'paginate__stop' && interaction.message == msg;
		const collector = msg.createMessageComponentCollector({ filter, time: 300000 });
		collector.on('collect', async (interaction: MessageComponentInteraction) => {
			if (interaction.user.id == message.author.id || client.config.owners.includes(interaction.user.id)) {
				await interaction.deferUpdate().catch(() => undefined);
				if (msg.deletable && !msg.deleted) {
					await msg.delete();
				}
				return;
			} else {
				return await interaction?.deferUpdate().catch(() => undefined);
			}
		});

		collector.on('end', async () => {
			updateOptions(true, true);
			await msg.edit(options as MessageEditOptions).catch(() => undefined);
		});

		function updateOptions(edit?: boolean, disable?: boolean) {
			if (edit == undefined) edit = false;
			if (disable == undefined) disable = false;
			options.components = [
				new MessageActionRow().addComponents(
					new MessageButton({
						style: Constants.MessageButtonStyles.PRIMARY,
						customId: 'paginate__stop',
						emoji: paginateEmojis.stop,
						disabled: disable
					})
				)
			];
			if (edit) {
				options.reply = undefined;
			}
		}
	}

	/**
	 * Surrounds text in a code block with the specified language and puts it in a hastebin if its too long.
	 *
	 * * Embed Description Limit = 4096 characters
	 * * Embed Field Limit = 1024 characters
	 */
	public async codeblock(code: string, length: number, language?: 'ts' | 'js' | 'sh' | 'json' | ''): Promise<string> {
		let hasteOut = '';
		const tildes = '```';
		language = language ?? '';
		const formattingLength = 2 * tildes.length + language?.length ?? 0 + 2 * '\n'.length;
		if (code.length + formattingLength >= length) hasteOut = 'Too large to display. Hastebin: ' + (await this.haste(code));

		const code2 = hasteOut ? code.substring(0, length - (hasteOut.length + '\n'.length + formattingLength)) : code;
		return tildes + language + '\n' + code2 + '\n' + tildes + (hasteOut.length ? '\n' + hasteOut : '');
	}

	private mapCredential(old: string) {
		const mapping = {
			['token']: 'Main Token',
			['devToken']: 'Dev Token',
			['betaToken']: 'Beta Token',
			['hypixelApiKey']: 'Hypixel Api Key'
		};
		return mapping[old] || old;
	}

	/**
	 * Redacts credentials from a string
	 */
	public redact(text: string) {
		for (const credentialName in client.config.credentials) {
			const credential = client.config.credentials[credentialName];
			const replacement = this.mapCredential(credentialName);
			const escapeRegex = /[.*+?^${}()|[\]\\]/g;
			text = text.replace(new RegExp(credential.toString().replace(escapeRegex, '\\$&'), 'g'), `[${replacement} Omitted]`);
			text = text.replace(
				new RegExp([...credential.toString()].reverse().join('').replace(escapeRegex, '\\$&'), 'g'),
				`[${replacement} Omitted]`
			);
		}
		return text;
	}

	public async inspectCleanRedactCodeblock(input: any, language: 'ts' | 'js', inspectOptions?: InspectOptions) {
		input = typeof input !== 'string' && inspectOptions !== undefined ? inspect(input, inspectOptions) : input;
		input = Util.cleanCodeBlockContent(input);
		input = this.redact(input);
		return client.util.codeblock(input, 1024, language);
	}

	public async slashRespond(
		interaction: CommandInteraction,
		responseOptions: BushSlashSendMessageType | BushSlashEditMessageType
	): Promise<Message | APIMessage> {
		let newResponseOptions: BushSlashSendMessageType | BushSlashEditMessageType = {};
		if (typeof responseOptions === 'string') {
			newResponseOptions.content = responseOptions;
		} else {
			newResponseOptions = responseOptions;
		}
		if (interaction.replied || interaction.deferred) {
			//@ts-expect-error: stop being dumb
			delete newResponseOptions.ephemeral; // Cannot change a preexisting message to be ephemeral
			return (await interaction.editReply(newResponseOptions)) as Message | APIMessage;
		} else {
			await interaction.reply(newResponseOptions);
			return await interaction.fetchReply().catch(() => undefined);
		}
	}

	/** Gets the channel configs as a TextChannel */
	public async getConfigChannel(channel: 'log' | 'error' | 'dm'): Promise<TextChannel> {
		return (await client.channels.fetch(client.config.channels[channel])) as unknown as TextChannel;
	}

	/**
	 * Takes an array and combines the elements using the supplied conjunction.
	 *
	 * @param {string[]} array The array to combine.
	 * @param {string} conjunction The conjunction to use.
	 * @param {string} ifEmpty What to return if the array is empty.
	 * @returns The combined elements or `ifEmpty`
	 *
	 * @example
	 * const permissions = oxford(['ADMINISTRATOR', 'SEND_MESSAGES', 'MANAGE_MESSAGES'], 'and', 'none');
	 * console.log(permissions); // ADMINISTRATOR, SEND_MESSAGES and MANAGE_MESSAGES
	 */
	public oxford(array: string[], conjunction: string, ifEmpty: string): string {
		const l = array.length;
		if (!l) return ifEmpty;
		if (l < 2) return array[0];
		if (l < 3) return array.join(` ${conjunction} `);
		array = array.slice();
		array[l - 1] = `${conjunction} ${array[l - 1]}`;
		return array.join(', ');
	}

	public async insertOrRemoveFromGlobal(
		action: 'add' | 'remove',
		key: keyof typeof BushCache['global'],
		value: any
	): Promise<Global | void> {
		const row = await Global.findByPk(client.config.environment);
		const oldValue: any[] = row[key];
		const newValue = this.addOrRemoveFromArray(action, oldValue, value);
		row[key] = newValue;
		client.cache.global[key] = newValue;
		return await row.save().catch((e) => client.logger.error('insertOrRemoveFromGlobal', e?.stack || e));
	}

	public addOrRemoveFromArray(action: 'add' | 'remove', array: any[], value: any): any[] {
		let newValue: any[];
		if (!array) return null;
		if (action === 'add') {
			if (!array.includes(action)) array.push(value);
			newValue = array;
		} else {
			newValue = Array.from(array).filter((ae) => ae !== value);
		}
		return newValue;
	}

	/**
	 * Surrounds a string to the begging an end of each element in an array.
	 *
	 * @param {string[]} array  The array you want to surround.
	 * @param {string} surroundChar1 The character placed in the beginning of the element (or end if surroundChar2 isn't supplied).
	 * @param {string} [surroundChar2=surroundChar1] The character placed in the end of the element.
	 * @returns {string[]}
	 */
	public surroundArray(array: string[], surroundChar1: string, surroundChar2?: string): string[] {
		const newArray = [];
		array.forEach((a) => {
			newArray.push(`${surroundChar1}${a}${surroundChar2 || surroundChar1}`);
		});
		return newArray;
	}

	public parseDuration(content: string, remove = true): { duration: number; contentWithoutTime: string } {
		if (!content) return { duration: 0, contentWithoutTime: null };

		let duration = 0;
		// Try to reduce false positives by requiring a space before the duration, this makes sure it still matches if it is
		// in the beginning of the argument
		let contentWithoutTime = ` ${content}`;

		for (const unit in BushConstants.TimeUnits) {
			const regex = BushConstants.TimeUnits[unit].match;
			const match = regex.exec(contentWithoutTime);
			const value = Number(match?.groups?.[unit] || 0);
			duration += value * BushConstants.TimeUnits[unit].value;

			if (remove) contentWithoutTime = contentWithoutTime.replace(regex, '');
		}
		// remove the space added earlier
		if (contentWithoutTime.startsWith(' ')) contentWithoutTime.replace(' ', '');
		return { duration, contentWithoutTime };
	}

	/**
	 * Checks if a moderator can perform a moderation action on another user.
	 * @param moderator - The person trying to perform the action.
	 * @param victim - The person getting punished.
	 * @param type - The type of punishment - used to format the response.
	 * @param checkModerator - Whether or not to check if the victim is a moderator.
	 */
	public moderationPermissionCheck(
		moderator: BushGuildMember,
		victim: BushGuildMember,
		type: 'mute' | 'unmute' | 'warn' | 'kick' | 'ban' | 'unban' | 'add a punishment role to' | 'remove a punishment role from',
		checkModerator = true,
		force = false
	): true | string {
		if (force) return true;

		// If the victim is not in the guild anymore it will be undefined
		if (!victim.guild && ['ban', 'unban'].includes(type)) return true;

		if (moderator.guild.id !== victim.guild.id) {
			throw new Error('moderator and victim not in same guild');
		}
		const isOwner = moderator.guild.ownerId === moderator.id;
		if (moderator.id === victim.id) {
			return `${util.emojis.error} You cannot ${type} yourself.`;
		}
		if (moderator.roles.highest.position <= victim.roles.highest.position && !isOwner) {
			return `${util.emojis.error} You cannot ${type} **${victim.user.tag}** because they have higher or equal role hierarchy as you do.`;
		}
		if (victim.roles.highest.position >= victim.guild.me.roles.highest.position) {
			return `${util.emojis.error} You cannot ${type} **${victim.user.tag}** because they have higher or equal role hierarchy as I do.`;
		}
		if (checkModerator && victim.permissions.has('MANAGE_MESSAGES')) {
			return `${util.emojis.error} You cannot ${type} **${victim.user.tag}** because they are a moderator.`;
		}
		return true;
	}

	public async createModLogEntry(
		options: {
			type: ModLogType;
			user: BushGuildMemberResolvable;
			moderator: BushGuildMemberResolvable;
			reason: string;
			duration?: number;
			guild: BushGuildResolvable;
		},
		getCaseNumber = false
	): Promise<{ log: ModLog; caseNum: number }> {
		const user = client.users.resolveId(options.user);
		const moderator = client.users.resolveId(options.moderator);
		const guild = client.guilds.resolveId(options.guild);
		const duration = options.duration || null;

		// If guild does not exist create it so the modlog can reference a guild.
		await Guild.findOrCreate({
			where: {
				id: guild
			},
			defaults: {
				id: guild
			}
		});

		const modLogEntry = ModLog.build({
			type: options.type,
			user,
			moderator,
			reason: options.reason,
			duration: duration,
			guild
		});
		const saveResult: ModLog = await modLogEntry.save().catch((e) => {
			void client.console.error('createModLogEntry', e?.stack || e);
			return null;
		});

		if (!getCaseNumber) return { log: saveResult, caseNum: null };

		const caseNum = (await ModLog.findAll({ where: { type: options.type, user: user, guild: guild } }))?.length;
		return { log: saveResult, caseNum };
	}

	public async createPunishmentEntry(options: {
		type: 'mute' | 'ban' | 'role' | 'block';
		user: BushGuildMemberResolvable;
		duration: number;
		guild: BushGuildResolvable;
		modlog: string;
		extraInfo?: Snowflake;
	}): Promise<ActivePunishment> {
		const expires = options.duration ? new Date(new Date().getTime() + options.duration) : null;
		const user = client.users.resolveId(options.user);
		const guild = client.guilds.resolveId(options.guild);
		const type = this.findTypeEnum(options.type);

		const entry = options.extraInfo
			? ActivePunishment.build({ user, type, guild, expires, modlog: options.modlog, extraInfo: options.extraInfo })
			: ActivePunishment.build({ user, type, guild, expires, modlog: options.modlog });
		return await entry.save().catch((e) => {
			void client.console.error('createPunishmentEntry', e?.stack || e);
			return null;
		});
	}

	public async removePunishmentEntry(options: {
		type: 'mute' | 'ban' | 'role' | 'block';
		user: BushGuildMemberResolvable;
		guild: BushGuildResolvable;
	}): Promise<boolean> {
		const user = client.users.resolveId(options.user);
		const guild = client.guilds.resolveId(options.guild);
		const type = this.findTypeEnum(options.type);

		let success = true;

		const entries = await ActivePunishment.findAll({
			// finding all cases of a certain type incase there were duplicates or something
			where: { user, guild, type }
		}).catch((e) => {
			void client.console.error('removePunishmentEntry', e?.stack || e);
			success = false;
		});
		if (entries) {
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			entries.forEach(async (entry) => {
				await entry.destroy().catch((e) => {
					void client.console.error('removePunishmentEntry', e?.stack || e);
				});
				success = false;
			});
		}
		return success;
	}

	private findTypeEnum(type: 'mute' | 'ban' | 'role' | 'block') {
		const typeMap = {
			['mute']: ActivePunishmentType.MUTE,
			['ban']: ActivePunishmentType.BAN,
			['role']: ActivePunishmentType.ROLE,
			['block']: ActivePunishmentType.BLOCK
		};
		return typeMap[type];
	}

	public humanizeDuration(duration: number, largest?: number): string {
		if (largest) return humanizeDuration(duration, { language: 'en', maxDecimalPoints: 2, largest });
		else return humanizeDuration(duration, { language: 'en', maxDecimalPoints: 2 });
	}

	public dateDelta(date: Date, largest?: number) {
		return this.humanizeDuration(moment(date).diff(moment()), largest ?? 3);
	}

	public async findUUID(player: string): Promise<string> {
		try {
			const raw = await got.get(`https://api.ashcon.app/mojang/v2/user/${player}`);
			let profile: MojangProfile;
			if (raw.statusCode == 200) {
				profile = JSON.parse(raw.body);
			} else {
				throw new Error('invalid player');
			}

			if (raw.statusCode == 200 && profile && profile.uuid) {
				return profile.uuid.replace(/-/g, '');
			} else {
				throw new Error(`Could not fetch the uuid for ${player}.`);
			}
		} catch (e) {
			throw new Error('An error has occurred.');
		}
	}

	public hexToRgb(hex: string): string {
		const arrBuff = new ArrayBuffer(4);
		const vw = new DataView(arrBuff);
		vw.setUint32(0, parseInt(hex, 16), false);
		const arrByte = new Uint8Array(arrBuff);

		return arrByte[1] + ', ' + arrByte[2] + ', ' + arrByte[3];
	}

	/* eslint-disable @typescript-eslint/no-unused-vars */
	public async lockdownChannel(options: { channel: BushTextChannel | BushNewsChannel; moderator: BushUserResolvable }) {}
	/* eslint-enable @typescript-eslint/no-unused-vars */

	public capitalizeFirstLetter(string: string): string {
		return string.charAt(0)?.toUpperCase() + string.slice(1);
	}

	public arg = new (class Arg {
		/**
		 * Casts a phrase to this argument's type.
		 * @param type - The type to cast to.
		 * @param resolver - The type resolver.
		 * @param message - Message that called the command.
		 * @param phrase - Phrase to process.
		 */
		public cast(type: BushArgumentType, resolver: TypeResolver, message: Message, phrase: string): Promise<any> {
			return Argument.cast(type, resolver, message, phrase);
		}

		/**
		 * Creates a type that is the left-to-right composition of the given types.
		 * If any of the types fails, the entire composition fails.
		 * @param types - Types to use.
		 */
		public compose(...types: BushArgumentType[]): ArgumentTypeCaster {
			return Argument.compose(types);
		}

		/**
		 * Creates a type that is the left-to-right composition of the given types.
		 * If any of the types fails, the composition still continues with the failure passed on.
		 * @param types - Types to use.
		 */
		public composeWithFailure(...types: BushArgumentType[]): ArgumentTypeCaster {
			return Argument.composeWithFailure(types);
		}

		/**
		 * Checks if something is null, undefined, or a fail flag.
		 * @param value - Value to check.
		 */
		public isFailure(value: any): value is null | undefined | (Flag & { value: any }) {
			return Argument.isFailure(value);
		}

		/**
		 * Creates a type from multiple types (product type).
		 * Only inputs where each type resolves with a non-void value are valid.
		 * @param types - Types to use.
		 */
		public product(...types: BushArgumentType[]): ArgumentTypeCaster {
			return Argument.product(types);
		}

		/**
		 * Creates a type where the parsed value must be within a range.
		 * @param type - The type to use.
		 * @param min - Minimum value.
		 * @param max - Maximum value.
		 * @param inclusive - Whether or not to be inclusive on the upper bound.
		 */
		public range(type: BushArgumentType, min: number, max: number, inclusive?: boolean): ArgumentTypeCaster {
			return Argument.range(type, min, max, inclusive);
		}

		/**
		 * Creates a type that parses as normal but also tags it with some data.
		 * Result is in an object `{ tag, value }` and wrapped in `Flag.fail` when failed.
		 * @param type - The type to use.
		 * @param tag - Tag to add. Defaults to the `type` argument, so useful if it is a string.
		 */
		public tagged(type: BushArgumentType, tag?: any): ArgumentTypeCaster {
			return Argument.tagged(type, tag);
		}

		/**
		 * Creates a type from multiple types (union type).
		 * The first type that resolves to a non-void value is used.
		 * Each type will also be tagged using `tagged` with themselves.
		 * @param types - Types to use.
		 */
		public taggedUnion(...types: BushArgumentType[]): ArgumentTypeCaster {
			return Argument.taggedUnion(types);
		}

		/**
		 * Creates a type that parses as normal but also tags it with some data and carries the original input.
		 * Result is in an object `{ tag, input, value }` and wrapped in `Flag.fail` when failed.
		 * @param type - The type to use.
		 * @param tag - Tag to add. Defaults to the `type` argument, so useful if it is a string.
		 */
		public taggedWithInput(type: BushArgumentType, tag?: any): ArgumentTypeCaster {
			return Argument.taggedWithInput(type, tag);
		}

		/**
		 * Creates a type from multiple types (union type).
		 * The first type that resolves to a non-void value is used.
		 * @param types - Types to use.
		 */
		public union(...types: BushArgumentType[]): ArgumentTypeCaster {
			return Argument.union(types);
		}

		/**
		 * Creates a type with extra validation.
		 * If the predicate is not true, the value is considered invalid.
		 * @param type - The type to use.
		 * @param predicate - The predicate function.
		 */
		public validate(type: BushArgumentType, predicate: ParsedValuePredicate): ArgumentTypeCaster {
			return Argument.validate(type, predicate);
		}

		/**
		 * Creates a type that parses as normal but also carries the original input.
		 * Result is in an object `{ input, value }` and wrapped in `Flag.fail` when failed.
		 * @param type - The type to use.
		 */
		public withInput(type: BushArgumentType): ArgumentTypeCaster {
			return Argument.withInput(type);
		}
	})();
}
