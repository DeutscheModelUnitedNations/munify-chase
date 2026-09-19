-- Custom SQL migration file, put your code below! --

-- Statistics materialized views. Refreshed periodically
CREATE MATERIALIZED VIEW "representation_speaking_stats" AS
WITH speaking AS (
	SELECT
		co.conference_id,
		r.id AS representation_id,
		r.name AS representation_name,
		r.alpha2_code,
		r.regional_group,
		r.type AS representation_type,
		EXTRACT(EPOCH FROM (stp.end_timestamp - stp.start_timestamp)) AS duration,
		sl.type AS list_type
	FROM spoken_time_period stp
	JOIN speakers_list sl ON sl.id = stp.speakers_list_id
	JOIN committee_member cm ON cm.id = stp.committee_member_id
	JOIN representation r ON r.id = cm.representation_id
	JOIN committee co ON co.id = cm.committee_id
	UNION ALL
	SELECT
		cf.conference_id,
		r.id,
		r.name,
		r.alpha2_code,
		r.regional_group,
		r.type,
		EXTRACT(EPOCH FROM (stp.end_timestamp - stp.start_timestamp)),
		sl.type
	FROM spoken_time_period stp
	JOIN speakers_list sl ON sl.id = stp.speakers_list_id
	JOIN conference_member cf ON cf.id = stp.conference_member_id
	JOIN representation r ON r.id = cf.representation_id
)
SELECT
	conference_id,
	representation_id,
	max(representation_name) AS representation_name,
	max(alpha2_code) AS alpha2_code,
	max(regional_group) AS regional_group,
	max(representation_type) AS representation_type,
	coalesce(sum(duration), 0)::int AS total_seconds,
	count(*) FILTER (WHERE list_type = 'SPEAKERS_LIST')::int AS speech_count,
	count(*) FILTER (WHERE list_type = 'COMMENT_LIST')::int AS comment_count
FROM speaking
GROUP BY conference_id, representation_id
WITH DATA;

CREATE UNIQUE INDEX "representation_speaking_stats_pk_idx"
	ON "representation_speaking_stats" ("conference_id", "representation_id");

-- One row per committee: total speaking time, speech count, completed votes.
CREATE MATERIALIZED VIEW "committee_activity_stats" AS
SELECT
	c.conference_id,
	c.id AS committee_id,
	c.name AS committee_name,
	c.abbreviation AS committee_abbreviation,
	coalesce(sum(EXTRACT(EPOCH FROM (stp.end_timestamp - stp.start_timestamp))), 0)::int
		AS total_speaking_seconds,
	count(stp.id)::int AS speech_count,
	coalesce(
		(SELECT count(*) FROM voting_session vs
		 WHERE vs.committee_id = c.id AND vs.completed_at IS NOT NULL),
		0
	)::int AS vote_count
FROM committee c
LEFT JOIN agenda_item ai ON ai.committee_id = c.id
LEFT JOIN speakers_list sl ON sl.agenda_item_id = ai.id
LEFT JOIN spoken_time_period stp ON stp.speakers_list_id = sl.id
GROUP BY c.conference_id, c.id, c.name, c.abbreviation
WITH DATA;

CREATE UNIQUE INDEX "committee_activity_stats_committee_id_idx"
	ON "committee_activity_stats" ("committee_id");

-- One row per representation that has proposed at least one amendment.
CREATE MATERIALIZED VIEW "amendment_success_stats" AS
SELECT
	co.conference_id,
	r.id AS representation_id,
	max(r.name) AS representation_name,
	max(r.alpha2_code) AS alpha2_code,
	count(*)::int AS total,
	count(*) FILTER (WHERE a.status IN ('ACCEPTED', 'CONSENSUS_ADOPTED'))::int AS accepted
FROM amendment a
JOIN committee_member cm ON cm.id = a.proposer_committee_member_id
JOIN representation r ON r.id = cm.representation_id
JOIN committee co ON co.id = cm.committee_id
GROUP BY co.conference_id, r.id
WITH DATA;

CREATE UNIQUE INDEX "amendment_success_stats_pk_idx"
	ON "amendment_success_stats" ("conference_id", "representation_id");

-- One row per representation that has sponsored at least one paper.
CREATE MATERIALIZED VIEW "paper_sponsor_stats" AS
SELECT
	co.conference_id,
	r.id AS representation_id,
	max(r.name) AS representation_name,
	max(r.alpha2_code) AS alpha2_code,
	count(*)::int AS sponsorships
FROM paper_sponsor ps
JOIN committee_member cm ON cm.id = ps.committee_member_id
JOIN representation r ON r.id = cm.representation_id
JOIN committee co ON co.id = cm.committee_id
GROUP BY co.conference_id, r.id
WITH DATA;

CREATE UNIQUE INDEX "paper_sponsor_stats_pk_idx"
	ON "paper_sponsor_stats" ("conference_id", "representation_id");

-- One row per representation that has cast at least one vote in a decided
-- (outcome is not null) session — how often they voted against the outcome.
CREATE MATERIALIZED VIEW "contrarian_vote_stats" AS
SELECT
	co.conference_id,
	r.id AS representation_id,
	max(r.name) AS representation_name,
	max(r.alpha2_code) AS alpha2_code,
	count(*) FILTER (
		WHERE (vv.vote = 'PRO' AND vs.outcome = 'REJECTED')
		   OR (vv.vote = 'CON' AND vs.outcome = 'ADOPTED')
	)::int AS contrary_votes,
	count(*)::int AS total_votes
FROM voting_vote vv
JOIN voting_session vs ON vs.id = vv.voting_session_id
JOIN committee_member cm ON cm.id = vv.committee_member_id
JOIN representation r ON r.id = cm.representation_id
JOIN committee co ON co.id = vs.committee_id
WHERE vs.outcome IS NOT NULL
GROUP BY co.conference_id, r.id
WITH DATA;

CREATE UNIQUE INDEX "contrarian_vote_stats_pk_idx"
	ON "contrarian_vote_stats" ("conference_id", "representation_id");

-- One row per unordered pair of representations that voted in >=3 of the
-- same sessions — how often they voted the same way.
CREATE MATERIALIZED VIEW "voting_alignment_stats" AS
WITH votes AS (
	SELECT
		vv.voting_session_id,
		r.id AS representation_id,
		r.name AS representation_name,
		r.alpha2_code,
		vv.vote,
		co.conference_id
	FROM voting_vote vv
	JOIN committee_member cm ON cm.id = vv.committee_member_id
	JOIN representation r ON r.id = cm.representation_id
	JOIN voting_session vs ON vs.id = vv.voting_session_id
	JOIN committee co ON co.id = vs.committee_id
)
SELECT
	a.conference_id,
	a.representation_id AS representation1_id,
	a.representation_name AS representation1_name,
	a.alpha2_code AS representation1_alpha2_code,
	b.representation_id AS representation2_id,
	b.representation_name AS representation2_name,
	b.alpha2_code AS representation2_alpha2_code,
	(count(*) FILTER (WHERE a.vote = b.vote))::float / count(*)::float AS agreement_rate,
	count(*)::int AS votes_compared
FROM votes a
JOIN votes b ON a.voting_session_id = b.voting_session_id AND a.representation_id < b.representation_id
GROUP BY
	a.conference_id, a.representation_id, a.representation_name, a.alpha2_code,
	b.representation_id, b.representation_name, b.alpha2_code
HAVING count(*) >= 3
WITH DATA;

CREATE UNIQUE INDEX "voting_alignment_stats_pk_idx"
	ON "voting_alignment_stats" ("conference_id", "representation1_id", "representation2_id");

-- One row per conference per calendar day with a check-in — distinct users
-- checked into any committee that day.
CREATE MATERIALIZED VIEW "attendance_trend_stats" AS
SELECT
	co.conference_id,
	date_trunc('day', pe.timestamp)::date AS date,
	count(DISTINCT pe.conference_user_id)::int AS unique_users_present
FROM presence_event pe
JOIN committee co ON co.id = pe.committee_id
WHERE pe.present = true
GROUP BY co.conference_id, date_trunc('day', pe.timestamp)
WITH DATA;

CREATE UNIQUE INDEX "attendance_trend_stats_pk_idx"
	ON "attendance_trend_stats" ("conference_id", "date");

-- One row per conference per 30-minute bucket — total speaking seconds
-- across every committee and NSA, for the activity timeline chart.
CREATE MATERIALIZED VIEW "speaking_timeline_stats" AS
WITH periods AS (
	SELECT stp.start_timestamp, stp.end_timestamp, co.conference_id
	FROM spoken_time_period stp
	JOIN committee_member cm ON cm.id = stp.committee_member_id
	JOIN committee co ON co.id = cm.committee_id
	UNION ALL
	SELECT stp.start_timestamp, stp.end_timestamp, cf.conference_id
	FROM spoken_time_period stp
	JOIN conference_member cf ON cf.id = stp.conference_member_id
)
SELECT
	conference_id,
	to_timestamp(floor(EXTRACT(EPOCH FROM start_timestamp) / 1800) * 1800) AS bucket,
	coalesce(sum(EXTRACT(EPOCH FROM (end_timestamp - start_timestamp))), 0)::int AS total_seconds
FROM periods
GROUP BY conference_id, to_timestamp(floor(EXTRACT(EPOCH FROM start_timestamp) / 1800) * 1800)
WITH DATA;

CREATE UNIQUE INDEX "speaking_timeline_stats_pk_idx"
	ON "speaking_timeline_stats" ("conference_id", "bucket");

-- ─── Mission control "hallway pulse" views ─────────────────────────────────

-- One row per conference. "Today" is evaluated at refresh time — a fresh
-- day starts showing zeros as soon as the job refreshes past midnight.
CREATE MATERIALIZED VIEW "mission_control_heartbeat_stats" AS
WITH speeches AS (
	SELECT co.conference_id, stp.start_timestamp, stp.end_timestamp
	FROM spoken_time_period stp
	JOIN speakers_list sl ON sl.id = stp.speakers_list_id
	JOIN agenda_item ai ON ai.id = sl.agenda_item_id
	JOIN committee co ON co.id = ai.committee_id
	WHERE stp.start_timestamp >= current_date
),
speech_agg AS (
	SELECT
		conference_id,
		count(*)::int AS speeches_today,
		coalesce(sum(EXTRACT(EPOCH FROM (end_timestamp - start_timestamp))), 0)::int
			AS debate_seconds_today
	FROM speeches
	GROUP BY conference_id
),
vote_agg AS (
	SELECT co.conference_id, count(*)::int AS votes_held_today
	FROM voting_session vs
	JOIN committee co ON co.id = vs.committee_id
	WHERE vs.completed_at IS NOT NULL AND vs.completed_at >= current_date
	GROUP BY co.conference_id
),
resolution_agg AS (
	SELECT co.conference_id, count(*)::int AS resolutions_adopted_today
	FROM resolution_paper rp
	JOIN committee co ON co.id = rp.committee_id
	WHERE rp.status = 'FINAL' AND rp.updated_at >= current_date
	GROUP BY co.conference_id
)
SELECT
	c.id AS conference_id,
	current_date AS day,
	coalesce(sa.speeches_today, 0) AS speeches_today,
	coalesce(sa.debate_seconds_today, 0) AS debate_seconds_today,
	coalesce(va.votes_held_today, 0) AS votes_held_today,
	coalesce(ra.resolutions_adopted_today, 0) AS resolutions_adopted_today
FROM conference c
LEFT JOIN speech_agg sa ON sa.conference_id = c.id
LEFT JOIN vote_agg va ON va.conference_id = c.id
LEFT JOIN resolution_agg ra ON ra.conference_id = c.id
WITH DATA;

CREATE UNIQUE INDEX "mission_control_heartbeat_stats_pk_idx"
	ON "mission_control_heartbeat_stats" ("conference_id");

-- One row per committee with a speech in the last 15 minutes as of refresh
-- time — powers the "busiest committee right now" tile.
CREATE MATERIALIZED VIEW "committee_recent_activity_stats" AS
SELECT
	co.conference_id,
	co.id AS committee_id,
	co.name AS committee_name,
	co.abbreviation AS committee_abbreviation,
	count(*)::int AS intervention_count
FROM spoken_time_period stp
JOIN speakers_list sl ON sl.id = stp.speakers_list_id
JOIN agenda_item ai ON ai.id = sl.agenda_item_id
JOIN committee co ON co.id = ai.committee_id
WHERE stp.start_timestamp >= now() - interval '15 minutes'
GROUP BY co.conference_id, co.id, co.name, co.abbreviation
WITH DATA;

CREATE UNIQUE INDEX "committee_recent_activity_stats_pk_idx"
	ON "committee_recent_activity_stats" ("committee_id");

-- One row per decided (outcome is not null) voting session — powers the
-- "closest vote today" tile (resolver filters + sorts at read time).
CREATE MATERIALIZED VIEW "voting_session_results_stats" AS
SELECT
	co.conference_id,
	vs.id AS voting_session_id,
	co.id AS committee_id,
	co.name AS committee_name,
	co.abbreviation AS committee_abbreviation,
	vs.vote_name,
	vs.votes_pro,
	vs.votes_con,
	abs(vs.votes_pro - vs.votes_con)::int AS margin,
	vs.completed_at
FROM voting_session vs
JOIN committee co ON co.id = vs.committee_id
WHERE vs.outcome IS NOT NULL
WITH DATA;

CREATE UNIQUE INDEX "voting_session_results_stats_pk_idx"
	ON "voting_session_results_stats" ("voting_session_id");

-- One row per adopted (FINAL) resolution paper — powers the "recently
-- adopted" feed (resolver filters + sorts at read time).
CREATE MATERIALIZED VIEW "resolution_adoption_stats" AS
SELECT
	co.conference_id,
	rp.id AS resolution_paper_id,
	co.id AS committee_id,
	co.name AS committee_name,
	co.abbreviation AS committee_abbreviation,
	rp.title AS paper_title,
	rp.document_number,
	ai.title AS agenda_item_title,
	rp.updated_at AS adopted_at
FROM resolution_paper rp
JOIN committee co ON co.id = rp.committee_id
JOIN agenda_item ai ON ai.id = rp.agenda_item_id
WHERE rp.status = 'FINAL'
WITH DATA;

CREATE UNIQUE INDEX "resolution_adoption_stats_pk_idx"
	ON "resolution_adoption_stats" ("resolution_paper_id");
