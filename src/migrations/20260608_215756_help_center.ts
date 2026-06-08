import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`payload_pages_blocks_help_center_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text DEFAULT 'help-circle',
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`payload_pages_blocks_help_center\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_pages_blocks_help_center_cards_order_idx\` ON \`payload_pages_blocks_help_center_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`payload_pages_blocks_help_center_cards_parent_id_idx\` ON \`payload_pages_blocks_help_center_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_pages_blocks_help_center\` (
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
  await db.run(sql`CREATE INDEX \`payload_pages_blocks_help_center_order_idx\` ON \`payload_pages_blocks_help_center\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`payload_pages_blocks_help_center_parent_id_idx\` ON \`payload_pages_blocks_help_center\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_pages_blocks_help_center_path_idx\` ON \`payload_pages_blocks_help_center\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_payload_pages_v_blocks_help_center_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text DEFAULT 'help-circle',
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_payload_pages_v_blocks_help_center\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_payload_pages_v_blocks_help_center_cards_order_idx\` ON \`_payload_pages_v_blocks_help_center_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_payload_pages_v_blocks_help_center_cards_parent_id_idx\` ON \`_payload_pages_v_blocks_help_center_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_payload_pages_v_blocks_help_center\` (
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
  await db.run(sql`CREATE INDEX \`_payload_pages_v_blocks_help_center_order_idx\` ON \`_payload_pages_v_blocks_help_center\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_payload_pages_v_blocks_help_center_parent_id_idx\` ON \`_payload_pages_v_blocks_help_center\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_payload_pages_v_blocks_help_center_path_idx\` ON \`_payload_pages_v_blocks_help_center\` (\`_path\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`payload_pages_blocks_help_center_cards\`;`)
  await db.run(sql`DROP TABLE \`payload_pages_blocks_help_center\`;`)
  await db.run(sql`DROP TABLE \`_payload_pages_v_blocks_help_center_cards\`;`)
  await db.run(sql`DROP TABLE \`_payload_pages_v_blocks_help_center\`;`)
}
