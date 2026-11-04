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
import { workingPaperChanges } from './workingPapers';

const paperPubsub = pubsub({ table: 'resolutionPaper' });

/**
 * Takes a DELEGATOR conference's accepted working papers over as CHASE drafts
 * (`docs/plans/delegator-link.md`, `workingPapers.ts` for which and how). A new draft's text is
 * written into its Yjs document before anybody can open it; a newer version replaces the text
 * through the live document, so open editors see it.
 */
export async function syncWorkingPapers({
	remote,
	conferenceId
}: {
	remote: DelegatorClient;
	conferenceId: string;
}) {
	const papers = await remote.query.papers({
		__args: {
			where: { type: 'WORKING_PAPER', delegation: { conferenceId: { eq: conferenceId } } }
		},
		id: true,
		agendaItem: { id: true, committeeId: true },
		delegation: { id: true, assignedRoleId: true },
		versions: { id: true, version: true, content: true }
	});
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
		papers: Array.from(papers).map((paper) => ({
			id: paper.id,
			agendaItem: paper.agendaItem,
			delegation: paper.delegation,
			versions: Array.from(paper.versions)
		})),
		existing: existing.flatMap(({ delegatorPaperId, ...draft }) =>
			delegatorPaperId ? [{ ...draft, delegatorPaperId }] : []
		),
		seats: new Set(seatRows.map((row) => row.id))
	});

	for (const paper of changes.create) {
		const doc = new Y.Doc();
		jsonToYDoc(doc, paper.content);
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

	for (const paper of changes.update) {
		await applyServerMutation(paper.draftId, (doc) => replaceResolution(doc, paper.content));
		await db
			.update(schema.resolutionPaper)
			.set({ delegatorVersion: paper.version })
			.where(eq(schema.resolutionPaper.id, paper.draftId));
		paperPubsub.updated(paper.draftId);
	}

	if (changes.remove.length > 0) {
		await db
			.delete(schema.resolutionPaper)
			.where(
				and(
					inArray(schema.resolutionPaper.id, changes.remove),
					isNull(schema.resolutionPaper.detachedAt)
				)
			);
		paperPubsub.removed();
	}
	return changes.leftBehind;
}
