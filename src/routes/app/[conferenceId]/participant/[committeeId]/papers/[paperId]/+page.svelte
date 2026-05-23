<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { client } from '$lib/api/rumbleClient/client';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import {
		ResolutionEditor,
		OperativeParagraphPreview,
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
	import { markupToClause, serializeClause } from '$lib/utils/amendmentMarkup';
	import * as Y from 'yjs';
	import { WebsocketProvider } from 'y-websocket';
	import Modal from '$lib/components/Modal.svelte';
	import CreateAmendmentModal from '$lib/components/CreateAmendmentModal.svelte';
	import Fieldset from '$lib/components/Fieldset.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import CommentSection from '$lib/components/CommentSection.svelte';
	import ResolutionSyncGate from '$lib/components/ResolutionSyncGate.svelte';
	import ConnectionIndicator from '$lib/components/ConnectionIndicator.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import toast from 'svelte-french-toast';
	import { getResolutionLabels } from '$lib/utils/resolutionEditorLabels';
	import { svgToDataUrl } from '$lib/utils/svgToDataUrl';
	import { downloadResolutionTypst, downloadResolutionPdf } from '$lib/utils/resolutionExport';
	import { loadResolutionPhrases } from '$lib/utils/resolutionPhrases';
	import { SvelteMap } from 'svelte/reactivity';

	const currentUser = await getCurrentUser();
	const [conferenceUser] =
		(await client.liveQuery.conferenceUsers({
			__args: {
				where: {
					conference: { id: page.params.conferenceId },
					user: { id: currentUser?.id ?? '' }
				}
			},
			id: true,
			conferenceUserType: true,
			committeeMemberId: true,
			committeeMember: {
				id: true,
				representation: {
					id: true,
					name: true,
					alpha3Code: true
				}
			}
		})) ?? [];

	// Live queries
	const [paper, allComments, allAmendments, clauseVotes, voteResults, committeeData] =
		await Promise.all([
			client.liveQuery.resolutionPaper({
				__args: { id: page.params.paperId! },
				id: true,
				title: true,
				status: true,
				documentNumber: true,
				creatorCommitteeMemberId: true,
				updatedAt: true,
				creator: {
					id: true,
					representation: {
						id: true,
						name: true,
						alpha3Code: true,
						alpha2Code: true,
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
							alpha3Code: true,
							alpha2Code: true,
							faIcon: true
						}
					}
				},
				shareCodes: {
					id: true,
					code: true,
					permission: true
				},
				editors: {
					id: true,
					conferenceUserId: true
				}
			}),
			client.liveQuery.resolutionComments({
				__args: { where: { paperId: page.params.paperId } },
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
				__args: { where: { paperId: page.params.paperId } },
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
				__args: { where: { paperId: page.params.paperId } },
				id: true,
				clauseId: true,
				outcome: true,
				votesFor: true,
				votesAgainst: true,
				votesAbstain: true
			}),
			client.liveQuery.resolutionVoteResults({
				__args: { where: { paperId: page.params.paperId }, limit: 1 },
				id: true,
				outcome: true,
				votesFor: true,
				votesAgainst: true,
				votesAbstain: true
			}),
			client.liveQuery.committee({
				__args: { id: page.params.committeeId! },
				id: true,
				abbreviation: true,
				name: true,
				resolutionHeadline: true,
				supportReEvaluationOpen: true,
				activeDraftResolutionId: true,
				amendmentSubmissionOpen: true,
				amendmentSponsoringOpen: true,
				totalPresent: true,
				currentOperativeIndex: true,
				activeAmendmentId: true,
				conference: {
					id: true,
					title: true,
					logoSvg: true
				},
				activeAgendaItem: {
					id: true,
					title: true
				}
			})
		]);

	// Element types inferred from the selected live query result shapes
	type PaperData = NonNullable<typeof paper>;
	type SponsorEntry = PaperData['sponsors'][number];
	type EditorEntry = PaperData['editors'][number];
	type AmendmentEntry = NonNullable<typeof allAmendments>[number];
	type AmendmentSponsorEntry = AmendmentEntry['sponsors'][number];
	type ClauseVoteEntry = NonNullable<typeof clauseVotes>[number];
	type CommentEntry = NonNullable<typeof allComments>[number];

	let committee = $derived(committeeData);

	let role = $derived(conferenceUser?.conferenceUserType);
	let myCommitteeMemberId = $derived(conferenceUser?.committeeMemberId);
	let myConferenceUserId = $derived(conferenceUser?.id);
	let isDelegate = $derived(role === 'DELEGATE');

	// Access control
	let isCreator = $derived(paper?.creatorCommitteeMemberId === myCommitteeMemberId);
	let isEditor = $derived(
		paper?.editors.some((e: EditorEntry) => e.conferenceUserId === myConferenceUserId)
	);
	let canEdit = $derived((isCreator || isEditor) && paper?.status === 'WORKING_PAPER');
	let canSubmit = $derived(isCreator && paper?.status === 'WORKING_PAPER');
	let canManageShareCodes = $derived(isCreator);
	let canSponsor = $derived(isDelegate);
	let isSponsor = $derived(
		paper?.sponsors.some((s: SponsorEntry) => s.committeeMemberId === myCommitteeMemberId)
	);
	let sortedSponsors = $derived(
		[...(paper?.sponsors ?? [])].sort((a: SponsorEntry, b: SponsorEntry) => {
			const nameA =
				a.committeeMember?.representation?.name ??
				getTranslatedCountryNameFromAlpha3Code(a.committeeMember?.representation?.alpha3Code) ??
				'';
			const nameB =
				b.committeeMember?.representation?.name ??
				getTranslatedCountryNameFromAlpha3Code(b.committeeMember?.representation?.alpha3Code) ??
				'';
			return nameA.localeCompare(nameB);
		})
	);

	let canDelete = $derived(isCreator && paper?.status === 'WORKING_PAPER');

	// DR support: delegate can toggle support during re-evaluation
	let isDrStatus = $derived(
		paper?.status === 'DRAFT_RESOLUTION' ||
			paper?.status === 'AMENDMENT_PHASE' ||
			paper?.status === 'VOTING_PHASE'
	);
	let canToggleDrSupport = $derived(
		isDelegate && isDrStatus && committee?.supportReEvaluationOpen === true
	);

	// Comments: show on SUBMITTED+ papers only (not working papers)
	let showComments = $derived(paper?.status !== 'WORKING_PAPER');

	// Y.js-backed collaborative store
	let store = $state<ResolutionStore | null>(null);
	let presence = $state<PresenceAdapter | null>(null);
	let wsSynced = $state(false);
	let wsConnected = $state(false);
	let wsForbidden = $state(false);
	// Bumped to force a soft re-establish of the Yjs session (no page reload).
	let retryNonce = $state(0);

	let preamblePhrases = $state<string[]>([]);
	let operativePhrases = $state<string[]>([]);
	onMount(async () => {
		const phrases = await loadResolutionPhrases();
		preamblePhrases = phrases.preamble;
		operativePhrases = phrases.operative;
	});

	$effect(() => {
		const paperId = page.params.paperId;
		// `retryNonce < 0` is always false; it exists only to register retryNonce
		// as a reactive dependency so bumping it re-runs this effect, tearing
		// down the old provider via the cleanup return and re-establishing.
		if (!paperId || retryNonce < 0) return;
		// Run the rest untracked: only paperId / retryNonce should re-trigger
		// this effect. Without this, reactive reads inside (currentUser fields,
		// anything else from $state) would cause re-mount loops.
		return untrack(() => establishYjsSession(paperId));
	});

	function establishYjsSession(paperId: string) {
		const doc = new Y.Doc();
		const wsProto = location.protocol === 'https:' ? 'wss:' : 'ws:';
		const wsUrl = `${wsProto}//${location.host}/api/ws/yjs`;
		const prov = new WebsocketProvider(wsUrl, paperId, doc);
		const s = createYjsStore(doc);
		const rep = conferenceUser?.committeeMember?.representation;
		const roleLabel =
			conferenceUser?.conferenceUserType === 'TEAM'
				? 'Team'
				: rep?.name || getTranslatedCountryNameFromAlpha3Code(rep?.alpha3Code) || 'Anonymous';
		const p = createAwarenessPresence({
			awareness: prov.awareness,
			user: {
				id: currentUser?.id ?? 'anon',
				name: roleLabel,
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
		conferenceEmblem: svgToDataUrl(committee?.conference?.logoSvg),
		committeeAbbreviation: committee?.abbreviation ?? undefined,
		committeeFullName: committee?.name ?? undefined,
		committeeResolutionHeadline: committee?.resolutionHeadline ?? undefined,
		documentNumber: paper?.documentNumber?.replace(`${committee?.abbreviation}/`, '') ?? undefined,
		topic: committee?.activeAgendaItem?.title ?? undefined,
		authoringDelegation:
			getTranslatedCountryNameFromAlpha3Code(paper?.creator?.representation?.alpha3Code) ??
			paper?.creator?.representation?.name ??
			undefined,
		sponsoringDelegations: paper?.sponsors
			?.map(
				(s: SponsorEntry) =>
					getTranslatedCountryNameFromAlpha3Code(s.committeeMember?.representation?.alpha3Code) ??
					s.committeeMember?.representation?.name ??
					''
			)
			.filter(Boolean)
			.sort((a: string, b: string) => a.localeCompare(b)),
		lastEdited: paper?.updatedAt ?? undefined
	});

	// Title save status (resolution content is auto-synced via Y.js, no save status needed for it)
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');

	let isExportingPdf = $state(false);
	async function exportPdf() {
		if (!resolution || isExportingPdf) return;
		isExportingPdf = true;
		try {
			await toast.promise(downloadResolutionPdf(resolution, headerData, paper.documentNumber), {
				loading: m.exportPdfLoading(),
				success: m.exportPdfSuccess(),
				error: m.exportPdfError()
			});
		} finally {
			isExportingPdf = false;
		}
	}

	let titleInput = $state('');
	let titleInitialized = $state(false);

	$effect(() => {
		if (paper?.title !== undefined && !titleInitialized) {
			titleInput = paper.title ?? '';
			titleInitialized = true;
		}
	});

	// Title save
	let titleSaveTimeout: ReturnType<typeof setTimeout>;

	function handleTitleChange() {
		if (titleInput === (paper?.title ?? '')) return;
		clearTimeout(titleSaveTimeout);
		saveStatus = 'saving';
		titleSaveTimeout = setTimeout(async () => {
			try {
				await client.mutate.updatePaperTitle({
					__args: { paperId: page.params.paperId!, title: titleInput },
					id: true
				});
				saveStatus = 'saved';
			} catch {
				saveStatus = 'error';
			}
		}, 500);
	}

	// Submit paper
	let showSubmitModal = $state(false);

	async function handleSubmit() {
		try {
			await client.mutate.submitPaper({ __args: { paperId: page.params.paperId! }, id: true });
			showSubmitModal = false;
			toast.success(m.paperSubmitted());
		} catch {
			toast.error(m.saveError());
		}
	}

	// Delete paper
	let showDeleteModal = $state(false);

	async function handleDelete() {
		try {
			// Cast required: rumble generator types scalar-returning mutations as plain types instead of fns
			await (
				client.mutate.softDeletePaper as unknown as (p: {
					__args: { paperId: string };
				}) => Promise<unknown>
			)({ __args: { paperId: page.params.paperId! } });
			showDeleteModal = false;
			toast.success(m.paperDeleted());
			goto(
				resolve('/app/[conferenceId]/participant/[committeeId]/papers', {
					conferenceId: page.params.conferenceId!,
					committeeId: page.params.committeeId!
				})
			);
		} catch {
			toast.error(m.saveError());
		}
	}

	// Sponsor mutations
	async function handleToggleSponsor() {
		if (!myCommitteeMemberId) return;
		try {
			if (isSponsor) {
				await (
					client.mutate.removeSponsor as unknown as (p: {
						__args: { paperId: string; committeeMemberId: string };
					}) => Promise<unknown>
				)({
					__args: { paperId: page.params.paperId!, committeeMemberId: myCommitteeMemberId }
				});
			} else {
				await client.mutate.addSponsor({
					__args: { paperId: page.params.paperId!, committeeMemberId: myCommitteeMemberId },
					id: true
				});
			}
		} catch {
			toast.error(m.saveError());
		}
	}

	// Share code mutations
	async function handleCreateShareCode(permission: 'SPONSOR' | 'EDIT') {
		try {
			await client.mutate.createShareCode({
				__args: { paperId: page.params.paperId!, permission },
				id: true,
				code: true
			});
		} catch {
			toast.error(m.saveError());
		}
	}

	async function handleDeleteShareCode(shareCodeId: string) {
		try {
			await (
				client.mutate.deleteShareCode as unknown as (p: {
					__args: { shareCodeId: string };
				}) => Promise<unknown>
			)({ __args: { shareCodeId } });
		} catch {
			toast.error(m.saveError());
		}
	}

	async function copyToClipboard(text: string) {
		await navigator.clipboard.writeText(text);
		toast.success(m.codeCopied());
	}

	// =====================================================
	// Comments
	// =====================================================

	let commentsByClauseId = $derived.by(() => {
		const map = new SvelteMap<string | null, CommentEntry[]>();
		for (const comment of allComments ?? []) {
			const key = comment.clauseId;
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push(comment);
		}
		return map;
	});

	// Comment mutations
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
				clauseId: clauseId ?? undefined,
				visibility: visibility as 'PUBLIC' | 'TEAM_ONLY',
				parentCommentId: parentCommentId ?? undefined
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
		await (
			client.mutate.deleteComment as unknown as (p: {
				__args: { commentId: string };
			}) => Promise<unknown>
		)({ __args: { commentId } });
		toast.success(m.commentDeleted());
	}

	// Collapsible metadata
	let metadataOpen = $state(true);

	// =====================================================
	// Amendments (Phase 6d)
	// =====================================================

	let currentOpIndex = $derived(committee?.currentOperativeIndex ?? 0);
	let activeAmendmentId = $derived(committee?.activeAmendmentId ?? null);

	let isActiveDr = $derived(paper?.id === committee?.activeDraftResolutionId);

	let showAmendmentUI = $derived(paper?.status === 'AMENDMENT_PHASE' && isActiveDr);

	let operativeClauses = $derived((resolution?.operative ?? []) as OperativeClause[]);

	let myAmendments = $derived(
		(allAmendments ?? []).filter(
			(a: AmendmentEntry) =>
				a.proposerCommitteeMemberId === myCommitteeMemberId && a.status === 'SUBMITTED'
		)
	);

	let mySponsoredAmendments = $derived(
		(allAmendments ?? []).filter(
			(a: AmendmentEntry) =>
				a.proposerCommitteeMemberId !== myCommitteeMemberId &&
				a.status === 'SUBMITTED' &&
				a.sponsors?.some((s: AmendmentSponsorEntry) => s.committeeMemberId === myCommitteeMemberId)
		)
	);

	let sponsorThresholdNeeded = $derived(Math.ceil((committee?.totalPresent ?? 0) * 0.1));

	let amendmentOverlays = $derived.by(() => {
		const visible = (allAmendments ?? []).filter((a: AmendmentEntry) => a.status === 'SUBMITTED');
		return visible.map(
			(a: AmendmentEntry) =>
				({
					id: a.id,
					type: a.type,
					status: a.status,
					targetClauseId: a.targetClauseId ?? undefined,
					targetOperativeIndex: a.targetOperativeIndex ?? undefined,
					targetPosition: a.targetPosition ?? undefined,
					newContent: markupToClause(a.newContent) ?? undefined,
					proposerName:
						a.proposer?.representation?.name ??
						getTranslatedCountryNameFromAlpha3Code(a.proposer?.representation?.alpha3Code),
					sponsorCount: a.sponsors?.length ?? 0,
					isOwnAmendment: a.proposerCommitteeMemberId === myCommitteeMemberId
				}) satisfies AmendmentOverlay
		);
	});

	// Amendment creation modal state
	let showCreateAmendmentModal = $state(false);
	let initialAmendmentType = $state<'DELETE' | 'ADD' | 'ALTER_TEXT' | 'ALTER_POSITION' | undefined>(
		undefined
	);
	let initialAmendmentTargetIndex = $state<number | undefined>(undefined);

	function openCreateAmendment(
		index: number,
		type: 'DELETE' | 'ADD' | 'ALTER_TEXT' | 'ALTER_POSITION'
	) {
		initialAmendmentType = type;
		initialAmendmentTargetIndex = index;
		showCreateAmendmentModal = true;
	}

	async function handleAmendmentSubmit(args: {
		type: 'DELETE' | 'ADD' | 'ALTER_TEXT' | 'ALTER_POSITION';
		targetClauseId: string | null;
		targetOperativeIndex: number | null;
		targetPosition: number | null;
		newContent: string | null;
	}) {
		if (!paper) return;
		try {
			await client.mutate.createAmendment({
				__args: {
					paperId: paper.id,
					type: args.type,
					targetClauseId: args.targetClauseId ?? undefined,
					targetOperativeIndex: args.targetOperativeIndex ?? undefined,
					targetPosition: args.targetPosition ?? undefined,
					newContent: args.newContent ?? undefined
				},
				id: true
			});
			toast.success(m.amendmentCreated());
		} catch {
			toast.error(m.saveError());
		}
	}

	async function handleSponsorAmendment(amendmentId: string) {
		if (!myCommitteeMemberId) return;
		try {
			await client.mutate.addAmendmentSponsor({
				__args: { amendmentId, committeeMemberId: myCommitteeMemberId },
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

	function getAmendmentStatusLabel(status: string) {
		switch (status) {
			case 'PENDING':
				return m.amendmentPending();
			case 'SUBMITTED':
				return m.amendmentSubmitted();
			case 'CONSENSUS_ADOPTED':
				return m.amendmentConsensusAdopted();
			case 'ACCEPTED':
				return m.amendmentAccepted();
			case 'REJECTED':
				return m.amendmentRejected();
			case 'WITHDRAWN':
				return m.amendmentWithdrawn();
			default:
				return status;
		}
	}

	function resolveOpIdx(a: {
		targetClauseId?: string | null;
		targetOperativeIndex?: number | null;
	}): number {
		if (a.targetClauseId) {
			const idx = operativeClauses.findIndex((c) => c.id === a.targetClauseId);
			if (idx !== -1) return idx;
		}
		return a.targetOperativeIndex ?? -1;
	}

	// =====================================================
	// Clause Votes (Phase 7 — participant view)
	// =====================================================

	let voteResult = $derived((voteResults ?? [])[0] ?? null);

	let rejectedClauseIds = $derived(
		(clauseVotes ?? [])
			.filter((v: ClauseVoteEntry) => v.outcome === 'REJECTED')
			.map((v: ClauseVoteEntry) => v.clauseId)
	);

	let clauseVoteMap = $derived.by(() => {
		const map = new SvelteMap<string, ClauseVoteEntry>();
		for (const v of clauseVotes ?? []) {
			map.set(v.clauseId, v);
		}
		return map;
	});
</script>

<svelte:head>
	<title>{paper?.documentNumber ?? paper?.title ?? m.untitledPaper()} - MUNify CHASE</title>
</svelte:head>

{#snippet amendmentDetail(
	amendment: {
		type: string;
		newContent?: unknown;
		targetPosition?: number | null;
	},
	resolvedOpIdx: number
)}
	{#if amendment.type === 'ALTER_TEXT' && typeof amendment.newContent === 'string'}
		{@const origClause = operativeClauses[resolvedOpIdx]}
		<div class="bg-base-200/50 rounded px-2 py-1 text-sm">
			<OperativeParagraphPreview
				markup={amendment.newContent}
				oldMarkup={origClause ? serializeClause(origClause) : undefined}
				showDiff
				showDiffToggle
				operativeNumber={resolvedOpIdx + 1}
				labels={getResolutionLabels()}
			/>
		</div>
	{:else if amendment.type === 'DELETE'}
		<div class="text-xs text-base-content/70 bg-base-200/50 rounded px-2 py-0.5">
			<i class="fas fa-trash mr-1"></i>
			{m.amendmentDelete()}
			{#if resolvedOpIdx >= 0}
				— <span class="font-mono">OP {resolvedOpIdx + 1}</span>
			{/if}
		</div>
	{:else if amendment.type === 'ALTER_POSITION' && amendment.targetPosition != null}
		<div class="text-xs text-base-content/70 bg-base-200/50 rounded px-2 py-0.5">
			<i class="fas fa-arrows-up-down mr-1"></i>
			{#if amendment.targetPosition === -1}
				{m.insertAtBeginning()}
			{:else}
				{m.insertAfterPresentation({ index: String(amendment.targetPosition + 1) })}
			{/if}
		</div>
	{:else if amendment.type === 'ADD' && amendment.newContent}
		{@const addClause = markupToClause(amendment.newContent)}
		<div class="text-xs text-base-content/70 bg-base-200/50 rounded px-2 py-0.5">
			<div class="flex items-baseline gap-1.5">
				<span class="whitespace-nowrap">
					<i class="fas fa-plus mr-1"></i>
					{#if amendment.targetPosition === -1}
						{m.insertAtBeginning()}
					{:else if amendment.targetPosition != null}
						{m.insertAfterPresentation({ index: String(amendment.targetPosition + 1) })}
					{/if}
				</span>
				{#if addClause}
					<span class="italic truncate">
						{getFirstTextContent(addClause).slice(0, 120)}{getFirstTextContent(addClause).length >
						120
							? '…'
							: ''}
					</span>
				{/if}
			</div>
		</div>
	{/if}
{/snippet}

{#if paper}
	<div class="mx-auto flex max-w-4xl flex-col px-4">
		<!-- Back button + save status -->
		<div class="flex items-center justify-between py-2">
			<a
				href={resolve('/app/[conferenceId]/participant/[committeeId]/papers', {
					conferenceId: page.params.conferenceId!,
					committeeId: page.params.committeeId!
				})}
				class="btn btn-ghost btn-sm"
			>
				<i class="fa-duotone fa-arrow-left mr-1"></i>
				{m.back()}
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
				{#if canDelete}
					<button
						class="btn btn-ghost btn-sm text-error"
						aria-label={m.deletePaper()}
						onclick={() => (showDeleteModal = true)}
					>
						<i class="fas fa-trash"></i>
					</button>
				{/if}
				<button
					type="button"
					class="btn btn-ghost btn-sm"
					title={m.downloadTypst()}
					aria-label={m.downloadTypst()}
					disabled={!resolution}
					onclick={() =>
						resolution && downloadResolutionTypst(resolution, headerData, paper.documentNumber)}
				>
					<i class="fas fa-file-code"></i>
				</button>
				<button
					type="button"
					class="btn btn-ghost btn-sm"
					title={m.downloadPdf()}
					aria-label={m.downloadPdf()}
					disabled={!resolution || isExportingPdf}
					onclick={exportPdf}
				>
					{#if isExportingPdf}
						<span class="loading loading-spinner loading-xs"></span>
					{:else}
						<i class="fas fa-file-pdf"></i>
					{/if}
				</button>
			</div>
		</div>

		<!-- Collapsible metadata header -->
		<div class="collapse collapse-arrow bg-base-100 shadow-sm">
			<input type="checkbox" bind:checked={metadataOpen} />
			<div class="collapse-title">
				<div class="flex items-center gap-2">
					{#if paper.documentNumber}
						<span class="font-bold font-mono">{paper.documentNumber}</span>
					{:else}
						<span class="font-bold">{paper.title || m.untitledPaper()}</span>
					{/if}
					<span
						class="badge badge-soft badge-sm {paper.status === 'WORKING_PAPER'
							? 'badge-ghost'
							: paper.status === 'SUBMITTED'
								? 'badge-warning'
								: paper.status === 'DRAFT_RESOLUTION'
									? 'badge-info'
									: paper.status === 'AMENDMENT_PHASE'
										? 'badge-secondary'
										: paper.status === 'VOTING_PHASE'
											? 'badge-accent'
											: 'badge-success'}"
					>
						{paper.status === 'WORKING_PAPER'
							? m.workingPaper()
							: paper.status === 'SUBMITTED'
								? m.submitted()
								: paper.status === 'DRAFT_RESOLUTION'
									? m.draftResolution()
									: paper.status === 'AMENDMENT_PHASE'
										? m.amendmentPhase()
										: paper.status === 'VOTING_PHASE'
											? m.votingPhase()
											: m.finalResolution()}
					</span>
				</div>
			</div>
			<div class="collapse-content flex flex-col gap-4">
				<!-- Title -->
				{#if canEdit}
					<Fieldset legend={m.paperTitle()} faIcon="fas fa-heading">
						<input
							type="text"
							class="input input-sm w-full"
							placeholder={m.untitledPaper()}
							bind:value={titleInput}
							oninput={handleTitleChange}
							onblur={handleTitleChange}
						/>
					</Fieldset>
				{/if}

				<!-- Sponsors -->
				<Fieldset legend={m.sponsors()} faIcon="fas fa-users">
					<div class="flex flex-wrap gap-2">
						{#each sortedSponsors as sponsor (sponsor.id)}
							<div
								class="tooltip tooltip-bottom"
								data-tip={sponsor.committeeMember?.representation?.name ??
									getTranslatedCountryNameFromAlpha3Code(
										sponsor.committeeMember?.representation?.alpha3Code
									)}
							>
								<Flag representation={sponsor.committeeMember?.representation} size="xs" />
							</div>
						{/each}
					</div>
					<p class="text-base-content/50 mt-1 text-xs">
						{m.supporterCount({ count: String(paper.sponsors.length) })}
					</p>
					{#if canSponsor && myCommitteeMemberId && !isDrStatus}
						<!-- WP/Submitted sponsor toggle -->
						<button
							class="btn btn-sm mt-2 {isSponsor ? 'btn-soft btn-error' : 'btn-primary'}"
							onclick={handleToggleSponsor}
						>
							{isSponsor ? m.removeSponsor() : m.sponsorPaper()}
						</button>
					{:else if canToggleDrSupport && myCommitteeMemberId}
						<!-- DR support toggle during re-evaluation -->
						<div class="mt-2 flex items-center gap-2">
							<span class="badge badge-warning animate-pulse badge-sm"
								>{m.supportReEvaluation()}</span
							>
							<button
								class="btn btn-sm {isSponsor ? 'btn-outline' : 'btn-primary'}"
								onclick={handleToggleSponsor}
							>
								{#if isSponsor}
									<i class="fas fa-minus mr-1"></i>
									{m.withdrawSupport()}
								{:else}
									<i class="fas fa-plus mr-1"></i>
									{m.supportDraftResolution()}
								{/if}
							</button>
						</div>
					{/if}
				</Fieldset>

				<!-- Share codes (creator only) -->
				{#if canManageShareCodes}
					<Fieldset legend={m.shareCodes()} faIcon="fas fa-share-nodes">
						{#if paper.shareCodes.length > 0}
							<div class="flex flex-col gap-2">
								{#each paper.shareCodes as shareCode (shareCode.id)}
									<div class="flex items-center gap-2">
										<code class="bg-base-300 rounded px-2 py-1 text-sm font-mono"
											>{shareCode.code}</code
										>
										<span
											class="badge badge-soft badge-sm {shareCode.permission === 'EDIT'
												? 'badge-info'
												: 'badge-primary'}"
										>
											{shareCode.permission === 'EDIT' ? m.editAccess() : m.sponsor()}
										</span>
										<button
											class="btn btn-ghost btn-xs"
											aria-label={m.copyCode()}
											onclick={() => copyToClipboard(shareCode.code)}
										>
											<i class="fas fa-copy"></i>
										</button>
										<button
											class="btn btn-ghost btn-xs text-error"
											aria-label={m.deleteShareCode()}
											onclick={() => handleDeleteShareCode(shareCode.id)}
										>
											<i class="fas fa-trash"></i>
										</button>
									</div>
								{/each}
							</div>
						{/if}
						<div class="mt-2 flex gap-2">
							<button class="btn btn-soft btn-xs" onclick={() => handleCreateShareCode('SPONSOR')}>
								<i class="fas fa-plus mr-1"></i>
								{m.createShareCodeSponsor()}
							</button>
							<button class="btn btn-soft btn-xs" onclick={() => handleCreateShareCode('EDIT')}>
								<i class="fas fa-plus mr-1"></i>
								{m.createShareCodeEdit()}
							</button>
						</div>
					</Fieldset>
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

		<!-- Voting phase indicator -->
		{#if paper.status === 'VOTING_PHASE'}
			<div class="alert alert-info mt-2 text-sm">
				<i class="fas fa-vote-yea"></i>
				<span>{m.votingPhaseActive()}</span>
			</div>
		{/if}

		{#if wsConnected && wsSynced}
			<div class="flex justify-end mt-4">
				<ConnectionIndicator live={true} />
			</div>
		{/if}

		<!-- Resolution Editor -->
		<div class="py-2">
			{#if !(wsSynced && store && resolution) || wsForbidden}
				<ResolutionSyncGate
					connected={wsConnected}
					synced={wsSynced}
					forbidden={wsForbidden}
					onRetry={() => retryNonce++}
				/>
			{:else if store && resolution}
				<ResolutionEditor
					{store}
					presence={presence ?? undefined}
					{headerData}
					labels={getResolutionLabels()}
					{preamblePhrases}
					{operativePhrases}
					editable={canEdit && paper.status !== 'VOTING_PHASE' && paper.status !== 'FINAL'}
					amendments={showAmendmentUI ? amendmentOverlays : undefined}
					rejectedClauseIds={paper.status === 'VOTING_PHASE' || paper.status === 'FINAL'
						? rejectedClauseIds
						: undefined}
					onAmendmentClick={showAmendmentUI ? handleAmendmentClick : undefined}
				>
					{#snippet betweenOperativeClauses({ index })}
						{#if showAmendmentUI && isDelegate && committee?.amendmentSubmissionOpen}
							<div class="flex justify-center py-1">
								<div class="dropdown dropdown-bottom">
									<div tabindex="0" role="button" class="btn btn-ghost btn-xs btn-circle">
										<i class="fas fa-plus text-xs"></i>
									</div>
									<ul
										role="menu"
										tabindex="0"
										class="dropdown-content menu bg-white text-gray-900 rounded-box z-10 w-52 p-2 shadow-lg"
									>
										<li>
											<button onclick={() => openCreateAmendment(index, 'DELETE')}>
												<i class="fas fa-trash text-error"></i>
												{m.deleteClause()}
											</button>
										</li>
										<li>
											<button onclick={() => openCreateAmendment(index, 'ADD')}>
												<i class="fas fa-plus text-success"></i>
												{m.addClause()}
											</button>
										</li>
										<li>
											<button onclick={() => openCreateAmendment(index, 'ALTER_TEXT')}>
												<i class="fas fa-pen text-warning"></i>
												{m.alterText()}
											</button>
										</li>
										<li>
											<button onclick={() => openCreateAmendment(index, 'ALTER_POSITION')}>
												<i class="fas fa-arrows-alt text-info"></i>
												{m.alterPosition()}
											</button>
										</li>
									</ul>
								</div>
							</div>
						{/if}
					{/snippet}
					{#snippet preambleAnnotations({ clause })}
						{#each presence?.editorsFor(clause.id) ?? [] as editor (editor.user.id)}
							<span
								class="badge badge-sm text-white"
								style="background-color: {editor.user.color ?? '#888'}"
							>
								{editor.user.name}
							</span>
						{/each}
					{/snippet}
					{#snippet clauseAnnotations({ clause })}
						{#each presence?.editorsFor(clause.id) ?? [] as editor (editor.user.id)}
							<span
								class="badge badge-sm text-white"
								style="background-color: {editor.user.color ?? '#888'}"
							>
								{editor.user.name}
							</span>
						{/each}
					{/snippet}
					{#snippet preambleClauseToolbar({ clause })}
						{#if showComments}
							<CommentSection
								clauseId={clause.id}
								comments={commentsByClauseId.get(clause.id) ?? []}
								{myConferenceUserId}
								canPostTeamOnly={false}
								readonly
								onCreateComment={(content, visibility, parentCommentId) =>
									onCreateComment(content, visibility, parentCommentId, clause.id)}
								{onUpdateComment}
								{onDeleteComment}
							/>
						{/if}
					{/snippet}
					{#snippet clauseToolbar({ clause })}
						{#if showComments}
							<CommentSection
								clauseId={clause.id}
								comments={commentsByClauseId.get(clause.id) ?? []}
								{myConferenceUserId}
								canPostTeamOnly={false}
								readonly
								onCreateComment={(content, visibility, parentCommentId) =>
									onCreateComment(content, visibility, parentCommentId, clause.id)}
								{onUpdateComment}
								{onDeleteComment}
							/>
						{/if}
					{/snippet}
					{#snippet afterPreambleClause({ clause })}
						{#if showComments && !canEdit}
							<CommentSection
								clauseId={clause.id}
								comments={commentsByClauseId.get(clause.id) ?? []}
								{myConferenceUserId}
								canPostTeamOnly={false}
								readonly
								marginIcon
								onCreateComment={(content, visibility, parentCommentId) =>
									onCreateComment(content, visibility, parentCommentId, clause.id)}
								{onUpdateComment}
								{onDeleteComment}
							/>
						{/if}
					{/snippet}
					{#snippet afterOperativeClause({ clause })}
						{#if showComments && !canEdit}
							<CommentSection
								clauseId={clause.id}
								comments={commentsByClauseId.get(clause.id) ?? []}
								{myConferenceUserId}
								canPostTeamOnly={false}
								readonly
								marginIcon
								onCreateComment={(content, visibility, parentCommentId) =>
									onCreateComment(content, visibility, parentCommentId, clause.id)}
								{onUpdateComment}
								{onDeleteComment}
							/>
						{/if}
					{/snippet}
				</ResolutionEditor>
			{/if}
		</div>

		<!-- Amendment phase UI -->
		{#if showAmendmentUI}
			<!-- Current paragraph indicator -->
			<div class="alert alert-info text-sm">
				<i class="fas fa-list-ol"></i>
				<span
					>{m.currentParagraph()}: <strong class="font-mono">OP {currentOpIndex + 1}</strong></span
				>
			</div>

			<!-- My Amendments -->
			{#if myAmendments.length > 0 || mySponsoredAmendments.length > 0}
				<Fieldset legend={m.myAmendments()} faIcon="fas fa-file-pen">
					<div class="flex flex-col gap-1.5">
						{#each myAmendments as amendment (amendment.id)}
							{@const sponsorCount = amendment.sponsors?.length ?? 0}
							{@const isActive = amendment.id === activeAmendmentId}
							{@const resolvedOpIdx = resolveOpIdx(amendment)}
							<div
								id="amendment-{amendment.id}"
								class="card card-border bg-base-100 px-2 py-1.5 {isActive
									? 'ring-1 ring-success bg-success/5'
									: ''}"
							>
								<div class="flex flex-col gap-1.5">
									<div class="flex items-center gap-1.5 flex-wrap">
										<span class="badge badge-xs {getAmendmentTypeBadgeClass(amendment.type)}">
											{amendment.documentNumber ?? getAmendmentTypeLabel(amendment.type)}
										</span>
										<span class="badge badge-ghost badge-xs">
											{getAmendmentStatusLabel(amendment.status)}
										</span>
										{#if resolvedOpIdx >= 0}
											<span class="badge badge-ghost badge-xs font-mono">
												OP {resolvedOpIdx + 1}
											</span>
										{/if}
										{#if isActive}
											<span class="badge badge-xs badge-success">
												<i class="fas fa-circle text-[0.5rem] animate-pulse"></i>
												{m.activeAmendment()}
											</span>
										{/if}
										<span class="flex-1"></span>
										<span class="text-xs whitespace-nowrap opacity-70">
											{m.sponsorThreshold({
												current: String(sponsorCount),
												needed: String(sponsorThresholdNeeded),
												percent: '10'
											})}
										</span>
									</div>

									{@render amendmentDetail(amendment, resolvedOpIdx)}

									<progress
										class="progress progress-primary w-full h-1.5"
										value={sponsorCount}
										max={sponsorThresholdNeeded}
									></progress>
								</div>
							</div>
						{/each}

						{#each mySponsoredAmendments as amendment (amendment.id)}
							{@const isActive = amendment.id === activeAmendmentId}
							{@const resolvedOpIdx = resolveOpIdx(amendment)}
							<div
								id="amendment-{amendment.id}"
								class="card card-border bg-base-100 px-2 py-1.5 {isActive
									? 'ring-1 ring-success bg-success/5'
									: ''}"
							>
								<div class="flex flex-col gap-1.5">
									<div class="flex items-center gap-1.5 flex-wrap">
										<span class="badge badge-xs {getAmendmentTypeBadgeClass(amendment.type)}">
											{amendment.documentNumber ?? getAmendmentTypeLabel(amendment.type)}
										</span>
										{#if resolvedOpIdx >= 0}
											<span class="badge badge-ghost badge-xs font-mono">
												OP {resolvedOpIdx + 1}
											</span>
										{/if}
										{#if isActive}
											<span class="badge badge-xs badge-success">
												<i class="fas fa-circle text-[0.5rem] animate-pulse"></i>
												{m.activeAmendment()}
											</span>
										{/if}
										{#if amendment.proposer?.representation}
											<div class="flex items-center gap-1 text-xs">
												<Flag representation={amendment.proposer.representation} size="xs" />
												<span>
													{m.proposedBy({
														name:
															amendment.proposer.representation.name ??
															getTranslatedCountryNameFromAlpha3Code(
																amendment.proposer.representation.alpha3Code
															) ??
															''
													})}
												</span>
											</div>
										{/if}
									</div>

									{@render amendmentDetail(amendment, resolvedOpIdx)}
								</div>
							</div>
						{/each}
					</div>
				</Fieldset>
			{/if}

			<!-- Submitted amendments from others that I can sponsor -->
			{@const otherPendingAmendments = (allAmendments ?? []).filter(
				(a: AmendmentEntry) =>
					a.status === 'SUBMITTED' &&
					a.proposerCommitteeMemberId !== myCommitteeMemberId &&
					!a.sponsors?.some(
						(s: AmendmentSponsorEntry) => s.committeeMemberId === myCommitteeMemberId
					)
			)}
			{#if otherPendingAmendments.length > 0 && isDelegate && committee?.amendmentSponsoringOpen}
				<Fieldset legend={m.amendments()} faIcon="fas fa-handshake">
					<div class="flex flex-col gap-1.5">
						{#each otherPendingAmendments as amendment (amendment.id)}
							{@const resolvedOpIdx = resolveOpIdx(amendment)}
							<div class="card card-border bg-base-100 px-2 py-1.5">
								<div class="flex flex-col gap-1.5">
									<div class="flex items-center gap-1.5 flex-wrap">
										<span class="badge badge-xs {getAmendmentTypeBadgeClass(amendment.type)}">
											{amendment.documentNumber ?? getAmendmentTypeLabel(amendment.type)}
										</span>
										{#if resolvedOpIdx >= 0}
											<span class="badge badge-ghost badge-xs font-mono">
												OP {resolvedOpIdx + 1}
											</span>
										{/if}
										{#if amendment.proposer?.representation}
											<div class="flex items-center gap-1 text-xs">
												<Flag representation={amendment.proposer.representation} size="xs" />
												<span class="truncate max-w-[10rem]">
													{amendment.proposer.representation.name ??
														getTranslatedCountryNameFromAlpha3Code(
															amendment.proposer.representation.alpha3Code
														)}
												</span>
											</div>
										{/if}
										<span class="badge badge-xs badge-ghost">
											<i class="fas fa-handshake text-[0.6rem]"></i>
											{amendment.sponsors?.length ?? 0}/{sponsorThresholdNeeded}
										</span>
										<span class="flex-1"></span>
										<button
											class="btn btn-primary btn-xs"
											onclick={() => handleSponsorAmendment(amendment.id)}
										>
											{m.sponsorAmendment()}
										</button>
									</div>

									{@render amendmentDetail(amendment, resolvedOpIdx)}
								</div>
							</div>
						{/each}
					</div>
				</Fieldset>
			{/if}
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
		{#if showComments && (commentsByClauseId.get(null)?.length ?? 0) > 0}
			<Fieldset legend={m.documentLevelComments()} faIcon="fas fa-comments">
				<CommentSection
					clauseId={null}
					comments={commentsByClauseId.get(null) ?? []}
					{myConferenceUserId}
					canPostTeamOnly={false}
					readonly
					onCreateComment={(content, visibility, parentCommentId) =>
						onCreateComment(content, visibility, parentCommentId, null)}
					{onUpdateComment}
					{onDeleteComment}
				/>
			</Fieldset>
		{/if}

		<!-- Submit button (creator only, working paper) -->
		{#if canSubmit}
			<div class="py-4">
				<button class="btn btn-primary w-full" onclick={() => (showSubmitModal = true)}>
					<i class="fas fa-paper-plane mr-2"></i>
					{m.submitToChair()}
				</button>
			</div>
		{/if}
	</div>

	<!-- Submit confirmation modal -->
	<Modal bind:open={showSubmitModal}>
		<div class="flex flex-col gap-4 p-4">
			<h3 class="text-lg font-bold">{m.submitToChair()}</h3>
			<p>{m.confirmSubmitPaper()}</p>
			<div class="flex justify-end gap-2">
				<button class="btn btn-ghost btn-sm" onclick={() => (showSubmitModal = false)}>
					{m.abort()}
				</button>
				<button class="btn btn-primary btn-sm" onclick={handleSubmit}>
					{m.yes()}
				</button>
			</div>
		</div>
	</Modal>

	<!-- Delete confirmation modal -->
	<Modal bind:open={showDeleteModal}>
		<div class="flex flex-col gap-4 p-4">
			<h3 class="text-lg font-bold">{m.deletePaper()}</h3>
			<p>{m.confirmDeletePaper()}</p>
			<div class="flex justify-end gap-2">
				<button class="btn btn-ghost btn-sm" onclick={() => (showDeleteModal = false)}>
					{m.abort()}
				</button>
				<button class="btn btn-error btn-sm" onclick={handleDelete}>
					{m.yes()}
				</button>
			</div>
		</div>
	</Modal>

	<!-- Amendment creation modal -->
	<CreateAmendmentModal
		bind:open={showCreateAmendmentModal}
		{operativeClauses}
		initialType={initialAmendmentType}
		initialTargetIndex={initialAmendmentTargetIndex}
		onSubmit={handleAmendmentSubmit}
	/>
{/if}
