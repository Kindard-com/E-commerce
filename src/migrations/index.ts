import * as migration_20260603_171103_init from './20260603_171103_init';
import * as migration_20260603_172139_cdn_integration from './20260603_172139_cdn_integration';
import * as migration_20260608_215756_help_center from './20260608_215756_help_center';
import * as migration_20260609_114702 from './20260609_114702';
import * as migration_20260609_115027 from './20260609_115027';
import * as migration_20260609_115654 from './20260609_115654';
import * as migration_20260609_121620 from './20260609_121620';

export const migrations = [
  {
    up: migration_20260603_171103_init.up,
    down: migration_20260603_171103_init.down,
    name: '20260603_171103_init',
  },
  {
    up: migration_20260603_172139_cdn_integration.up,
    down: migration_20260603_172139_cdn_integration.down,
    name: '20260603_172139_cdn_integration',
  },
  {
    up: migration_20260608_215756_help_center.up,
    down: migration_20260608_215756_help_center.down,
    name: '20260608_215756_help_center',
  },
  {
    up: migration_20260609_114702.up,
    down: migration_20260609_114702.down,
    name: '20260609_114702',
  },
  {
    up: migration_20260609_115027.up,
    down: migration_20260609_115027.down,
    name: '20260609_115027',
  },
  {
    up: migration_20260609_115654.up,
    down: migration_20260609_115654.down,
    name: '20260609_115654',
  },
  {
    up: migration_20260609_121620.up,
    down: migration_20260609_121620.down,
    name: '20260609_121620'
  },
];
