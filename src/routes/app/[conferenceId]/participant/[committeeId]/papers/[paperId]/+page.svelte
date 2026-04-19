<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import {
		ResolutionEditor,
		migrateResolution,
		type Resolution,
		type ResolutionHeaderData,
		type AmendmentOverlay,
		type OperativeClause
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import Modal from '$lib/components/Modal.svelte';
	import CreateAmendmentModal from '$lib/components/CreateAmendmentModal.svelte';
	import Fieldset from '$lib/components/Fieldset.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import CommentSection from '$lib/components/CommentSection.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import toast from 'svelte-french-toast';
	import { fly, fade } from 'svelte/transition';
	import { getResolutionLabels } from '$lib/utils/resolutionEditorLabels';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';

	const currentUser = await getCurrentUser();
	const [conferenceUser] = await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				conference: { id: page.params.conferenceId },
				user: { id: currentUser?.sub ?? '' }
			}
		},
		id: true,
		conferenceUserType: true,
		committeeMemberId: true
	}) ?? [];

	// Live queries
	const [paper, locks, allComments, allAmendments, clauseVotes, voteResults, committeeData]: [any, any, any, any, any, any, any] = await Promise.all([
		client.liveQuery.resolutionPaper({
			__args: { id: page.params.paperId! },
			id: true,
			title: true,
			status: true,
			content: true,
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
		client.liveQuery.paperClauseLocks({
			__args: { where: { paperId: page.params.paperId } },
			id: true,
			clauseId: true,
			conferenceUserId: true,
			acquiredAt: true,
			conferenceUser: {
				id: true,
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
				title: true
			},
			activeAgendaItem: {
				id: true,
				title: true
			}
		})
	]);

	let committee = $derived(committeeData);

	let role = $derived(conferenceUser?.conferenceUserType);
	let myCommitteeMemberId = $derived(conferenceUser?.committeeMemberId);
	let myConferenceUserId = $derived(conferenceUser?.id);
	let isDelegate = $derived(role === 'DELEGATE');

	// Access control
	let isCreator = $derived(paper?.creatorCommitteeMemberId === myCommitteeMemberId);
	let isEditor = $derived(
		paper?.editors.some((e: any) => e.conferenceUserId === myConferenceUserId)
	);
	let canEdit = $derived((isCreator || isEditor) && paper?.status === 'WORKING_PAPER');
	let canSubmit = $derived(isCreator && paper?.status === 'WORKING_PAPER');
	let canManageShareCodes = $derived(isCreator);
	let canSponsor = $derived(isDelegate);
	let isSponsor = $derived(
		paper?.sponsors.some((s: any) => s.committeeMemberId === myCommitteeMemberId)
	);
	let sortedSponsors = $derived(
		[...(paper?.sponsors ?? [])].sort((a: any, b: any) => {
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

	// Collaborative mode: only enable lock UI when paper has other editors or is beyond working paper
	let collaborativeMode = $derived(
		(paper?.editors?.length ?? 0) > 0 || paper?.status !== 'WORKING_PAPER'
	);

	// Comments: show on SUBMITTED+ papers only (not working papers)
	let showComments = $derived(paper?.status !== 'WORKING_PAPER');

	// Resolution content — initialize from paper data
	let resolution = $state<Resolution | null>(null);
	let hasPendingSave = $state(false);

	$effect(() => {
		if (paper?.content && !resolution) {
			resolution = migrateResolution(paper.content as Resolution);
		}
	});

	// Accept remote updates when no local save is in-flight
	$effect(() => {
		if (paper?.content && !hasPendingSave) {
			resolution = migrateResolution(paper.content as Resolution);
		}
	});

	// Resolution header data for document preview
	let headerData = $derived<ResolutionHeaderData>({
		conferenceTitle: committee?.conference?.title ?? undefined,
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
				(s: any) =>
					getTranslatedCountryNameFromAlpha3Code(s.committeeMember?.representation?.alpha3Code) ??
					s.committeeMember?.representation?.name ??
					''
			)
			.filter(Boolean)
			.sort((a: string, b: string) => a.localeCompare(b)),
		lastEdited: paper?.updatedAt ?? undefined
	});

	onMount(() => {
		// Hybrid heartbeat — only fires when idle with held locks
		const heartbeatInterval = setInterval(() => {
			if (editableClauseIds.size > 0 && canEdit && Date.now() - lastInteractionTime > 25_000) {
				for (const clauseId of editableClauseIds) {
					client.mutate
						.acquireClauseLock({
							__args: { paperId: page.params.paperId!, clauseId },
							id: true
						})
						.catch(() => {
							optimisticMyLockIds.delete(clauseId);
						});
				}
			}
		}, 30_000);

		// Best-effort lock release on tab close
		const handleBeforeUnload = () => {
			if (canEdit) {
				const body = JSON.stringify({
					query: `mutation { releaseAllMyLocks(paperId: "${page.params.paperId}") }`
				});
				navigator.sendBeacon('/api/graphql', new Blob([body], { type: 'application/json' }));
			}
		};
		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			clearInterval(heartbeatInterval);
			window.removeEventListener('beforeunload', handleBeforeUnload);

			// Release locks on navigation
			if (canEdit) {
				client.mutate
					.releaseAllMyLocks({ __args: { paperId: page.params.paperId! } } as any)
					.catch(() => {});
			}
		};
	});

	// =====================================================
	// Clause-level locking
	// =====================================================

	let lastInteractionTime = $state(Date.now());

	// Clause IDs locked by OTHER users
	let lockedClauseIds = $derived.by(() => {
		const set = new SvelteSet<string>();
		for (const lock of locks ?? []) {
			if (lock.conferenceUserId !== myConferenceUserId) {
				set.add(lock.clauseId);
			}
		}
		return set;
	});

	// Clause IDs I hold confirmed locks for
	let myLockedClauseIds = $derived.by(() => {
		const set = new SvelteSet<string>();
		for (const lock of locks ?? []) {
			if (lock.conferenceUserId === myConferenceUserId) {
				set.add(lock.clauseId);
			}
		}
		return set;
	});

	// Map for lock badge rendering: clauseId → lock info
	let locksByClauseId = $derived.by(() => {
		const map = new SvelteMap<string, any>();
		for (const lock of locks ?? []) {
			if (lock.conferenceUserId !== myConferenceUserId) {
				map.set(lock.clauseId, lock);
			}
		}
		return map;
	});

	// Optimistic lock IDs — added immediately on mutation success, before subscription arrives
	let optimisticMyLockIds = new SvelteSet<string>();

	// Effective editable clause IDs = confirmed (subscription) + optimistic
	let editableClauseIds = $derived.by(() => {
		const set = new SvelteSet(myLockedClauseIds);
		for (const id of optimisticMyLockIds) set.add(id);
		return set;
	});

	// Are there any locks held by other users?
	let hasOtherLocks = $derived(lockedClauseIds.size > 0);

	// Click "Start editing" → acquire lock
	async function handleClauseLock(clauseId: string) {
		if (!canEdit || lockedClauseIds.has(clauseId)) return;
		try {
			await client.mutate.acquireClauseLock({
				__args: { paperId: page.params.paperId!, clauseId },
				id: true
			});
			optimisticMyLockIds.add(clauseId);
			lastInteractionTime = Date.now();
		} catch {
			const lock = locksByClauseId.get(clauseId);
			const country =
				lock?.conferenceUser?.committeeMember?.representation?.name ??
				getTranslatedCountryNameFromAlpha3Code(
					lock?.conferenceUser?.committeeMember?.representation?.alpha3Code
				) ??
				'?';
			toast.error(m.lockAcquireFailed({ country }));
		}
	}

	// Click "Done editing" → release lock
	async function handleClauseUnlock(clauseId: string) {
		if (!canEdit) return;
		optimisticMyLockIds.delete(clauseId);
		await client.mutate
			.releaseClauseLock({ __args: { paperId: page.params.paperId!, clauseId } } as any)
			.catch(() => {});
	}

	// Any interaction (typing, clicking) → refresh idle timer
	function handleClauseInteraction(_clauseId: string) {
		lastInteractionTime = Date.now();
	}

	// Auto-save
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let saveTimeout: ReturnType<typeof setTimeout>;

	function handleResolutionChange(updated: Resolution) {
		resolution = updated;
		hasPendingSave = true;
		clearTimeout(saveTimeout);
		saveStatus = 'saving';
		saveTimeout = setTimeout(async () => {
			try {
				await client.mutate.updatePaperContent({
					__args: { paperId: page.params.paperId!, content: updated },
					id: true
				});
				saveStatus = 'saved';
				hasPendingSave = false;
			} catch {
				saveStatus = 'error';
			}
		}, 500);
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
			await client.mutate.softDeletePaper({ __args: { paperId: page.params.paperId! } } as any);
			showDeleteModal = false;
			toast.success(m.paperDeleted());
			goto(`/app/${page.params.conferenceId}/participant/${page.params.committeeId}/papers`);
		} catch {
			toast.error(m.saveError());
		}
	}

	// Sponsor mutations
	async function handleToggleSponsor() {
		if (!myCommitteeMemberId) return;
		try {
			if (isSponsor) {
				await client.mutate.removeSponsor({
					__args: { paperId: page.params.paperId!, committeeMemberId: myCommitteeMemberId }
				} as any);
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
			await client.mutate.deleteShareCode({ __args: { shareCodeId } } as any);
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
		const map = new SvelteMap<string | null, any[]>();
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
		await client.mutate.deleteComment({ __args: { commentId } } as any);
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
			(a: any) => a.proposerCommitteeMemberId === myCommitteeMemberId && a.status === 'SUBMITTED'
		)
	);

	let mySponsoredAmendments = $derived(
		(allAmendments ?? []).filter(
			(a: any) =>
				a.proposerCommitteeMemberId !== myCommitteeMemberId &&
				a.status === 'SUBMITTED' &&
				a.sponsors?.some((s: any) => s.committeeMemberId === myCommitteeMemberId)
		)
	);

	let sponsorThresholdNeeded = $derived(Math.ceil((committee?.totalPresent ?? 0) * 0.1));

	let amendmentOverlays = $derived.by(() => {
		const visible = (allAmendments ?? []).filter(
			(a: any) =>
				a.status === 'SUBMITTED' || a.status === 'CONSENSUS_ADOPTED' || a.status === 'ACCEPTED'
		);
		return visible.map(
			(a: any) =>
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
		newContent: OperativeClause | null;
	}) {
		if (!paper) return;
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

	// =====================================================
	// Clause Votes (Phase 7 — participant view)
	// =====================================================

	let voteResult = $derived((voteResults ?? [])[0] ?? null);

	let rejectedClauseIds = $derived(
		(clauseVotes ?? []).filter((v: any) => v.outcome === 'REJECTED').map((v: any) => v.clauseId)
	);

	let clauseVoteMap = $derived.by(() => {
		const map = new SvelteMap<string, any>();
		for (const v of clauseVotes ?? []) {
			map.set(v.clauseId, v);
		}
		return map;
	});
</script>

<svelte:head>
	<title>{paper?.documentNumber ?? paper?.title ?? m.untitledPaper()} - MUNify CHASE</title>
</svelte:head>

{#if paper}
	<div class="mx-auto flex max-w-4xl flex-col px-4">
		<!-- Back button + save status -->
		<div class="flex items-center justify-between py-2">
			<a
				href="/app/{page.params.conferenceId}/participant/{page.params.committeeId}/papers"
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
					<button class="btn btn-ghost btn-sm text-error" onclick={() => (showDeleteModal = true)}>
						<i class="fas fa-trash"></i>
					</button>
				{/if}
				<a
					href="/app/print/{paper.id}"
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
						{#each sortedSponsors as sponsor}
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
								{#each paper.shareCodes as shareCode}
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
											onclick={() => copyToClipboard(shareCode.code)}
										>
											<i class="fas fa-copy"></i>
										</button>
										<button
											class="btn btn-ghost btn-xs text-error"
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

		<!-- Collaborative editing info banner -->
		{#if canEdit && collaborativeMode && hasOtherLocks}
			<div class="alert alert-info mt-2 text-sm">
				<i class="fas fa-lock"></i>
				<span>{m.collaborativeEditingInfo()}</span>
			</div>
		{/if}

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

		<!-- Resolution Editor -->
		<div class="py-2">
			{#if resolution}
				{@const collab = canEdit && collaborativeMode}
				<ResolutionEditor
					committeeName={committee?.name ?? ''}
					{resolution}
					{headerData}
					labels={getResolutionLabels()}
					editable={canEdit && paper.status !== 'VOTING_PHASE' && paper.status !== 'FINAL'}
					onResolutionChange={handleResolutionChange}
					onClauseLock={collab ? handleClauseLock : undefined}
					onClauseUnlock={collab ? handleClauseUnlock : undefined}
					onClauseInteraction={collab ? handleClauseInteraction : undefined}
					lockedClauseIds={collab ? lockedClauseIds : undefined}
					editableClauseIds={collab ? editableClauseIds : undefined}
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
						{@const lock = locksByClauseId.get(clause.id)}
						{#if lock}
							<div
								class="tooltip tooltip-right"
								data-tip={m.clauseLockedBy({
									country:
										lock.conferenceUser?.committeeMember?.representation?.name ??
										getTranslatedCountryNameFromAlpha3Code(
											lock.conferenceUser?.committeeMember?.representation?.alpha3Code
										) ??
										'?'
								})}
								in:fly={{ y: -6, duration: 200 }}
								out:fade={{ duration: 150 }}
							>
								<div
									class="flex items-center gap-2 rounded-md bg-warning/40 px-2 py-1 text-sm shadow-sm"
								>
									{#if lock.conferenceUser?.committeeMember?.representation}
										<Flag
											representation={lock.conferenceUser.committeeMember.representation}
											size="xs"
										/>
									{/if}
									<i class="fas fa-lock text-warning text-base"></i>
								</div>
							</div>
						{/if}
					{/snippet}
					{#snippet clauseAnnotations({ clause })}
						{@const lock = locksByClauseId.get(clause.id)}
						{#if lock}
							<div
								class="tooltip tooltip-right"
								data-tip={m.clauseLockedBy({
									country:
										lock.conferenceUser?.committeeMember?.representation?.name ??
										getTranslatedCountryNameFromAlpha3Code(
											lock.conferenceUser?.committeeMember?.representation?.alpha3Code
										) ??
										'?'
								})}
								in:fly={{ y: -6, duration: 200 }}
								out:fade={{ duration: 150 }}
							>
								<div
									class="flex items-center gap-2 rounded-md bg-warning/40 px-2 py-1 text-sm shadow-sm"
								>
									{#if lock.conferenceUser?.committeeMember?.representation}
										<Flag
											representation={lock.conferenceUser.committeeMember.representation}
											size="xs"
										/>
									{/if}
									<i class="fas fa-lock text-warning text-base"></i>
								</div>
							</div>
						{/if}
					{/snippet}
					{#snippet preambleClauseToolbar({ clause })}
						{#if showComments}
							<CommentSection
								paperId={page.params.paperId!}
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
								paperId={page.params.paperId!}
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
								paperId={page.params.paperId!}
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
					{#snippet afterOperativeClause({ clause, index })}
						{#if showComments && !canEdit}
							<CommentSection
								paperId={page.params.paperId!}
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
					<div class="flex flex-col gap-2">
						{#each myAmendments as amendment (amendment.id)}
							{@const sponsorCount = amendment.sponsors?.length ?? 0}
							{@const isActive = amendment.id === activeAmendmentId}
							<div
								id="amendment-{amendment.id}"
								class="card card-border bg-base-100 p-3 {isActive
									? 'ring-2 ring-success bg-success/5'
									: ''}"
							>
								<div class="flex flex-col gap-2">
									<div class="flex items-center gap-2 flex-wrap">
										<span class="badge badge-sm {getAmendmentTypeBadgeClass(amendment.type)}">
											{amendment.documentNumber ?? getAmendmentTypeLabel(amendment.type)}
										</span>
										<span class="badge badge-ghost badge-sm">
											{getAmendmentStatusLabel(amendment.status)}
										</span>
										{#if amendment.targetClauseId || amendment.targetOperativeIndex != null}
											{@const resolvedOpIdx = amendment.targetClauseId
												? operativeClauses.findIndex((c) => c.id === amendment.targetClauseId)
												: (amendment.targetOperativeIndex ?? -1)}
											{#if resolvedOpIdx >= 0}
												<span class="badge badge-ghost badge-sm font-mono">
													OP {resolvedOpIdx + 1}
												</span>
											{/if}
										{/if}
										{#if isActive}
											<span class="badge badge-success badge-sm">{m.activeAmendment()}</span>
										{/if}
									</div>

									<!-- Sponsor progress -->
									<div class="flex items-center gap-2">
										<progress
											class="progress progress-primary w-full"
											value={sponsorCount}
											max={sponsorThresholdNeeded}
										></progress>
										<span class="text-xs whitespace-nowrap">
											{m.sponsorThreshold({
												current: String(sponsorCount),
												needed: String(sponsorThresholdNeeded),
												percent: '10'
											})}
										</span>
									</div>
								</div>
							</div>
						{/each}

						{#each mySponsoredAmendments as amendment (amendment.id)}
							{@const isActive = amendment.id === activeAmendmentId}
							<div
								id="amendment-{amendment.id}"
								class="card card-border bg-base-100 p-3 {isActive
									? 'ring-2 ring-success bg-success/5'
									: ''}"
							>
								<div class="flex items-center justify-between gap-2">
									<div class="flex items-center gap-2 flex-wrap">
										<span class="badge badge-sm {getAmendmentTypeBadgeClass(amendment.type)}">
											{amendment.documentNumber ?? getAmendmentTypeLabel(amendment.type)}
										</span>
										{#if amendment.targetClauseId || amendment.targetOperativeIndex != null}
											{@const resolvedOpIdx = amendment.targetClauseId
												? operativeClauses.findIndex((c) => c.id === amendment.targetClauseId)
												: (amendment.targetOperativeIndex ?? -1)}
											{#if resolvedOpIdx >= 0}
												<span class="badge badge-ghost badge-sm font-mono">
													OP {resolvedOpIdx + 1}
												</span>
											{/if}
										{/if}
										{#if isActive}
											<span class="badge badge-success badge-sm">{m.activeAmendment()}</span>
										{/if}
										{#if amendment.proposer?.representation}
											<div class="flex items-center gap-1 text-sm">
												<Flag representation={amendment.proposer.representation} size="xs" />
												<span class="text-xs">
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
								</div>
							</div>
						{/each}
					</div>
				</Fieldset>
			{/if}

			<!-- Submitted amendments from others that I can sponsor -->
			{@const otherPendingAmendments = (allAmendments ?? []).filter(
				(a: any) =>
					a.status === 'SUBMITTED' &&
					a.proposerCommitteeMemberId !== myCommitteeMemberId &&
					!a.sponsors?.some((s: any) => s.committeeMemberId === myCommitteeMemberId)
			)}
			{#if otherPendingAmendments.length > 0 && isDelegate && committee?.amendmentSponsoringOpen}
				<Fieldset legend={m.amendments()} faIcon="fas fa-handshake">
					<div class="flex flex-col gap-2">
						{#each otherPendingAmendments as amendment (amendment.id)}
							<div class="card card-border bg-base-100 p-3">
								<div class="flex items-center justify-between gap-2">
									<div class="flex items-center gap-2 flex-wrap">
										<span class="badge badge-sm {getAmendmentTypeBadgeClass(amendment.type)}">
											{amendment.documentNumber ?? getAmendmentTypeLabel(amendment.type)}
										</span>
										{#if amendment.targetClauseId || amendment.targetOperativeIndex != null}
											{@const resolvedOpIdx = amendment.targetClauseId
												? operativeClauses.findIndex((c) => c.id === amendment.targetClauseId)
												: (amendment.targetOperativeIndex ?? -1)}
											{#if resolvedOpIdx >= 0}
												<span class="badge badge-ghost badge-sm font-mono">
													OP {resolvedOpIdx + 1}
												</span>
											{/if}
										{/if}
										{#if amendment.proposer?.representation}
											<div class="flex items-center gap-1 text-sm">
												<Flag representation={amendment.proposer.representation} size="xs" />
											</div>
										{/if}
										<span class="text-xs">
											{amendment.sponsors?.length ?? 0}/{sponsorThresholdNeeded}
										</span>
									</div>
									<button
										class="btn btn-primary btn-xs"
										onclick={() => handleSponsorAmendment(amendment.id)}
									>
										{m.sponsorAmendment()}
									</button>
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
					paperId={page.params.paperId!}
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
		committeeName={committee?.name ?? ''}
		initialType={initialAmendmentType}
		initialTargetIndex={initialAmendmentTargetIndex}
		onSubmit={handleAmendmentSubmit}
	/>
{/if}
