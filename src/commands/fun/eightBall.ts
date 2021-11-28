import { BushCommand, type BushMessage, type BushSlashMessage } from '#lib';

export default class EightBallCommand extends BushCommand {
	public constructor() {
		super('eightBall', {
			aliases: ['8ball', 'eightball'],
			category: 'fun',
			description: 'Ask questions for a randomly generated response.',
			usage: ['8Ball <question>'],
			examples: ['8Ball does anyone love me?'],
			args: [
				{
					id: 'question',
					description: 'The question to have answered.',
					type: 'string',
					match: 'rest',
					prompt: 'What question would you like answered?',
					retry: '{error} Invalid question.',
					slashType: 'STRING'
				}
			],
			slash: true,
			clientPermissions: (m) => util.clientSendAndPermCheck(m),
			userPermissions: []
		});
	}

	public override async exec(message: BushMessage | BushSlashMessage) {
		const responses = [
			'It is certain',
			'Without a doubt',
			'You may rely on it',
			'Yes definitely',
			'It is decidedly so',
			'As I see it, yes',
			'Most likely',
			'Yes',
			'Outlook good',
			'Signs point to yes',
			'Reply hazy try again',
			'Better not tell you now',
			'Ask again later',
			'Cannot predict now',
			'Concentrate and ask again',
			"Don't count on it",
			'Outlook not so good',
			'My sources say no',
			'Very doubtful',
			'My reply is no'
		];
		const answer = responses[Math.floor(Math.random() * responses.length)];
		await message.util.reply(answer);
	}
}
