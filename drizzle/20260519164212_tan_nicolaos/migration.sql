-- new_content holds a JSON string scalar (RES-Markup) after the
-- amendment-markup backfill; `#>> '{}'` unwraps it to plain text.
-- (`::text` would keep the surrounding JSON quotes.)
ALTER TABLE "amendment" ALTER COLUMN "new_content" SET DATA TYPE text USING new_content #>> '{}';
