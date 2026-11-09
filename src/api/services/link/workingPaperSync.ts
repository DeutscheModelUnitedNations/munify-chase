import { db, schema } from '#api/db/db';
import { pubsub } from '#api/rumble';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import * as Y from 'yjs';
import {
	jsonToYDoc,
	replaceResolution
} from '@deutschemodelunitednations/munify-resolution-editor/yjs';
import { nanoid } from '#lib/helpers/nanoid';
import { applyServerMutation } from '#api/yjs/server';
import type { DelegatorClient } from './delegatorRemote';
import type { Resolution } from '@deutschemodelunitednations/munify-resolution-editor/schema';
import { PAGE_SIZE } from './liveTable';
import {
	readableResolution,
	workingPaperChanges,
	type DelegatorWorkingPaper,
	type LeftBehind,
	type PaperToTakeOver
} from './workingPapers';

const paperPubsub = pubsub({ table: 'resolutionPaper' });

/**
 * Takes a DELEGATOR conference's accepted working papers over as CHASE drafts
 * (`docs/plans/delegator-link.md`, `workingPapers.ts` for which and how). The worker hands over
 * the papers as it keeps them, without texts; only the versions that go across are read. A new
 * draft's text is written into its Yjs document before anybody can open it; a newer version
 * replaces the text through the live document, so open editors see it.
 */
export async function syncWorkingPapers({
	remote,
	conferenceId,
	papers
}: {
	remote: DelegatorClient;
	conferenceId: string;
	papers: readonly DelegatorWorkingPaper[];
}) {
	const [existing, seatRows] = await Promise.all([
		db.query.resolutionPaper.findMany({
			where: { committee: { conferenceId }, delegatorPaperId: { isNotNull: true } },
			columns: { id: true, delegatorPaperId: true, delegatorVersion: true, detachedAt: true }
		}),
		db.query.committeeMember.findMany({
			where: { committee: { conferenceId } },
			columns: { id: true }
		})
	]);
	const changes = workingPaperChanges({
		papers,
		existing: existing.flatMap(({ delegatorPaperId, ...draft }) =>
			delegatorPaperId ? [{ ...draft, delegatorPaperId }] : []
		),
		seats: new Set(seatRows.map((row) => row.id))
	});

	const contents = await readContents({
		remote,
		versionIds: changes.takeOver.map((paper) => paper.versionId)
	});
	const leftBehind: LeftBehind[] = [...changes.leftBehind];

	for (const paper of changes.takeOver) {
		const taken = await takeOver({ paper, content: contents.get(paper.versionId) });
		if (!taken) leftBehind.push({ paperId: paper.delegatorPaperId, reason: 'unreadable' });
	}
	await removeDrafts(changes.remove);
	return leftBehind;
}

/** Writes one paper's text into its draft, or a new draft; false when the text is unreadable. */
async function takeOver({ paper, content }: { paper: PaperToTakeOver; content: unknown }) {
	const resolution = readableResolution(content);
	if (!resolution) return false;
	if (paper.draftId) {
		await replaceText({ draftId: paper.draftId, version: paper.version, content: resolution });
	} else {
		await createDraft({ paper, content: resolution });
	}
	return true;
}

/** Drafts whose paper DELEGATOR no longer offers; one somebody detached stays. */
async function removeDrafts(ids: readonly string[]) {
	if (ids.length === 0) return;
	await db
		.delete(schema.resolutionPaper)
		.where(
			and(inArray(schema.resolutionPaper.id, [...ids]), isNull(schema.resolutionPaper.detachedAt))
		);
	paperPubsub.removed();
}

/** The texts of the given versions, by id; a list answers at most a page. */
async function readContents({
	remote,
	versionIds
}: {
	remote: DelegatorClient;
	versionIds: readonly string[];
}) {
	const contents = new Map<string, unknown>();
	for (let start = 0; start < versionIds.length; start += PAGE_SIZE) {
		const ids = versionIds.slice(start, start + PAGE_SIZE);
		// a version is read through its paper: DELEGATOR has no list of versions
		const papers = await remote.query.papers({
			__args: { where: { versions: { id: { in: ids } } } },
			versions: { id: true, content: true }
		});
		for (const paper of papers) {
			for (const version of paper.versions) contents.set(version.id, version.content);
		}
	}
	return contents;
}

async function createDraft({ paper, content }: { paper: PaperToTakeOver; content: Resolution }) {
	const doc = new Y.Doc();
	jsonToYDoc(doc, content);
	const id = nanoid();
	await db.transaction(async (tx) => {
		await tx.insert(schema.resolutionPaper).values({
			id,
			committeeId: paper.committeeId,
			agendaItemId: paper.agendaItemId,
			creatorCommitteeMemberId: paper.creatorCommitteeMemberId,
			status: 'WORKING_PAPER',
			delegatorPaperId: paper.delegatorPaperId,
			delegatorVersion: paper.version
		});
		await tx
			.insert(schema.paperYjsDoc)
			.values({ paperId: id, state: Buffer.from(Y.encodeStateAsUpdate(doc)) });
	});
	paperPubsub.created();
}

async function replaceText({
	draftId,
	version,
	content
}: {
	draftId: string;
	version: number;
	content: Resolution;
}) {
	await applyServerMutation(draftId, (doc) => replaceResolution(doc, content));
	await db
		.update(schema.resolutionPaper)
		.set({ delegatorVersion: version })
		.where(eq(schema.resolutionPaper.id, draftId));
	paperPubsub.updated(draftId);
}
