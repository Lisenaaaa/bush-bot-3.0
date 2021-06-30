import { Guild, User } from 'discord.js';
import { BushListener } from '../../lib/extensions/discord-akairo/BushListener';
import { Ban } from '../../lib/models';

export default class SyncUnbanListener extends BushListener {
	public constructor() {
		super('guildBanRemove', {
			emitter: 'client',
			event: 'guildBanRemove'
		});
	}

	public async exec(guild: Guild, user: User): Promise<void> {
		const bans = await Ban.findAll({
			where: {
				user: user.id,
				guild: guild.id
			}
		});
		for (const dbBan of bans) {
			await dbBan.destroy();
		}
	}
}
