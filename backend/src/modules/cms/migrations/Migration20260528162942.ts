import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260528162942 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "cms_content" drop constraint if exists "cms_content_handle_unique";`);
    this.addSql(`create table if not exists "cms_content" ("id" text not null, "type" text not null default 'global', "handle" text not null, "data" jsonb not null default '{}', "is_published" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cms_content_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cms_content_handle_unique" ON "cms_content" ("handle") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_content_deleted_at" ON "cms_content" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "cms_content" cascade;`);
  }

}
