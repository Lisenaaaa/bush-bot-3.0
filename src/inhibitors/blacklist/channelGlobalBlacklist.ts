import { BushInhibitor, BushMessage, BushSlashMessage } from '@lib';

export default class UserGlobalBlacklistInhibitor extends BushInhibitor {
	public constructor() {
		super('channelGlobalBlacklist', {
			reason: 'channelGlobalBlacklist',
			category: 'blacklist',
			type: 'all'
		});
	}

	public override exec(message: BushMessage | BushSlashMessage): boolean {
		if (!message.author) return false;
		if (client.isOwner(message.author) || client.isSuperUser(message.author) || client.user.id === message.author.id)
			return false;
		if (client.cache.global.blacklistedChannels.includes(message.channel.id)) {
			// client.console.debug(`channelGlobalBlacklist blocked message.`);
			return true;
		}
	}
}
