<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { client } from '$lib/api/rumbleClient/client';
	import { onMount, untrack } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import {
		ResolutionEditor,
		calculateAmendmentDiffSize,
		getFirstTextContent,
		type ResolutionStore,
		type PresenceAdapter,
		type Resolution,
		type ResolutionHeaderData,
		type AmendmentOverlay,
		type OperativeClause
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import {
		createYjsStore,
		createAwarenessPresence
	} from '@deutschemodelunitednations/munify-resolution-editor/yjs';
	import * as Y from 'yjs';
	import { WebsocketProvider } from 'y-websocket';
	import Flag from '$lib/components/Flag.svelte';
	import Fieldset from '$lib/components/Fieldset.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import CreateAmendmentModal from '$lib/components/CreateAmendmentModal.svelte';
	import CommentSection from '$lib/components/CommentSection.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import toast from 'svelte-french-toast';
	import { openVotingModal } from '$lib/components/voting/votingModal';
	import { getResolutionLabels } from '$lib/utils/resolutionEditorLabels';
	import { SvelteMap } from 'svelte/reactivity';

	import { getCurrentUser } from '$lib/state/currentUser.svelte';

	const committee = await client.liveQuery.committee({
		__args: { id: page.params.committeeId! },
		id: true,
		abbreviation: true,
		name: true,
		resolutionHeadline: true,
		currentOperativeClauseId: true,
		currentOperativeIndex: true,
		activeAmendmentId: true,
		totalPresent: true,
		activeAgendaItem: { id: true, title: true },
		conference: { id: true, title: true },
		members: {
			id: true,
			representation: {
				id: true,
				name: true,
				alpha2Code: true,
				alpha3Code: true,
				faIcon: true,
				type: true
			}
		}
	});

	const currentUser = await getCurrentUser();

	const [
		paper,
		allComments,
		allAmendments,
		clauseVotes,
		allVoteResults,
		currentUserConferenceUsers
	] = await Promise.all([
		client.liveQuery.resolutionPaper({
			__args: { id: page.params.paperId! },
			id: true,
			title: true,
			status: true,
			documentNumber: true,
			sequenceNumber: true,
			updatedAt: true,
			agendaItem: {
				id: true,
				title: true
			},
			creator: {
				id: true,
				representation: {
					id: true,
					name: true,
					alpha2Code: true,
					alpha3Code: true,
					faIcon: true
				}
			},
			sponsors: {
				id: true,
				committeeMemberId: true,
				committeeMember: {
					id: true,
					representation: {
						id: true,
						name: true,
						alpha2Code: true,
						alpha3Code: true,
						faIcon: true
					}
				}
			}
		}),
		client.liveQuery.resolutionComments({
			__args: { where: { paper: { id: page.params.paperId } } },
			id: true,
			clauseId: true,
			content: true,
			visibility: true,
			parentCommentId: true,
			createdAt: true,
			updatedAt: true,
			author: {
				id: true,
				user: {
					givenName: true,
					familyName: true
				},
				committeeMember: {
					id: true,
					representation: {
						id: true,
						name: true,
						alpha2Code: true,
						alpha3Code: true,
						faIcon: true
					}
				},
				conferenceUserType: true
			}
		}),
		client.liveQuery.amendments({
			__args: { where: { paper: { id: page.params.paperId } } },
			id: true,
			type: true,
			status: true,
			documentNumber: true,
			targetClauseId: true,
			targetOperativeIndex: true,
			targetPosition: true,
			newContent: true,
			proposerCommitteeMemberId: true,
			createdAt: true,
			proposer: {
				id: true,
				representation: {
					id: true,
					name: true,
					alpha2Code: true,
					alpha3Code: true,
					faIcon: true
				}
			},
			sponsors: {
				id: true,
				committeeMemberId: true,
				committeeMember: {
					id: true,
					representation: {
						id: true,
						name: true,
						alpha2Code: true,
						alpha3Code: true,
						faIcon: true
					}
				}
			}
		}),
		client.liveQuery.operativeClauseVotes({
			__args: { where: { paper: { id: page.params.paperId } } },
			id: true,
			clauseId: true,
			outcome: true,
			votesFor: true,
			votesAgainst: true,
			votesAbstain: true
		}),
		client.liveQuery.resolutionVoteResults({
			__args: { where: { paper: { id: page.params.paperId } }, limit: 1 },
			id: true,
			outcome: true,
			votesFor: true,
			votesAgainst: true,
			votesAbstain: true
		}),
		client.liveQuery.conferenceUsers({
			__args: {
				where: {
					conference: { id: page.params.conferenceId },
					user: { id: currentUser?.id ?? '' }
				}
			},
			id: true
		})
	]);

	// Element types inferred from the selected live query result shapes
	type PaperData = NonNullable<typeof paper>;
	type SponsorEntry = PaperData['sponsors'][number];
	type CommitteeData = NonNullable<typeof committee>;
	type CommitteeMemberEntry = CommitteeData['members'][number];
	type CommentEntry = NonNullable<typeof allComments>[number];
	type AmendmentEntry = NonNullable<typeof allAmendments>[number];
	type AmendmentSponsorEntry = AmendmentEntry['sponsors'][number];

	let myConferenceUserId = $derived(currentUserConferenceUsers?.[0]?.id);

	let voteResult = $derived(allVoteResults?.[0] ?? null);

	let editorMode = $state<'edit' | 'preview'>('preview');

	// Y.js-backed collaborative store
	let store = $state<ResolutionStore | null>(null);
	let presence = $state<PresenceAdapter | null>(null);
	let wsSynced = $state(false);
	let wsConnected = $state(false);
	let wsForbidden = $state(false);

	$effect(() => {
		const paperId = page.params.paperId;
		if (!paperId) return;
		// Only paperId should re-trigger this effect.
		return untrack(() => establishYjsSession(paperId));
	});

	function establishYjsSession(paperId: string) {
		const doc = new Y.Doc();
		const wsProto = location.protocol === 'https:' ? 'wss:' : 'ws:';
		const wsUrl = `${wsProto}//${location.host}/api/ws/yjs`;
		const prov = new WebsocketProvider(wsUrl, paperId, doc);
		const s = createYjsStore(doc);
		const p = createAwarenessPresence({
			awareness: prov.awareness,
			user: {
				id: currentUser?.id ?? 'anon',
				name: 'Team',
				color: stringToColor(currentUser?.id ?? 'anon')
			}
		});
		const onSynced = (synced: boolean) => {
			wsSynced = synced;
		};
		const onStatus = ({ status }: { status: string }) => {
			wsConnected = status === 'connected';
			if (status !== 'connected') wsSynced = false;
		};
		const onClose = (event: CloseEvent | null) => {
			// 4403 = our server's "Forbidden" close code. Stop the reconnect
			// loop so we don't hammer the server; surface state so the UI can
			// tell the user to re-auth.
			if (event?.code === 4403) {
				prov.shouldConnect = false;
				wsForbidden = true;
				wsConnected = false;
				wsSynced = false;
			}
		};
		prov.on('sync', onSynced);
		prov.on('status', onStatus);
		prov.on('connection-close', onClose);
		// Catch up with any state already established by the time we got here
		// (BroadcastChannel between tabs can sync the provider before our
		// listener is attached, and that fire-once 'synced' event is missed).
		if (prov.synced) wsSynced = true;
		if (prov.wsconnected) wsConnected = true;
		// Last-resort reconciliation. y-websocket's `synced` setter dedupes
		// no-op assignments; if the disconnect path didn't reset _synced
		// (e.g., browser closed the WS before wsconnected was true), the
		// next sync step 2 won't refire. Poll to self-heal within a second.
		// IMPORTANT: only flip in the recovery direction (false→true). Going
		// back (true→false) on a transient dip would mask the editor and
		// race with sync messages already in flight.
		const reconcileInterval = setInterval(() => {
			if (wsForbidden) return;
			if (prov.wsconnected && !wsConnected) wsConnected = true;
			if (prov.synced && !wsSynced) wsSynced = true;
		}, 1000);
		store = s;
		presence = p;
		return () => {
			clearInterval(reconcileInterval);
			prov.off('sync', onSynced);
			prov.off('status', onStatus);
			prov.off('connection-close', onClose);
			s.destroy();
			prov.destroy();
			doc.destroy();
			store = null;
			presence = null;
			wsSynced = false;
			wsConnected = false;
			wsForbidden = false;
		};
	}

	function stringToColor(s: string) {
		let h = 0;
		for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
		const hue = ((h % 360) + 360) % 360;
		return `hsl(${hue}, 70%, 50%)`;
	}

	// Reactive resolution snapshot (read from store; null until connected)
	let resolution = $derived<Resolution | null>(store?.snapshot ?? null);

	// Resolution header data for document preview
	let headerData = $derived<ResolutionHeaderData>({
		conferenceTitle: committee?.conference?.title ?? undefined,
		committeeAbbreviation: committee?.abbreviation ?? undefined,
		committeeFullName: committee?.name ?? undefined,
		committeeResolutionHeadline: committee?.resolutionHeadline ?? undefined,
		documentNumber: paper?.documentNumber?.replace(`${committee?.abbreviation}/`, '') ?? undefined,
		topic: paper?.agendaItem?.title ?? committee?.activeAgendaItem?.title ?? undefined,
		authoringDelegation:
			getTranslatedCountryNameFromAlpha3Code(paper?.creator?.representation?.alpha3Code) ??
			paper?.creator?.representation?.name ??
			undefined,
		sponsoringDelegations: paper?.sponsors
			?.map(
				(s) =>
					getTranslatedCountryNameFromAlpha3Code(s.committeeMember?.representation?.alpha3Code) ??
					s.committeeMember?.representation?.name ??
					''
			)
			.filter(Boolean)
			.sort((a, b) => a.localeCompare(b)),
		lastEdited: paper?.updatedAt ?? undefined
	});

	const scrollStorageKey = $derived(`scroll-position:paper:${page.params.paperId}`);

	// Restore scroll position after SvelteKit navigation (afterNavigate fires after SvelteKit's
	// own scroll reset, so our restore wins). We poll with rAF until the content is tall enough
	// to actually scroll to the saved position, because data arrives asynchronously.
	afterNavigate(() => {
		const saved = sessionStorage.getItem(scrollStorageKey);
		if (saved === null) return;
		const savedY = parseInt(saved, 10);
		if (savedY === 0) return;

		let attempts = 0;
		const maxAttempts = 60; // ~1 second at 60fps

		function tryRestore() {
			const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
			if (maxScroll >= savedY || attempts >= maxAttempts) {
				window.scrollTo({ top: Math.min(savedY, Math.max(maxScroll, 0)), behavior: 'instant' });
			} else {
				attempts++;
				requestAnimationFrame(tryRestore);
			}
		}

		requestAnimationFrame(tryRestore);
	});

	onMount(() => {
		const handleScroll = () => {
			sessionStorage.setItem(scrollStorageKey, String(window.scrollY));
		};
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	// Save status — kept for future use (e.g. title or metadata mutations); content auto-syncs via Y.js
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');

	function getStatusBadgeClass(status: string) {
		switch (status) {
			case 'DRAFT_RESOLUTION':
				return 'badge-info';
			case 'AMENDMENT_PHASE':
				return 'badge-secondary';
			case 'VOTING_PHASE':
				return 'badge-accent';
			case 'FINAL':
				return 'badge-success';
			case 'SUBMITTED':
				return 'badge-warning';
			default:
				return 'badge-ghost';
		}
	}

	function getStatusText(status: string) {
		switch (status) {
			case 'WORKING_PAPER':
				return m.workingPaper();
			case 'SUBMITTED':
				return m.submitted();
			case 'DRAFT_RESOLUTION':
				return m.draftResolution();
			case 'AMENDMENT_PHASE':
				return m.amendmentPhase();
			case 'VOTING_PHASE':
				return m.votingPhase();
			case 'FINAL':
				return m.finalResolution();
			default:
				return status;
		}
	}

	// =====================================================
	// Comments
	// =====================================================

	// Group comments by clauseId for inline display
	let commentsByClauseId = $derived.by(() => {
		const map = new SvelteMap<string | null, CommentEntry[]>();
		for (const comment of allComments ?? []) {
			const key = comment.clauseId;
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push(comment);
		}
		return map;
	});

	// Comment counts per clause (for badge annotations)
	let commentCountByClauseId = $derived.by(() => {
		const map = new SvelteMap<string, number>();
		for (const comment of allComments ?? []) {
			if (comment.clauseId) {
				map.set(comment.clauseId, (map.get(comment.clauseId) ?? 0) + 1);
			}
		}
		return map;
	});

	// Comment statistics
	let documentCommentCount = $derived((allComments ?? []).filter((c) => !c.clauseId).length);
	let clauseCommentCount = $derived((allComments ?? []).filter((c) => c.clauseId).length);

	async function onCreateComment(
		content: string,
		visibility: string,
		parentCommentId?: string,
		clauseId?: string | null
	) {
		await client.mutate.createComment({
			__args: {
				paperId: page.params.paperId!,
				content,
				clauseId: clauseId ?? null,
				visibility: visibility as 'PUBLIC' | 'TEAM_ONLY',
				parentCommentId: parentCommentId ?? null
			},
			id: true
		});
		toast.success(m.commentPosted());
	}

	async function onUpdateComment(commentId: string, content: string) {
		await client.mutate.updateComment({ __args: { commentId, content }, id: true });
		toast.success(m.commentUpdated());
	}

	async function onDeleteComment(commentId: string) {
		// Cast required: rumble generator types scalar-returning mutations as plain types instead of fns
		await (
			client.mutate.deleteComment as unknown as (p: {
				__args: { commentId: string };
			}) => Promise<unknown>
		)({ __args: { commentId } });
		toast.success(m.commentDeleted());
	}

	// =====================================================
	// Sponsor management
	// =====================================================

	let showAddSponsorModal = $state(false);
	let sponsorSearchQuery = $state('');

	let availableMembers = $derived(
		(committee?.members ?? []).filter(
			(member: CommitteeMemberEntry) =>
				!paper?.sponsors.some((s: SponsorEntry) => s.committeeMemberId === member.id)
		)
	);

	function getRepresentationName(
		rep: { name?: string | null; alpha3Code?: string | null } | null | undefined
	) {
		return rep?.name ?? getTranslatedCountryNameFromAlpha3Code(rep?.alpha3Code) ?? '';
	}

	let sortedSponsors = $derived(
		[...(paper?.sponsors ?? [])].sort((a, b) =>
			getRepresentationName(a.committeeMember?.representation).localeCompare(
				getRepresentationName(b.committeeMember?.representation)
			)
		)
	);

	let filteredAvailableMembers = $derived(
		(sponsorSearchQuery
			? availableMembers.filter((member: CommitteeMemberEntry) =>
					getRepresentationName(member.representation)
						.toLowerCase()
						.includes(sponsorSearchQuery.toLowerCase())
				)
			: availableMembers
		).sort((a: CommitteeMemberEntry, b: CommitteeMemberEntry) =>
			getRepresentationName(a.representation).localeCompare(getRepresentationName(b.representation))
		)
	);

	async function handleAddSponsor(committeeMemberId: string) {
		await client.mutate.addSponsor({
			__args: { paperId: page.params.paperId!, committeeMemberId },
			id: true
		});
		toast.success(m.sponsorAdded());
	}

	async function handleRemoveSponsor(committeeMemberId: string) {
		await (
			client.mutate.removeSponsor as unknown as (p: {
				__args: { paperId: string; committeeMemberId: string };
			}) => Promise<unknown>
		)({
			__args: { paperId: page.params.paperId!, committeeMemberId }
		});
		toast.success(m.sponsorRemoved());
	}

	// Collapsible metadata
	let metadataOpen = $state(false);

	// =====================================================
	// Amendments (Phase 6c)
	// =====================================================

	let submittedAmendments = $derived((allAmendments ?? []).filter((a) => a.status === 'SUBMITTED'));

	let currentOpIndex = $derived.by(() => {
		const clauseId = committee?.currentOperativeClauseId;
		if (clauseId && resolution) {
			const idx = resolution.operative.findIndex((c: { id: string }) => c.id === clauseId);
			if (idx !== -1) return idx;
		}
		return committee?.currentOperativeIndex ?? 0;
	});
	let activeAmendmentId = $derived(committee?.activeAmendmentId ?? null);

	let operativeClauses = $derived((resolution?.operative ?? []) as OperativeClause[]);

	// Resolve an amendment's operative index from its targetClauseId (stable) with fallback to stored index
	function resolveAmendmentIndex(a: {
		targetClauseId?: string | null;
		targetOperativeIndex?: number | null;
	}): number {
		if (a.targetClauseId) {
			const idx = operativeClauses.findIndex((c) => c.id === a.targetClauseId);
			if (idx !== -1) return idx;
		}
		return a.targetOperativeIndex ?? -1;
	}

	// GO-ordered: current paragraph first → DELETE > ALTER_TEXT (diff size desc) > ADD > ALTER_POSITION → then by createdAt
	let sortedSubmittedAmendments = $derived.by(() => {
		const typeOrder: Record<string, number> = {
			DELETE: 0,
			ALTER_TEXT: 1,
			ADD: 2,
			ALTER_POSITION: 3
		};
		return [...submittedAmendments].sort((a, b) => {
			// Current paragraph first
			const aIsCurrent = resolveAmendmentIndex(a) === currentOpIndex;
			const bIsCurrent = resolveAmendmentIndex(b) === currentOpIndex;
			if (aIsCurrent && !bIsCurrent) return -1;
			if (!aIsCurrent && bIsCurrent) return 1;

			// Then by type
			const aType = typeOrder[a.type] ?? 99;
			const bType = typeOrder[b.type] ?? 99;
			if (aType !== bType) return aType - bType;

			// For ALTER_TEXT, sort by diff size descending
			if (a.type === 'ALTER_TEXT' && b.type === 'ALTER_TEXT') {
				const aClause = operativeClauses[resolveAmendmentIndex(a)];
				const bClause = operativeClauses[resolveAmendmentIndex(b)];
				if (aClause && bClause && a.newContent && b.newContent) {
					const aDiff = calculateAmendmentDiffSize(aClause, a.newContent as OperativeClause);
					const bDiff = calculateAmendmentDiffSize(bClause, b.newContent as OperativeClause);
					if (aDiff !== bDiff) return bDiff - aDiff;
				}
			}

			// Then by createdAt
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		});
	});

	// Group amendments by operative clause for display
	let groupedAmendments = $derived.by(() => {
		const groups: {
			label: string;
			index: number | null;
			amendments: typeof sortedSubmittedAmendments;
		}[] = [];
		const byIndex = new SvelteMap<number | null, typeof sortedSubmittedAmendments>();

		for (const a of sortedSubmittedAmendments) {
			const resolved = resolveAmendmentIndex(a);
			const key = resolved >= 0 ? resolved : null;
			if (!byIndex.has(key)) byIndex.set(key, []);
			byIndex.get(key)!.push(a);
		}

		// Numbered groups first, sorted by index
		const numbered = [...byIndex.entries()].filter(([k]) => k !== null).sort(([a], [b]) => a! - b!);
		for (const [idx, amendments] of numbered) {
			groups.push({ label: `OP ${idx! + 1}`, index: idx, amendments });
		}

		// General group (ADD amendments with no target index) at the end
		const general = byIndex.get(null);
		if (general && general.length > 0) {
			groups.push({ label: m.general(), index: null, amendments: general });
		}

		return groups;
	});

	// Amendment sponsor management
	let showAmendmentSponsorModal = $state(false);
	let amendmentSponsorSearchQuery = $state('');
	let amendmentSponsorTargetId = $state<string | null>(null);

	let amendmentSponsorTarget = $derived(
		(allAmendments ?? []).find((a) => a.id === amendmentSponsorTargetId)
	);

	let filteredAvailableAmendmentMembers = $derived.by(() => {
		const existingSponsorIds = new Set(
			(amendmentSponsorTarget?.sponsors ?? []).map(
				(s: AmendmentSponsorEntry) => s.committeeMemberId
			)
		);
		const available = (committee?.members ?? []).filter(
			(member: CommitteeMemberEntry) => !existingSponsorIds.has(member.id)
		);
		const filtered = amendmentSponsorSearchQuery
			? available.filter((member: CommitteeMemberEntry) =>
					getRepresentationName(member.representation)
						.toLowerCase()
						.includes(amendmentSponsorSearchQuery.toLowerCase())
				)
			: available;
		return filtered.sort((a: CommitteeMemberEntry, b: CommitteeMemberEntry) =>
			getRepresentationName(a.representation).localeCompare(getRepresentationName(b.representation))
		);
	});

	let sponsorThresholdNeeded = $derived(Math.ceil((committee?.totalPresent ?? 0) * 0.1));

	async function handleAddAmendmentSponsor(committeeMemberId: string) {
		if (!amendmentSponsorTargetId) return;
		await client.mutate.addAmendmentSponsor({
			__args: { amendmentId: amendmentSponsorTargetId, committeeMemberId },
			id: true
		});
		toast.success(m.sponsorAdded());
	}

	async function handleRemoveAmendmentSponsor(amendmentId: string, committeeMemberId: string) {
		await (
			client.mutate.removeAmendmentSponsor as unknown as (p: {
				__args: { amendmentId: string; committeeMemberId: string };
			}) => Promise<unknown>
		)({
			__args: { amendmentId, committeeMemberId }
		});
		toast.success(m.sponsorRemoved());
	}

	// Transform server amendments → AmendmentOverlay[] for editor rendering
	let amendmentOverlays = $derived.by(() => {
		const visible = (allAmendments ?? []).filter(
			(a) => a.status === 'SUBMITTED' || a.status === 'CONSENSUS_ADOPTED' || a.status === 'ACCEPTED'
		);
		return visible.map(
			(a) =>
				({
					id: a.id,
					type: a.type,
					status: a.status,
					targetClauseId: a.targetClauseId ?? undefined,
					targetOperativeIndex: a.targetOperativeIndex ?? undefined,
					targetPosition: a.targetPosition ?? undefined,
					newContent: a.newContent as OperativeClause | undefined,
					proposerName:
						a.proposer?.representation?.name ??
						getTranslatedCountryNameFromAlpha3Code(a.proposer?.representation?.alpha3Code),
					sponsorCount: a.sponsors?.length ?? 0,
					isOwnAmendment: false
				}) satisfies AmendmentOverlay
		);
	});

	// Amendment mutations
	let canEdit = $derived(paper?.status !== 'FINAL' || !voteResult);

	let showAdoptConfirmModal = $state(false);
	let showRejectConfirmModal = $state(false);
	let confirmAmendmentId = $state<string | null>(null);
	let showVoteOutcomeModal = $state(false);
	let voteOutcomeAmendmentId = $state<string | null>(null);

	async function handleAdoptByConsensus(amendmentId: string) {
		if (!committee) return;
		try {
			await client.mutate.updateCommittee({
				__args: { id: committee.id, activeAmendmentId: amendmentId },
				id: true
			});
			await client.mutate.adoptByConsensus({ __args: { amendmentId }, id: true });
			toast.success(m.amendmentAdopted());
			showAdoptConfirmModal = false;
			confirmAmendmentId = null;
			await client.mutate.updateCommittee({
				__args: { id: committee.id, clearActiveAmendment: true },
				id: true
			});
		} catch {
			toast.error(m.saveError());
		}
	}

	async function handleAmendmentVote(amendment: {
		id: string;
		type: string;
		targetClauseId?: string | null;
		targetOperativeIndex?: number | null;
	}) {
		if (!committee) return;
		const typeLabel = getAmendmentTypeLabel(amendment.type);
		const resolvedIdx = resolveAmendmentIndex(amendment);
		const clauseLabel = resolvedIdx >= 0 ? `OP ${resolvedIdx + 1}` : '';
		const docNumber = paper?.documentNumber ?? m.draftResolution();
		const voteName = `${docNumber} – ${typeLabel} ${clauseLabel}`.trim();

		// Set active amendment for presentation
		await client.mutate.updateCommittee({
			__args: { id: committee.id, activeAmendmentId: amendment.id },
			id: true
		});

		const result = await openVotingModal({
			voteName,
			majority: 'SIMPLE',
			voteType: 'SHOW_OF_HANDS',
			withAbstentions: true
		});

		if (!result.cancelled) {
			voteOutcomeAmendmentId = amendment.id;
			showVoteOutcomeModal = true;
			return; // don't clear active amendment yet — chair must decide outcome
		}

		// Clear active amendment after cancellation
		await client.mutate.updateCommittee({
			__args: { id: committee.id, clearActiveAmendment: true },
			id: true
		});
	}

	async function handleVoteOutcomeDecision(outcome: 'ADOPTED' | 'REJECTED') {
		if (!voteOutcomeAmendmentId || !committee) return;
		try {
			if (outcome === 'ADOPTED') {
				await client.mutate.acceptAmendment({
					__args: { amendmentId: voteOutcomeAmendmentId },
					id: true
				});
				toast.success(m.amendmentAdopted());
			} else {
				await client.mutate.rejectAmendment({
					__args: { amendmentId: voteOutcomeAmendmentId },
					id: true
				});
				toast.success(m.amendmentRejectedToast());
			}
		} catch {
			toast.error(m.saveError());
		}
		showVoteOutcomeModal = false;
		voteOutcomeAmendmentId = null;
		await client.mutate.updateCommittee({
			__args: { id: committee.id, clearActiveAmendment: true },
			id: true
		});
	}

	async function handleCancelVoteOutcome() {
		showVoteOutcomeModal = false;
		voteOutcomeAmendmentId = null;
		if (committee) {
			await client.mutate.updateCommittee({
				__args: { id: committee.id, clearActiveAmendment: true },
				id: true
			});
		}
	}

	async function handleRejectAmendment(amendmentId: string) {
		if (!committee) return;
		try {
			await client.mutate.rejectAmendment({ __args: { amendmentId }, id: true });
			toast.success(m.amendmentRejectedToast());
			showRejectConfirmModal = false;
			confirmAmendmentId = null;
			await client.mutate.updateCommittee({
				__args: { id: committee.id, clearActiveAmendment: true },
				id: true
			});
		} catch {
			toast.error(m.saveError());
		}
	}

	async function handleWithdrawAmendment(amendmentId: string) {
		if (!committee) return;
		try {
			await client.mutate.withdrawAmendment({ __args: { amendmentId }, id: true });
			toast.success(m.amendmentWithdrawnToast());
			await client.mutate.updateCommittee({
				__args: { id: committee.id, clearActiveAmendment: true },
				id: true
			});
		} catch {
			toast.error(m.saveError());
		}
	}

	async function handleSetActiveAmendment(amendmentId: string | null) {
		if (!committee) return;
		try {
			if (amendmentId) {
				await client.mutate.updateCommittee({
					__args: { id: committee.id, activeAmendmentId: amendmentId },
					id: true
				});
			} else {
				await client.mutate.updateCommittee({
					__args: { id: committee.id, clearActiveAmendment: true },
					id: true
				});
			}
		} catch {
			toast.error(m.saveError());
		}
	}

	async function handleAdvanceParagraph() {
		if (!committee) return;
		try {
			const newIndex = currentOpIndex + 1;
			await client.mutate.updateCommittee({
				__args: {
					id: committee.id,
					currentOperativeIndex: newIndex,
					currentOperativeClauseId: operativeClauses[newIndex]?.id ?? null
				},
				id: true
			});
		} catch {
			toast.error(m.saveError());
		}
	}

	function handleAmendmentClick(amendmentId: string) {
		const el = document.getElementById(`amendment-${amendmentId}`);
		el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		el?.classList.add('ring-2', 'ring-primary');
		setTimeout(() => el?.classList.remove('ring-2', 'ring-primary'), 2000);
	}

	function getAmendmentTypeBadgeClass(type: string) {
		switch (type) {
			case 'DELETE':
				return 'badge-error';
			case 'ADD':
				return 'badge-success';
			case 'ALTER_TEXT':
				return 'badge-warning';
			case 'ALTER_POSITION':
				return 'badge-info';
			default:
				return 'badge-ghost';
		}
	}

	function getAmendmentTypeLabel(type: string) {
		switch (type) {
			case 'DELETE':
				return m.deleteClause();
			case 'ADD':
				return m.addClause();
			case 'ALTER_TEXT':
				return m.alterText();
			case 'ALTER_POSITION':
				return m.alterPosition();
			default:
				return type;
		}
	}

	// =====================================================
	// Chair Create Amendment
	// =====================================================

	let showChairCreateAmendmentModal = $state(false);

	function openChairCreateAmendment() {
		showChairCreateAmendmentModal = true;
	}

	async function handleChairAmendmentSubmit(args: {
		type: 'DELETE' | 'ADD' | 'ALTER_TEXT' | 'ALTER_POSITION';
		targetClauseId: string | null;
		targetOperativeIndex: number | null;
		targetPosition: number | null;
		newContent: OperativeClause | null;
		committeeMemberId?: string;
	}) {
		if (!args.committeeMemberId) return;
		await client.mutate.chairCreateAmendment({
			__args: {
				paperId: page.params.paperId!,
				type: args.type,
				committeeMemberId: args.committeeMemberId,
				targetClauseId: args.targetClauseId,
				targetOperativeIndex: args.targetOperativeIndex,
				targetPosition: args.targetPosition,
				newContent: args.newContent
			},
			id: true
		});
		toast.success(m.amendmentCreated());
	}

	// =====================================================
	// Chair Edit Amendment
	// =====================================================

	let editingAmendment = $state<(typeof allAmendments)[0] | null>(null);
	let showEditAmendmentModal = $state(false);

	function openEditAmendment(amendment: (typeof allAmendments)[0]) {
		editingAmendment = amendment;
		showEditAmendmentModal = true;
	}

	async function handleEditAmendmentSubmit(args: {
		type: 'DELETE' | 'ADD' | 'ALTER_TEXT' | 'ALTER_POSITION';
		targetClauseId: string | null;
		targetOperativeIndex: number | null;
		targetPosition: number | null;
		newContent: OperativeClause | null;
		committeeMemberId?: string;
	}) {
		if (!editingAmendment) return;
		await client.mutate.editAmendment({
			__args: {
				amendmentId: editingAmendment.id,
				targetClauseId: args.targetClauseId,
				targetOperativeIndex: args.targetOperativeIndex,
				targetPosition: args.targetPosition,
				newContent: args.newContent,
				proposerCommitteeMemberId: args.committeeMemberId ?? null
			},
			id: true
		});
		toast.success(m.amendmentUpdated());
	}

	// =====================================================
	// Voting Phase (Phase 7)
	// =====================================================

	// Map clauseId → vote for quick lookup
	let clauseVoteMap = $derived.by(() => {
		const map = new SvelteMap<string, (typeof clauseVotes)[0]>();
		for (const v of clauseVotes ?? []) {
			map.set(v.clauseId, v);
		}
		return map;
	});

	// Rejected clause IDs for editor strikethrough
	let rejectedClauseIds = $derived(
		(clauseVotes ?? []).filter((v) => v.outcome === 'REJECTED').map((v) => v.clauseId)
	);

	let votedClauseCount = $derived((clauseVotes ?? []).length);

	// Clause vote modal state
	let showClauseOutcomeModal = $state(false);
	let pendingClauseVote = $state<{
		clauseId: string;
		votesFor: number;
		votesAgainst: number;
		votesAbstain: number;
	} | null>(null);

	// Final vote modal state
	let showFinalOutcomeModal = $state(false);
	let pendingFinalVote = $state<{
		votesFor: number;
		votesAgainst: number;
		votesAbstain: number;
	} | null>(null);

	// Modals
	let showStartVotingPhaseModal = $state(false);
	let showRevertStatusModal = $state(false);
	let revertRestoreSnapshot = $state(false);

	async function handleRevertStatus() {
		try {
			await client.mutate.revertPaperStatus({
				__args: {
					paperId: page.params.paperId!,
					restoreSnapshot: revertRestoreSnapshot
				},
				id: true
			});
			showRevertStatusModal = false;
			revertRestoreSnapshot = false;
			toast.success(m.statusReverted());
		} catch {
			toast.error(m.saveError());
		}
	}

	function getPreviousStatus(status: string): string {
		const order = [
			'WORKING_PAPER',
			'SUBMITTED',
			'DRAFT_RESOLUTION',
			'AMENDMENT_PHASE',
			'VOTING_PHASE',
			'FINAL'
		];
		const idx = order.indexOf(status);
		return idx > 0 ? order[idx - 1] : status;
	}

	async function handleStartVotingPhase() {
		try {
			await client.mutate.startVotingPhase({
				__args: { paperId: page.params.paperId! },
				id: true
			});
			showStartVotingPhaseModal = false;
			toast.success(m.votingPhaseStarted());
		} catch {
			toast.error(m.saveError());
		}
	}

	async function handleClauseVote() {
		const clause = operativeClauses[currentOpIndex];
		if (!clause) return;
		const voteName = `OP ${currentOpIndex + 1}`;
		const result = await openVotingModal({
			voteName,
			majority: 'SIMPLE',
			voteType: 'SHOW_OF_HANDS',
			withAbstentions: true
		});
		if (!result.cancelled) {
			pendingClauseVote = {
				clauseId: clause.id,
				votesFor: result.votesFor,
				votesAgainst: result.votesAgainst,
				votesAbstain: result.votesAbstain
			};
			showClauseOutcomeModal = true;
		}
	}

	async function handleClauseOutcomeDecision(outcome: 'ADOPTED' | 'REJECTED') {
		if (!pendingClauseVote) return;
		try {
			await client.mutate.recordClauseVote({
				__args: {
					paperId: page.params.paperId!,
					clauseId: pendingClauseVote.clauseId,
					outcome,
					votesFor: pendingClauseVote.votesFor,
					votesAgainst: pendingClauseVote.votesAgainst,
					votesAbstain: pendingClauseVote.votesAbstain
				},
				id: true
			});
			toast.success(m.clauseVoteRecorded());
		} catch {
			toast.error(m.saveError());
		}
		showClauseOutcomeModal = false;
		pendingClauseVote = null;
	}

	async function handleDeleteClauseVote(clauseId: string) {
		try {
			await (
				client.mutate.deleteClauseVote as unknown as (p: {
					__args: { paperId: string; clauseId: string };
				}) => Promise<unknown>
			)({
				__args: { paperId: page.params.paperId!, clauseId }
			});
			toast.success(m.clauseVoteDeleted());
		} catch {
			toast.error(m.saveError());
		}
	}

	async function handleFinalVoteCall() {
		const docNumber = paper?.documentNumber ?? m.draftResolution();
		const result = await openVotingModal({
			voteName: docNumber,
			majority: 'SIMPLE',
			voteType: 'SHOW_OF_HANDS',
			withAbstentions: true
		});
		if (!result.cancelled) {
			pendingFinalVote = {
				votesFor: result.votesFor,
				votesAgainst: result.votesAgainst,
				votesAbstain: result.votesAbstain
			};
			showFinalOutcomeModal = true;
		}
	}

	async function handleFinalOutcomeDecision(outcome: 'ADOPTED' | 'REJECTED' | 'SENT_BACK') {
		if (!pendingFinalVote) return;
		try {
			await client.mutate.recordVoteResult({
				__args: {
					paperId: page.params.paperId!,
					outcome,
					votesFor: pendingFinalVote.votesFor,
					votesAgainst: pendingFinalVote.votesAgainst,
					votesAbstain: pendingFinalVote.votesAbstain
				},
				id: true
			});
			showFinalOutcomeModal = false;
			pendingFinalVote = null;
			if (outcome === 'ADOPTED') toast.success(m.resolutionAdopted());
			else if (outcome === 'REJECTED') toast.success(m.resolutionRejected());
			else toast.success(m.resolutionSentBack());
		} catch {
			toast.error(m.saveError());
		}
	}

	function navigateToVotingClause(index: number) {
		if (!committee) return;
		client.mutate
			.updateCommittee({
				__args: {
					id: committee.id,
					currentOperativeIndex: index,
					currentOperativeClauseId: operativeClauses[index]?.id ?? null
				},
				id: true
			})
			.catch(() => toast.error(m.saveError()));
	}
</script>

<svelte:head>
	<title>{paper?.documentNumber ?? m.draftResolution()} - MUNify CHASE</title>
</svelte:head>

{#if paper}
	<div class="mx-auto flex max-w-4xl flex-col px-4">
		<!-- Back button + save status -->
		<div class="flex items-center justify-between py-2">
			<a
				href={resolve('/app/[conferenceId]/[committeeId]/(chairs)/resolutions', {
					conferenceId: page.params.conferenceId!,
					committeeId: page.params.committeeId!
				})}
				class="btn btn-ghost btn-sm"
			>
				<i class="fa-duotone fa-arrow-left mr-1"></i>
				{m.backToResolutions()}
			</a>
			<div class="flex items-center gap-2 text-sm">
				{#if saveStatus === 'saving'}
					<span class="text-warning">
						<i class="fas fa-circle-notch fa-spin mr-1"></i>{m.savingChanges()}
					</span>
				{:else if saveStatus === 'saved'}
					<span class="text-success">
						<i class="fas fa-check mr-1"></i>{m.changesSaved()}
					</span>
				{:else if saveStatus === 'error'}
					<span class="text-error">
						<i class="fas fa-exclamation-triangle mr-1"></i>{m.saveError()}
					</span>
				{/if}
				<a
					href={resolve('/app/print/[documentId]', { documentId: paper.id })}
					target="_blank"
					class="btn btn-ghost btn-sm"
					title={m.printResolution()}
				>
					<i class="fas fa-print"></i>
				</a>
			</div>
		</div>

		<!-- Collapsible metadata header -->
		<div class="collapse collapse-arrow bg-base-100 shadow-sm">
			<input type="checkbox" bind:checked={metadataOpen} />
			<div class="collapse-title">
				<div class="flex items-center gap-2">
					<span class="font-bold font-mono">
						{paper.documentNumber ?? m.draftResolution()}
					</span>
					<span class="badge badge-soft badge-sm {getStatusBadgeClass(paper.status)}">
						{getStatusText(paper.status)}
					</span>
				</div>
			</div>
			<div class="collapse-content flex flex-col gap-4">
				<!-- Agenda Item -->
				{#if paper.agendaItem}
					<div class="text-sm">
						<span class="opacity-60">{m.agendaItem()}:</span>
						{paper.agendaItem.title}
					</div>
				{/if}

				<!-- Creator -->
				{#if paper.creator?.representation}
					<div class="flex items-center gap-2 text-sm">
						<span class="opacity-60">{m.submittingNation()}:</span>
						<Flag representation={paper.creator.representation} size="xs" />
						{paper.creator.representation.name ??
							getTranslatedCountryNameFromAlpha3Code(paper.creator.representation.alpha3Code)}
					</div>
				{/if}

				<!-- Sponsors -->
				<Fieldset legend={m.sponsors()} faIcon="fas fa-users">
					<div class="flex flex-wrap gap-2">
						{#each sortedSponsors as sponsor (sponsor.id)}
							<div
								class="group relative tooltip tooltip-bottom"
								data-tip={sponsor.committeeMember?.representation?.name ??
									getTranslatedCountryNameFromAlpha3Code(
										sponsor.committeeMember?.representation?.alpha3Code
									)}
							>
								<Flag representation={sponsor.committeeMember?.representation} size="xs" />
								<button
									class="absolute -top-1 -right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
									aria-label={m.removeSponsor()}
									onclick={() => handleRemoveSponsor(sponsor.committeeMemberId)}
								>
									<i class="fas fa-times text-[0.5rem]"></i>
								</button>
							</div>
						{/each}
						<button
							class="btn btn-ghost btn-xs"
							aria-label={m.addSponsor()}
							onclick={() => {
								sponsorSearchQuery = '';
								showAddSponsorModal = true;
							}}
						>
							<i class="fas fa-plus"></i>
						</button>
					</div>
					<p class="mt-1 text-xs opacity-60">
						{m.sponsorCount({ count: String(paper.sponsors.length) })}
					</p>
				</Fieldset>

				{#if paper.status !== 'WORKING_PAPER'}
					<button
						class="btn btn-ghost btn-sm btn-block opacity-60 hover:opacity-100"
						onclick={() => {
							revertRestoreSnapshot = false;
							showRevertStatusModal = true;
						}}
					>
						<i class="fas fa-undo text-xs"></i>
						{m.revertStatus()}
					</button>
				{/if}
			</div>
		</div>

		<!-- Final vote result alert -->
		{#if paper.status === 'FINAL' && voteResult}
			<div
				class="alert mt-2 {voteResult.outcome === 'ADOPTED'
					? 'alert-success'
					: voteResult.outcome === 'REJECTED'
						? 'alert-error'
						: 'alert-warning'}"
			>
				<i
					class="fas {voteResult.outcome === 'ADOPTED'
						? 'fa-check-circle'
						: voteResult.outcome === 'REJECTED'
							? 'fa-times-circle'
							: 'fa-undo'}"
				></i>
				<div>
					<span class="font-bold">
						{voteResult.outcome === 'ADOPTED'
							? m.adopted()
							: voteResult.outcome === 'REJECTED'
								? m.rejected()
								: m.sentBack()}
					</span>
					<span class="ml-2 text-sm">
						{m.votesFor()}: {voteResult.votesFor} | {m.votesAgainst()}: {voteResult.votesAgainst}
						{#if voteResult.votesAbstain > 0}
							| {m.votesAbstain()}: {voteResult.votesAbstain}
						{/if}
					</span>
				</div>
			</div>
		{/if}

		<!-- Comment statistics -->
		{#if (allComments ?? []).length > 0}
			<div class="flex items-center gap-4 text-sm text-base-content/60 mt-2">
				<div class="flex items-center gap-1">
					<i class="fas fa-comments"></i>
					<span class="font-semibold">{(allComments ?? []).length}</span>
					{m.comments()}
				</div>
				<span class="text-base-content/30">|</span>
				<div class="flex items-center gap-1">
					<span>{documentCommentCount}</span>
					{m.documentWide()}
				</div>
				<span class="text-base-content/30">|</span>
				<div class="flex items-center gap-1">
					<span>{clauseCommentCount}</span>
					{m.clauseComments()}
				</div>
			</div>
		{/if}

		<!-- Edit/Preview Toggle -->
		{#if canEdit}
			<div class="flex justify-end mt-4">
				<button
					class="btn btn-sm btn-ghost"
					onclick={() => (editorMode = editorMode === 'edit' ? 'preview' : 'edit')}
				>
					<i class="fas {editorMode === 'edit' ? 'fa-eye' : 'fa-pen'}"></i>
					{editorMode === 'edit' ? m.preview() : m.edit()}
				</button>
			</div>
		{/if}

		<!-- Resolution Editor -->
		<div class="py-2">
			{#if wsForbidden}
				<div class="alert alert-warning my-4">
					<i class="fa-solid fa-triangle-exclamation"></i>
					<span>{m.collabSessionExpired()}</span>
					<button class="btn btn-sm" onclick={() => location.reload()}>
						{m.reload()}
					</button>
				</div>
			{:else if !wsSynced}
				<div class="flex items-center justify-center gap-2 py-12 text-base-content/60">
					<span class="loading loading-spinner loading-sm"></span>
					<span class="text-sm">
						{wsConnected ? m.synchronizing() : m.connecting()}
					</span>
				</div>
			{:else if store && resolution}
				<ResolutionEditor
					{store}
					presence={presence ?? undefined}
					{headerData}
					labels={getResolutionLabels()}
					editable={canEdit && editorMode === 'edit'}
					amendments={paper.status === 'AMENDMENT_PHASE' ? amendmentOverlays : undefined}
					rejectedClauseIds={paper.status === 'VOTING_PHASE' || paper.status === 'FINAL'
						? rejectedClauseIds
						: undefined}
					onAmendmentClick={paper.status === 'AMENDMENT_PHASE' ? handleAmendmentClick : undefined}
				>
					{#snippet preambleAnnotations({ clause })}
						{@const commentCount = commentCountByClauseId.get(clause.id) ?? 0}
						{#each presence?.editorsFor(clause.id) ?? [] as editor (editor.user.id)}
							<span
								class="badge badge-sm text-white"
								style="background-color: {editor.user.color ?? '#888'}"
							>
								{editor.user.name}
							</span>
						{/each}
						{#if commentCount > 0}
							<div class="badge badge-sm badge-info">
								<i class="fas fa-comment text-xs"></i>
								{commentCount}
							</div>
						{/if}
					{/snippet}
					{#snippet clauseAnnotations({ clause })}
						{@const commentCount = commentCountByClauseId.get(clause.id) ?? 0}
						{#each presence?.editorsFor(clause.id) ?? [] as editor (editor.user.id)}
							<span
								class="badge badge-sm text-white"
								style="background-color: {editor.user.color ?? '#888'}"
							>
								{editor.user.name}
							</span>
						{/each}
						{#if commentCount > 0}
							<div class="badge badge-sm badge-info">
								<i class="fas fa-comment text-xs"></i>
								{commentCount}
							</div>
						{/if}
					{/snippet}
					{#snippet preambleClauseToolbar({ clause })}
						<CommentSection
							clauseId={clause.id}
							comments={commentsByClauseId.get(clause.id) ?? []}
							{myConferenceUserId}
							canPostTeamOnly={true}
							onCreateComment={(content, visibility, parentCommentId) =>
								onCreateComment(content, visibility, parentCommentId, clause.id)}
							{onUpdateComment}
							{onDeleteComment}
						/>
					{/snippet}
					{#snippet clauseToolbar({ clause })}
						<CommentSection
							clauseId={clause.id}
							comments={commentsByClauseId.get(clause.id) ?? []}
							{myConferenceUserId}
							canPostTeamOnly={true}
							onCreateComment={(content, visibility, parentCommentId) =>
								onCreateComment(content, visibility, parentCommentId, clause.id)}
							{onUpdateComment}
							{onDeleteComment}
						/>
					{/snippet}
					{#snippet afterPreambleClause({ clause })}
						<CommentSection
							clauseId={clause.id}
							comments={commentsByClauseId.get(clause.id) ?? []}
							{myConferenceUserId}
							canPostTeamOnly={true}
							marginIcon
							onCreateComment={(content, visibility, parentCommentId) =>
								onCreateComment(content, visibility, parentCommentId, clause.id)}
							{onUpdateComment}
							{onDeleteComment}
						/>
					{/snippet}
					{#snippet afterOperativeClause({ clause })}
						<CommentSection
							clauseId={clause.id}
							comments={commentsByClauseId.get(clause.id) ?? []}
							{myConferenceUserId}
							canPostTeamOnly={true}
							marginIcon
							onCreateComment={(content, visibility, parentCommentId) =>
								onCreateComment(content, visibility, parentCommentId, clause.id)}
							{onUpdateComment}
							{onDeleteComment}
						/>
					{/snippet}
				</ResolutionEditor>
			{/if}
		</div>

		<!-- Amendment phase controls (Phase 6c) -->
		{#if paper.status === 'AMENDMENT_PHASE'}
			<Fieldset legend={m.currentParagraph()} faIcon="fas fa-list-ol">
				<div class="flex items-center justify-between">
					<span class="font-mono text-lg font-bold">
						OP {currentOpIndex + 1} / {operativeClauses.length}
					</span>
					<div class="flex items-center gap-1">
						<button
							class="btn btn-ghost btn-sm"
							aria-label={m.previousParagraph()}
							disabled={currentOpIndex <= 0}
							onclick={async () => {
								if (!committee) return;
								try {
									const newIndex = currentOpIndex - 1;
									await client.mutate.updateCommittee({
										__args: {
											id: committee.id,
											currentOperativeIndex: newIndex,
											currentOperativeClauseId: operativeClauses[newIndex]?.id ?? null
										},
										id: true
									});
								} catch {
									toast.error(m.saveError());
								}
							}}
						>
							<i class="fas fa-backward"></i>
						</button>
						<button
							class="btn btn-primary btn-sm"
							onclick={handleAdvanceParagraph}
							disabled={currentOpIndex >= operativeClauses.length - 1}
						>
							<i class="fas fa-forward mr-1"></i>
							{m.advanceToNextParagraph()}
						</button>
					</div>
				</div>
			</Fieldset>

			<Fieldset legend={m.amendmentQueue()} faIcon="fas fa-gavel">
				<div class="flex justify-end">
					<button class="btn btn-primary btn-sm" onclick={openChairCreateAmendment}>
						<i class="fas fa-plus mr-1"></i>
						{m.chairCreateAmendment()}
					</button>
				</div>

				{#if sortedSubmittedAmendments.length === 0}
					<p class="text-base-content/50 text-sm">{m.noAmendments()}</p>
				{:else}
					<div class="flex flex-col gap-3">
						{#each groupedAmendments as group (group.label)}
							<div>
								<h4
									class="text-sm font-bold mb-1 {group.index === currentOpIndex
										? 'text-primary'
										: 'opacity-70'}"
								>
									{group.label}
								</h4>
								<div class="flex flex-col gap-2">
									{#each group.amendments as amendment (amendment.id)}
										{@const isActive = amendment.id === activeAmendmentId}
										{@const sponsorCount = amendment.sponsors?.length ?? 0}
										{@const thresholdMet = sponsorCount >= sponsorThresholdNeeded}
										<div
											id="amendment-{amendment.id}"
											class="card card-border bg-base-100 p-3 transition-all {group.index ===
											currentOpIndex
												? 'border-primary border-2'
												: ''} {isActive ? 'ring-2 ring-success bg-success/5' : ''}"
										>
											<div class="flex flex-col gap-2">
												<div class="flex items-center gap-2 flex-wrap">
													<span class="badge badge-sm {getAmendmentTypeBadgeClass(amendment.type)}">
														{amendment.documentNumber ?? getAmendmentTypeLabel(amendment.type)}
													</span>
													{#if amendment.proposer?.representation}
														<div class="flex items-center gap-1 text-sm">
															<Flag representation={amendment.proposer.representation} size="xs" />
															<span>
																{amendment.proposer.representation.name ??
																	getTranslatedCountryNameFromAlpha3Code(
																		amendment.proposer.representation.alpha3Code
																	)}
															</span>
														</div>
													{/if}
													<span
														class="badge badge-xs {thresholdMet
															? 'badge-success'
															: 'badge-warning'}"
													>
														{sponsorCount}/{sponsorThresholdNeeded}
													</span>
													{#if isActive}
														<span class="badge badge-success badge-sm">{m.activeAmendment()}</span>
													{/if}
												</div>

												<!-- Amendment detail preview -->
												{#if amendment.type === 'ALTER_TEXT' && amendment.newContent}
													<div
														class="text-xs text-base-content/70 bg-base-200/50 rounded px-2 py-1"
													>
														<span class="italic">
															{getFirstTextContent(amendment.newContent as OperativeClause).slice(
																0,
																120
															)}{getFirstTextContent(amendment.newContent as OperativeClause)
																.length > 120
																? '…'
																: ''}
														</span>
													</div>
												{:else if amendment.type === 'ALTER_POSITION' && amendment.targetPosition != null}
													<div
														class="text-xs text-base-content/70 bg-base-200/50 rounded px-2 py-1"
													>
														<i class="fas fa-arrow-right mr-1"></i>
														{#if amendment.targetPosition === -1}
															{m.insertAtBeginning()}
														{:else}
															{m.insertAfterPresentation({
																index: String(amendment.targetPosition + 1)
															})}
														{/if}
													</div>
												{:else if amendment.type === 'ADD' && amendment.newContent}
													<div
														class="text-xs text-base-content/70 bg-base-200/50 rounded px-2 py-1"
													>
														<div class="flex flex-col gap-0.5">
															<span>
																<i class="fas fa-arrow-right mr-1"></i>
																{#if amendment.targetPosition === -1}
																	{m.insertAtBeginning()}
																{:else if amendment.targetPosition != null}
																	{m.insertAfterPresentation({
																		index: String(amendment.targetPosition + 1)
																	})}
																{/if}
															</span>
															<span class="italic">
																{getFirstTextContent(amendment.newContent as OperativeClause).slice(
																	0,
																	120
																)}{getFirstTextContent(amendment.newContent as OperativeClause)
																	.length > 120
																	? '…'
																	: ''}
															</span>
														</div>
													</div>
												{/if}

												<!-- Sponsors -->
												<div class="flex items-center gap-1 flex-wrap">
													{#each amendment.sponsors ?? [] as sponsor (sponsor.id)}
														<div
															class="group relative tooltip tooltip-bottom"
															data-tip={getRepresentationName(
																sponsor.committeeMember?.representation
															)}
														>
															<Flag
																representation={sponsor.committeeMember?.representation}
																size="xs"
															/>
															<button
																class="absolute -top-1 -right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
																aria-label={m.removeSponsor()}
																onclick={() =>
																	handleRemoveAmendmentSponsor(
																		amendment.id,
																		sponsor.committeeMemberId
																	)}
															>
																<i class="fas fa-times text-[0.5rem]"></i>
															</button>
														</div>
													{/each}
													<button
														class="btn btn-ghost btn-xs"
														aria-label={m.addSponsor()}
														onclick={() => {
															amendmentSponsorTargetId = amendment.id;
															amendmentSponsorSearchQuery = '';
															showAmendmentSponsorModal = true;
														}}
													>
														<i class="fas fa-plus"></i>
													</button>
												</div>

												<!-- Actions: two rows -->
												<div class="flex flex-col gap-1">
													<div class="flex items-center gap-1 justify-end">
														<button
															class="btn btn-xs {isActive ? 'btn-ghost' : 'btn-success'}"
															onclick={() =>
																handleSetActiveAmendment(isActive ? null : amendment.id)}
														>
															<i class="fas {isActive ? 'fa-stop' : 'fa-play'}"></i>
															{#if !isActive}{m.setActiveAmendment()}{/if}
														</button>
														<button
															class="btn btn-primary btn-xs"
															onclick={() => handleAmendmentVote(amendment)}
														>
															<i class="fas fa-box-ballot"></i>
															{m.startVote()}
														</button>
													</div>
													<div class="flex items-center gap-1 justify-end">
														<button
															class="btn btn-soft btn-success btn-xs"
															onclick={() => {
																confirmAmendmentId = amendment.id;
																showAdoptConfirmModal = true;
															}}
														>
															{m.adoptByConsensus()}
														</button>
														<button
															class="btn btn-soft btn-error btn-xs"
															onclick={() => {
																confirmAmendmentId = amendment.id;
																showRejectConfirmModal = true;
															}}
														>
															{m.amendmentRejected()}
														</button>
														<button
															class="btn btn-soft btn-xs"
															onclick={() => openEditAmendment(amendment)}
														>
															<i class="fas fa-pen"></i>
															{m.edit()}
														</button>
														<button
															class="btn btn-ghost btn-xs"
															onclick={() => handleWithdrawAmendment(amendment.id)}
														>
															{m.withdrawAmendment()}
														</button>
													</div>
												</div>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</Fieldset>

			<!-- Start Voting Phase button -->
			<div class="flex justify-end mt-2">
				<button class="btn btn-accent btn-sm" onclick={() => (showStartVotingPhaseModal = true)}>
					<i class="fas fa-vote-yea mr-1"></i>
					{m.startVotingPhase()}
				</button>
			</div>
		{/if}

		<!-- Voting Phase controls (Phase 7) -->
		{#if paper.status === 'VOTING_PHASE'}
			<!-- Paragraph Voting -->
			<Fieldset legend={m.paragraphVoting()} faIcon="fas fa-list-ol">
				<div class="flex items-center justify-between mb-3">
					<span class="font-mono text-lg font-bold">
						OP {currentOpIndex + 1} / {operativeClauses.length}
					</span>
					<span class="text-sm opacity-60">
						{m.clausesVoted({
							voted: String(votedClauseCount),
							total: String(operativeClauses.length)
						})}
					</span>
				</div>

				<!-- Nav buttons -->
				<div class="flex items-center gap-2 mb-3">
					<button
						class="btn btn-ghost btn-sm"
						disabled={currentOpIndex <= 0}
						onclick={() => navigateToVotingClause(currentOpIndex - 1)}
					>
						<i class="fas fa-chevron-left mr-1"></i>
						{m.previousParagraph()}
					</button>
					<button
						class="btn btn-ghost btn-sm"
						disabled={currentOpIndex >= operativeClauses.length - 1}
						onclick={() => navigateToVotingClause(currentOpIndex + 1)}
					>
						{m.nextParagraph()}
						<i class="fas fa-chevron-right ml-1"></i>
					</button>
				</div>

				<!-- Current clause vote status -->
				{@const currentClause = operativeClauses[currentOpIndex]}
				{#if currentClause}
					{@const existingVote = clauseVoteMap.get(currentClause.id)}
					{#if existingVote}
						<!-- Already voted -->
						<div
							class="alert {existingVote.outcome === 'ADOPTED'
								? 'alert-success'
								: 'alert-error'} mb-2"
						>
							<i
								class="fas {existingVote.outcome === 'ADOPTED'
									? 'fa-check-circle'
									: 'fa-times-circle'}"
							></i>
							<span>
								OP {currentOpIndex + 1}:
								<strong>
									{existingVote.outcome === 'ADOPTED' ? m.adopted() : m.rejected()}
								</strong>
								— {m.votesFor()}: {existingVote.votesFor} | {m.votesAgainst()}: {existingVote.votesAgainst}
								{#if existingVote.votesAbstain > 0}
									| {m.votesAbstain()}: {existingVote.votesAbstain}
								{/if}
							</span>
							<button
								class="btn btn-ghost btn-xs"
								onclick={() => handleDeleteClauseVote(currentClause.id)}
							>
								<i class="fas fa-undo mr-1"></i>
								{m.undoVote()}
							</button>
						</div>
					{:else}
						<!-- Quick vote form -->
						<div class="rounded-lg bg-base-200 p-3">
							<p class="text-sm font-medium mb-2">
								{m.voteOnParagraph({ index: String(currentOpIndex + 1) })}
							</p>
							<button class="btn btn-accent btn-sm" onclick={handleClauseVote}>
								<i class="fas fa-box-ballot mr-1"></i>
								{m.startVote()}
							</button>
						</div>
					{/if}
				{/if}
			</Fieldset>

			<!-- Clause Vote Summary -->
			<Fieldset legend={m.clauseVoteSummary()} faIcon="fas fa-clipboard-check">
				<div class="flex flex-col gap-1">
					{#each operativeClauses as clause, i (clause.id)}
						{@const vote = clauseVoteMap.get(clause.id)}
						<button
							class="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-base-200 transition-colors text-left {i ===
							currentOpIndex
								? 'bg-base-200 font-semibold'
								: ''}"
							onclick={() => navigateToVotingClause(i)}
						>
							<span class="font-mono w-12">OP {i + 1}</span>
							{#if vote}
								<span
									class="badge badge-xs {vote.outcome === 'ADOPTED'
										? 'badge-success'
										: 'badge-error'}"
								>
									{vote.outcome === 'ADOPTED' ? m.adopted() : m.rejected()}
								</span>
							{:else}
								<span class="badge badge-xs badge-ghost">—</span>
							{/if}
						</button>
					{/each}
				</div>
			</Fieldset>

			<!-- Final Vote -->
			<Fieldset legend={m.finalVote()} faIcon="fas fa-gavel">
				{#if voteResult}
					<div
						class="alert {voteResult.outcome === 'ADOPTED'
							? 'alert-success'
							: voteResult.outcome === 'REJECTED'
								? 'alert-error'
								: 'alert-warning'}"
					>
						<i
							class="fas {voteResult.outcome === 'ADOPTED'
								? 'fa-check-circle'
								: voteResult.outcome === 'REJECTED'
									? 'fa-times-circle'
									: 'fa-undo'}"
						></i>
						<span>
							<strong>
								{voteResult.outcome === 'ADOPTED'
									? m.adopted()
									: voteResult.outcome === 'REJECTED'
										? m.rejected()
										: m.sentBack()}
							</strong>
							— {m.votesFor()}: {voteResult.votesFor} | {m.votesAgainst()}: {voteResult.votesAgainst}
							{#if voteResult.votesAbstain > 0}
								| {m.votesAbstain()}: {voteResult.votesAbstain}
							{/if}
						</span>
					</div>
				{:else}
					<p class="text-sm opacity-60 mb-3">{m.finalVoteDescription()}</p>
					<button class="btn btn-accent btn-sm" onclick={handleFinalVoteCall}>
						<i class="fas fa-box-ballot mr-1"></i>
						{m.startVote()}
					</button>
				{/if}
			</Fieldset>
		{/if}

		<!-- Per-paragraph results when FINAL -->
		{#if paper.status === 'FINAL' && (clauseVotes ?? []).length > 0}
			<Fieldset legend={m.clauseVoteSummary()} faIcon="fas fa-clipboard-check">
				<div class="flex flex-col gap-1">
					{#each operativeClauses as clause, i (clause.id)}
						{@const vote = clauseVoteMap.get(clause.id)}
						<div class="flex items-center gap-2 px-2 py-1 text-sm">
							<span class="font-mono w-12">OP {i + 1}</span>
							{#if vote}
								<span
									class="badge badge-xs {vote.outcome === 'ADOPTED'
										? 'badge-success'
										: 'badge-error'}"
								>
									{vote.outcome === 'ADOPTED' ? m.adopted() : m.rejected()}
								</span>
								<span class="text-xs opacity-60">
									{vote.votesFor}/{vote.votesAgainst}
									{#if vote.votesAbstain > 0}/{vote.votesAbstain}{/if}
								</span>
							{:else}
								<span class="badge badge-xs badge-ghost">—</span>
							{/if}
						</div>
					{/each}
					{#if voteResult}
						<div class="divider my-1"></div>
						<div class="flex items-center gap-2 px-2 py-1 text-sm font-semibold">
							<span class="w-12">{m.finalVote()}</span>
							<span
								class="badge badge-xs {voteResult.outcome === 'ADOPTED'
									? 'badge-success'
									: voteResult.outcome === 'REJECTED'
										? 'badge-error'
										: 'badge-warning'}"
							>
								{voteResult.outcome === 'ADOPTED'
									? m.adopted()
									: voteResult.outcome === 'REJECTED'
										? m.rejected()
										: m.sentBack()}
							</span>
							<span class="text-xs opacity-60">
								{voteResult.votesFor}/{voteResult.votesAgainst}
								{#if voteResult.votesAbstain > 0}/{voteResult.votesAbstain}{/if}
							</span>
						</div>
					{/if}
				</div>
			</Fieldset>
		{/if}

		<!-- Document-level comments -->
		<Fieldset legend={m.documentLevelComments()} faIcon="fas fa-comments">
			<CommentSection
				clauseId={null}
				comments={commentsByClauseId.get(null) ?? []}
				{myConferenceUserId}
				canPostTeamOnly={true}
				onCreateComment={(content, visibility, parentCommentId) =>
					onCreateComment(content, visibility, parentCommentId, null)}
				{onUpdateComment}
				{onDeleteComment}
			/>
		</Fieldset>
	</div>

	<!-- Add Sponsor Modal -->
	<Modal bind:open={showAddSponsorModal}>
		<div class="flex items-center justify-between mb-4">
			<h3 class="font-bold text-lg">{m.addSponsor()}</h3>
			<button
				class="btn btn-ghost btn-sm"
				aria-label={m.close()}
				onclick={() => (showAddSponsorModal = false)}
			>
				<i class="fas fa-times"></i>
			</button>
		</div>
		<input
			class="input input-bordered w-full mb-3"
			placeholder={m.searchMembers()}
			bind:value={sponsorSearchQuery}
		/>
		<div class="max-h-64 overflow-y-auto space-y-1">
			{#each filteredAvailableMembers as member (member.id)}
				<button
					class="btn btn-ghost btn-sm w-full justify-start gap-2"
					onclick={() => handleAddSponsor(member.id)}
				>
					<Flag representation={member.representation} size="xs" />
					<span>
						{member.representation?.name ??
							getTranslatedCountryNameFromAlpha3Code(member.representation?.alpha3Code)}
					</span>
				</button>
			{/each}
			{#if filteredAvailableMembers.length === 0}
				<p class="text-center text-sm opacity-60 py-4">{m.noResults()}</p>
			{/if}
		</div>
	</Modal>

	<!-- Add Amendment Sponsor Modal -->
	<Modal bind:open={showAmendmentSponsorModal}>
		<div class="flex items-center justify-between mb-4">
			<h3 class="font-bold text-lg">{m.addSponsor()}</h3>
			<button
				class="btn btn-ghost btn-sm"
				aria-label={m.close()}
				onclick={() => (showAmendmentSponsorModal = false)}
			>
				<i class="fas fa-times"></i>
			</button>
		</div>
		<input
			class="input input-bordered w-full mb-3"
			placeholder={m.searchMembers()}
			bind:value={amendmentSponsorSearchQuery}
		/>
		<div class="max-h-64 overflow-y-auto space-y-1">
			{#each filteredAvailableAmendmentMembers as member (member.id)}
				<button
					class="btn btn-ghost btn-sm w-full justify-start gap-2"
					onclick={() => handleAddAmendmentSponsor(member.id)}
				>
					<Flag representation={member.representation} size="xs" />
					<span>
						{member.representation?.name ??
							getTranslatedCountryNameFromAlpha3Code(member.representation?.alpha3Code)}
					</span>
				</button>
			{/each}
			{#if filteredAvailableAmendmentMembers.length === 0}
				<p class="text-center text-sm opacity-60 py-4">{m.noResults()}</p>
			{/if}
		</div>
	</Modal>

	<!-- Adopt by Consensus confirmation modal -->
	<Modal bind:open={showAdoptConfirmModal}>
		<div class="flex flex-col gap-4 p-4">
			<h3 class="text-lg font-bold">{m.adoptByConsensus()}</h3>
			<p>{m.confirmAdoptByConsensus()}</p>
			<div class="flex justify-end gap-2">
				<button
					class="btn btn-ghost btn-sm"
					onclick={() => {
						showAdoptConfirmModal = false;
						confirmAmendmentId = null;
					}}
				>
					{m.abort()}
				</button>
				<button
					class="btn btn-success btn-sm"
					onclick={() => confirmAmendmentId && handleAdoptByConsensus(confirmAmendmentId)}
				>
					{m.yes()}
				</button>
			</div>
		</div>
	</Modal>

	<!-- Reject confirmation modal -->
	<Modal bind:open={showRejectConfirmModal}>
		<div class="flex flex-col gap-4 p-4">
			<h3 class="text-lg font-bold">{m.amendmentRejected()}</h3>
			<p>{m.confirmRejectAmendment()}</p>
			<div class="flex justify-end gap-2">
				<button
					class="btn btn-ghost btn-sm"
					onclick={() => {
						showRejectConfirmModal = false;
						confirmAmendmentId = null;
					}}
				>
					{m.abort()}
				</button>
				<button
					class="btn btn-error btn-sm"
					onclick={() => confirmAmendmentId && handleRejectAmendment(confirmAmendmentId)}
				>
					{m.yes()}
				</button>
			</div>
		</div>
	</Modal>

	<!-- Vote outcome decision modal -->
	<Modal bind:open={showVoteOutcomeModal}>
		<div class="flex flex-col gap-4 p-4">
			<h3 class="text-lg font-bold">{m.voteOutcome()}</h3>
			<div class="flex justify-end gap-2">
				<button class="btn btn-ghost btn-sm" onclick={handleCancelVoteOutcome}>
					{m.abort()}
				</button>
				<button class="btn btn-error btn-sm" onclick={() => handleVoteOutcomeDecision('REJECTED')}>
					{m.amendmentRejected()}
				</button>
				<button class="btn btn-success btn-sm" onclick={() => handleVoteOutcomeDecision('ADOPTED')}>
					{m.amendmentAccepted()}
				</button>
			</div>
		</div>
	</Modal>

	<!-- Start Voting Phase confirmation modal -->
	<Modal bind:open={showStartVotingPhaseModal}>
		<div class="flex flex-col gap-4 p-4">
			<h3 class="text-lg font-bold">{m.startVotingPhase()}</h3>
			<p>{m.confirmStartVotingPhase()}</p>
			<div class="flex justify-end gap-2">
				<button class="btn btn-ghost btn-sm" onclick={() => (showStartVotingPhaseModal = false)}>
					{m.abort()}
				</button>
				<button class="btn btn-accent btn-sm" onclick={handleStartVotingPhase}>
					{m.yes()}
				</button>
			</div>
		</div>
	</Modal>

	<!-- Clause Vote outcome modal -->
	<Modal bind:open={showClauseOutcomeModal}>
		<div class="flex flex-col gap-4 p-4">
			<h3 class="text-lg font-bold">{m.voteOutcome()}</h3>
			<div class="flex justify-end gap-2">
				<button
					class="btn btn-ghost btn-sm"
					onclick={() => {
						showClauseOutcomeModal = false;
						pendingClauseVote = null;
					}}
				>
					{m.abort()}
				</button>
				<button
					class="btn btn-error btn-sm"
					onclick={() => handleClauseOutcomeDecision('REJECTED')}
				>
					{m.rejected()}
				</button>
				<button
					class="btn btn-success btn-sm"
					onclick={() => handleClauseOutcomeDecision('ADOPTED')}
				>
					{m.adopted()}
				</button>
			</div>
		</div>
	</Modal>

	<!-- Final Vote outcome modal -->
	<Modal bind:open={showFinalOutcomeModal}>
		<div class="flex flex-col gap-4 p-4">
			<h3 class="text-lg font-bold">{m.voteOutcome()}</h3>
			<div class="flex justify-end gap-2">
				<button
					class="btn btn-ghost btn-sm"
					onclick={() => {
						showFinalOutcomeModal = false;
						pendingFinalVote = null;
					}}
				>
					{m.abort()}
				</button>
				<button
					class="btn btn-warning btn-sm"
					onclick={() => handleFinalOutcomeDecision('SENT_BACK')}
				>
					{m.sendBack()}
				</button>
				<button class="btn btn-error btn-sm" onclick={() => handleFinalOutcomeDecision('REJECTED')}>
					{m.rejected()}
				</button>
				<button
					class="btn btn-success btn-sm"
					onclick={() => handleFinalOutcomeDecision('ADOPTED')}
				>
					{m.adopted()}
				</button>
			</div>
		</div>
	</Modal>

	<!-- Revert Status confirmation modal -->
	<Modal bind:open={showRevertStatusModal}>
		<div class="flex flex-col gap-4 p-4">
			<h3 class="text-lg font-bold">{m.revertStatus()}</h3>
			<p>
				{m.confirmRevertStatus({
					from: getStatusText(paper.status),
					to: getStatusText(getPreviousStatus(paper.status))
				})}
			</p>

			{#if paper.status === 'AMENDMENT_PHASE'}
				<label class="flex items-start gap-3 cursor-pointer">
					<input
						type="checkbox"
						class="checkbox checkbox-sm mt-0.5"
						bind:checked={revertRestoreSnapshot}
					/>
					<div>
						<div class="font-medium text-sm">{m.restoreContentFromSnapshot()}</div>
						<div class="text-xs opacity-60">{m.restoreContentFromSnapshotDescription()}</div>
					</div>
				</label>
			{/if}

			{#if paper.status === 'VOTING_PHASE'}
				<div class="alert alert-warning text-sm">
					<i class="fas fa-exclamation-triangle"></i>
					{m.revertVotingWarning()}
				</div>
			{/if}

			{#if paper.status === 'DRAFT_RESOLUTION'}
				<div class="alert alert-warning text-sm">
					<i class="fas fa-exclamation-triangle"></i>
					{m.revertDrWarning()}
				</div>
			{/if}

			<div class="flex justify-end gap-2">
				<button class="btn btn-ghost btn-sm" onclick={() => (showRevertStatusModal = false)}>
					{m.abort()}
				</button>
				<button class="btn btn-warning btn-sm" onclick={handleRevertStatus}>
					{m.revertStatus()}
				</button>
			</div>
		</div>
	</Modal>

	<!-- Chair Create Amendment Modal -->
	<CreateAmendmentModal
		bind:open={showChairCreateAmendmentModal}
		{operativeClauses}
		committeeName={committee?.name ?? ''}
		committeeMembers={committee?.members}
		onSubmit={handleChairAmendmentSubmit}
	/>

	<!-- Chair Edit Amendment Modal -->
	{#if editingAmendment}
		<CreateAmendmentModal
			bind:open={showEditAmendmentModal}
			editMode={true}
			{operativeClauses}
			committeeName={committee?.name ?? ''}
			committeeMembers={committee?.members}
			initialType={editingAmendment.type}
			initialTargetIndex={editingAmendment.targetOperativeIndex ?? undefined}
			initialProposerId={editingAmendment.proposerCommitteeMemberId}
			initialNewContent={editingAmendment.newContent as OperativeClause | null}
			initialTargetPosition={editingAmendment.targetPosition ?? null}
			onSubmit={handleEditAmendmentSubmit}
		/>
	{/if}
{/if}
