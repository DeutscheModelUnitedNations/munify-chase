ALTER TABLE "committee" ADD COLUMN "presentation_layout" text DEFAULT 'default' NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "presentation_root_font_size" smallint DEFAULT 16 NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "presentation_resolution_font_size" smallint DEFAULT 16 NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "display_regional_groups" boolean DEFAULT false NOT NULL;