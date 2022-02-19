import type { BadWords } from "./common/AutoMod.js";

const enum Severity {
	DELETE,
	WARN,
	TEMP_MUTE,
	PERM_MUTE,
}

export default {
	/* -------------------------------------------------------------------------- */
	/*                                    Slurs                                   */
	/* -------------------------------------------------------------------------- */
	"Slurs": [
		{
			match: "faggot",
			severity: Severity.TEMP_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "homophobic slur",
			regex: false,
		},
		{
			match: "nigga",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "racial slur",
			regex: false,
		},
		{
			match: "nigger",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "racial slur",
			regex: false,
		},
		{
			match: "nigra",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "racial slur",
			regex: false,
		},
		{
			match: "retard",
			severity: Severity.TEMP_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "ableist slur",
			regex: false,
		},
		{
			match: "retarted",
			severity: Severity.TEMP_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "ableist slur",
			regex: false,
		},
		{
			match: "slut",
			severity: Severity.WARN,
			ignoreSpaces: false,
			ignoreCapitalization: true,
			reason: "derogatory term",
			regex: false,
		},
		{
			match: "tar baby",
			severity: Severity.TEMP_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "racial slur",
			regex: false,
		},
		{
			match: "whore",
			severity: Severity.WARN,
			ignoreSpaces: false,
			ignoreCapitalization: true,
			reason: "derogatory term",
			regex: false,
		},
		{
			match: "卍",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "racist symbol",
			regex: false,
		},
		{
			//? N word
			match: "space movie 1992",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "racial slur",
			regex: false,
		},
	],

	/* -------------------------------------------------------------------------- */
	/*                                 Steam Scams                                */
	/* -------------------------------------------------------------------------- */
	"Steam Scams": [
		{
			//? I'm on tilt, in the cop they gave the status "Unreliable"
			match: 'Я в тильте, в кс дали статус "Ненадежный"',
			severity: Severity.WARN,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "steam scam phrase",
			regex: false,
		},
		{
			match: "hello i am leaving cs:go",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "steam scam phrase",
			regex: false,
		},
		{
			match: "hello! I'm done with csgo",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "steam scam phrase",
			regex: false,
		},
		{
			match: "hi bro, i'm leaving this fucking game, take my skin",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "steam scam phrase",
			regex: false,
		},
		{
			match: "hi friend, today i am leaving this fucking game",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "steam scam phrase",
			regex: false,
		},
		{
			match: "hi guys, i'm leaving this fucking game, take my",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "steam scam phrase",
			regex: false,
		},
		{
			match: "hi, bro h am leaving cs:go and giving away my skin",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "steam scam phrase",
			regex: false,
		},
		{
			match: "hi, bro i am leaving cs:go and giving away my skin",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "steam scam phrase",
			regex: false,
		},
		{
			match: "i confirm all exchanges, there won't be enough",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "steam scam phrase",
			regex: false,
		},
		{
			match: "i quit csgo",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "steam scam phrase",
			regex: false,
		},
		{
			match: "the first three who send a trade",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "steam scam phrase",
			regex: false,
		},
		{
			match: "you can choose any skin for yourself",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "steam scam phrase",
			regex: false,
		},
		{
			match: "Hey, I'm leaving for the army and giving the skins",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "steam scam phrase",
			regex: false,
		},
		{
			match: "fuck this trash called CS:GO, deleted,",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "steam scam phrase",
			regex: false,
		},
		{
			match: "please take my skins",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "steam scam phrase",
			regex: false,
		},
		{
			match: "Hi, I stopped playing CS:GO and decided to giveaway my inventory.",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "steam scam phrase",
			regex: false,
		},
	],

	/* -------------------------------------------------------------------------- */
	/*                                 Nitro Scams                                */
	/* -------------------------------------------------------------------------- */
	"Nitro Scams": [
		{
			match: "and there is discord hallween's giveaway",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "discord nitro for free - steam store",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "free 3 months of discord nitro",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "free discord nitro airdrop",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "get 3 months of discord nitro",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "get discord nitro for free",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "get free discord nitro from steam",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "lol, jahjajha free discord nitro for 3 month!!",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "steam is giving away 3 months of discord nitro for free to all no limited steam users",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			//? Lol, 1 month free discord nitro!
			match: "Лол, бесплатный дискорд нитро на 1 месяц!",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Airdrop Discord FREE NITRO from Steam —",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "take nitro faster, it's already running out",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: false,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "only the first 10 people will have time to take nitro",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: false,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Discord is giving away nitro!",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: false,
			ignoreCapitalization: false,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Free gift discord nitro for 1 month!",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: false,
			ignoreCapitalization: false,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Hi i claim this nitro for free 3 months lol!",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "bro watch this, working nitro gen",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: false,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Free distribution of discord nitro for 3 months from steam!",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Get 3 Months of Discord Nitro. Personalize your profile, screen share in HD, upgrade your emojis, and more!",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Steam is giving away free discord nitro, have time to pick up at my link",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Airdrop Discord NITRO with",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Check this lol, there nitro is handed out for free, take it until everything is sorted out",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "A free Discord Nitro | Steam Store Discord Nitro Distribution.",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Xbox gives away discord nitro for free",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "airdrop discord nitro by steam",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			//? 3 months nitro free from steam, take too
			match: "3 месяца нитро бесплатно от стима, забирайте тоже",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Free distributiοn of discοrd nitrο for 3 months from steаm!",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Free discord nitro for 1 month!",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "I got some nitro left over here",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Hey, steam gived nitro",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "nitro giveaway by steam, take it",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "3 months nitro from styme,",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "XBOX and DISCORD are giving away free NITRO FULL for a month.",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Hi,take the Discord Nitro for free",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			//? Discord nitro got free, take it before it's too late
			match: "Дискорд нитро получил бесплатно,забирай пока не поздно",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "1 month nitro for free",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Gifts for the new year, nitro for 3 months",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "1 month nitro from steam, take it guys",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Hello, discord and steam are giving away nitro, take it away",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Who is first? :)",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Whо is first? :)",
			//? This one uses a different o, prob should make some autodelete if includes link and special char
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Discord Nitro distribution from STEAM",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "3 month nitro for free, take it ",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "3 months nitro from steam, take it guys)",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Gifts from steam nitro, gifts for 3 months",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "Free subscription for 3 months DISCORD NITRO",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "who will catch this gift?)",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
		{
			match: "take it guys :)",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "discord nitro scam phrase",
			regex: false,
		},
	],

	/* -------------------------------------------------------------------------- */
	/*                                 Misc Scams                                 */
	/* -------------------------------------------------------------------------- */
	"Misc Scams": [
		{
			match: "found a cool software that improves the",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "misc. scam phrase",
			regex: false,
		},
		{
			match:
				"there is a possible chance tomorrow there will be a cyber-attack event where on all social networks including Discord there will be people trying",
			severity: Severity.WARN,
			ignoreSpaces: false,
			ignoreCapitalization: true,
			reason: "annoying copy pasta",
			regex: false,
		},
		{
			match: "i made a game can you test play ?",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "malware phrase",
			regex: false,
		},
		{
			match: "tell me if something is wrong in the game",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "malware phrase",
			regex: false,
		},
		{
			match: "Hi, can you check out the game I created today:)",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "malware phrase",
			regex: false,
		},
		{
			match: "Just want to get other people's opinions, what to add and what to remove.",
			severity: Severity.PERM_MUTE,
			ignoreSpaces: true,
			ignoreCapitalization: true,
			reason: "malware phrase",
			regex: false,
		},
	],

	/* -------------------------------------------------------------------------- */
	/*                    Frequently Advertised Discord Severs                    */
	/* -------------------------------------------------------------------------- */
} as BadWords;
