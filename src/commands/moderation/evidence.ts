import { BushCommand, ModLog, type BushMessage, type BushSlashMessage } from '#lib';
import { type ArgumentOptions, type Flag } from 'discord-akairo';

export default class EvidenceCommand extends BushCommand {
	public constructor() {
		super('evidence', {
			aliases: ['evidence'],
			category: 'moderation',
			description: 'Add evidence to a modlog case.',
			usage: ['evidence <case_id> <evidence>'],
			examples: ['evidence 9210b1ea-91f5-4ea2-801b-02b394469c77 was spamming in #general'],
			args: [
				{
					id: 'case_id',
					description: 'The case to modify the evidence of.',
					type: 'string',
					prompt: 'What case would you like to modify the evidence of?',
					slashType: 'STRING',
					only: 'slash'
				},
				{
					id: 'evidence',
					description: 'The value to set the evidence to.',
					type: 'string',
					prompt: 'What would you like to modify the evidence to?',
					slashType: 'STRING',
					only: 'slash'
				}
			],
			slash: true,
			channel: 'guild',
			clientPermissions: (m) => util.clientSendAndPermCheck(m),
			userPermissions: (m) => util.userGuildPermCheck(m, ['MANAGE_MESSAGES'])
		});
	}

	override *args(message: BushMessage): IterableIterator<ArgumentOptions | Flag> {
		const case_id = yield {
			id: 'case_id',
			type: 'string',
			prompt: {
				start: 'What case would you like to modify the evidence of?',
				retry: '{error} Pick a valid case to modify the evidence of.',
				optional: false
			}
		};

		const evidence = yield {
			id: 'evidence',
			type: 'string',
			match: 'restContent',
			prompt: {
				start: 'What would you like to modify the evidence to?',
				retry: '{error} Pick a valid argument.',
				optional: !!message.attachments.some((attachment) => !!attachment.contentType?.includes('image'))
			}
		};

		return { case_id, evidence };
	}

	public override async exec(
		message: BushMessage | BushSlashMessage,
		{ case_id: caseID, evidence }: { case_id: string; evidence?: string }
	) {
		const entry = await ModLog.findByPk(caseID);
		if (!entry || entry.pseudo) return message.util.send(`${util.emojis.error} Invalid modlog entry.`);
		if (entry.guild !== message.guild!.id) return message.util.reply(`${util.emojis.error} This modlog is from another server.`);

		if (evidence && (message as BushMessage).attachments?.size)
			return message.util.reply(`${util.emojis.error} Please either attach an image or a reason not both.`);

		const _evidence = evidence ? evidence : !message.util.isSlash ? (message as BushMessage).attachments.first()?.url : undefined;
		if (!_evidence) return message.util.reply(`${util.emojis.error} You must provide evidence for this modlog.`);

		const oldEntry = entry.evidence;

		entry.evidence = _evidence.trim();
		await entry.save();

		client.emit('bushUpdateModlog', message.member!, entry.id, 'evidence', oldEntry, entry.evidence);

		return message.util.reply(`${util.emojis.success} Successfully updated the evidence for case \`${caseID}\`.`);
	}
}
