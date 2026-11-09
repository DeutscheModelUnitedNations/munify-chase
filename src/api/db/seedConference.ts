import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { reset } from 'drizzle-seed';
import { assertFirstEntryExists } from '@m1212e/rumble';
import { load as loadYaml } from 'js-yaml';
import type { SeedData } from './seed-data/schema';
import * as fs from 'fs';
import { getCountryData } from './seedUtils';
import {
	anyConferenceAdmin,
	committeeDelegateUsers,
	committeeMembersWithRepresentation
} from './seedQueries';
import { eq, type InferSelectModel } from 'drizzle-orm';
import { nanoid } from '../../lib/helpers/nanoid';
import * as Y from 'yjs';
import { jsonToYDoc } from '@deutschemodelunitednations/munify-resolution-editor/yjs';
import {
	createEmptyResolution,
	toRoman,
	type Resolution
} from '@deutschemodelunitednations/munify-resolution-editor/schema';

const db = drizzle(process.env.DATABASE_URL!);

console.info('Resetting database...\n');
await reset(db, schema);

console.info('########################');
console.info('### Seeding database ###');
console.info('########################\n');

try {
	// Load the YAML file
	const filePath = './src/api/db/seed-data/' + process.argv[2];
	const fileContents = fs.readFileSync(filePath, 'utf8');

	const data = loadYaml(fileContents) as SeedData;

	// Users
	for (const user of data.users) {
		await db.insert(schema.user).values({
			...user
		});
	}

	// Conference
	console.info('Conferences:');
	for (const conference of data.conferences) {
		const conferenceEntry = await db
			.insert(schema.conference)
			.values({
				...conference
			})
			.returning()
			.then(assertFirstEntryExists);

		console.info(` - ${conference.title}`);

		console.info('   Conference users:');
		for (const user of data.users) {
			await db.insert(schema.conferenceUser).values({
				userEmail: user.email,
				conferenceId: conferenceEntry.id,
				conferenceUserType: user.conferenceUserType
			});
			console.info(`    - ${user.preferredUsername} (${user.conferenceUserType})`);
		}

		const delegations: Record<string, InferSelectModel<typeof schema.representation>> = {};
		for (const alpha2Code of conference.committees.flatMap((committee) =>
			committee.countries.map((country) => country.toLowerCase())
		)) {
			if (delegations[alpha2Code]) {
				continue;
			}
			delegations[alpha2Code] = await db
				.insert(schema.representation)
				.values({
					...getCountryData(alpha2Code),
					conferenceId: conferenceEntry.id
				})
				.returning()
				.then(assertFirstEntryExists);
		}
		console.info(`   Delegations: ${Object.keys(delegations).length}`);

		console.info('   Custom representations:');
		const customRepresentations = [];
		for (const representation of conference.customRepresentations ?? []) {
			const representationEntry = await db
				.insert(schema.representation)
				.values({
					...representation,
					conferenceId: conferenceEntry.id,
					alpha2Code: representation.type === 'UN' ? 'un' : undefined,
					alpha3Code: representation.type === 'UN' ? 'uno' : undefined
				})
				.returning()
				.then(assertFirstEntryExists);

			customRepresentations.push(
				await db
					.insert(schema.conferenceMember)
					.values({
						conferenceId: conferenceEntry.id,
						representationId: representationEntry.id
					})
					.returning()
					.then(assertFirstEntryExists)
			);
			console.info(`    - ${representation.name} (${representation.type})`);
		}

		console.info('   Committees:');
		for (const committee of conference.committees) {
			const committeeEntry = await db
				.insert(schema.committee)
				.values({
					...committee,
					conferenceId: conferenceEntry.id
				})
				.returning()
				.then(assertFirstEntryExists);

			console.info(`    - ${committee.name}`);

			console.info('      Agenda items:');
			for (const agendaItem of committee.agendaItems) {
				const agendaItemEntry = await db
					.insert(schema.agendaItem)
					.values({
						...agendaItem,
						committeeId: committeeEntry.id
					})
					.returning()
					.then(assertFirstEntryExists);

				if (agendaItem.active) {
					await db
						.update(schema.committee)
						.set({ activeAgendaItemId: agendaItemEntry.id })
						.where(eq(schema.committee.id, committeeEntry.id));
				}

				console.info(`       - ${agendaItem.title}${agendaItem.active ? ' (active)' : ''}`);

				await db.insert(schema.speakersList).values({
					agendaItemId: agendaItemEntry.id,
					type: 'SPEAKERS_LIST',
					speakingTime: 180
				});
				await db.insert(schema.speakersList).values({
					agendaItemId: agendaItemEntry.id,
					type: 'COMMENT_LIST',
					speakingTime: 30
				});
			}

			for (const country of committee.countries) {
				const delegation = delegations[country.toLowerCase()];
				if (!delegation) {
					throw new Error(`Delegation ${country.toLowerCase()} not found`);
				}

				const cm = await db
					.insert(schema.committeeMember)
					.values({
						committeeId: committeeEntry.id,
						representationId: delegation.id
					})
					.returning()
					.then(assertFirstEntryExists);

				await db.insert(schema.conferenceUser).values({
					userEmail: `${committee.abbreviation.toLowerCase()}.${country.toLowerCase()}@delegate.dev`,
					conferenceId: conferenceEntry.id,
					conferenceUserType: 'DELEGATE',
					committeeMemberId: cm.id
				});
			}
			console.info(`      Countries: ${committee.countries.length}`);

			for (const customRepresentation of customRepresentations) {
				if (customRepresentation.representationId === committeeEntry.id) {
					continue;
				}
				await db.insert(schema.committeeMember).values({
					committeeId: committeeEntry.id,
					representationId: customRepresentation.representationId
				});
			}
		}
	}

	console.info('\n### Seeding resolution papers ###');
	await seedResolutionPapers();

	console.info('\n### Seeding statistics & dashboard data ###');
	await seedStatisticsAndDashboardData();

	console.info('\n####################');
	console.info('### Seeding done ###');
	console.info('####################\n');
} catch (e) {
	console.error(e);
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function encodeYjsState(res: Resolution): Buffer {
	const doc = new Y.Doc();
	jsonToYDoc(doc, res);
	return Buffer.from(Y.encodeStateAsUpdate(doc));
}

function buildResolution(
	committeeName: string,
	preambleClauses: string[],
	operativeClauses: string[]
): Resolution {
	const res = createEmptyResolution(committeeName);
	res.preamble = preambleClauses.map((content) => ({ id: nanoid(), content }));
	res.operative = operativeClauses.map((content) => ({
		id: nanoid(),
		blocks: [{ type: 'text' as const, id: nanoid(), content }]
	}));
	return res;
}

async function insertPaper(opts: {
	committeeId: string;
	agendaItemId: string;
	creatorMemberId: string;
	status: (typeof schema.resolutionPaper.$inferInsert)['status'];
	title: string;
	documentNumber?: string;
	content: Resolution;
	sponsorMemberIds: string[];
	snapshots?: Array<{ trigger: (typeof schema.paperContentSnapshot.$inferInsert)['trigger'] }>;
}) {
	const paperId = nanoid();
	await db.insert(schema.resolutionPaper).values({
		id: paperId,
		committeeId: opts.committeeId,
		agendaItemId: opts.agendaItemId,
		creatorCommitteeMemberId: opts.creatorMemberId,
		status: opts.status,
		title: opts.title,
		documentNumber: opts.documentNumber
	});
	await db.insert(schema.paperYjsDoc).values({
		id: nanoid(),
		paperId,
		state: encodeYjsState(opts.content)
	});
	for (const memberId of [...new Set(opts.sponsorMemberIds)]) {
		await db
			.insert(schema.paperSponsor)
			.values({ id: nanoid(), paperId, committeeMemberId: memberId });
	}
	for (const snap of opts.snapshots ?? []) {
		await db.insert(schema.paperContentSnapshot).values({
			id: nanoid(),
			paperId,
			content: JSON.stringify(opts.content),
			trigger: snap.trigger
		});
	}
	return paperId;
}

type AmendmentStatus = (typeof schema.amendment.$inferInsert)['status'];

async function insertAmendment(opts: {
	paperId: string;
	proposer: string;
	type: (typeof schema.amendment.$inferInsert)['type'];
	status: AmendmentStatus;
	targetClauseId?: string;
	targetOperativeIndex?: number;
	targetPosition?: number;
	newContent?: string;
	oldContent?: string;
	documentNumber: string;
	sponsorIds?: string[];
	obsoletedByAmendmentId?: string;
}): Promise<string> {
	const amendId = nanoid();
	await db.insert(schema.amendment).values({
		id: amendId,
		paperId: opts.paperId,
		proposerCommitteeMemberId: opts.proposer,
		type: opts.type,
		status: opts.status,
		targetClauseId: opts.targetClauseId,
		targetOperativeIndex: opts.targetOperativeIndex,
		targetPosition: opts.targetPosition,
		newContent: opts.newContent,
		oldContent: opts.oldContent,
		documentNumber: opts.documentNumber,
		obsoletedByAmendmentId: opts.obsoletedByAmendmentId
	});
	for (const memberId of opts.sponsorIds ?? [opts.proposer]) {
		await db
			.insert(schema.amendmentSponsor)
			.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: memberId });
	}
	return amendId;
}

// ─── topic content ────────────────────────────────────────────────────────────

type TopicContent = { preamble: string[]; operative: string[] };

function climateFinanceContent(): TopicContent {
	return {
		preamble: [
			'Reaffirming the commitments made under the Paris Agreement and the Glasgow Climate Pact to limit global warming to 1.5 °C and to support the most vulnerable nations in their adaptation efforts,',
			'Recognizing that developing countries, particularly Small Island Developing States (SIDS) and Least Developed Countries (LDCs), bear disproportionate climate impacts despite contributing least to cumulative global emissions,',
			"Deeply concerned by the estimated $400 billion annual gap in climate adaptation financing identified in UNEP's Adaptation Gap Report 2023,",
			'Welcoming the establishment of the Loss and Damage Fund at COP28 and urging its prompt operationalization with adequate, predictable and grant-based financing,',
			'Noting with concern that fewer than 15 per cent of current climate finance flows are directed toward adaptation, the remainder being allocated to mitigation activities,'
		],
		operative: [
			'Calls upon all developed nations to fulfil their commitment to jointly mobilize $100 billion per year in climate finance for developing countries and to significantly scale this target beyond 2025;',
			'Urges multilateral development banks to triple their climate adaptation lending by 2030, with a minimum of 50 per cent of new financing directed to the most vulnerable nations and communities;',
			'Recommends the establishment of a Climate Adaptation Rapid Response Facility to provide emergency concessional financing within 30 days of a declared climate disaster;',
			'Decides to establish an inter-governmental Expert Panel on Climate Adaptation Finance to review the adequacy and accessibility of existing funds and to report to the General Assembly at its eightieth session;',
			'Requests the Secretary-General to appoint a Special Envoy on Climate Finance to facilitate high-level negotiations between contributor and recipient nations and to present a roadmap within six months;',
			'Encourages all Member States to integrate climate adaptation into their national development plans, public budgeting frameworks and official development assistance strategies by 2026;'
		]
	};
}

function multilateralismContent(): TopicContent {
	return {
		preamble: [
			'Reaffirming the purposes and principles enshrined in the Charter of the United Nations and the fundamental importance of strengthening multilateral cooperation to address shared global challenges,',
			'Recognizing that the global governance architecture must better reflect the realities of the twenty-first century and ensure meaningful, equitable representation for all regions and peoples,',
			'Recalling the Pact for the Future adopted at the Summit of the Future in September 2024 and the commitments therein to reform international institutions and revitalize multilateralism,',
			'Deeply concerned that the voices of the Global South remain systematically underrepresented in key multilateral decision-making bodies, including in areas of trade, finance and security,',
			'Acknowledging that trust in multilateral institutions has eroded in recent years and that urgent reform is necessary to restore their legitimacy and effectiveness,'
		],
		operative: [
			'Calls for a comprehensive, transparent and inclusive intergovernmental process to reform the United Nations Security Council to reflect contemporary geopolitical realities, including through expanding both permanent and non-permanent membership;',
			'Urges Member States to strengthen the authority, resources and effectiveness of the General Assembly as the chief deliberative, policy-making and representative organ of the United Nations;',
			'Recommends enhanced and structured participation of regional bodies, civil society organizations, youth representatives and indigenous peoples in multilateral forums, including through formal consultative status mechanisms;',
			'Invites the Secretary-General to convene a high-level panel on multilateral governance reform to present concrete, actionable recommendations to the General Assembly no later than 2026;',
			'Encourages Member States to increase their assessed contributions and voluntary funding to the United Nations system to ensure it has adequate resources to fulfil its mandate;'
		]
	};
}

function conflictRootCausesContent(): TopicContent {
	return {
		preamble: [
			'Recalling its previous resolutions on the maintenance of international peace and security, in particular resolutions 1366 (2001) on conflict prevention and 2171 (2014) on mediation,',
			'Recognizing that sustainable peace requires addressing the structural root causes of conflict, including entrenched poverty, inequality, political exclusion, weak governance and impunity,',
			'Deeply alarmed by the significant humanitarian consequences of ongoing armed conflicts and the increasing trend of protracted intra-state violence affecting millions of civilians worldwide,',
			'Affirming the vital importance of inclusive political dialogue, national reconciliation processes and transitional justice mechanisms in post-conflict societies,',
			'Reiterating the primary responsibility of states to protect their populations and to create conditions for lasting peace through inclusive development and good governance,'
		],
		operative: [
			'Condemns all acts of violence against civilian populations and demands that all parties to armed conflicts immediately comply with their obligations under international humanitarian and human rights law;',
			'Calls upon all Member States to invest in conflict prevention through early warning systems, nationally owned mediation capacity and integrated development programming in fragile and conflict-affected settings;',
			'Urges greater coherence and coordination between the Security Council, the General Assembly, the Peacebuilding Commission and regional organizations in conflict prevention and resolution;',
			'Requests the Peacebuilding Commission to develop specific guidelines for addressing economic exclusion and youth unemployment as primary drivers of conflict relapse;',
			'Encourages the Secretary-General to expand the capacity of the Department of Political and Peacebuilding Affairs to support preventive diplomacy and good-offices missions;'
		]
	};
}

function techAndPeaceContent(): TopicContent {
	return {
		preamble: [
			'Recognizing the transformative potential of emerging technologies for international peace and security, and the urgent need for international norms and frameworks to govern their development and use,',
			'Alarmed by the rapid proliferation of lethal autonomous weapons systems and the integration of artificial intelligence into military decision-making without adequate ethical, legal or accountability frameworks,',
			'Deeply concerned by the growing use of social media platforms and digital information environments for targeted disinformation campaigns that undermine democratic institutions, inflame tensions and contribute to conflict,',
			'Recalling the work of the Open-Ended Working Group on developments in the field of information and telecommunications in the context of international security and the Group of Governmental Experts on Lethal Autonomous Weapons Systems,',
			'Acknowledging the profound dual-use nature of cyber capabilities and the imperative to prevent their misuse while preserving their benefits for sustainable development and humanitarian action,'
		],
		operative: [
			'Urges all Member States to refrain from offensive cyber operations targeting critical civilian infrastructure, including hospitals, power grids, water systems and financial institutions, consistent with international law;',
			'Calls for the establishment of a UN Digital Stability Board, modelled on existing non-proliferation and arms control bodies, to develop, promote and monitor adherence to norms for responsible state behaviour in cyberspace;',
			'Invites the Secretary-General to appoint a High-Level Panel on Artificial Intelligence, Autonomous Systems and Peace with a mandate to present concrete recommendations to the Security Council within twelve months;',
			'Encourages all Member States to engage constructively in negotiations toward a legally binding international instrument prohibiting or restricting the use of fully autonomous weapons that operate without meaningful human control;',
			'Requests the development of a United Nations Digital Blue Helmet capacity to support peacekeeping missions operating in environments affected by disinformation, election interference and cyber threats;'
		]
	};
}

function getTopicContent(agendaTitle: string): TopicContent {
	const lower = agendaTitle.toLowerCase();
	if (lower.includes('climate') || lower.includes('adaptation') || lower.includes('financing')) {
		return climateFinanceContent();
	}
	if (lower.includes('multilateral') || lower.includes('inclusive')) {
		return multilateralismContent();
	}
	if (lower.includes('conflict') || lower.includes('root cause') || lower.includes('peace')) {
		return conflictRootCausesContent();
	}
	if (
		lower.includes('tech') ||
		lower.includes('digital') ||
		lower.includes('cyber') ||
		lower.includes('ai')
	) {
		return techAndPeaceContent();
	}
	// fallback
	return climateFinanceContent();
}

// ─── main seeding logic ───────────────────────────────────────────────────────

type Member = { id: string };
type CommitteeRow = typeof schema.committee.$inferSelect;
type AgendaItemRow = typeof schema.agendaItem.$inferSelect;

type CommitteeSeed = {
	committee: CommitteeRow;
	members: Array<Member & { representationType: string }>;
	delegates: Member[];
	adminCU: Member | undefined;
	delegateCUs: Member[];
	/** How many sponsors an amendment needs to meet the support threshold */
	thresholdCount: number;
	/** The k-th delegate's id, wrapping around to avoid running out of delegates */
	d: (k: number) => string;
	/** `n` delegate ids from `offset` on, wrapping around */
	pick: (n: number, offset?: number) => string[];
};

type ItemSeed = CommitteeSeed & {
	agendaItem: AgendaItemRow;
	isActive: boolean;
	preamble: string[];
	operative: string[];
	/** A document number on this agenda item, e.g. `GA/I/DR.1` */
	doc: (suffix: string) => string;
	/** The topic's operative clause `i`, wrapping around */
	clause: (i: number) => string;
	/** The topic's operative clause `i` (wrapping around) with its `;` replaced by `ending` */
	amended: (i: number, ending: string) => string;
};

const range = (n: number) => Array.from({ length: Math.max(0, n) }, (_, i) => i);

/** The id of operative clause `i` of `res`, wrapping around */
const op = (res: Resolution, i: number) => res.operative[i % res.operative.length].id;

async function loadCommitteeSeed(committee: CommitteeRow): Promise<CommitteeSeed | undefined> {
	const members = await committeeMembersWithRepresentation(db, committee.id);
	const delegates = members.filter((m) => m.representationType === 'DELEGATION');
	if (delegates.length < 5) return undefined;

	const d = (k: number) => delegates[k % delegates.length].id;
	return {
		committee,
		members,
		delegates,
		adminCU: await anyConferenceAdmin(db, committee.conferenceId),
		delegateCUs: await committeeDelegateUsers(db, committee.id),
		thresholdCount: Math.max(
			1,
			Math.ceil((delegates.length * (committee.paperSupportThreshold ?? 10)) / 100)
		),
		d,
		pick: (n, offset = 0) => range(n).map((i) => d(offset + i))
	};
}

function agendaItemsOf(committeeId: string) {
	return db.select().from(schema.agendaItem).where(eq(schema.agendaItem.committeeId, committeeId));
}

async function seedResolutionPapers() {
	const committees = await db.select().from(schema.committee);

	for (const committee of committees) {
		const agendaItems = await agendaItemsOf(committee.id);
		const seed = await loadCommitteeSeed(committee);
		if (!seed) continue;

		console.info(`  ${committee.name}:`);
		for (const [itemIdx, agendaItem] of agendaItems.entries()) {
			await seedAgendaItem(seed, agendaItem, itemIdx);
		}
	}
}

async function seedAgendaItem(seed: CommitteeSeed, agendaItem: AgendaItemRow, itemIdx: number) {
	const isActive = agendaItem.id === seed.committee.activeAgendaItemId;
	const prefix = `${seed.committee.abbreviation}/${toRoman(itemIdx + 1)}`;
	const { preamble, operative } = getTopicContent(agendaItem.title);
	const clause = (i: number) => operative[i % operative.length];
	const item: ItemSeed = {
		...seed,
		agendaItem,
		isActive,
		preamble,
		operative,
		doc: (suffix) => `${prefix}/${suffix}`,
		clause,
		amended: (i, ending) => clause(i).replace(';', ending)
	};

	console.info(`    [${agendaItem.title}${isActive ? ' — active' : ''}]`);

	await seedWorkingPaper(item);
	await seedSubmittedPaper(item);
	const drId = await seedDraftResolution(item);

	if (isActive) {
		// Pin this DR as the committee's active draft resolution
		await db
			.update(schema.committee)
			.set({ activeDraftResolutionId: drId })
			.where(eq(schema.committee.id, seed.committee.id));
		await seedAmendmentPhasePaper(item);
		await seedVotingPhasePaper(item);
	} else {
		await seedFinalPaper(item);
	}

	await seedItemSpeakersLists(item);
}

// ── inserting amendments and comments from lists ──────────────────────────

type AmendmentSpec = Omit<Parameters<typeof insertAmendment>[0], 'paperId'> & {
	/** Seeded only in committees with more delegates than this */
	above?: number;
	/** Names the inserted amendment in the result of `insertAmendments` */
	key?: string;
};

/** Inserts the amendments the committee is large enough for, answering the keyed ones' ids */
async function insertAmendments(paperId: string, seed: CommitteeSeed, specs: AmendmentSpec[]) {
	const ids: Record<string, string> = {};
	for (const { above = -1, key, ...spec } of specs) {
		if (seed.delegates.length <= above) continue;
		const id = await insertAmendment({ paperId, ...spec });
		if (key) ids[key] = id;
	}
	return ids;
}

type CommentVisibility = (typeof schema.resolutionComment.$inferInsert)['visibility'];

type CommentSpec = {
	author: Member | undefined;
	content: string;
	visibility: CommentVisibility;
	clauseId?: string;
	/** Seeded only when this holds (and the authors exist) */
	when?: boolean;
	/** A reply in the same thread, on the same clause and with the same visibility */
	reply?: { author: Member | undefined; content: string };
};

async function insertComments(paperId: string, specs: CommentSpec[]) {
	for (const { author, content, visibility, clauseId, when = true, reply } of specs) {
		if (!when || !author || (reply && !reply.author)) continue;
		const rootId = nanoid();
		await db.insert(schema.resolutionComment).values({
			id: rootId,
			paperId,
			authorConferenceUserId: author.id,
			content,
			clauseId,
			visibility
		});
		if (reply?.author) {
			await db.insert(schema.resolutionComment).values({
				id: nanoid(),
				paperId,
				authorConferenceUserId: reply.author.id,
				content: reply.content,
				clauseId,
				visibility,
				parentCommentId: rootId
			});
		}
	}
}

function paperOf(s: ItemSeed) {
	return { committeeId: s.committee.id, agendaItemId: s.agendaItem.id };
}

// ── WORKING_PAPER ─────────────────────────────────────────────────────────

async function seedWorkingPaper(s: ItemSeed) {
	// Shorter preamble/operative for working papers; full for DRs and above.
	const content = buildResolution(
		s.committee.name,
		s.preamble.slice(0, 3),
		s.operative.slice(0, 3)
	);
	const paperId = await insertPaper({
		...paperOf(s),
		creatorMemberId: s.d(0),
		status: 'WORKING_PAPER',
		title: `Draft: ${s.agendaItem.title}`,
		content,
		sponsorMemberIds: s.pick(3, 0)
	});
	// All PENDING (drafting stage, nothing official yet)
	await insertAmendments(paperId, s, [
		{
			above: 2,
			proposer: s.d(1),
			type: 'ALTER_TEXT',
			status: 'PENDING',
			targetClauseId: content.operative[0].id,
			targetOperativeIndex: 0,
			newContent: s.amended(
				0,
				', with particular attention to the needs of the most vulnerable nations;'
			),
			documentNumber: s.doc('WP.ALT.1'),
			sponsorIds: [s.d(1)]
		},
		{
			above: 3,
			proposer: s.d(2),
			type: 'DELETE',
			status: 'PENDING',
			targetClauseId: op(content, 1),
			targetOperativeIndex: 1 % content.operative.length,
			documentNumber: s.doc('WP.DEL.1'),
			sponsorIds: [s.d(2), s.d(3)]
		},
		{
			above: 4,
			proposer: s.d(3),
			type: 'ADD',
			status: 'PENDING',
			targetOperativeIndex: 2,
			targetPosition: 2,
			newContent:
				'Emphasizes the importance of transparent and accountable implementation mechanisms at all levels;',
			documentNumber: s.doc('WP.ADD.1'),
			sponsorIds: []
		}
	]);
	console.info(`      WORKING_PAPER (${paperId})`);
}

// ── SUBMITTED ─────────────────────────────────────────────────────────────

async function seedSubmittedPaper(s: ItemSeed) {
	const content = buildResolution(
		s.committee.name,
		s.preamble.slice(0, 4),
		s.operative.slice(0, 4)
	);
	const paperId = await insertPaper({
		...paperOf(s),
		creatorMemberId: s.d(10),
		status: 'SUBMITTED',
		title: `${s.agendaItem.title} — co-sponsored proposal`,
		content,
		sponsorMemberIds: s.pick(5, 10),
		snapshots: [{ trigger: 'SUBMITTED' }]
	});
	await insertComments(paperId, [
		{
			author: s.adminCU,
			content: 'Solid structure. Please tighten the preambulatory language before promotion.',
			visibility: 'TEAM_ONLY'
		}
	]);
	// A mix of PENDING and SUBMITTED
	await insertAmendments(paperId, s, [
		{
			above: 2,
			proposer: s.d(1),
			type: 'ALTER_TEXT',
			status: 'SUBMITTED',
			targetClauseId: content.operative[0].id,
			targetOperativeIndex: 0,
			newContent: s.amended(
				0,
				', consistent with the principle of common but differentiated responsibilities and respective capabilities;'
			),
			documentNumber: s.doc('SUB.ALT.1'),
			sponsorIds: [s.d(1), s.d(2)]
		},
		{
			above: 4,
			proposer: s.d(3),
			type: 'ALTER_TEXT',
			status: 'SUBMITTED',
			targetClauseId: op(content, 1),
			targetOperativeIndex: 1 % content.operative.length,
			newContent: s.amended(
				1,
				', with a minimum allocation of 50 per cent directed to the Least Developed Countries;'
			),
			documentNumber: s.doc('SUB.ALT.2'),
			sponsorIds: [s.d(3), s.d(4)]
		},
		{
			above: 5,
			proposer: s.d(4),
			type: 'DELETE',
			status: 'SUBMITTED',
			targetClauseId: op(content, 2),
			targetOperativeIndex: 2 % content.operative.length,
			documentNumber: s.doc('SUB.DEL.1'),
			sponsorIds: [s.d(4), s.d(5)]
		},
		{
			above: 6,
			proposer: s.d(5),
			type: 'ADD',
			status: 'PENDING',
			targetOperativeIndex: 3,
			targetPosition: 3,
			newContent:
				'Requests the Secretary-General to provide technical assistance to developing countries in the implementation of commitments under this resolution;',
			documentNumber: s.doc('SUB.ADD.1'),
			sponsorIds: [s.d(5)]
		},
		{
			above: 7,
			proposer: s.d(6),
			type: 'ALTER_POSITION',
			status: 'PENDING',
			targetClauseId: content.operative[0].id,
			targetOperativeIndex: 0,
			targetPosition: content.operative.length - 1,
			documentNumber: s.doc('SUB.POS.1'),
			sponsorIds: []
		}
	]);
	console.info(`      SUBMITTED (${paperId})`);

	await insertComments(paperId, [
		{
			author: s.delegateCUs[0],
			content: 'We support this paper in principle but would like to strengthen OP3.',
			visibility: 'PUBLIC'
		}
	]);
}

// ── DRAFT_RESOLUTION ──────────────────────────────────────────────────────

async function seedDraftResolution(s: ItemSeed) {
	const docNum = s.doc('DR.1');
	const content = buildResolution(s.committee.name, s.preamble, s.operative);
	const paperId = await insertPaper({
		...paperOf(s),
		creatorMemberId: s.d(20),
		status: 'DRAFT_RESOLUTION',
		documentNumber: docNum,
		content,
		title: `Draft Resolution on ${s.agendaItem.title}`,
		sponsorMemberIds: s.pick(7, 20),
		snapshots: [{ trigger: 'SUBMITTED' }]
	});
	// One of each type, various statuses, varying sponsor counts
	await insertAmendments(paperId, s, draftResolutionAmendments(s, content));
	await insertComments(paperId, draftResolutionComments(s, content));
	console.info(`      DRAFT_RESOLUTION ${docNum} (${paperId})`);
	return paperId;
}

function draftResolutionAmendments(s: ItemSeed, content: Resolution): AmendmentSpec[] {
	const clauses = content.operative;
	const secondOrFirst = clauses.length > 1 ? 1 : 0;
	const thirdOrFirst = clauses.length > 2 ? 2 : 0;
	return [
		// 1 sponsor
		{
			above: 3,
			proposer: s.d(3),
			type: 'ALTER_TEXT',
			status: 'SUBMITTED',
			targetClauseId: clauses[0].id,
			targetOperativeIndex: 0,
			newContent: s.amended(
				0,
				', taking into account the principle of common but differentiated responsibilities;'
			),
			documentNumber: s.doc('ALT.1')
		},
		// 2 sponsors
		{
			above: 5,
			proposer: s.d(4),
			type: 'DELETE',
			status: 'PENDING',
			targetClauseId: clauses[1].id,
			targetOperativeIndex: 1,
			documentNumber: s.doc('DEL.1'),
			sponsorIds: [s.d(4), s.d(5)]
		},
		// inserts a new clause at position 2
		{
			above: 6,
			proposer: s.d(6),
			type: 'ADD',
			status: 'PENDING',
			targetOperativeIndex: 2,
			targetPosition: 2,
			newContent:
				'Emphasizes the need for transparent reporting mechanisms that allow civil society to monitor state compliance with commitments made under this resolution;',
			documentNumber: s.doc('ADD.1')
		},
		// moves clause 2 to position 0
		{
			above: 7,
			proposer: s.d(7),
			type: 'ALTER_POSITION',
			status: 'PENDING',
			targetClauseId: op(content, 2),
			targetOperativeIndex: 2,
			targetPosition: 0,
			documentNumber: s.doc('POS.1')
		},
		// no supporters at all yet
		{
			above: 8,
			proposer: s.d(8),
			type: 'ALTER_TEXT',
			status: 'PENDING',
			targetClauseId: op(content, 2),
			targetOperativeIndex: 2,
			newContent: s.amended(
				2,
				', ensuring full transparency and public accountability mechanisms;'
			),
			documentNumber: s.doc('ALT.2'),
			sponsorIds: []
		},
		// sponsors clearly above threshold (well-supported amendment)
		{
			above: 9,
			proposer: s.d(9),
			type: 'DELETE',
			status: 'SUBMITTED',
			targetClauseId: clauses[secondOrFirst].id,
			targetOperativeIndex: secondOrFirst,
			documentNumber: s.doc('DEL.2'),
			sponsorIds: range(Math.min(s.thresholdCount + 3, s.delegates.length - 9)).map((i) =>
				s.d(9 + i)
			)
		},
		// denser coverage
		{
			above: 10,
			proposer: s.d(10),
			type: 'ALTER_TEXT',
			status: 'SUBMITTED',
			targetClauseId: op(content, 2),
			targetOperativeIndex: 2 % clauses.length,
			newContent: s.amended(2, ', with an explicit timeline and accountability framework;'),
			documentNumber: s.doc('ALT.3'),
			sponsorIds: [s.d(10), s.d(11), s.d(12)]
		},
		{
			above: 12,
			proposer: s.d(11),
			type: 'ALTER_TEXT',
			status: 'SUBMITTED',
			targetClauseId: clauses[0].id,
			targetOperativeIndex: 0,
			newContent: s.amended(
				0,
				', including through innovative instruments such as green bonds and debt-for-climate swaps;'
			),
			documentNumber: s.doc('ALT.4'),
			sponsorIds: [s.d(11)]
		},
		{
			above: 13,
			proposer: s.d(12),
			type: 'ADD',
			status: 'SUBMITTED',
			targetOperativeIndex: clauses.length,
			targetPosition: clauses.length,
			newContent:
				'Stresses the need for simplified access modalities to climate funds, removing bureaucratic barriers that disproportionately hinder the smallest and most vulnerable states;',
			documentNumber: s.doc('ADD.2'),
			sponsorIds: [s.d(12), s.d(13)]
		},
		{
			above: 14,
			proposer: s.d(13),
			type: 'ALTER_TEXT',
			status: 'PENDING',
			targetClauseId: op(content, 1),
			targetOperativeIndex: 1 % clauses.length,
			newContent: s.amended(
				1,
				', subject to the sovereign right of states to determine their own development pathways;'
			),
			documentNumber: s.doc('ALT.5'),
			sponsorIds: [s.d(13)]
		},
		{
			above: 15,
			proposer: s.d(14),
			type: 'ALTER_POSITION',
			status: 'SUBMITTED',
			targetClauseId: clauses[thirdOrFirst].id,
			targetOperativeIndex: thirdOrFirst,
			targetPosition: 0,
			documentNumber: s.doc('POS.2'),
			sponsorIds: [s.d(14), s.d(15)]
		}
	];
}

/** Every visibility/clause/thread combination */
function draftResolutionComments(s: ItemSeed, content: Resolution): CommentSpec[] {
	return [
		{
			author: s.adminCU,
			content: 'Pending amendment in OP1 needs a vote before we can proceed to voting phase.',
			visibility: 'TEAM_ONLY'
		},
		{
			author: s.delegateCUs[0],
			content: 'Our delegation strongly supports the language in PP2.',
			clauseId: content.preamble[1 % content.preamble.length].id,
			visibility: 'PUBLIC'
		},
		{
			author: s.delegateCUs[1],
			content: 'OP1 should reference the 2030 Agenda for Sustainable Development explicitly.',
			clauseId: content.operative[0].id,
			visibility: 'PUBLIC'
		},
		{
			author: s.adminCU,
			when: content.operative.length > 1,
			content: 'OP2 language overlaps with the already-adopted framework — please reconcile.',
			clauseId: content.operative[1]?.id,
			visibility: 'TEAM_ONLY'
		},
		{
			author: s.delegateCUs[2],
			content:
				"We propose adding a reference to the Secretary-General's report A/79/123 in the preamble.",
			clauseId: content.preamble[0].id,
			visibility: 'PUBLIC',
			reply: {
				author: s.delegateCUs[3],
				content: 'Seconded. That report is directly on point for this clause.'
			}
		},
		{
			author: s.adminCU,
			when: !!s.delegateCUs[0],
			content: 'Internal note: confirm quorum before calling the amendment vote.',
			visibility: 'TEAM_ONLY',
			reply: { author: s.adminCU, content: 'Confirmed — 2/3 present and voting. Proceed.' }
		}
	];
}

// ── AMENDMENT_PHASE ───────────────────────────────────────────────────────

async function seedAmendmentPhasePaper(s: ItemSeed) {
	const docNum = s.doc('DR.2');
	const content = buildResolution(s.committee.name, s.preamble, [
		...s.operative.slice(0, 5),
		'Invites the Secretary-General to present a report on implementation progress to the Assembly at its next session.'
	]);
	const paperId = await insertPaper({
		...paperOf(s),
		creatorMemberId: s.d(40),
		status: 'AMENDMENT_PHASE',
		documentNumber: docNum,
		content,
		title: `Draft Resolution on ${s.agendaItem.title}`,
		sponsorMemberIds: s.pick(6, 40),
		snapshots: [{ trigger: 'SUBMITTED' }]
	});

	// Every type × every status combination, then the threshold-testing scenarios, then one
	// subject for each amendment review state
	const ids = await insertAmendments(paperId, s, [
		...amendmentPhaseAmendments(s, content),
		...thresholdAmendments(s, content),
		...reviewSubjectAmendments(s, content)
	]);

	await insertComments(paperId, [
		{
			author: s.adminCU,
			content: 'Eight amendments pending — check the order of votes carefully.',
			visibility: 'TEAM_ONLY'
		},
		{
			author: s.delegateCUs[0],
			content: 'We formally withdraw our support for DEL.2 — the underlying clause should remain.',
			visibility: 'PUBLIC'
		},
		{
			author: s.delegateCUs[1],
			content: 'OP1 is the crux of this resolution — any amendment here must be voted separately.',
			clauseId: content.operative[0].id,
			visibility: 'PUBLIC',
			reply: {
				author: s.delegateCUs[2],
				content: 'Agreed. We will call for a separate vote on ALT.2.'
			}
		}
	]);

	if (ids.accepted) {
		await insertReviewItems({
			paperId,
			triggerAmendmentId: ids.accepted,
			specs: reviewItems(s, ids)
		});
	}
	console.info(`      AMENDMENT_PHASE ${docNum} (${paperId})`);
}

function amendmentPhaseAmendments(s: ItemSeed, content: Resolution): AmendmentSpec[] {
	const clauses = content.operative;
	return [
		// applied
		{
			above: 4,
			proposer: s.d(4),
			type: 'ADD',
			status: 'CONSENSUS_ADOPTED',
			targetOperativeIndex: 2,
			targetPosition: 3,
			newContent:
				'Also encourages Member States to share best practices and technical expertise through South-South and triangular cooperation mechanisms;',
			documentNumber: s.doc('ADD.1')
		},
		{
			above: 5,
			proposer: s.d(5),
			type: 'DELETE',
			status: 'REJECTED',
			targetClauseId: op(content, 1),
			targetOperativeIndex: 1,
			documentNumber: s.doc('DEL.1')
		},
		// 3 sponsors, triggers the amendment review items
		{
			above: 8,
			key: 'accepted',
			proposer: s.d(6),
			type: 'ALTER_TEXT',
			status: 'ACCEPTED',
			targetClauseId: op(content, 2),
			targetOperativeIndex: 2,
			oldContent: JSON.stringify({
				id: nanoid(),
				blocks: [{ type: 'text' as const, id: nanoid(), content: s.clause(2) }]
			}),
			newContent: s.amended(
				2,
				', with particular attention to gender-responsive and youth-inclusive approaches;'
			),
			documentNumber: s.doc('ALT.2'),
			sponsorIds: [s.d(6), s.d(7), s.d(8)]
		},
		{
			above: 9,
			proposer: s.d(9),
			type: 'ALTER_POSITION',
			status: 'WITHDRAWN',
			targetClauseId: clauses[0].id,
			targetOperativeIndex: 0,
			targetPosition: 4,
			documentNumber: s.doc('POS.2')
		},
		{
			above: 11,
			proposer: s.d(10),
			type: 'DELETE',
			status: 'SUBMITTED',
			targetClauseId: op(content, 3),
			targetOperativeIndex: 3,
			documentNumber: s.doc('DEL.2'),
			sponsorIds: [s.d(10), s.d(11)]
		},
		// review item subject (State 2)
		{
			above: 12,
			key: 'pending0',
			proposer: s.d(12),
			type: 'ADD',
			status: 'SUBMITTED',
			targetOperativeIndex: 5,
			targetPosition: 5,
			newContent:
				'Calls upon the international community to ensure that climate finance reaches the most vulnerable communities without bureaucratic delay;',
			documentNumber: s.doc('ADD.2')
		},
		// review item subject (State 3)
		{
			above: 13,
			key: 'pending1',
			proposer: s.d(13),
			type: 'ALTER_TEXT',
			status: 'SUBMITTED',
			targetClauseId: content.preamble[0].id,
			newContent:
				'Reaffirming the purposes and principles enshrined in the Charter of the United Nations and the indispensable role of multilateral cooperation,',
			documentNumber: s.doc('ALT.3')
		},
		// moves the last operative clause to the front
		{
			above: 14,
			proposer: s.d(14),
			type: 'ALTER_POSITION',
			status: 'SUBMITTED',
			targetClauseId: clauses[clauses.length - 1].id,
			targetOperativeIndex: clauses.length - 1,
			targetPosition: 0,
			documentNumber: s.doc('POS.3')
		}
	];
}

function thresholdAmendments(s: ItemSeed, content: Resolution): AmendmentSpec[] {
	const clauses = content.operative;
	const fourthOrFirst = clauses.length > 3 ? 3 : 0;
	const fifthOrFirst = clauses.length > 4 ? 4 : 0;
	const t = s.thresholdCount;
	return [
		// 1 sponsor — clearly below threshold for large committees (e.g. GA needs ~19)
		{
			above: 40,
			proposer: s.d(40),
			type: 'ALTER_TEXT',
			status: 'PENDING',
			targetClauseId: clauses[fourthOrFirst].id,
			targetOperativeIndex: fourthOrFirst,
			newContent: s.amended(
				fourthOrFirst,
				', while respecting the principle of national sovereignty and non-interference;'
			),
			documentNumber: s.doc('ALT.4')
		},
		// exactly threshold sponsors, the minimum needed to submit
		{
			above: 50 + t,
			proposer: s.d(50),
			type: 'ADD',
			status: 'PENDING',
			targetOperativeIndex: 1,
			targetPosition: 1,
			newContent:
				'Requests the Secretariat to compile a biennial progress review and present findings to the Assembly at its next regular session;',
			documentNumber: s.doc('ADD.3'),
			sponsorIds: range(t).map((i) => s.d(50 + i))
		},
		// submitted without ever collecting any support
		{
			above: 70,
			proposer: s.d(70),
			type: 'DELETE',
			status: 'SUBMITTED',
			targetClauseId: clauses[fifthOrFirst].id,
			targetOperativeIndex: fifthOrFirst,
			documentNumber: s.doc('DEL.3'),
			sponsorIds: []
		},
		// sponsors 2× above threshold (strongly supported)
		{
			above: 80 + t * 2,
			proposer: s.d(80),
			type: 'ALTER_POSITION',
			status: 'SUBMITTED',
			targetClauseId: clauses[0].id,
			targetOperativeIndex: 0,
			targetPosition: clauses.length - 1,
			documentNumber: s.doc('POS.4'),
			sponsorIds: range(Math.min(t * 2 + 2, s.delegates.length - 80)).map((i) => s.d(80 + i))
		}
	];
}

/**
 * Created to give each amendment review state a seeded subject, all against the accepted
 * ALT.2 on the third operative clause. Uses modulo wrapping so they work even in small
 * committees.
 */
function reviewSubjectAmendments(s: ItemSeed, content: Resolution): AmendmentSpec[] {
	const clauses = content.operative;
	const alterText = (k: number, clause: number, ending: string, doc: string, key: string) =>
		({
			key,
			proposer: s.d(k),
			type: 'ALTER_TEXT',
			status: 'SUBMITTED',
			targetClauseId: op(content, clause),
			targetOperativeIndex: clause % clauses.length,
			newContent: s.amended(clause, ending),
			documentNumber: s.doc(doc)
		}) satisfies AmendmentSpec;
	const deleteThird = (k: number, doc: string, key: string) =>
		({
			key,
			proposer: s.d(k),
			type: 'DELETE',
			status: 'SUBMITTED',
			targetClauseId: op(content, 2),
			targetOperativeIndex: 2 % clauses.length,
			documentNumber: s.doc(doc)
		}) satisfies AmendmentSpec;
	const add = (k: number, position: number, newContent: string, doc: string, key: string) =>
		({
			key,
			proposer: s.d(k),
			type: 'ADD',
			status: 'SUBMITTED',
			targetOperativeIndex: position,
			targetPosition: position,
			newContent,
			documentNumber: s.doc(doc)
		}) satisfies AmendmentSpec;

	return [
		// competing text on the same clause: likely obsolete
		alterText(
			15,
			2,
			', with priority given to Small Island Developing States and Least Developed Countries and without imposing additional reporting requirements on recipients;',
			'RW.1',
			'obsolete1'
		),
		// can't delete a clause that was already substantively rewritten: ruled obsolete
		deleteThird(16, 'RW.2', 'obsolete2'),
		// contradicts the gender-responsive language ALT.2 added
		add(
			17,
			3,
			'Affirms that the Climate Adaptation Rapid Response Facility shall operate on the basis of purely technical and needs-based criteria, without imposing gender-disaggregated reporting obligations on recipient Member States;',
			'RW.3',
			'rewrite1'
		),
		// redundant, ALT.2 already introduced identical phrasing
		alterText(
			18,
			1,
			', with particular attention to gender-responsive and youth-inclusive approaches;',
			'RW.4',
			'rewrite2'
		),
		// its rationale quotes the clause's wording from before ALT.2
		alterText(
			19,
			3,
			', noting that OP2 establishes the Facility without gender-specific conditionalities;',
			'RW.5',
			'rewrite3'
		),
		// stale after ALT.2, resolved through a custom manual edit
		alterText(
			20,
			4,
			', drawing on the original mandate of the Climate Adaptation Rapid Response Facility as proposed by the primary sponsors, without reference to gender or age-specific criteria;',
			'RW.6',
			'rewrite4'
		),
		// conflicts with the 30-day emergency timeline, the chair kept the original text
		add(
			21,
			5,
			'Recommends that the Climate Adaptation Rapid Response Facility conduct a mandatory 60-day due-diligence review before releasing funds to any recipient state, to prevent misappropriation;',
			'RW.7',
			'rewrite5'
		),
		// a ≥45-day floor, against the ≤30-day emergency window
		alterText(
			26,
			0,
			', provided that all disbursement mechanisms maintain a minimum processing period of no less than 45 days per transaction to ensure proper fiduciary due diligence;',
			'RW.12',
			'rewrite8'
		),
		// a second competing rewrite of the same clause
		alterText(
			22,
			2,
			', subject to transparent financial accountability mechanisms and independent third-party auditing of disbursements;',
			'RW.8',
			'obsolete3'
		),
		// a second DELETE of the clause just rewritten
		deleteThird(23, 'RW.9', 'obsolete4'),
		// rejects the gender-specific criteria ALT.2 introduced
		alterText(
			24,
			5,
			', reaffirming that climate finance should remain free from gender-specific or age-based conditionalities that may impede access by recipient states;',
			'RW.10',
			'rewrite6'
		),
		// quotes OP2 as it was before ALT.2
		alterText(
			25,
			4,
			', building on the Rapid Response Facility as established in OP2 prior to amendment, with a mandate limited to emergency disbursements only;',
			'RW.11',
			'rewrite7'
		)
	];
}

type ReviewPhase = (typeof schema.amendmentReviewItem.$inferInsert)['phase'];

type ReviewItemSpec = {
	subject: string | undefined;
	phase: ReviewPhase;
	verdictObsolete?: boolean;
	verdictRewrite?: string | null;
	/** The chair ruled the subject obsolete, so it is withdrawn */
	withdraw?: boolean;
	/** The chair's rewrite, applied to the subject */
	rewriteTo?: string;
};

/**
 * One item per review state, without pre-populated AI output (the AI fills it in at
 * runtime). Unresolved OBSOLESCENCE and REWRITE items, and resolved ones of both phases.
 */
function reviewItems(s: ItemSeed, ids: Record<string, string>): ReviewItemSpec[] {
	const chairRewrite = s.amended(
		4,
		', in a manner consistent with the Climate Adaptation Rapid Response Facility as amended, including its gender-responsive and youth-inclusive mandate;'
	);
	return [
		{ subject: ids.obsolete1, phase: 'OBSOLESCENCE' },
		// pending amendments on unrelated clauses
		{ subject: ids.pending0, phase: 'OBSOLESCENCE' },
		{ subject: ids.pending1, phase: 'OBSOLESCENCE' },
		{ subject: ids.obsolete2, phase: 'RESOLVED', verdictObsolete: true, withdraw: true },
		{ subject: ids.rewrite1, phase: 'REWRITE' },
		{ subject: ids.rewrite2, phase: 'REWRITE' },
		{ subject: ids.rewrite3, phase: 'REWRITE' },
		{ subject: ids.rewrite8, phase: 'REWRITE' },
		// the chair rewrote the stale OP2 reference to match the amended language
		{
			subject: ids.rewrite4,
			phase: 'RESOLVED',
			verdictRewrite: chairRewrite,
			rewriteTo: chairRewrite
		},
		// the chair kept the original text
		{ subject: ids.rewrite5, phase: 'RESOLVED', verdictRewrite: null },
		{ subject: ids.obsolete3, phase: 'OBSOLESCENCE' },
		{ subject: ids.obsolete4, phase: 'OBSOLESCENCE' },
		{ subject: ids.rewrite6, phase: 'REWRITE' },
		{ subject: ids.rewrite7, phase: 'REWRITE' }
	];
}

async function insertReviewItems({
	paperId,
	triggerAmendmentId,
	specs
}: {
	paperId: string;
	triggerAmendmentId: string;
	specs: ReviewItemSpec[];
}) {
	for (const { subject, withdraw, rewriteTo, ...values } of specs) {
		if (!subject) continue;
		if (withdraw) {
			await db
				.update(schema.amendment)
				.set({ status: 'WITHDRAWN', obsoletedByAmendmentId: triggerAmendmentId })
				.where(eq(schema.amendment.id, subject));
		}
		await db.insert(schema.amendmentReviewItem).values({
			id: nanoid(),
			paperId,
			triggerAmendmentId,
			subjectAmendmentId: subject,
			...values
		});
		if (rewriteTo) {
			await db
				.update(schema.amendment)
				.set({ newContent: rewriteTo })
				.where(eq(schema.amendment.id, subject));
		}
	}
}

// ── VOTING_PHASE and FINAL ────────────────────────────────────────────────

/**
 * The processed amendments of a paper past its amendment phase: accepted, rejected,
 * adopted by consensus and withdrawn, plus `last`.
 */
function processedAmendments({
	s,
	content,
	docPrefix,
	texts,
	last
}: {
	s: ItemSeed;
	content: Resolution;
	docPrefix: string;
	texts: { accepted: string; added: string; withdrawn: string };
	last: AmendmentSpec;
}): AmendmentSpec[] {
	const clauses = content.operative;
	return [
		{
			above: 3,
			proposer: s.d(2),
			type: 'ALTER_TEXT',
			status: 'ACCEPTED',
			targetClauseId: clauses[0].id,
			targetOperativeIndex: 0,
			newContent: s.amended(0, texts.accepted),
			documentNumber: s.doc(`${docPrefix}.ALT.1`),
			sponsorIds: [s.d(2), s.d(3)]
		},
		{
			above: 5,
			proposer: s.d(4),
			type: 'DELETE',
			status: 'REJECTED',
			targetClauseId: op(content, 1),
			targetOperativeIndex: 1 % clauses.length,
			documentNumber: s.doc(`${docPrefix}.DEL.1`),
			sponsorIds: [s.d(4), s.d(5)]
		},
		{
			above: 7,
			proposer: s.d(6),
			type: 'ADD',
			status: 'CONSENSUS_ADOPTED',
			targetOperativeIndex: clauses.length,
			targetPosition: clauses.length,
			newContent: texts.added,
			documentNumber: s.doc(`${docPrefix}.ADD.1`),
			sponsorIds: [s.d(6), s.d(7)]
		},
		{
			above: 9,
			proposer: s.d(8),
			type: 'ALTER_TEXT',
			status: 'WITHDRAWN',
			targetClauseId: op(content, 2),
			targetOperativeIndex: 2 % clauses.length,
			newContent: s.amended(2, texts.withdrawn),
			documentNumber: s.doc(`${docPrefix}.ALT.2`),
			sponsorIds: [s.d(8)]
		},
		last
	];
}

async function seedVotingPhasePaper(s: ItemSeed) {
	const docNum = s.doc('DR.3');
	const content = buildResolution(s.committee.name, s.preamble, s.operative);
	const paperId = await insertPaper({
		...paperOf(s),
		creatorMemberId: s.d(60),
		status: 'VOTING_PHASE',
		documentNumber: docNum,
		content,
		title: `Draft Resolution on ${s.agendaItem.title}`,
		sponsorMemberIds: s.pick(9, 60),
		snapshots: [{ trigger: 'SUBMITTED' }]
	});
	await insertComments(paperId, [
		{
			author: s.adminCU,
			content: 'Roll call vote in progress — record every vote individually.',
			visibility: 'TEAM_ONLY'
		},
		{
			author: s.delegateCUs[0],
			content: 'Our delegation requests an explanation of vote before the vote is recorded.',
			visibility: 'PUBLIC'
		}
	]);
	// All processed: voting is underway, no new amendments possible
	await insertAmendments(
		paperId,
		s,
		processedAmendments({
			s,
			content,
			docPrefix: 'VP',
			texts: {
				accepted:
					', including through dedicated fast-track disbursement windows for declared climate emergencies;',
				added:
					'Decides to convene a high-level review conference within three years to assess progress in implementation of the commitments made herein;',
				withdrawn:
					', provided that recipient states demonstrate measurable progress against agreed benchmarks;'
			},
			last: {
				above: 11,
				proposer: s.d(10),
				type: 'ALTER_POSITION',
				status: 'REJECTED',
				targetClauseId: content.operative[0].id,
				targetOperativeIndex: 0,
				targetPosition: content.operative.length - 1,
				documentNumber: s.doc('VP.POS.1'),
				sponsorIds: [s.d(10), s.d(11)]
			}
		})
	);
	console.info(`      VOTING_PHASE ${docNum} (${paperId})`);
}

/** Adopted: only for non-active topics */
async function seedFinalPaper(s: ItemSeed) {
	const docNum = s.doc('RES.1');
	const content = buildResolution(s.committee.name, s.preamble, s.operative);
	const paperId = await insertPaper({
		...paperOf(s),
		creatorMemberId: s.d(40),
		status: 'FINAL',
		documentNumber: docNum,
		content,
		title: `Resolution on ${s.agendaItem.title}`,
		sponsorMemberIds: s.pick(8, 40),
		snapshots: [{ trigger: 'SUBMITTED' }, { trigger: 'VOTE_CONCLUDED' }]
	});
	await insertComments(paperId, [
		{
			author: s.adminCU,
			content: 'Adopted by consensus. Excellent work by all delegations.',
			visibility: 'TEAM_ONLY'
		},
		{
			author: s.delegateCUs[0],
			content: 'Historic resolution — our delegation is proud to have co-sponsored this text.',
			visibility: 'PUBLIC'
		},
		{
			author: s.delegateCUs[1],
			content: 'OP1 sets a clear benchmark — we look forward to the review at the next session.',
			clauseId: content.operative[0].id,
			visibility: 'PUBLIC'
		}
	]);
	// The historical record of what happened in the vote
	await insertAmendments(
		paperId,
		s,
		processedAmendments({
			s,
			content,
			docPrefix: 'F',
			texts: {
				accepted:
					', with particular attention to the needs of Least Developed Countries and Small Island Developing States;',
				added:
					'Calls upon all Member States to submit voluntary implementation reports to the Secretary-General within two years of adoption of this resolution;',
				withdrawn: ', subject to annual reporting obligations and independent verification;'
			},
			last: {
				above: 11,
				proposer: s.d(10),
				type: 'ALTER_TEXT',
				status: 'ACCEPTED',
				targetClauseId: op(content, 3),
				targetOperativeIndex: 3 % content.operative.length,
				newContent: s.amended(
					3 % content.operative.length,
					', with full respect for national sovereignty and ownership of implementation strategies;'
				),
				documentNumber: s.doc('F.ALT.3'),
				sponsorIds: [s.d(10), s.d(11), s.d(0)]
			}
		})
	);
	console.info(`      FINAL ${docNum} (${paperId})`);
}

// ── speakers lists ────────────────────────────────────────────────────────

type ListType = (typeof schema.speakersList.$inferSelect)['type'];

/**
 * How every agenda item's lists are populated: how many speakers (from which delegate on)
 * and the phase the list is in.
 */
const SEEDED_LISTS: Record<
	'active' | 'inactive',
	Record<
		ListType,
		{ count: number; offset: number; state: () => Partial<typeof schema.speakersList.$inferInsert> }
	>
> = {
	active: {
		// first one currently speaking
		SPEAKERS_LIST: {
			count: 5,
			offset: 0,
			state: () => ({ phase: 'SPEECH', timeLeft: 95, startTimestamp: new Date() })
		},
		// floor open for a question
		COMMENT_LIST: { count: 3, offset: 5, state: () => ({ phase: 'QUESTION', timeLeft: 20 }) }
	},
	inactive: {
		// past speakers, list closed, last speaker done
		SPEAKERS_LIST: {
			count: 4,
			offset: 10,
			state: () => ({ isClosed: true, phase: 'SPEECH_DONE', timeLeft: 0 })
		},
		// delegate currently answering
		COMMENT_LIST: {
			count: 2,
			offset: 15,
			state: () => ({ phase: 'ANSWER', timeLeft: 12, startTimestamp: new Date() })
		}
	}
};

async function seedItemSpeakersLists(s: ItemSeed) {
	const lists = await db
		.select()
		.from(schema.speakersList)
		.where(eq(schema.speakersList.agendaItemId, s.agendaItem.id));

	for (const list of lists) {
		const { count, offset, state } = SEEDED_LISTS[s.isActive ? 'active' : 'inactive'][list.type];
		for (const i of range(Math.min(count, s.delegates.length))) {
			await db.insert(schema.speakerOnList).values({
				id: nanoid(),
				speakersListId: list.id,
				committeeMemberId: s.d(i + offset),
				position: i
			});
		}
		await db.update(schema.speakersList).set(state()).where(eq(schema.speakersList.id, list.id));
	}
}

// ─── statistics & dashboard data ───────────────────────────────────────────
// Backs the materialized views in statistics.ts / missionControlPulse.ts:
// spoken time, presence, and voting sessions aren't produced anywhere else
// in this seed, so without this those resolvers/tiles just show zeros.

function daysAgo(n: number, hour: number, minute = 0): Date {
	const d = new Date();
	d.setDate(d.getDate() - n);
	d.setHours(hour, minute, 0, 0);
	return d;
}

function minutesAgo(n: number): Date {
	return new Date(Date.now() - n * 60_000);
}

function addSeconds(d: Date, s: number): Date {
	return new Date(d.getTime() + s * 1000);
}

async function seedSpeeches(opts: {
	speakersListId: string;
	speakingTime: number;
	speakers: Array<{ committeeMemberId?: string; conferenceMemberId?: string }>;
	startAt: Date;
	count: number;
}) {
	let cursor = opts.startAt;
	for (let i = 0; i < opts.count; i++) {
		const speaker = opts.speakers[i % opts.speakers.length];
		const duration = Math.max(20, opts.speakingTime - (i % 4) * 15);
		await db.insert(schema.spokenTimePeriod).values({
			id: nanoid(),
			...speaker,
			speakersListId: opts.speakersListId,
			startTimestamp: cursor,
			endTimestamp: addSeconds(cursor, duration),
			queuedAt: addSeconds(cursor, -30),
			phase: 'SPEECH_DONE'
		});
		cursor = addSeconds(cursor, duration + 20 + (i % 3) * 10);
	}
}

async function insertVotingSession(opts: {
	committeeId: string;
	startedByConferenceUserId?: string;
	delegates: Array<{ id: string }>;
	voteName: string;
	pro: number;
	con: number;
	abstain: number;
	completedAt: Date | null;
	offset?: number;
}) {
	const { delegates, pro, con, abstain, completedAt } = opts;
	const majorityAmount = Math.floor(delegates.length / 2) + 1;
	const sessionId = nanoid();

	await db.insert(schema.votingSession).values({
		id: sessionId,
		committeeId: opts.committeeId,
		startedByConferenceUserId: opts.startedByConferenceUserId,
		mode: 'ROLL_CALL',
		voteName: opts.voteName,
		majority: 'SIMPLE',
		withAbstentions: true,
		majorityAmount,
		currentStage: completedAt ? 'EVALUATION' : 'PRO',
		votesPro: pro,
		votesCon: con,
		votesAbstain: abstain,
		completedAt: completedAt ?? undefined,
		outcome: completedAt ? (pro > con ? 'ADOPTED' : 'REJECTED') : undefined
	});

	const choices: Array<'PRO' | 'CON' | 'ABSTAIN'> = [
		...Array(pro).fill('PRO' as const),
		...Array(con).fill('CON' as const),
		...Array(abstain).fill('ABSTAIN' as const)
	];
	const offset = opts.offset ?? 0;
	for (let i = 0; i < choices.length && i < delegates.length; i++) {
		await db.insert(schema.votingVote).values({
			id: nanoid(),
			votingSessionId: sessionId,
			committeeMemberId: delegates[(offset + i) % delegates.length].id,
			vote: choices[i]
		});
	}

	return sessionId;
}

async function seedStatisticsAndDashboardData() {
	const committees = await db.select().from(schema.committee);

	for (const [committeeIdx, committee] of committees.entries()) {
		const agendaItems = await agendaItemsOf(committee.id);
		if (agendaItems.length === 0) continue;
		const seed = await loadCommitteeSeed(committee);
		if (!seed) continue;

		console.info(`  ${committee.name}:`);
		await seedPresence(seed);
		await seedSpokenTime({ seed, committeeIdx, agendaItems });
		await seedVotingSessions(seed);
	}
}

/** ~80% of delegates checked in right now, 3-day history */
async function seedPresence({ committee, delegates, delegateCUs, adminCU }: CommitteeSeed) {
	const presentDelegates = delegates.filter((_, i) => i % 5 !== 0);
	for (const d of presentDelegates) {
		await db
			.update(schema.committeeMember)
			.set({ present: true })
			.where(eq(schema.committeeMember.id, d.id));
	}

	for (let dayOffset = 2; dayOffset >= 0; dayOffset--) {
		for (const cu of delegateCUs) {
			await seedRollCallDay({ committeeId: committee.id, conferenceUserId: cu.id, dayOffset });
		}
		if (adminCU) {
			await db.insert(schema.presenceEvent).values({
				conferenceUserId: adminCU.id,
				committeeId: committee.id,
				timestamp: daysAgo(dayOffset, 8, 45),
				present: true,
				type: 'MANUAL'
			});
		}
	}
	console.info(`    Presence events: ${delegateCUs.length * 5 + 3}`);
}

async function seedRollCallDay({
	committeeId,
	conferenceUserId,
	dayOffset
}: {
	committeeId: string;
	conferenceUserId: string;
	dayOffset: number;
}) {
	await db.insert(schema.presenceEvent).values({
		conferenceUserId,
		committeeId,
		timestamp: daysAgo(dayOffset, 9, (dayOffset * 7 + 3) % 30),
		present: true,
		type: 'ROLL_CALL'
	});
	// Leave today's check-ins open, matching committeeMember.present above.
	if (dayOffset > 0) {
		await db.insert(schema.presenceEvent).values({
			conferenceUserId,
			committeeId,
			timestamp: daysAgo(dayOffset, 17, (dayOffset * 11 + 5) % 30),
			present: false,
			type: 'ROLL_CALL'
		});
	}
}

type Speaker = { committeeMemberId?: string; conferenceMemberId?: string };

/**
 * Historical speeches (yesterday + today) plus a burst in the last 15 minutes so the
 * "busiest committee" tile has a winner.
 */
async function seedSpokenTime({
	seed,
	committeeIdx,
	agendaItems
}: {
	seed: CommitteeSeed;
	committeeIdx: number;
	agendaItems: AgendaItemRow[];
}) {
	const conferenceMembers = await db
		.select({ id: schema.conferenceMember.id })
		.from(schema.conferenceMember)
		.where(eq(schema.conferenceMember.conferenceId, seed.committee.conferenceId));
	const delegateSpeakers: Speaker[] = seed.delegates.map((d) => ({ committeeMemberId: d.id }));
	const speakerPools: Record<ListType, Speaker[]> = {
		SPEAKERS_LIST: delegateSpeakers,
		COMMENT_LIST: [
			...delegateSpeakers,
			...seed.members
				.filter((m) => m.representationType !== 'DELEGATION')
				.map((m) => ({ committeeMemberId: m.id })),
			...conferenceMembers.map((m) => ({ conferenceMemberId: m.id }))
		]
	};
	// staggered per committee so there's a clear "busiest committee right now"
	const recentCount = 2 + (committeeIdx % 2);

	let speechCount = 0;
	for (const agendaItem of agendaItems) {
		const lists = await db
			.select()
			.from(schema.speakersList)
			.where(eq(schema.speakersList.agendaItemId, agendaItem.id));
		const isActive = agendaItem.id === seed.committee.activeAgendaItemId;

		for (const list of lists) {
			speechCount += await seedHistoricalSpeeches(list, speakerPools[list.type]);
			if (isActive && list.type === 'SPEAKERS_LIST') {
				speechCount += await seedRecentSpeeches({ seed, listId: list.id, recentCount });
			}
		}
	}
	console.info(`    Spoken time periods: ${speechCount}`);
}

async function seedHistoricalSpeeches(
	list: typeof schema.speakersList.$inferSelect,
	speakers: Speaker[]
) {
	const count = list.type === 'SPEAKERS_LIST' ? 6 : 4;
	for (const startAt of [daysAgo(1, 10, 0), daysAgo(0, 9, 30)]) {
		await seedSpeeches({
			speakersListId: list.id,
			speakingTime: list.speakingTime,
			speakers,
			startAt,
			count
		});
	}
	return count * 2;
}

/** A couple of interventions in the last 15 minutes */
async function seedRecentSpeeches({
	seed,
	listId,
	recentCount
}: {
	seed: CommitteeSeed;
	listId: string;
	recentCount: number;
}) {
	for (const i of range(recentCount)) {
		const end = minutesAgo(1 + i * 3);
		await db.insert(schema.spokenTimePeriod).values({
			id: nanoid(),
			committeeMemberId: seed.d(i + 20),
			speakersListId: listId,
			startTimestamp: addSeconds(end, -90),
			endTimestamp: end,
			queuedAt: addSeconds(end, -120),
			phase: 'SPEECH_DONE'
		});
	}
	return recentCount;
}

/** History plus a close vote and an active session */
async function seedVotingSessions({ committee, delegates, adminCU }: CommitteeSeed) {
	const n = delegates.length;
	const sessions = [
		{
			voteName: 'Procedural motion to suspend the meeting',
			pro: Math.ceil(n * 0.7),
			con: Math.floor(n * 0.2),
			abstain: Math.max(0, n - Math.ceil(n * 0.9)),
			completedAt: daysAgo(1, 15, 0),
			offset: 0
		},
		{
			voteName: 'Motion to extend speaking time',
			pro: Math.floor(n * 0.3),
			con: Math.ceil(n * 0.6),
			abstain: Math.max(0, n - Math.floor(n * 0.9)),
			completedAt: daysAgo(1, 16, 0),
			offset: 5
		},
		{
			voteName: 'Draft resolution — final vote',
			pro: Math.floor(n / 2) + 1,
			con: Math.floor(n / 2),
			abstain: 0,
			completedAt: minutesAgo(45),
			offset: 2
		},
		{
			voteName: 'Amendment vote',
			pro: Math.ceil(n * 0.6),
			con: Math.floor(n * 0.3),
			abstain: Math.max(0, n - Math.ceil(n * 0.9)),
			completedAt: minutesAgo(120),
			offset: 8
		},
		{
			voteName: 'Motion for a moderated caucus',
			pro: Math.floor(n * 0.4),
			con: Math.floor(n * 0.1),
			abstain: 0,
			completedAt: null,
			offset: 1
		}
	];
	let activeSessionId: string | undefined;
	for (const session of sessions) {
		activeSessionId = await insertVotingSession({
			committeeId: committee.id,
			startedByConferenceUserId: adminCU?.id,
			delegates,
			...session
		});
	}
	// the last one is still running
	await db
		.update(schema.committee)
		.set({ activeVotingSessionId: activeSessionId })
		.where(eq(schema.committee.id, committee.id));
	console.info(`    Voting sessions: 5 (1 active)`);
}

process.exit(0);
