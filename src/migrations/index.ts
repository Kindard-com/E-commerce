import * as migration_20260603_171103_init from './20260603_171103_init';
import * as migration_20260603_172139_cdn_integration from './20260603_172139_cdn_integration';

export const migrations = [
  {
    up: migration_20260603_171103_init.up,
    down: migration_20260603_171103_init.down,
    name: '20260603_171103_init',
  },
  {
    up: migration_20260603_172139_cdn_integration.up,
    down: migration_20260603_172139_cdn_integration.down,
    name: '20260603_172139_cdn_integration'
  },
];
