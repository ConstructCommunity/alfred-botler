import Role from './models/roles';

const ROLES: Record<string, Role> = {
  ANY: {
    id: '116497549237551109',
    displayName: '@everyone',
    requireApplication: false,
    hideInList: true,
  },

  STAFF: {
    id: '157048794985267200',
    displayName: 'CC Staff',
    requireApplication: true,
    hideInList: true,
    description: 'Verified Staff members.',
  },
  PLATFORM_STAFF: {
    id: '768837151642353724',
    displayName: 'Platform Staff',
    requireApplication: true,
    pingable: true,
    description: 'Verified Staff members.',
  },
  NITRO_BOOSTER: {
    id: '628826027988090884',
    displayName: 'Nitro Booster',
    requireApplication: true,
    pingable: true,
		description: 'Discord Nitro server boosters.',
		prefix: "<:purple_heart:768584412514222172> "
  },

  HELPER: {
    id: '298536205606453248',
    displayName: 'Helper',
    shortName: 'helper',
    requireApplication: false,
    pingable: true,
  },
  DESIGNER: {
    id: '378168474649755648',
    displayName: 'Designer',
    shortName: 'designer',
    requireApplication: false,
  },
  PROGRAMMER: {
    id: '256383286211772416',
    displayName: 'Programmer',
    shortName: 'programmer',
    requireApplication: false,
  },
  ARTIST: {
    id: '166557768193540096',
    displayName: 'Artist',
    shortName: 'artist',
    requireApplication: false,
  },
  ANIMATOR: {
    id: '767739954499027014',
    displayName: 'Animator',
    shortName: 'animator',
    requireApplication: false,
  },
  WRITER: {
    id: '767740075663687721',
    displayName: 'Writer',
    shortName: 'writer',
    requireApplication: false,
  },
  AUDIO_ENGINEER: {
    id: '258691772430024704',
    displayName: 'Audio Engineer',
    shortName: 'audio',
    requireApplication: false,
  },
  QA_TESTER: {
    id: '767740196019896341',
    displayName: 'QA Tester',
    shortName: 'tester',
    requireApplication: false,
  },
}

export default {
  GUILD_ID: '116497549237551109',
  OWNER: '107180621981298688',
  BOT: '168340128622706688',
  MESSAGE: {
    SEPARATOR: '──────────────────────────',
    EMPTY: 'ᅠ',
    SCIRRA_FOOTER: `©Scirra Ltd ${new Date().getFullYear()} | Donations: https://github.com/sponsors/Armaldio`,
    SCIRRA_C3RELEASES_PREFIX: 'https://www.construct.net',
  },
  GITHUB: {
    RAW_REPO_URL_PREFIX: 'https://raw.githubusercontent.com/WebCreationClub/alfred-botler/master',
  },
  ROLES,
  CHANNELS: {
    DEVCHANNEL: '177841210361249794',
    ANY: '-1',
    ALFRED_COMMANDS: '281500034380333056',
    TEST: '244447929400688650',
    PRIVATE_TESTS: '321770336804667413',
    MODERATORS: '227786972020604929',
    FEEDBACK: '183566321156358144',
    PLUGIN_ANNOUNCE: '415230295869227009',
    COLLECTION: '383290818548465676',
    COMMUNITY_ANNOUNCEMENTS: '334126534954844180',
    SCIRRA_ANNOUNCEMENTS: '157638221956775936',
    BIN: '402379486164680704',
    GENERAL: '116497549237551109',
    OFFTOPIC: '226376432064921600',
    JOBOFFERS: '437700852246118420',
    CREATIONCLUB: '448587099088879627',
    PROMO: '499606974510399498',
    PENDING_PROMO: '536214036535050251',
    EVENTS: '424586943792152585',
    TOOLS: '383288402843402250',
    INTRODUCE_YOURSELF: '228466047009685504',
  },
};
