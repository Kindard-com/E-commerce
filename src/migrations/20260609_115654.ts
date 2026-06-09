import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`payload_pages_blocks_marquee\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text DEFAULT 'NEW ARRIVALS: MINI EXPLORER COLLECTION FREE SHIPPING OVER $150 PLAY IN STYLE MEMBERS GET EARLY ACCESS ',
  	\`background_color\` text DEFAULT '#FFFFFF',
  	\`text_color\` text DEFAULT '#000000',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`payload_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_pages_blocks_marquee_order_idx\` ON \`payload_pages_blocks_marquee\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`payload_pages_blocks_marquee_parent_id_idx\` ON \`payload_pages_blocks_marquee\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_pages_blocks_marquee_path_idx\` ON \`payload_pages_blocks_marquee\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_payload_pages_v_blocks_marquee\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text DEFAULT 'NEW ARRIVALS: MINI EXPLORER COLLECTION FREE SHIPPING OVER $150 PLAY IN STYLE MEMBERS GET EARLY ACCESS ',
  	\`background_color\` text DEFAULT '#FFFFFF',
  	\`text_color\` text DEFAULT '#000000',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_payload_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_payload_pages_v_blocks_marquee_order_idx\` ON \`_payload_pages_v_blocks_marquee\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_payload_pages_v_blocks_marquee_parent_id_idx\` ON \`_payload_pages_v_blocks_marquee\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_payload_pages_v_blocks_marquee_path_idx\` ON \`_payload_pages_v_blocks_marquee\` (\`_path\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`payload_pages_blocks_marquee\`;`)
  await db.run(sql`DROP TABLE \`_payload_pages_v_blocks_marquee\`;`)
}
