import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`help_articles\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`content\` text,
  	\`meta_title\` text,
  	\`meta_image_id\` integer,
  	\`meta_description\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`payload_media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`help_articles_meta_meta_image_idx\` ON \`help_articles\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`help_articles_slug_idx\` ON \`help_articles\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`help_articles_updated_at_idx\` ON \`help_articles\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`help_articles_created_at_idx\` ON \`help_articles\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`help_articles__status_idx\` ON \`help_articles\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_help_articles_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_content\` text,
  	\`version_meta_title\` text,
  	\`version_meta_image_id\` integer,
  	\`version_meta_description\` text,
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`help_articles\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`payload_media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_help_articles_v_parent_idx\` ON \`_help_articles_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_help_articles_v_version_meta_version_meta_image_idx\` ON \`_help_articles_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_help_articles_v_version_version_slug_idx\` ON \`_help_articles_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_help_articles_v_version_version_updated_at_idx\` ON \`_help_articles_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_help_articles_v_version_version_created_at_idx\` ON \`_help_articles_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_help_articles_v_version_version__status_idx\` ON \`_help_articles_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_help_articles_v_created_at_idx\` ON \`_help_articles_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_help_articles_v_updated_at_idx\` ON \`_help_articles_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_help_articles_v_latest_idx\` ON \`_help_articles_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_help_articles_v_autosave_idx\` ON \`_help_articles_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`help_articles_id\` integer REFERENCES help_articles(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_help_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`help_articles_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`help_articles\`;`)
  await db.run(sql`DROP TABLE \`_help_articles_v\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`payload_users_id\` integer,
  	\`payload_pages_id\` integer,
  	\`payload_categories_id\` integer,
  	\`payload_media_id\` integer,
  	\`subscribers_id\` integer,
  	\`support_tickets_id\` integer,
  	\`payload_forms_id\` integer,
  	\`payload_form_submissions_id\` integer,
  	\`payload_addresses_id\` integer,
  	\`variants_id\` integer,
  	\`variant_types_id\` integer,
  	\`variant_options_id\` integer,
  	\`products_id\` integer,
  	\`payload_carts_id\` integer,
  	\`payload_orders_id\` integer,
  	\`transactions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_users_id\`) REFERENCES \`payload_users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_pages_id\`) REFERENCES \`payload_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_categories_id\`) REFERENCES \`payload_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_media_id\`) REFERENCES \`payload_media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`subscribers_id\`) REFERENCES \`subscribers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`support_tickets_id\`) REFERENCES \`support_tickets\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_forms_id\`) REFERENCES \`payload_forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_form_submissions_id\`) REFERENCES \`payload_form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_addresses_id\`) REFERENCES \`payload_addresses\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`variants_id\`) REFERENCES \`variants\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`variant_types_id\`) REFERENCES \`variant_types\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`variant_options_id\`) REFERENCES \`variant_options\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_carts_id\`) REFERENCES \`payload_carts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_orders_id\`) REFERENCES \`payload_orders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`transactions_id\`) REFERENCES \`transactions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "payload_users_id", "payload_pages_id", "payload_categories_id", "payload_media_id", "subscribers_id", "support_tickets_id", "payload_forms_id", "payload_form_submissions_id", "payload_addresses_id", "variants_id", "variant_types_id", "variant_options_id", "products_id", "payload_carts_id", "payload_orders_id", "transactions_id") SELECT "id", "order", "parent_id", "path", "payload_users_id", "payload_pages_id", "payload_categories_id", "payload_media_id", "subscribers_id", "support_tickets_id", "payload_forms_id", "payload_form_submissions_id", "payload_addresses_id", "variants_id", "variant_types_id", "variant_options_id", "products_id", "payload_carts_id", "payload_orders_id", "transactions_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payload_users_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payload_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payload_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payload_media_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_subscribers_id_idx\` ON \`payload_locked_documents_rels\` (\`subscribers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_support_tickets_id_idx\` ON \`payload_locked_documents_rels\` (\`support_tickets_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payload_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_forms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payload_form_submissions_i_idx\` ON \`payload_locked_documents_rels\` (\`payload_form_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payload_addresses_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_addresses_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_variants_id_idx\` ON \`payload_locked_documents_rels\` (\`variants_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_variant_types_id_idx\` ON \`payload_locked_documents_rels\` (\`variant_types_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_variant_options_id_idx\` ON \`payload_locked_documents_rels\` (\`variant_options_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payload_carts_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_carts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payload_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_orders_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_transactions_id_idx\` ON \`payload_locked_documents_rels\` (\`transactions_id\`);`)
}
