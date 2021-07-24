import { BushCommandHandlerEvents, BushListener } from '@lib';

export default class SlashStartedListener extends BushListener {
	public constructor() {
		super('slashStarted', {
			emitter: 'commandHandler',
			event: 'slashStarted',
			category: 'commands'
		});
	}
	async exec([message, command]: BushCommandHandlerEvents['slashStarted']): Promise<unknown> {
		return await this.client.logger.info(
			'SlashCommand',
			`The <<${command.id}>> command was used by <<${message.author.tag}>> in ${
				message.channel.type === 'DM' ? `their <<DMs>>` : `<<#${message.channel.name}>> in <<${message.guild?.name}>>`
			}.`,
			true
		);
	}
}
