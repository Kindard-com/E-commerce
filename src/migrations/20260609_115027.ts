import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`payload_pages_blocks_help_center\` ADD \`hero_image_id\` integer REFERENCES payload_media(id);`)
  await db.run(sql`CREATE INDEX \`payload_pages_blocks_help_center_hero_image_idx\` ON \`payload_pages_blocks_help_center\` (\`hero_image_id\`);`)
  await db.run(sql`ALTER TABLE \`_payload_pages_v_blocks_help_center\` ADD \`hero_image_id\` integer REFERENCES payload_media(id);`)
  await db.run(sql`CREATE INDEX \`_payload_pages_v_blocks_help_center_hero_image_idx\` ON \`_payload_pages_v_blocks_help_center\` (\`hero_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_pages_blocks_help_center\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`hero_title\` text DEFAULT 'Welcome! How can we help?',
  	\`hero_subtitle\` text DEFAULT 'Search in our help center for quick answers',
  	\`search_placeholder\` text DEFAULT 'Search for questions or topics...',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`payload_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_pages_blocks_help_center\`("_order", "_parent_id", "_path", "id", "hero_title", "hero_subtitle", "search_placeholder", "block_name") SELECT "_order", "_parent_id", "_path", "id", "hero_title", "hero_subtitle", "search_placeholder", "block_name" FROM \`payload_pages_blocks_help_center\`;`)
  await db.run(sql`DROP TABLE \`payload_pages_blocks_help_center\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_pages_blocks_help_center\` RENAME TO \`payload_pages_blocks_help_center\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_pages_blocks_help_center_order_idx\` ON \`payload_pages_blocks_help_center\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`payload_pages_blocks_help_center_parent_id_idx\` ON \`payload_pages_blocks_help_center\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_pages_blocks_help_center_path_idx\` ON \`payload_pages_blocks_help_center\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new__payload_pages_v_blocks_help_center\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_title\` text DEFAULT 'Welcome! How can we help?',
  	\`hero_subtitle\` text DEFAULT 'Search in our help center for quick answers',
  	\`search_placeholder\` text DEFAULT 'Search for questions or topics...',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_payload_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__payload_pages_v_blocks_help_center\`("_order", "_parent_id", "_path", "id", "hero_title", "hero_subtitle", "search_placeholder", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "hero_title", "hero_subtitle", "search_placeholder", "_uuid", "block_name" FROM \`_payload_pages_v_blocks_help_center\`;`)
  await db.run(sql`DROP TABLE \`_payload_pages_v_blocks_help_center\`;`)
  await db.run(sql`ALTER TABLE \`__new__payload_pages_v_blocks_help_center\` RENAME TO \`_payload_pages_v_blocks_help_center\`;`)
  await db.run(sql`CREATE INDEX \`_payload_pages_v_blocks_help_center_order_idx\` ON \`_payload_pages_v_blocks_help_center\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_payload_pages_v_blocks_help_center_parent_id_idx\` ON \`_payload_pages_v_blocks_help_center\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_payload_pages_v_blocks_help_center_path_idx\` ON \`_payload_pages_v_blocks_help_center\` (\`_path\`);`)
}
