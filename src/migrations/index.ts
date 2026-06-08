import * as migration_20260603_171103_init from './20260603_171103_init';
import * as migration_20260603_172139_cdn_integration from './20260603_172139_cdn_integration';
import * as migration_20260608_213703_ticket_form from './20260608_213703_ticket_form';
import * as migration_20260608_215756_help_center from './20260608_215756_help_center';

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
    up: migration_20260608_213703_ticket_form.up,
    down: migration_20260608_213703_ticket_form.down,
    name: '20260608_213703_ticket_form',
  },
  {
    up: migration_20260608_215756_help_center.up,
    down: migration_20260608_215756_help_center.down,
    name: '20260608_215756_help_center'
  },
];
