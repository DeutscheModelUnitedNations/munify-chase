CREATE TYPE "public"."committee_status" AS ENUM('FORMAL', 'INFORMAL', 'PAUSE', 'SUSPENSION');--> statement-breakpoint
CREATE TYPE "public"."conference_user_type" AS ENUM('ADMIN', 'TEAM', 'SPECTATOR', 'DELEGATE', 'NON_STATE_ACTOR');--> statement-breakpoint
CREATE TYPE "public"."regional_group" AS ENUM('AFRICA', 'ASIA_PACIFIC', 'EASTERN_EUROPE', 'LATIN_AMERICA_CARIBBEAN', 'WESTERN_EUROPE_OTHERS');--> statement-breakpoint
CREATE TYPE "public"."representation_type" AS ENUM('DELEGATION', 'NSA', 'UN');--> statement-breakpoint
CREATE TYPE "public"."speakers_list_category" AS ENUM('SPEAKERS_LIST', 'COMMENT_LIST');--> statement-breakpoint
CREATE TABLE "agenda_item" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"committee_id" text NOT NULL,
	"title" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "committee" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"name" text NOT NULL,
	"abbreviation" text NOT NULL,
	"conference_id" text NOT NULL,
	"whiteboard_content" text DEFAULT '<p></p>',
	"show_whiteboard" boolean DEFAULT true NOT NULL,
	"status" "committee_status" DEFAULT 'SUSPENSION' NOT NULL,
	"status_headline" text DEFAULT '' NOT NULL,
	"status_until" timestamp DEFAULT now() NOT NULL,
	"state_of_debate" text,
	"allow_delegations_to_add_themselves_to_speakers_list" boolean DEFAULT false NOT NULL,
	"active_agenda_item_id" text,
	"custom_simple_majority" smallint,
	"custom_two_thirds_majority" smallint,
	"custom_paper_support_threshold" smallint,
	CONSTRAINT "committee_conferenceId_name_unique" UNIQUE("conference_id","name"),
	CONSTRAINT "committee_conferenceId_abbreviation_unique" UNIQUE("conference_id","abbreviation")
);
--> statement-breakpoint
CREATE TABLE "committee_member" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"present" boolean DEFAULT false NOT NULL,
	"committee_id" text NOT NULL,
	"representation_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conference" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"title" text NOT NULL,
	"press_website" text
);
--> statement-breakpoint
CREATE TABLE "conference_member" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"conference_id" text NOT NULL,
	"representation_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conference_user" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"conference_user_type" "conference_user_type" NOT NULL,
	"user_email" text NOT NULL,
	"conference_id" text NOT NULL,
	"conference_member_id" text,
	"committee_member_id" text
);
--> statement-breakpoint
CREATE TABLE "representation" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"name" text,
	"alpha2_code" text,
	"alpha3_code" text,
	"type" "representation_type" NOT NULL,
	"fa_icon" text,
	"regional_group" "regional_group",
	"conference_id" text NOT NULL,
	CONSTRAINT "representation_conferenceId_name_unique" UNIQUE("conference_id","name"),
	CONSTRAINT "representation_conferenceId_alpha2Code_alpha3Code_unique" UNIQUE("conference_id","alpha2_code","alpha3_code")
);
--> statement-breakpoint
CREATE TABLE "speaker_on_list" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"committee_member_id" text,
	"conference_member_id" text,
	"speakers_list_id" text NOT NULL,
	"position" smallint NOT NULL,
	"overwrite_name" text,
	CONSTRAINT "speaker_on_list_speakersListId_position_unique" UNIQUE("speakers_list_id","position"),
	CONSTRAINT "speaker_on_list_speakersListId_committeeMemberId_unique" UNIQUE("speakers_list_id","committee_member_id"),
	CONSTRAINT "speaker_on_list_speakersListId_conferenceMemberId_unique" UNIQUE("speakers_list_id","conference_member_id")
);
--> statement-breakpoint
CREATE TABLE "speakers_list" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"agenda_item_id" text NOT NULL,
	"type" "speakers_list_category" NOT NULL,
	"speaking_time" smallint NOT NULL,
	"time_left" smallint DEFAULT 0 NOT NULL,
	"start_timestamp" timestamp,
	"is_closed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "speakers_list_agendaItemId_type_unique" UNIQUE("agenda_item_id","type")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"email" text NOT NULL,
	"family_name" text NOT NULL,
	"given_name" text NOT NULL,
	"locale" text,
	"preferred_username" text NOT NULL,
	CONSTRAINT "user_id_unique" UNIQUE("id"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "agenda_item" ADD CONSTRAINT "agenda_item_committee_id_committee_id_fk" FOREIGN KEY ("committee_id") REFERENCES "public"."committee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "committee" ADD CONSTRAINT "committee_conference_id_conference_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conference"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "committee" ADD CONSTRAINT "committee_active_agenda_item_id_agenda_item_id_fk" FOREIGN KEY ("active_agenda_item_id") REFERENCES "public"."agenda_item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "committee_member" ADD CONSTRAINT "committee_member_committee_id_committee_id_fk" FOREIGN KEY ("committee_id") REFERENCES "public"."committee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "committee_member" ADD CONSTRAINT "committee_member_representation_id_representation_id_fk" FOREIGN KEY ("representation_id") REFERENCES "public"."representation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conference_member" ADD CONSTRAINT "conference_member_conference_id_conference_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conference"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conference_member" ADD CONSTRAINT "conference_member_representation_id_representation_id_fk" FOREIGN KEY ("representation_id") REFERENCES "public"."representation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conference_user" ADD CONSTRAINT "conference_user_conference_id_conference_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conference"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conference_user" ADD CONSTRAINT "conference_user_conference_member_id_conference_member_id_fk" FOREIGN KEY ("conference_member_id") REFERENCES "public"."conference_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conference_user" ADD CONSTRAINT "conference_user_committee_member_id_committee_member_id_fk" FOREIGN KEY ("committee_member_id") REFERENCES "public"."committee_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "representation" ADD CONSTRAINT "representation_conference_id_conference_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conference"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "speaker_on_list" ADD CONSTRAINT "speaker_on_list_committee_member_id_committee_member_id_fk" FOREIGN KEY ("committee_member_id") REFERENCES "public"."committee_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "speaker_on_list" ADD CONSTRAINT "speaker_on_list_conference_member_id_conference_member_id_fk" FOREIGN KEY ("conference_member_id") REFERENCES "public"."conference_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "speaker_on_list" ADD CONSTRAINT "speaker_on_list_speakers_list_id_speakers_list_id_fk" FOREIGN KEY ("speakers_list_id") REFERENCES "public"."speakers_list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "speakers_list" ADD CONSTRAINT "speakers_list_agenda_item_id_agenda_item_id_fk" FOREIGN KEY ("agenda_item_id") REFERENCES "public"."agenda_item"("id") ON DELETE cascade ON UPDATE no action;