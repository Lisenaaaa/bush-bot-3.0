import { BushCommand, BushMessage, BushUser } from '#lib';
import { Collection, type Snowflake } from 'discord.js';

export default class PurgeCommand extends BushCommand {
	public constructor() {
		super('purge', {
			aliases: ['purge'],
			category: 'moderation',
			description: 'A command to mass delete messages.',
			usage: ['purge <amount> [--bot] [--user <user>]'],
			examples: ['purge 20'],
			args: [
				{
					id: 'amount',
					description: 'The amount of messages to purge.',
					customType: util.arg.range('integer', 1, 100, true),
					readableType: 'integer',
					prompt: 'How many messages would you like to purge?',
					retry: '{error} Please pick a number between 1 and 100.',
					slashType: 'INTEGER',
					minValue: 1,
					maxValue: 100
				},
				{
					id: 'bot',
					description: 'Filter messages to only include those that are from bots.',
					match: 'flag',
					flag: '--bot',
					prompt: 'Would you like to only delete messages that are from bots?',
					slashType: 'BOOLEAN',
					optional: true
				},
				{
					id: 'user',
					description: 'Filter messages to only include those that are from a specified user.',
					match: 'option',
					type: 'user',
					flag: '--user',
					slashType: 'BOOLEAN',
					optional: true
				}
			],
			slash: true,
			clientPermissions: (m) => util.clientSendAndPermCheck(m, ['MANAGE_MESSAGES', 'EMBED_LINKS'], true),
			userPermissions: ['MANAGE_MESSAGES'],
			channel: 'guild'
		});
	}

	public override async exec(message: BushMessage, args: { amount: number; bot: boolean, user: BushUser }) {
		if (message.channel.type === 'DM') return message.util.reply(`${util.emojis.error} You cannot run this command in dms.`);
		if (args.amount > 100 || args.amount < 1) return message.util.reply(`${util.emojis.error} `);

		const messageFilter = (filterMessage: BushMessage): boolean => {
			const shouldFilter: boolean[] = [];
			if (args.bot) shouldFilter.push(filterMessage.author.bot);
			if (args.user) shouldFilter.push(filterMessage.author.id === args.user.id);

			return shouldFilter.filter((bool) => bool === false).length === 0 && filterMessage.id !== message.id;
		};
		const _messages = (await message.channel.messages.fetch({ limit: 100, before: message.id }))
			.filter((message) => messageFilter(message))
			.first(args.amount);
		const messages = new Collection<Snowflake, BushMessage>();
		_messages.forEach((m) => messages.set(m.id, m));

		const purged = await message.channel.bulkDelete(messages, true).catch(() => null);
		if (!purged) return message.util.reply(`${util.emojis.error} Failed to purge messages.`).catch(() => null);
		else {
			client.emit('bushPurge', message.author, message.guild!, message.channel, messages);
			await message.util.send(`${util.emojis.success} Successfully purged **${purged.size}** messages.`);
			/* .then(async (purgeMessage) => {
					if (!message.util.isSlashMessage(message)) {
						await util.sleep(5);
						await purgeMessage.delete().catch(() => {});
					}
				}); */
		}
	}
}
