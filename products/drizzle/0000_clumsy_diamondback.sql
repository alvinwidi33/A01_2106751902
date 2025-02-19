CREATE TABLE IF NOT EXISTS "categories" (
	"id" uuid DEFAULT gen_random_uuid(),
	"name" varchar NOT NULL,
	"tenant_id" uuid NOT NULL,
	CONSTRAINT "categories_id_tenant_id_pk" PRIMARY KEY("id","tenant_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"price" integer NOT NULL,
	"quantity_available" integer NOT NULL,
	"category_id" uuid
);
