import { BushListener } from '@lib';

export default class UncaughtExceptionListener extends BushListener {
	public constructor() {
		super('uncaughtException', {
			emitter: 'process',
			event: 'uncaughtException'
		});
	}

	public override async exec(error: Error): Promise<void> {
		// eslint-disable-next-line @typescript-eslint/no-base-to-string
		void client.console.error('uncaughtException', `An uncaught exception occurred:\n${error?.stack || error}`, false);
		void client.console.channelError({
			embeds: [
				{
					title: 'An uncaught exception occurred',
					// eslint-disable-next-line @typescript-eslint/no-base-to-string
					fields: [{ name: 'error', value: await util.codeblock(`${error?.stack || error}`, 1024, 'js') }],
					color: util.colors.error
				}
			]
		});
	}
}
