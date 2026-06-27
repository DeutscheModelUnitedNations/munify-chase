import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { reset } from 'drizzle-seed';
import { assertFirstEntryExists } from '@m1212e/rumble';
import yaml from 'js-yaml';
import type { SeedData } from './seed-data/schema';
import * as fs from 'fs';
import { getCountryData } from './seedUtils';
import { and, eq, type InferSelectModel } from 'drizzle-orm';
import { attendanceCode as generateAttendanceCode } from '../../lib/helpers/attendanceCode';
import { nanoid } from '../../lib/helpers/nanoid';
import * as Y from 'yjs';
import { jsonToYDoc } from '@deutschemodelunitednations/munify-resolution-editor/yjs';
import {
	createEmptyResolution,
	toRoman,
	type Resolution
} from '@deutschemodelunitednations/munify-resolution-editor/schema';

// casing is a valid runtime option but missing from DrizzlePgConfig types in this RC
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

	const data = yaml.load(fileContents) as SeedData;

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
				conferenceUserType: user.conferenceUserType,
				attendanceCode:
					user.conferenceUserType === 'NON_STATE_ACTOR' ? generateAttendanceCode() : null
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

async function seedResolutionPapers() {
	const committees = await db.select().from(schema.committee);

	for (const committee of committees) {
		const agendaItems = await db
			.select()
			.from(schema.agendaItem)
			.where(eq(schema.agendaItem.committeeId, committee.id));

		const allMembers = await db
			.select({
				id: schema.committeeMember.id,
				representationType: schema.representation.type
			})
			.from(schema.committeeMember)
			.innerJoin(
				schema.representation,
				eq(schema.committeeMember.representationId, schema.representation.id)
			)
			.where(eq(schema.committeeMember.committeeId, committee.id));

		const delegates = allMembers.filter((m) => m.representationType === 'DELEGATION');
		if (delegates.length < 5) continue;

		const adminCU = (
			await db
				.select()
				.from(schema.conferenceUser)
				.where(
					and(
						eq(schema.conferenceUser.conferenceId, committee.conferenceId),
						eq(schema.conferenceUser.conferenceUserType, 'ADMIN')
					)
				)
				.limit(1)
		)[0];

		const delegateCUs = await db
			.select({ id: schema.conferenceUser.id })
			.from(schema.conferenceUser)
			.innerJoin(
				schema.committeeMember,
				eq(schema.conferenceUser.committeeMemberId, schema.committeeMember.id)
			)
			.where(eq(schema.committeeMember.committeeId, committee.id));

		console.info(`  ${committee.name}:`);

		// pick(n, offset) — wraps around to avoid running out of delegates
		const pick = (n: number, offset = 0) =>
			Array.from({ length: n }, (_, i) => delegates[(offset + i) % delegates.length].id);

		// How many sponsors are needed for an amendment to meet the support threshold
		const thresholdCount = Math.max(
			1,
			Math.ceil((delegates.length * (committee.paperSupportThreshold ?? 10)) / 100)
		);

		for (let itemIdx = 0; itemIdx < agendaItems.length; itemIdx++) {
			const agendaItem = agendaItems[itemIdx];
			const isActive = agendaItem.id === committee.activeAgendaItemId;
			const roman = toRoman(itemIdx + 1);
			const abbr = committee.abbreviation;
			const { preamble, operative } = getTopicContent(agendaItem.title);

			// Shorter preamble/operative for working papers; full for DRs and above.
			const wpContent = buildResolution(
				committee.name,
				preamble.slice(0, 3),
				operative.slice(0, 3)
			);
			const drContent = buildResolution(committee.name, preamble, operative);

			console.info(`    [${agendaItem.title}${isActive ? ' — active' : ''}]`);

			// ── WORKING_PAPER ─────────────────────────────────────────────────
			const wpId = await insertPaper({
				committeeId: committee.id,
				agendaItemId: agendaItem.id,
				creatorMemberId: pick(1, 0)[0],
				status: 'WORKING_PAPER',
				title: `Draft: ${agendaItem.title}`,
				content: wpContent,
				sponsorMemberIds: pick(3, 0)
			});
			// Amendments on WORKING_PAPER — all PENDING (drafting stage, nothing official yet)
			if (delegates.length > 2) {
				await insertAmendment({
					paperId: wpId,
					proposer: delegates[1 % delegates.length].id,
					type: 'ALTER_TEXT',
					status: 'PENDING',
					targetClauseId: wpContent.operative[0].id,
					targetOperativeIndex: 0,
					newContent: operative[0].replace(
						';',
						', with particular attention to the needs of the most vulnerable nations;'
					),
					documentNumber: `${abbr}/${roman}/WP.ALT.1`,
					sponsorIds: [delegates[1 % delegates.length].id]
				});
			}
			if (delegates.length > 3) {
				await insertAmendment({
					paperId: wpId,
					proposer: delegates[2 % delegates.length].id,
					type: 'DELETE',
					status: 'PENDING',
					targetClauseId: wpContent.operative[1 % wpContent.operative.length].id,
					targetOperativeIndex: 1 % wpContent.operative.length,
					documentNumber: `${abbr}/${roman}/WP.DEL.1`,
					sponsorIds: [delegates[2 % delegates.length].id, delegates[3 % delegates.length].id]
				});
			}
			if (delegates.length > 4) {
				await insertAmendment({
					paperId: wpId,
					proposer: delegates[3 % delegates.length].id,
					type: 'ADD',
					status: 'PENDING',
					targetOperativeIndex: 2,
					targetPosition: 2,
					newContent:
						'Emphasizes the importance of transparent and accountable implementation mechanisms at all levels;',
					documentNumber: `${abbr}/${roman}/WP.ADD.1`,
					sponsorIds: []
				});
			}
			console.info(`      WORKING_PAPER (${wpId})`);

			// ── SUBMITTED ─────────────────────────────────────────────────────
			const submittedContent = buildResolution(
				committee.name,
				preamble.slice(0, 4),
				operative.slice(0, 4)
			);
			const subId = await insertPaper({
				committeeId: committee.id,
				agendaItemId: agendaItem.id,
				creatorMemberId: pick(1, 10)[0],
				status: 'SUBMITTED',
				title: `${agendaItem.title} — co-sponsored proposal`,
				content: submittedContent,
				sponsorMemberIds: pick(5, 10),
				snapshots: [{ trigger: 'SUBMITTED' }]
			});
			// Add a chair comment on the submitted paper
			if (adminCU) {
				await db.insert(schema.resolutionComment).values({
					id: nanoid(),
					paperId: subId,
					authorConferenceUserId: adminCU.id,
					content: 'Solid structure. Please tighten the preambulatory language before promotion.',
					visibility: 'TEAM_ONLY'
				});
			}
			// Amendments on SUBMITTED paper — mix of PENDING and SUBMITTED
			if (delegates.length > 2) {
				await insertAmendment({
					paperId: subId,
					proposer: delegates[1 % delegates.length].id,
					type: 'ALTER_TEXT',
					status: 'SUBMITTED',
					targetClauseId: submittedContent.operative[0].id,
					targetOperativeIndex: 0,
					newContent: operative[0].replace(
						';',
						', consistent with the principle of common but differentiated responsibilities and respective capabilities;'
					),
					documentNumber: `${abbr}/${roman}/SUB.ALT.1`,
					sponsorIds: [delegates[1 % delegates.length].id, delegates[2 % delegates.length].id]
				});
			}
			if (delegates.length > 4) {
				await insertAmendment({
					paperId: subId,
					proposer: delegates[3 % delegates.length].id,
					type: 'ALTER_TEXT',
					status: 'SUBMITTED',
					targetClauseId: submittedContent.operative[1 % submittedContent.operative.length].id,
					targetOperativeIndex: 1 % submittedContent.operative.length,
					newContent: operative[1 % operative.length].replace(
						';',
						', with a minimum allocation of 50 per cent directed to the Least Developed Countries;'
					),
					documentNumber: `${abbr}/${roman}/SUB.ALT.2`,
					sponsorIds: [delegates[3 % delegates.length].id, delegates[4 % delegates.length].id]
				});
			}
			if (delegates.length > 5) {
				await insertAmendment({
					paperId: subId,
					proposer: delegates[4 % delegates.length].id,
					type: 'DELETE',
					status: 'SUBMITTED',
					targetClauseId: submittedContent.operative[2 % submittedContent.operative.length].id,
					targetOperativeIndex: 2 % submittedContent.operative.length,
					documentNumber: `${abbr}/${roman}/SUB.DEL.1`,
					sponsorIds: [delegates[4 % delegates.length].id, delegates[5 % delegates.length].id]
				});
			}
			if (delegates.length > 6) {
				await insertAmendment({
					paperId: subId,
					proposer: delegates[5 % delegates.length].id,
					type: 'ADD',
					status: 'PENDING',
					targetOperativeIndex: 3,
					targetPosition: 3,
					newContent:
						'Requests the Secretary-General to provide technical assistance to developing countries in the implementation of commitments under this resolution;',
					documentNumber: `${abbr}/${roman}/SUB.ADD.1`,
					sponsorIds: [delegates[5 % delegates.length].id]
				});
			}
			if (delegates.length > 7) {
				await insertAmendment({
					paperId: subId,
					proposer: delegates[6 % delegates.length].id,
					type: 'ALTER_POSITION',
					status: 'PENDING',
					targetClauseId: submittedContent.operative[0].id,
					targetOperativeIndex: 0,
					targetPosition: submittedContent.operative.length - 1,
					documentNumber: `${abbr}/${roman}/SUB.POS.1`,
					sponsorIds: []
				});
			}
			console.info(`      SUBMITTED (${subId})`);

			// ── SUBMITTED: extra delegate comment ────────────────────────────
			if (delegateCUs[0]) {
				await db.insert(schema.resolutionComment).values({
					id: nanoid(),
					paperId: subId,
					authorConferenceUserId: delegateCUs[0].id,
					content: 'We support this paper in principle but would like to strengthen OP3.',
					visibility: 'PUBLIC'
				});
			}

			// ── DRAFT_RESOLUTION ──────────────────────────────────────────────
			const drDocNum = `${abbr}/${roman}/DR.1`;
			const drId = await insertPaper({
				committeeId: committee.id,
				agendaItemId: agendaItem.id,
				creatorMemberId: pick(1, 20)[0],
				status: 'DRAFT_RESOLUTION',
				documentNumber: drDocNum,
				content: drContent,
				title: `Draft Resolution on ${agendaItem.title}`,
				sponsorMemberIds: pick(7, 20),
				snapshots: [{ trigger: 'SUBMITTED' }]
			});

			// Amendments on the DR — one of each type, various statuses, varying sponsor counts
			// ALTER_TEXT + SUBMITTED — 1 sponsor
			if (delegates.length > 3) {
				const amendId = nanoid();
				const proposer = delegates[3 % delegates.length].id;
				await db.insert(schema.amendment).values({
					id: amendId,
					paperId: drId,
					proposerCommitteeMemberId: proposer,
					type: 'ALTER_TEXT',
					status: 'SUBMITTED',
					targetClauseId: drContent.operative[0].id,
					targetOperativeIndex: 0,
					newContent: operative[0].replace(
						';',
						', taking into account the principle of common but differentiated responsibilities;'
					),
					documentNumber: `${abbr}/${roman}/ALT.1`
				});
				await db
					.insert(schema.amendmentSponsor)
					.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: proposer });
			}
			// DELETE + PENDING — 2 sponsors
			if (delegates.length > 5) {
				const amendId = nanoid();
				const proposer = delegates[4 % delegates.length].id;
				const cosponsor = delegates[5 % delegates.length].id;
				await db.insert(schema.amendment).values({
					id: amendId,
					paperId: drId,
					proposerCommitteeMemberId: proposer,
					type: 'DELETE',
					status: 'PENDING',
					targetClauseId: drContent.operative[1].id,
					targetOperativeIndex: 1,
					documentNumber: `${abbr}/${roman}/DEL.1`
				});
				await db
					.insert(schema.amendmentSponsor)
					.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: proposer });
				await db
					.insert(schema.amendmentSponsor)
					.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: cosponsor });
			}
			// ADD + PENDING — inserts a new clause at position 2
			if (delegates.length > 6) {
				const amendId = nanoid();
				const proposer = delegates[6 % delegates.length].id;
				await db.insert(schema.amendment).values({
					id: amendId,
					paperId: drId,
					proposerCommitteeMemberId: proposer,
					type: 'ADD',
					status: 'PENDING',
					targetOperativeIndex: 2,
					targetPosition: 2,
					newContent:
						'Emphasizes the need for transparent reporting mechanisms that allow civil society to monitor state compliance with commitments made under this resolution;',
					documentNumber: `${abbr}/${roman}/ADD.1`
				});
				await db
					.insert(schema.amendmentSponsor)
					.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: proposer });
			}
			// ALTER_POSITION + PENDING — moves clause 2 to position 0
			if (delegates.length > 7) {
				const amendId = nanoid();
				const proposer = delegates[7 % delegates.length].id;
				await db.insert(schema.amendment).values({
					id: amendId,
					paperId: drId,
					proposerCommitteeMemberId: proposer,
					type: 'ALTER_POSITION',
					status: 'PENDING',
					targetClauseId: drContent.operative[2 % drContent.operative.length].id,
					targetOperativeIndex: 2,
					targetPosition: 0,
					documentNumber: `${abbr}/${roman}/POS.1`
				});
				await db
					.insert(schema.amendmentSponsor)
					.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: proposer });
			}
			// ALTER_TEXT + PENDING — 0 sponsors (proposer only, no support collected yet)
			if (delegates.length > 8) {
				const amendId = nanoid();
				await db.insert(schema.amendment).values({
					id: amendId,
					paperId: drId,
					proposerCommitteeMemberId: delegates[8 % delegates.length].id,
					type: 'ALTER_TEXT',
					status: 'PENDING',
					targetClauseId: drContent.operative[2 % drContent.operative.length].id,
					targetOperativeIndex: 2,
					newContent: operative[2 % operative.length].replace(
						';',
						', ensuring full transparency and public accountability mechanisms;'
					),
					documentNumber: `${abbr}/${roman}/ALT.2`
				});
				// Intentionally no amendmentSponsor row — zero supporters
			}
			// DELETE + SUBMITTED — sponsors clearly above threshold (well-supported amendment)
			if (delegates.length > 9) {
				const amendId = nanoid();
				const p = delegates[9 % delegates.length].id;
				await db.insert(schema.amendment).values({
					id: amendId,
					paperId: drId,
					proposerCommitteeMemberId: p,
					type: 'DELETE',
					status: 'SUBMITTED',
					targetClauseId: drContent.operative[drContent.operative.length > 1 ? 1 : 0].id,
					targetOperativeIndex: drContent.operative.length > 1 ? 1 : 0,
					documentNumber: `${abbr}/${roman}/DEL.2`
				});
				// Add sponsors well above threshold
				const aboveThresholdCount = Math.min(thresholdCount + 3, delegates.length - 9);
				for (let i = 0; i < aboveThresholdCount; i++) {
					await db.insert(schema.amendmentSponsor).values({
						id: nanoid(),
						amendmentId: amendId,
						committeeMemberId: delegates[(9 + i) % delegates.length].id
					});
				}
			}

			// More amendments on the DR — denser coverage
			if (delegates.length > 10) {
				await insertAmendment({
					paperId: drId,
					proposer: delegates[10 % delegates.length].id,
					type: 'ALTER_TEXT',
					status: 'SUBMITTED',
					targetClauseId: drContent.operative[2 % drContent.operative.length].id,
					targetOperativeIndex: 2 % drContent.operative.length,
					newContent: operative[2 % operative.length].replace(
						';',
						', with an explicit timeline and accountability framework;'
					),
					documentNumber: `${abbr}/${roman}/ALT.3`,
					sponsorIds: [
						delegates[10 % delegates.length].id,
						delegates[11 % delegates.length].id,
						delegates[12 % delegates.length].id
					]
				});
			}
			if (delegates.length > 12) {
				await insertAmendment({
					paperId: drId,
					proposer: delegates[11 % delegates.length].id,
					type: 'ALTER_TEXT',
					status: 'SUBMITTED',
					targetClauseId: drContent.operative[0].id,
					targetOperativeIndex: 0,
					newContent: operative[0].replace(
						';',
						', including through innovative instruments such as green bonds and debt-for-climate swaps;'
					),
					documentNumber: `${abbr}/${roman}/ALT.4`,
					sponsorIds: [delegates[11 % delegates.length].id]
				});
			}
			if (delegates.length > 13) {
				await insertAmendment({
					paperId: drId,
					proposer: delegates[12 % delegates.length].id,
					type: 'ADD',
					status: 'SUBMITTED',
					targetOperativeIndex: drContent.operative.length,
					targetPosition: drContent.operative.length,
					newContent:
						'Stresses the need for simplified access modalities to climate funds, removing bureaucratic barriers that disproportionately hinder the smallest and most vulnerable states;',
					documentNumber: `${abbr}/${roman}/ADD.2`,
					sponsorIds: [delegates[12 % delegates.length].id, delegates[13 % delegates.length].id]
				});
			}
			if (delegates.length > 14) {
				await insertAmendment({
					paperId: drId,
					proposer: delegates[13 % delegates.length].id,
					type: 'ALTER_TEXT',
					status: 'PENDING',
					targetClauseId: drContent.operative[1 % drContent.operative.length].id,
					targetOperativeIndex: 1 % drContent.operative.length,
					newContent: operative[1 % operative.length].replace(
						';',
						', subject to the sovereign right of states to determine their own development pathways;'
					),
					documentNumber: `${abbr}/${roman}/ALT.5`,
					sponsorIds: [delegates[13 % delegates.length].id]
				});
			}
			if (delegates.length > 15) {
				await insertAmendment({
					paperId: drId,
					proposer: delegates[14 % delegates.length].id,
					type: 'ALTER_POSITION',
					status: 'SUBMITTED',
					targetClauseId: drContent.operative[drContent.operative.length > 2 ? 2 : 0].id,
					targetOperativeIndex: drContent.operative.length > 2 ? 2 : 0,
					targetPosition: 0,
					documentNumber: `${abbr}/${roman}/POS.2`,
					sponsorIds: [delegates[14 % delegates.length].id, delegates[15 % delegates.length].id]
				});
			}

			// Comments on the DR — all visibility/clause/thread combinations
			// TEAM_ONLY chair comment at paper level
			if (adminCU) {
				await db.insert(schema.resolutionComment).values({
					id: nanoid(),
					paperId: drId,
					authorConferenceUserId: adminCU.id,
					content: 'Pending amendment in OP1 needs a vote before we can proceed to voting phase.',
					visibility: 'TEAM_ONLY'
				});
			}
			// PUBLIC delegate comment on preamble clause PP2
			if (delegateCUs[0]) {
				await db.insert(schema.resolutionComment).values({
					id: nanoid(),
					paperId: drId,
					authorConferenceUserId: delegateCUs[0].id,
					content: 'Our delegation strongly supports the language in PP2.',
					clauseId: drContent.preamble[1 % drContent.preamble.length].id,
					visibility: 'PUBLIC'
				});
			}
			// PUBLIC delegate comment on operative clause OP1
			if (delegateCUs[1]) {
				await db.insert(schema.resolutionComment).values({
					id: nanoid(),
					paperId: drId,
					authorConferenceUserId: delegateCUs[1].id,
					content: 'OP1 should reference the 2030 Agenda for Sustainable Development explicitly.',
					clauseId: drContent.operative[0].id,
					visibility: 'PUBLIC'
				});
			}
			// TEAM_ONLY chair comment on operative clause OP2
			if (adminCU && drContent.operative.length > 1) {
				await db.insert(schema.resolutionComment).values({
					id: nanoid(),
					paperId: drId,
					authorConferenceUserId: adminCU.id,
					content: 'OP2 language overlaps with the already-adopted framework — please reconcile.',
					clauseId: drContent.operative[1].id,
					visibility: 'TEAM_ONLY'
				});
			}
			// Threaded exchange: PUBLIC root comment + PUBLIC reply
			if (delegateCUs[2] && delegateCUs[3]) {
				const rootCommentId = nanoid();
				await db.insert(schema.resolutionComment).values({
					id: rootCommentId,
					paperId: drId,
					authorConferenceUserId: delegateCUs[2].id,
					content:
						"We propose adding a reference to the Secretary-General's report A/79/123 in the preamble.",
					clauseId: drContent.preamble[0].id,
					visibility: 'PUBLIC'
				});
				await db.insert(schema.resolutionComment).values({
					id: nanoid(),
					paperId: drId,
					authorConferenceUserId: delegateCUs[3].id,
					content: 'Seconded. That report is directly on point for this clause.',
					clauseId: drContent.preamble[0].id,
					visibility: 'PUBLIC',
					parentCommentId: rootCommentId
				});
			}
			// Threaded exchange: TEAM_ONLY root + TEAM_ONLY reply
			if (adminCU && delegateCUs[0]) {
				const rootCommentId2 = nanoid();
				await db.insert(schema.resolutionComment).values({
					id: rootCommentId2,
					paperId: drId,
					authorConferenceUserId: adminCU.id,
					content: 'Internal note: confirm quorum before calling the amendment vote.',
					visibility: 'TEAM_ONLY'
				});
				await db.insert(schema.resolutionComment).values({
					id: nanoid(),
					paperId: drId,
					authorConferenceUserId: adminCU.id,
					content: 'Confirmed — 2/3 present and voting. Proceed.',
					visibility: 'TEAM_ONLY',
					parentCommentId: rootCommentId2
				});
			}
			console.info(`      DRAFT_RESOLUTION ${drDocNum} (${drId})`);

			if (isActive) {
				// Pin this DR as the committee's active draft resolution
				await db
					.update(schema.committee)
					.set({ activeDraftResolutionId: drId })
					.where(eq(schema.committee.id, committee.id));

				// ── AMENDMENT_PHASE ───────────────────────────────────────────
				const drDocNum2 = `${abbr}/${roman}/DR.2`;
				const apContent = buildResolution(committee.name, preamble, [
					...operative.slice(0, 5),
					'Invites the Secretary-General to present a report on implementation progress to the Assembly at its next session.'
				]);
				const apId = await insertPaper({
					committeeId: committee.id,
					agendaItemId: agendaItem.id,
					creatorMemberId: pick(1, 40)[0],
					status: 'AMENDMENT_PHASE',
					documentNumber: drDocNum2,
					content: apContent,
					title: `Draft Resolution on ${agendaItem.title}`,
					sponsorMemberIds: pick(6, 40),
					snapshots: [{ trigger: 'SUBMITTED' }]
				});

				// Amendments covering every type × every status combination
				const apOp = apContent.operative;
				const apPP = apContent.preamble;

				// Captures for amendmentReviewItems below
				let acceptedAmendId: string | null = null;
				const pendingAmendIds: string[] = [];

				// ADD + CONSENSUS_ADOPTED — applied, 1 sponsor
				if (delegates.length > 4) {
					const amendId = nanoid();
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: delegates[4 % delegates.length].id,
						type: 'ADD',
						status: 'CONSENSUS_ADOPTED',
						targetOperativeIndex: 2,
						targetPosition: 3,
						newContent:
							'Also encourages Member States to share best practices and technical expertise through South-South and triangular cooperation mechanisms;',
						documentNumber: `${abbr}/${roman}/ADD.1`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({
							id: nanoid(),
							amendmentId: amendId,
							committeeMemberId: delegates[4 % delegates.length].id
						});
				}
				// DELETE + REJECTED — 1 sponsor
				if (delegates.length > 5) {
					const amendId = nanoid();
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: delegates[5 % delegates.length].id,
						type: 'DELETE',
						status: 'REJECTED',
						targetClauseId: apOp[1 % apOp.length].id,
						targetOperativeIndex: 1,
						documentNumber: `${abbr}/${roman}/DEL.1`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({
							id: nanoid(),
							amendmentId: amendId,
							committeeMemberId: delegates[5 % delegates.length].id
						});
				}
				// ALTER_TEXT + ACCEPTED — 3 sponsors
				if (delegates.length > 8) {
					const amendId = nanoid();
					acceptedAmendId = amendId;
					const proposer = delegates[6 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: proposer,
						type: 'ALTER_TEXT',
						status: 'ACCEPTED',
						targetClauseId: apOp[2 % apOp.length].id,
						targetOperativeIndex: 2,
						newContent: operative[2 % operative.length].replace(
							';',
							', with particular attention to gender-responsive and youth-inclusive approaches;'
						),
						documentNumber: `${abbr}/${roman}/ALT.2`
					});
					for (const idx of [6, 7, 8]) {
						await db
							.insert(schema.amendmentSponsor)
							.values({
								id: nanoid(),
								amendmentId: amendId,
								committeeMemberId: delegates[idx % delegates.length].id
							});
					}
				}
				// ALTER_POSITION + WITHDRAWN — 1 sponsor
				if (delegates.length > 9) {
					const amendId = nanoid();
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: delegates[9 % delegates.length].id,
						type: 'ALTER_POSITION',
						status: 'WITHDRAWN',
						targetClauseId: apOp[0].id,
						targetOperativeIndex: 0,
						targetPosition: 4,
						documentNumber: `${abbr}/${roman}/POS.2`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({
							id: nanoid(),
							amendmentId: amendId,
							committeeMemberId: delegates[9 % delegates.length].id
						});
				}
				// DELETE + SUBMITTED — 2 sponsors
				if (delegates.length > 11) {
					const amendId = nanoid();
					const p = delegates[10 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'DELETE',
						status: 'SUBMITTED',
						targetClauseId: apOp[3 % apOp.length].id,
						targetOperativeIndex: 3,
						documentNumber: `${abbr}/${roman}/DEL.2`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: p });
					await db
						.insert(schema.amendmentSponsor)
						.values({
							id: nanoid(),
							amendmentId: amendId,
							committeeMemberId: delegates[11 % delegates.length].id
						});
				}
				// ADD + SUBMITTED — used as review item subject (State 2)
				if (delegates.length > 12) {
					const amendId = nanoid();
					pendingAmendIds.push(amendId);
					const p = delegates[12 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'ADD',
						status: 'SUBMITTED',
						targetOperativeIndex: 5,
						targetPosition: 5,
						newContent:
							'Calls upon the international community to ensure that climate finance reaches the most vulnerable communities without bureaucratic delay;',
						documentNumber: `${abbr}/${roman}/ADD.2`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: p });
				}
				// ALTER_TEXT + SUBMITTED — used as review item subject (State 3)
				if (delegates.length > 13) {
					const amendId = nanoid();
					pendingAmendIds.push(amendId);
					const p = delegates[13 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'ALTER_TEXT',
						status: 'SUBMITTED',
						targetClauseId: apPP[0].id,
						newContent:
							'Reaffirming the purposes and principles enshrined in the Charter of the United Nations and the indispensable role of multilateral cooperation,',
						documentNumber: `${abbr}/${roman}/ALT.3`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: p });
				}
				// ALTER_POSITION + SUBMITTED — 1 sponsor (moves last op clause to front)
				if (delegates.length > 14) {
					const amendId = nanoid();
					const p = delegates[14 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'ALTER_POSITION',
						status: 'SUBMITTED',
						targetClauseId: apOp[apOp.length - 1].id,
						targetOperativeIndex: apOp.length - 1,
						targetPosition: 0,
						documentNumber: `${abbr}/${roman}/POS.3`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: p });
				}

				// ── Threshold-testing scenarios ──────────────────────────────────

				// ALTER_TEXT + PENDING — 1 sponsor (below threshold for all but the smallest committees)
				if (delegates.length > 40) {
					const amendId = nanoid();
					pendingAmendIds.push(amendId);
					const p = delegates[40 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'ALTER_TEXT',
						status: 'PENDING',
						targetClauseId: apOp[apOp.length > 3 ? 3 : 0].id,
						targetOperativeIndex: apOp.length > 3 ? 3 : 0,
						newContent: operative[(apOp.length > 3 ? 3 : 0) % operative.length].replace(
							';',
							', while respecting the principle of national sovereignty and non-interference;'
						),
						documentNumber: `${abbr}/${roman}/ALT.4`
					});
					// 1 sponsor — clearly below threshold for large committees (e.g. GA needs ~19)
					await db
						.insert(schema.amendmentSponsor)
						.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: p });
				}

				// ADD + PENDING — exactly thresholdCount sponsors (right at the threshold, ready to submit)
				if (delegates.length > 50 + thresholdCount) {
					const amendId = nanoid();
					pendingAmendIds.push(amendId);
					const p = delegates[50 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'ADD',
						status: 'PENDING',
						targetOperativeIndex: 1,
						targetPosition: 1,
						newContent:
							'Requests the Secretariat to compile a biennial progress review and present findings to the Assembly at its next regular session;',
						documentNumber: `${abbr}/${roman}/ADD.3`
					});
					// Exactly threshold sponsors — the minimum needed
					for (let i = 0; i < thresholdCount; i++) {
						await db.insert(schema.amendmentSponsor).values({
							id: nanoid(),
							amendmentId: amendId,
							committeeMemberId: delegates[(50 + i) % delegates.length].id
						});
					}
				}

				// DELETE + SUBMITTED — 0 sponsors (submitted but never collected support)
				if (delegates.length > 70) {
					const amendId = nanoid();
					const p = delegates[70 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'DELETE',
						status: 'SUBMITTED',
						targetClauseId: apOp[apOp.length > 4 ? 4 : 0].id,
						targetOperativeIndex: apOp.length > 4 ? 4 : 0,
						documentNumber: `${abbr}/${roman}/DEL.3`
					});
					// No sponsors — 0 supporters (edge case: submitted without collecting any support)
				}

				// ALTER_POSITION + SUBMITTED — sponsors well above threshold (strongly supported)
				if (delegates.length > 80 + thresholdCount * 2) {
					const amendId = nanoid();
					const p = delegates[80 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'ALTER_POSITION',
						status: 'SUBMITTED',
						targetClauseId: apOp[0].id,
						targetOperativeIndex: 0,
						targetPosition: apOp.length - 1,
						documentNumber: `${abbr}/${roman}/POS.4`
					});
					// Sponsors 2× above threshold
					const aboveCount = Math.min(thresholdCount * 2 + 2, delegates.length - 80);
					for (let i = 0; i < aboveCount; i++) {
						await db.insert(schema.amendmentSponsor).values({
							id: nanoid(),
							amendmentId: amendId,
							committeeMemberId: delegates[(80 + i) % delegates.length].id
						});
					}
				}

				// ── Review-scenario amendments ────────────────────────────────────────────────
				// Created specifically to give each amendment review state a seeded subject.
				// Uses modulo wrapping so they work even in small committees.

				let reviewObsolete1AmendId: string | null = null; // OBSOLESCENCE, unresolved — ALTER_TEXT same clause
				let reviewObsolete2AmendId: string | null = null; // OBSOLESCENCE, resolved → WITHDRAWN — DELETE same clause
				let reviewObsolete3AmendId: string | null = null; // OBSOLESCENCE, unresolved — ALTER_TEXT same clause, alt rewrite
				let reviewObsolete4AmendId: string | null = null; // OBSOLESCENCE, unresolved — DELETE same clause, competing DELETE
				let reviewRewrite1AmendId: string | null = null; // REWRITE, unresolved — ADD contradicts gender language
				let reviewRewrite2AmendId: string | null = null; // REWRITE, unresolved — ALTER_TEXT adds redundant gender language
				let reviewRewrite3AmendId: string | null = null; // REWRITE, unresolved — ALTER_TEXT references stale clause wording
				let reviewRewrite4AmendId: string | null = null; // REWRITE, resolved, custom manual edit
				let reviewRewrite5AmendId: string | null = null; // REWRITE, resolved, kept original — conflicts with 30-day window (minor; chair accepted risk)
				let reviewRewrite6AmendId: string | null = null; // REWRITE, unresolved — ALTER_TEXT contradicts gender/youth focus
				let reviewRewrite7AmendId: string | null = null; // REWRITE, unresolved — ALTER_TEXT quotes old OP2 language
				let reviewRewrite8AmendId: string | null = null; // REWRITE, unresolved — ALTER_TEXT on OP1 sets ≥45-day floor, contradicts 30-day OP3

				// RW.1 — OBSOLESCENCE: targets the same clause (apOp[2]) as the accepted ALT.2 with competing text
				// Direct clause conflict → AI should flag as likely obsolete
				{
					const amendId = nanoid();
					reviewObsolete1AmendId = amendId;
					const p = delegates[15 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'ALTER_TEXT',
						status: 'SUBMITTED',
						targetClauseId: apOp[2 % apOp.length].id,
						targetOperativeIndex: 2 % apOp.length,
						newContent: operative[2 % operative.length].replace(
							';',
							', with priority given to Small Island Developing States and Least Developed Countries and without imposing additional reporting requirements on recipients;'
						),
						documentNumber: `${abbr}/${roman}/RW.1`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: p });
				}

				// RW.2 — OBSOLESCENCE resolved → WITHDRAWN: DELETE on the same clause (apOp[2]) just altered by ALT.2
				// Chair ruled it obsolete — can't delete a clause that was already substantively rewritten
				{
					const amendId = nanoid();
					reviewObsolete2AmendId = amendId;
					const p = delegates[16 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'DELETE',
						status: 'SUBMITTED',
						targetClauseId: apOp[2 % apOp.length].id,
						targetOperativeIndex: 2 % apOp.length,
						documentNumber: `${abbr}/${roman}/RW.2`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: p });
				}

				// RW.3 — REWRITE: ADD that explicitly contradicts the gender-responsive language added by ALT.2
				// Inserts a clause affirming the Facility shall operate without gender-disaggregated requirements
				{
					const amendId = nanoid();
					reviewRewrite1AmendId = amendId;
					const p = delegates[17 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'ADD',
						status: 'SUBMITTED',
						targetOperativeIndex: 3,
						targetPosition: 3,
						newContent:
							'Affirms that the Climate Adaptation Rapid Response Facility shall operate on the basis of purely technical and needs-based criteria, without imposing gender-disaggregated reporting obligations on recipient Member States;',
						documentNumber: `${abbr}/${roman}/RW.3`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: p });
				}

				// RW.4 — REWRITE: ALTER_TEXT on apOp[1] adding "gender-responsive and youth-inclusive" language
				// Now redundant — ALT.2 already introduced identical phrasing in apOp[2]
				{
					const amendId = nanoid();
					reviewRewrite2AmendId = amendId;
					const p = delegates[18 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'ALTER_TEXT',
						status: 'SUBMITTED',
						targetClauseId: apOp[1 % apOp.length].id,
						targetOperativeIndex: 1 % apOp.length,
						newContent: operative[1 % operative.length].replace(
							';',
							', with particular attention to gender-responsive and youth-inclusive approaches;'
						),
						documentNumber: `${abbr}/${roman}/RW.4`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: p });
				}

				// RW.5 — REWRITE: ALTER_TEXT on apOp[3] that references the original (pre-ALT.2) wording of apOp[2]
				// The quoted rationale is now factually stale after the clause was amended
				{
					const amendId = nanoid();
					reviewRewrite3AmendId = amendId;
					const p = delegates[19 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'ALTER_TEXT',
						status: 'SUBMITTED',
						targetClauseId: apOp[3 % apOp.length].id,
						targetOperativeIndex: 3 % apOp.length,
						newContent: operative[3 % operative.length].replace(
							';',
							', noting that OP2 establishes the Facility without gender-specific conditionalities;'
						),
						documentNumber: `${abbr}/${roman}/RW.5`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: p });
				}

				// RW.6 — REWRITE resolved via custom manual edit
				// ALTER_TEXT on apOp[4] referencing the Rapid Response Facility "as originally proposed" — stale after ALT.2
				{
					const amendId = nanoid();
					reviewRewrite4AmendId = amendId;
					const p = delegates[20 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'ALTER_TEXT',
						status: 'SUBMITTED',
						targetClauseId: apOp[4 % apOp.length].id,
						targetOperativeIndex: 4 % apOp.length,
						newContent: operative[4 % operative.length].replace(
							';',
							', drawing on the original mandate of the Climate Adaptation Rapid Response Facility as proposed by the primary sponsors, without reference to gender or age-specific criteria;'
						),
						documentNumber: `${abbr}/${roman}/RW.6`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: p });
				}

				// RW.7 — REWRITE resolved via skip / keep original (no amendmentRevision)
				// ADD proposing a 60-day review window for Rapid Response Facility disbursements — conflicts with the
				// 30-day emergency timeline in amended apOp[2]; chair reviewed AI concern but kept original text
				{
					const amendId = nanoid();
					reviewRewrite5AmendId = amendId;
					const p = delegates[21 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'ADD',
						status: 'SUBMITTED',
						targetOperativeIndex: 5,
						targetPosition: 5,
						newContent:
							'Recommends that the Climate Adaptation Rapid Response Facility conduct a mandatory 60-day due-diligence review before releasing funds to any recipient state, to prevent misappropriation;',
						documentNumber: `${abbr}/${roman}/RW.7`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: p });
				}

				// RW.12 — REWRITE: ALTER_TEXT on apOp[0] mandating a minimum 45-day disbursement floor
				// Directly conflicts with the ≤30-day emergency window of the Rapid Response Facility in amended apOp[2]
				{
					const amendId = nanoid();
					reviewRewrite8AmendId = amendId;
					const p = delegates[26 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'ALTER_TEXT',
						status: 'SUBMITTED',
						targetClauseId: apOp[0].id,
						targetOperativeIndex: 0,
						newContent: operative[0].replace(
							';',
							', provided that all disbursement mechanisms maintain a minimum processing period of no less than 45 days per transaction to ensure proper fiduciary due diligence;'
						),
						documentNumber: `${abbr}/${roman}/RW.12`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: p });
				}

				// RW.8 — OBSOLESCENCE: second competing ALTER_TEXT on apOp[2] with an entirely different rewrite
				// Proposes financial transparency focus instead — directly conflicts on same clause as ALT.2
				{
					const amendId = nanoid();
					reviewObsolete3AmendId = amendId;
					const p = delegates[22 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'ALTER_TEXT',
						status: 'SUBMITTED',
						targetClauseId: apOp[2 % apOp.length].id,
						targetOperativeIndex: 2 % apOp.length,
						newContent: operative[2 % operative.length].replace(
							';',
							', subject to transparent financial accountability mechanisms and independent third-party auditing of disbursements;'
						),
						documentNumber: `${abbr}/${roman}/RW.8`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: p });
				}

				// RW.9 — OBSOLESCENCE: a second DELETE targeting apOp[2], the same clause already altered
				// Competes directly with the accepted ALTER_TEXT — can't delete what was just rewritten
				{
					const amendId = nanoid();
					reviewObsolete4AmendId = amendId;
					const p = delegates[23 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'DELETE',
						status: 'SUBMITTED',
						targetClauseId: apOp[2 % apOp.length].id,
						targetOperativeIndex: 2 % apOp.length,
						documentNumber: `${abbr}/${roman}/RW.9`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: p });
				}

				// RW.10 — REWRITE: ALTER_TEXT on apOp[5] that explicitly rejects gender-specific criteria
				// Directly contradicts the "gender-responsive and youth-inclusive approaches" in amended apOp[2]
				{
					const amendId = nanoid();
					reviewRewrite6AmendId = amendId;
					const p = delegates[24 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'ALTER_TEXT',
						status: 'SUBMITTED',
						targetClauseId: apOp[5 % apOp.length].id,
						targetOperativeIndex: 5 % apOp.length,
						newContent: operative[5 % operative.length].replace(
							';',
							', reaffirming that climate finance should remain free from gender-specific or age-based conditionalities that may impede access by recipient states;'
						),
						documentNumber: `${abbr}/${roman}/RW.10`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: p });
				}

				// RW.11 — REWRITE: ALTER_TEXT on apOp[4] that quotes "OP2 as originally proposed"
				// References the pre-amendment text of apOp[2] — factually stale after ALT.2
				{
					const amendId = nanoid();
					reviewRewrite7AmendId = amendId;
					const p = delegates[25 % delegates.length].id;
					await db.insert(schema.amendment).values({
						id: amendId,
						paperId: apId,
						proposerCommitteeMemberId: p,
						type: 'ALTER_TEXT',
						status: 'SUBMITTED',
						targetClauseId: apOp[4 % apOp.length].id,
						targetOperativeIndex: 4 % apOp.length,
						newContent: operative[4 % operative.length].replace(
							';',
							', building on the Rapid Response Facility as established in OP2 prior to amendment, with a mandate limited to emergency disbursements only;'
						),
						documentNumber: `${abbr}/${roman}/RW.11`
					});
					await db
						.insert(schema.amendmentSponsor)
						.values({ id: nanoid(), amendmentId: amendId, committeeMemberId: p });
				}

				// Comments on AMENDMENT_PHASE paper
				if (adminCU) {
					await db.insert(schema.resolutionComment).values({
						id: nanoid(),
						paperId: apId,
						authorConferenceUserId: adminCU.id,
						content: 'Eight amendments pending — check the order of votes carefully.',
						visibility: 'TEAM_ONLY'
					});
				}
				if (delegateCUs[0]) {
					await db.insert(schema.resolutionComment).values({
						id: nanoid(),
						paperId: apId,
						authorConferenceUserId: delegateCUs[0].id,
						content:
							'We formally withdraw our support for DEL.2 — the underlying clause should remain.',
						visibility: 'PUBLIC'
					});
				}
				// PUBLIC clause-level comment + reply thread on OP1
				if (delegateCUs[1] && delegateCUs[2]) {
					const rootId = nanoid();
					await db.insert(schema.resolutionComment).values({
						id: rootId,
						paperId: apId,
						authorConferenceUserId: delegateCUs[1].id,
						content:
							'OP1 is the crux of this resolution — any amendment here must be voted separately.',
						clauseId: apOp[0].id,
						visibility: 'PUBLIC'
					});
					await db.insert(schema.resolutionComment).values({
						id: nanoid(),
						paperId: apId,
						authorConferenceUserId: delegateCUs[2].id,
						content: 'Agreed. We will call for a separate vote on ALT.2.',
						clauseId: apOp[0].id,
						visibility: 'PUBLIC',
						parentCommentId: rootId
					});
				}

				// AmendmentReviewItems — distinct review states seeded without pre-populated AI output.
				// States 1–4 = OBSOLESCENCE phase; states 5–10 = REWRITE phase.
				// AI fields are left empty; the AI will populate them at runtime.
				if (acceptedAmendId) {
					// ── State 1: OBSOLESCENCE, unresolved — competing ALTER_TEXT on same clause ──
					if (reviewObsolete1AmendId) {
						await db.insert(schema.amendmentReviewItem).values({
							id: nanoid(),
							paperId: apId,
							triggerAmendmentId: acceptedAmendId,
							subjectAmendmentId: reviewObsolete1AmendId,
							phase: 'OBSOLESCENCE',
							resolved: false
						});
					}

					// ── State 2: OBSOLESCENCE, unresolved — pending amendment on unrelated clause ──
					if (pendingAmendIds[0]) {
						await db.insert(schema.amendmentReviewItem).values({
							id: nanoid(),
							paperId: apId,
							triggerAmendmentId: acceptedAmendId,
							subjectAmendmentId: pendingAmendIds[0],
							phase: 'OBSOLESCENCE',
							resolved: false
						});
					}

					// ── State 3: OBSOLESCENCE, unresolved — pending amendment on unrelated clause ──
					if (pendingAmendIds[1]) {
						await db.insert(schema.amendmentReviewItem).values({
							id: nanoid(),
							paperId: apId,
							triggerAmendmentId: acceptedAmendId,
							subjectAmendmentId: pendingAmendIds[1],
							phase: 'OBSOLESCENCE',
							resolved: false
						});
					}

					// ── State 4: OBSOLESCENCE, resolved — DELETE on same clause ruled obsolete → WITHDRAWN ──
					if (reviewObsolete2AmendId) {
						await db
							.update(schema.amendment)
							.set({ status: 'WITHDRAWN', obsoletedByAmendmentId: acceptedAmendId })
							.where(eq(schema.amendment.id, reviewObsolete2AmendId));
						await db.insert(schema.amendmentReviewItem).values({
							id: nanoid(),
							paperId: apId,
							triggerAmendmentId: acceptedAmendId,
							subjectAmendmentId: reviewObsolete2AmendId,
							phase: 'OBSOLESCENCE',
							resolved: true
						});
					}

					// ── State 5: REWRITE, unresolved — ADD contradicting gender-responsive language ──
					if (reviewRewrite1AmendId) {
						await db.insert(schema.amendmentReviewItem).values({
							id: nanoid(),
							paperId: apId,
							triggerAmendmentId: acceptedAmendId,
							subjectAmendmentId: reviewRewrite1AmendId,
							phase: 'REWRITE',
							resolved: false
						});
					}

					// ── State 6: REWRITE, unresolved — ALTER_TEXT adding redundant gender language ──
					if (reviewRewrite2AmendId) {
						await db.insert(schema.amendmentReviewItem).values({
							id: nanoid(),
							paperId: apId,
							triggerAmendmentId: acceptedAmendId,
							subjectAmendmentId: reviewRewrite2AmendId,
							phase: 'REWRITE',
							resolved: false
						});
					}

					// ── State 7: REWRITE, unresolved — ALTER_TEXT referencing stale clause wording ──
					if (reviewRewrite3AmendId) {
						await db.insert(schema.amendmentReviewItem).values({
							id: nanoid(),
							paperId: apId,
							triggerAmendmentId: acceptedAmendId,
							subjectAmendmentId: reviewRewrite3AmendId,
							phase: 'REWRITE',
							resolved: false
						});
					}

					// ── State 8: REWRITE, unresolved — ALTER_TEXT on OP1 mandating ≥45-day floor, conflicts with ≤30-day OP3 ──
					if (reviewRewrite8AmendId) {
						await db.insert(schema.amendmentReviewItem).values({
							id: nanoid(),
							paperId: apId,
							triggerAmendmentId: acceptedAmendId,
							subjectAmendmentId: reviewRewrite8AmendId,
							phase: 'REWRITE',
							resolved: false
						});
					}

					// ── State 9: REWRITE, resolved — chair rewrote the stale OP2 reference to match the amended language ──
					if (reviewRewrite4AmendId) {
						const reviewItemId9 = nanoid();
						// originalText9 mirrors RW.6's newContent exactly (what the amendment proposed before the chair's edit)
						const originalText9 = operative[4 % operative.length].replace(
							';',
							', drawing on the original mandate of the Climate Adaptation Rapid Response Facility as proposed by the primary sponsors, without reference to gender or age-specific criteria;'
						);
						const editedText9 = operative[4 % operative.length].replace(
							';',
							', in a manner consistent with the Climate Adaptation Rapid Response Facility as amended, including its gender-responsive and youth-inclusive mandate;'
						);
						await db.insert(schema.amendmentReviewItem).values({
							id: reviewItemId9,
							paperId: apId,
							triggerAmendmentId: acceptedAmendId,
							subjectAmendmentId: reviewRewrite4AmendId,
							phase: 'REWRITE',
							resolved: true
						});
						await db.insert(schema.amendmentRevision).values({
							id: nanoid(),
							amendmentId: reviewRewrite4AmendId,
							previousContent: originalText9,
							newContent: editedText9,
							causedByAmendmentId: acceptedAmendId,
							reviewItemId: reviewItemId9
						});
						await db
							.update(schema.amendment)
							.set({ newContent: editedText9 })
							.where(eq(schema.amendment.id, reviewRewrite4AmendId));
					}

					// ── State 10: REWRITE, resolved — chair kept the original text ──
					if (reviewRewrite5AmendId) {
						await db.insert(schema.amendmentReviewItem).values({
							id: nanoid(),
							paperId: apId,
							triggerAmendmentId: acceptedAmendId,
							subjectAmendmentId: reviewRewrite5AmendId,
							phase: 'REWRITE',
							resolved: true
						});
					}

					// ── State 11: OBSOLESCENCE, unresolved — second competing ALTER_TEXT on same clause ──
					if (reviewObsolete3AmendId) {
						await db.insert(schema.amendmentReviewItem).values({
							id: nanoid(),
							paperId: apId,
							triggerAmendmentId: acceptedAmendId,
							subjectAmendmentId: reviewObsolete3AmendId,
							phase: 'OBSOLESCENCE',
							resolved: false
						});
					}

					// ── State 12: OBSOLESCENCE, unresolved — second DELETE on same clause ──
					if (reviewObsolete4AmendId) {
						await db.insert(schema.amendmentReviewItem).values({
							id: nanoid(),
							paperId: apId,
							triggerAmendmentId: acceptedAmendId,
							subjectAmendmentId: reviewObsolete4AmendId,
							phase: 'OBSOLESCENCE',
							resolved: false
						});
					}

					// ── State 13: REWRITE, unresolved — ALTER_TEXT rejecting gender-specific criteria ──
					if (reviewRewrite6AmendId) {
						await db.insert(schema.amendmentReviewItem).values({
							id: nanoid(),
							paperId: apId,
							triggerAmendmentId: acceptedAmendId,
							subjectAmendmentId: reviewRewrite6AmendId,
							phase: 'REWRITE',
							resolved: false
						});
					}

					// ── State 14: REWRITE, unresolved — ALTER_TEXT referencing pre-amendment OP2 ──
					if (reviewRewrite7AmendId) {
						await db.insert(schema.amendmentReviewItem).values({
							id: nanoid(),
							paperId: apId,
							triggerAmendmentId: acceptedAmendId,
							subjectAmendmentId: reviewRewrite7AmendId,
							phase: 'REWRITE',
							resolved: false
						});
					}
				}
				console.info(`      AMENDMENT_PHASE ${drDocNum2} (${apId})`);

				// ── VOTING_PHASE ──────────────────────────────────────────────
				const drDocNum3 = `${abbr}/${roman}/DR.3`;
				const vpContent = buildResolution(committee.name, preamble, operative);
				const vpId = await insertPaper({
					committeeId: committee.id,
					agendaItemId: agendaItem.id,
					creatorMemberId: pick(1, 60)[0],
					status: 'VOTING_PHASE',
					documentNumber: drDocNum3,
					content: vpContent,
					title: `Draft Resolution on ${agendaItem.title}`,
					sponsorMemberIds: pick(9, 60),
					snapshots: [{ trigger: 'SUBMITTED' }]
				});
				// TEAM_ONLY chair comment on VOTING_PHASE
				if (adminCU) {
					await db.insert(schema.resolutionComment).values({
						id: nanoid(),
						paperId: vpId,
						authorConferenceUserId: adminCU.id,
						content: 'Roll call vote in progress — record every vote individually.',
						visibility: 'TEAM_ONLY'
					});
				}
				// PUBLIC paper-level delegate comment on VOTING_PHASE
				if (delegateCUs[0]) {
					await db.insert(schema.resolutionComment).values({
						id: nanoid(),
						paperId: vpId,
						authorConferenceUserId: delegateCUs[0].id,
						content: 'Our delegation requests an explanation of vote before the vote is recorded.',
						visibility: 'PUBLIC'
					});
				}
				// Amendments on VOTING_PHASE — all processed (voting is underway, no new amendments possible)
				if (delegates.length > 3) {
					await insertAmendment({
						paperId: vpId,
						proposer: delegates[2 % delegates.length].id,
						type: 'ALTER_TEXT',
						status: 'ACCEPTED',
						targetClauseId: vpContent.operative[0].id,
						targetOperativeIndex: 0,
						newContent: operative[0].replace(
							';',
							', including through dedicated fast-track disbursement windows for declared climate emergencies;'
						),
						documentNumber: `${abbr}/${roman}/VP.ALT.1`,
						sponsorIds: [delegates[2 % delegates.length].id, delegates[3 % delegates.length].id]
					});
				}
				if (delegates.length > 5) {
					await insertAmendment({
						paperId: vpId,
						proposer: delegates[4 % delegates.length].id,
						type: 'DELETE',
						status: 'REJECTED',
						targetClauseId: vpContent.operative[1 % vpContent.operative.length].id,
						targetOperativeIndex: 1 % vpContent.operative.length,
						documentNumber: `${abbr}/${roman}/VP.DEL.1`,
						sponsorIds: [delegates[4 % delegates.length].id, delegates[5 % delegates.length].id]
					});
				}
				if (delegates.length > 7) {
					await insertAmendment({
						paperId: vpId,
						proposer: delegates[6 % delegates.length].id,
						type: 'ADD',
						status: 'CONSENSUS_ADOPTED',
						targetOperativeIndex: vpContent.operative.length,
						targetPosition: vpContent.operative.length,
						newContent:
							'Decides to convene a high-level review conference within three years to assess progress in implementation of the commitments made herein;',
						documentNumber: `${abbr}/${roman}/VP.ADD.1`,
						sponsorIds: [delegates[6 % delegates.length].id, delegates[7 % delegates.length].id]
					});
				}
				if (delegates.length > 9) {
					await insertAmendment({
						paperId: vpId,
						proposer: delegates[8 % delegates.length].id,
						type: 'ALTER_TEXT',
						status: 'WITHDRAWN',
						targetClauseId: vpContent.operative[2 % vpContent.operative.length].id,
						targetOperativeIndex: 2 % vpContent.operative.length,
						newContent: operative[2 % operative.length].replace(
							';',
							', provided that recipient states demonstrate measurable progress against agreed benchmarks;'
						),
						documentNumber: `${abbr}/${roman}/VP.ALT.2`,
						sponsorIds: [delegates[8 % delegates.length].id]
					});
				}
				if (delegates.length > 11) {
					await insertAmendment({
						paperId: vpId,
						proposer: delegates[10 % delegates.length].id,
						type: 'ALTER_POSITION',
						status: 'REJECTED',
						targetClauseId: vpContent.operative[0].id,
						targetOperativeIndex: 0,
						targetPosition: vpContent.operative.length - 1,
						documentNumber: `${abbr}/${roman}/VP.POS.1`,
						sponsorIds: [delegates[10 % delegates.length].id, delegates[11 % delegates.length].id]
					});
				}
				console.info(`      VOTING_PHASE ${drDocNum3} (${vpId})`);
			} else {
				// ── FINAL (adopted) — only for non-active topics ──────────────
				const resDocNum = `${abbr}/${roman}/RES.1`;
				const finalContent = buildResolution(committee.name, preamble, operative);
				const finalId = await insertPaper({
					committeeId: committee.id,
					agendaItemId: agendaItem.id,
					creatorMemberId: pick(1, 40)[0],
					status: 'FINAL',
					documentNumber: resDocNum,
					content: finalContent,
					title: `Resolution on ${agendaItem.title}`,
					sponsorMemberIds: pick(8, 40),
					snapshots: [{ trigger: 'SUBMITTED' }, { trigger: 'VOTE_CONCLUDED' }]
				});
				// TEAM_ONLY chair note
				if (adminCU) {
					await db.insert(schema.resolutionComment).values({
						id: nanoid(),
						paperId: finalId,
						authorConferenceUserId: adminCU.id,
						content: 'Adopted by consensus. Excellent work by all delegations.',
						visibility: 'TEAM_ONLY'
					});
				}
				// PUBLIC delegate congratulation comment
				if (delegateCUs[0]) {
					await db.insert(schema.resolutionComment).values({
						id: nanoid(),
						paperId: finalId,
						authorConferenceUserId: delegateCUs[0].id,
						content:
							'Historic resolution — our delegation is proud to have co-sponsored this text.',
						visibility: 'PUBLIC'
					});
				}
				// PUBLIC clause-level comment on adopted OP1
				if (delegateCUs[1]) {
					await db.insert(schema.resolutionComment).values({
						id: nanoid(),
						paperId: finalId,
						authorConferenceUserId: delegateCUs[1].id,
						content:
							'OP1 sets a clear benchmark — we look forward to the review at the next session.',
						clauseId: finalContent.operative[0].id,
						visibility: 'PUBLIC'
					});
				}
				// Amendments on FINAL — all processed (historical record of what happened in the vote)
				if (delegates.length > 3) {
					await insertAmendment({
						paperId: finalId,
						proposer: delegates[2 % delegates.length].id,
						type: 'ALTER_TEXT',
						status: 'ACCEPTED',
						targetClauseId: finalContent.operative[0].id,
						targetOperativeIndex: 0,
						newContent: operative[0].replace(
							';',
							', with particular attention to the needs of Least Developed Countries and Small Island Developing States;'
						),
						documentNumber: `${abbr}/${roman}/F.ALT.1`,
						sponsorIds: [delegates[2 % delegates.length].id, delegates[3 % delegates.length].id]
					});
				}
				if (delegates.length > 5) {
					await insertAmendment({
						paperId: finalId,
						proposer: delegates[4 % delegates.length].id,
						type: 'DELETE',
						status: 'REJECTED',
						targetClauseId: finalContent.operative[1 % finalContent.operative.length].id,
						targetOperativeIndex: 1 % finalContent.operative.length,
						documentNumber: `${abbr}/${roman}/F.DEL.1`,
						sponsorIds: [delegates[4 % delegates.length].id, delegates[5 % delegates.length].id]
					});
				}
				if (delegates.length > 7) {
					await insertAmendment({
						paperId: finalId,
						proposer: delegates[6 % delegates.length].id,
						type: 'ADD',
						status: 'CONSENSUS_ADOPTED',
						targetOperativeIndex: finalContent.operative.length,
						targetPosition: finalContent.operative.length,
						newContent:
							'Calls upon all Member States to submit voluntary implementation reports to the Secretary-General within two years of adoption of this resolution;',
						documentNumber: `${abbr}/${roman}/F.ADD.1`,
						sponsorIds: [delegates[6 % delegates.length].id, delegates[7 % delegates.length].id]
					});
				}
				if (delegates.length > 9) {
					await insertAmendment({
						paperId: finalId,
						proposer: delegates[8 % delegates.length].id,
						type: 'ALTER_TEXT',
						status: 'WITHDRAWN',
						targetClauseId: finalContent.operative[2 % finalContent.operative.length].id,
						targetOperativeIndex: 2 % finalContent.operative.length,
						newContent: operative[2 % operative.length].replace(
							';',
							', subject to annual reporting obligations and independent verification;'
						),
						documentNumber: `${abbr}/${roman}/F.ALT.2`,
						sponsorIds: [delegates[8 % delegates.length].id]
					});
				}
				if (delegates.length > 11) {
					await insertAmendment({
						paperId: finalId,
						proposer: delegates[10 % delegates.length].id,
						type: 'ALTER_TEXT',
						status: 'ACCEPTED',
						targetClauseId: finalContent.operative[3 % finalContent.operative.length].id,
						targetOperativeIndex: 3 % finalContent.operative.length,
						newContent: operative[(3 % finalContent.operative.length) % operative.length].replace(
							';',
							', with full respect for national sovereignty and ownership of implementation strategies;'
						),
						documentNumber: `${abbr}/${roman}/F.ALT.3`,
						sponsorIds: [
							delegates[10 % delegates.length].id,
							delegates[11 % delegates.length].id,
							delegates[0].id
						]
					});
				}
				console.info(`      FINAL ${resDocNum} (${finalId})`);
			}

			// ── Speakers lists ─────────────────────────────────────────────────
			// Populate every agenda item's lists with speakers and meaningful phase states
			{
				const lists = await db
					.select()
					.from(schema.speakersList)
					.where(eq(schema.speakersList.agendaItemId, agendaItem.id));

				for (const list of lists) {
					if (isActive) {
						if (list.type === 'SPEAKERS_LIST') {
							// Active item: 5 speakers queued, first one currently speaking (SPEECH)
							const speakerCount = Math.min(5, delegates.length);
							for (let i = 0; i < speakerCount; i++) {
								await db.insert(schema.speakerOnList).values({
									id: nanoid(),
									speakersListId: list.id,
									committeeMemberId: delegates[i % delegates.length].id,
									position: i
								});
							}
							await db
								.update(schema.speakersList)
								.set({ phase: 'SPEECH', timeLeft: 95, startTimestamp: new Date() })
								.where(eq(schema.speakersList.id, list.id));
						} else {
							// Active COMMENT_LIST: 3 speakers queued, floor open for a question (QUESTION)
							const commentCount = Math.min(3, delegates.length);
							for (let i = 0; i < commentCount; i++) {
								await db.insert(schema.speakerOnList).values({
									id: nanoid(),
									speakersListId: list.id,
									committeeMemberId: delegates[(i + 5) % delegates.length].id,
									position: i
								});
							}
							await db
								.update(schema.speakersList)
								.set({ phase: 'QUESTION', timeLeft: 20 })
								.where(eq(schema.speakersList.id, list.id));
						}
					} else {
						if (list.type === 'SPEAKERS_LIST') {
							// Inactive item: 4 past speakers, list closed, last speaker done (SPEECH_DONE)
							const speakerCount = Math.min(4, delegates.length);
							for (let i = 0; i < speakerCount; i++) {
								await db.insert(schema.speakerOnList).values({
									id: nanoid(),
									speakersListId: list.id,
									committeeMemberId: delegates[(i + 10) % delegates.length].id,
									position: i
								});
							}
							await db
								.update(schema.speakersList)
								.set({ isClosed: true, phase: 'SPEECH_DONE', timeLeft: 0 })
								.where(eq(schema.speakersList.id, list.id));
						} else {
							// Inactive COMMENT_LIST: 2 speakers, delegate currently answering (ANSWER)
							const commentCount = Math.min(2, delegates.length);
							for (let i = 0; i < commentCount; i++) {
								await db.insert(schema.speakerOnList).values({
									id: nanoid(),
									speakersListId: list.id,
									committeeMemberId: delegates[(i + 15) % delegates.length].id,
									position: i
								});
							}
							await db
								.update(schema.speakersList)
								.set({ phase: 'ANSWER', timeLeft: 12, startTimestamp: new Date() })
								.where(eq(schema.speakersList.id, list.id));
						}
					}
				}
			}
		}
	}
}

process.exit(0);
