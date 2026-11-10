<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import Grid from 'svelte-grid-extended';
	import {
		getPresentationLayoutPreset,
		type PresentationLayoutPresetOptions
	} from '#lib/data/presentationLayoutPresets';
	import UndrawError from '#lib/components/UndrawError.svelte';
	import emptyStreet from '#assets/undraw/empty_street.svg';
	import RegionalGroups from './RegionalGroups.svelte';
	import PresentationInfoTiles from './PresentationInfoTiles.svelte';
	import SpeakersListTile from './SpeakersListTile.svelte';
	import PresentationPaperTiles from './PresentationPaperTiles.svelte';
	import { resolutionPreviewState } from './presentation';
	import { speakersListSelection } from '../../selections';
	import PresentationRollCall from '#lib/components/rollCall/PresentationRollCall.svelte';
	import ShowOfHandsVotingPresentation from '#lib/components/voting/ShowOfHandsVotingPresentation.svelte';
	import RollCallVotingPresentation from '#lib/components/voting/RollCallVotingPresentation.svelte';
	import DeviceBasedVotingPresentation from '#lib/components/voting/DeviceBasedVotingPresentation.svelte';
	import AdoptionConfetti from '#lib/components/AdoptionConfetti.svelte';
	import { sortTranslatedCountries } from '#lib/utils/nationTranslationHelper.svelte';
	import { browser } from '$app/env';
	import { client } from '#lib/api/rumbleClient/client';
	import { latchWhileDisconnected } from '#lib/state/connection.svelte';
	import { page } from '$app/state';
	import { compareRequests, requestRepresentation } from '#lib/helpers/requests';
	import { toggleFullscreen } from '#lib/platform/index';

	const committeeId = page.params.committeeId!;

	const committee = await client.liveQuery.committee({
		__args: { id: committeeId },
		id: true,
		abbreviation: true,
		name: true,
		status: true,
		statusHeadline: true,
		statusUntil: true,
		totalPresent: true,
		simpleMajority: true,
		twoThirdsMajority: true,
		whiteboardContent: true,
		presentationLayout: true,
		presentationRootFontSize: true,
		presentationResolutionFontSize: true,
		displayRegionalGroups: true,
		allowRequests: true,
		presentationShowRequests: true,
		currentOperativeIndex: true,
		activeDraftResolutionId: true,
		activeDraftResolution: { id: true, status: true },
		activeAmendmentId: true,
		activeAmendment: {
			id: true,
			type: true,
			documentNumber: true,
			targetClauseId: true,
			targetOperativeIndex: true,
			targetPosition: true,
			newContent: true,
			proposer: {
				id: true,
				representation: {
					id: true,
					name: true,
					alpha2Code: true,
					alpha3Code: true
				}
			}
		},
		lastResolutionAdoptionDate: true,
		activeAgendaItem: {
			id: true,
			title: true,
			speakersList: speakersListSelection
		},
		members: {
			id: true,
			present: true,
			representation: {
				id: true,
				type: true,
				name: true,
				alpha2Code: true,
				alpha3Code: true,
				regionalGroup: true,
				icon: true
			}
		},
		conference: {
			id: true,
			title: true,
			logoSvg: true,
			uniqueConferenceMembers: {
				id: true,
				representation: {
					id: true,
					type: true,
					name: true,
					alpha2Code: true,
					alpha3Code: true,
					icon: true
				}
			}
		}
	});

	const requesterRepresentationFields = {
		name: true,
		alpha2Code: true,
		alpha3Code: true,
		icon: true,
		type: true
	} as const;

	const pendingRequests = await client.liveQuery.requests({
		__args: {
			where: { committeeId: { eq: committeeId }, status: 'PENDING' },
			orderBy: { createdAt: 'asc' }
		},
		id: true,
		createdAt: true,
		requestType: { id: true, name: true, icon: true, priority: true, showOnPresentation: true },
		committeeMember: { id: true, representation: requesterRepresentationFields },
		conferenceMember: { id: true, representation: requesterRepresentationFields },
		conferenceUser: {
			id: true,
			committeeMember: { id: true, representation: requesterRepresentationFields },
			conferenceMember: { id: true, representation: requesterRepresentationFields }
		}
	});

	// Same order as the chairs' queue
	const presentationRequests = $derived(
		committee?.allowRequests && committee.presentationShowRequests
			? (pendingRequests ?? [])
					.filter((req) => req.requestType?.showOnPresentation)
					.sort(compareRequests)
					.map((req) => ({
						id: req.id,
						requestType: req.requestType,
						representation: requestRepresentation(req)
					}))
			: []
	);

	// A boolean of its own so the layout only changes when the tile appears or
	// disappears, not on every queue update
	const hasPresentationRequests = $derived(presentationRequests.length > 0);

	// The delegations, in the order the roll call goes through them
	const rollCallMembers = $derived(
		(committee?.members ?? [])
			.filter((x) => x.representation?.type === 'DELEGATION')
			.sort((a, b) => sortTranslatedCountries(a.representation!, b.representation!))
	);

	const minAmendmentSponsors = $derived(Math.ceil((committee?.totalPresent ?? 0) * 0.1));

	const activePaperId = $derived(committee?.activeDraftResolutionId ?? null);

	let layout = $derived(
		getPresentationLayoutPreset(
			activePaperId != null
				? 'resolution'
				: ((committee?.presentationLayout as PresentationLayoutPresetOptions) ?? undefined),
			{ showRequests: hasPresentationRequests }
		)
	);

	// Freeze the last-known agenda item while the WS is confirmed disconnected, so a
	// transient network blip doesn't reset the active speaker's timer on the projector.
	const getActiveAgendaItem = latchWhileDisconnected(() => committee?.activeAgendaItem);
	let activeAgendaItem = $derived(getActiveAgendaItem());

	let speakersList = $derived(
		activeAgendaItem?.speakersList.find((x) => x.type === 'SPEAKERS_LIST')
	);

	let commentsList = $derived(
		activeAgendaItem?.speakersList.find((x) => x.type === 'COMMENT_LIST')
	);
	let speakersQueueResizeFn = $state<(() => void) | undefined>(undefined);
	let commentsQueueResizeFn = $state<(() => void) | undefined>(undefined);

	$effect(() => {
		if (!layout || !committee) {
			return;
		}
		resizeQueues();
	});

	const resizeQueues = () => {
		speakersQueueResizeFn?.();
		commentsQueueResizeFn?.();
	};

	$effect(() => {
		if (committee?.presentationRootFontSize) {
			document.documentElement.style.fontSize = `${committee.presentationRootFontSize}px`;
		}
	});

	$effect(() => {
		const handler = (event: MessageEvent) => {
			if (event.source !== window.opener) return;
			if (event.data !== 'toggle-fullscreen') return;
			if (!document.fullscreenElement) {
				document.documentElement.requestFullscreen().catch(() => {});
			} else {
				document.exitFullscreen().catch(() => {});
			}
		};
		window.addEventListener('message', handler);
		return () => window.removeEventListener('message', handler);
	});

	$effect(() => {
		const handler = (event: KeyboardEvent) => {
			if (event.key !== 'F11') return;
			event.preventDefault();
			void toggleFullscreen();
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	});
</script>

<svelte:head>
	<title>{committee?.abbreviation ?? 'N/A'} {m.presentationMode()} - MUNify CHASE</title>
</svelte:head>

{#if committee}
	<main id="main-content" tabindex="-1">
		<Grid
			itemSize={{ height: browser ? window.innerHeight / 16 : 60 }}
			cols={12}
			on:change={resizeQueues}
			collision="none"
		>
			<PresentationInfoTiles
				{layout}
				{committee}
				agendaItemTitle={activeAgendaItem?.title}
				{minAmendmentSponsors}
			/>

			{#if layout.speakersList}
				<SpeakersListTile
					gridProps={layout.speakersList}
					id="speakers-list"
					list={speakersList}
					bind:resizeFn={speakersQueueResizeFn}
				/>
			{/if}

			{#if layout.commentsList}
				<SpeakersListTile
					gridProps={layout.commentsList}
					id="comment-list"
					list={commentsList}
					bind:resizeFn={commentsQueueResizeFn}
				/>
			{/if}

			<PresentationPaperTiles
				{layout}
				{activePaperId}
				resolutionFontSize={committee.presentationResolutionFontSize ?? 16}
				preview={resolutionPreviewState(committee)}
				requests={presentationRequests}
			/>
		</Grid>
	</main>

	<AdoptionConfetti
		lastAdoptionDate={committee.lastResolutionAdoptionDate}
		confettiDurationSec={45}
	/>

	<RegionalGroups
		open={committee.displayRegionalGroups ?? false}
		committeeMembers={committee.members}
	/>

	<PresentationRollCall {committeeId} members={rollCallMembers} />

	<ShowOfHandsVotingPresentation {committeeId} />
	<RollCallVotingPresentation {committeeId} {committee} />
	<DeviceBasedVotingPresentation {committeeId} {committee} />
{:else}
	<UndrawError
		undrawImage={emptyStreet}
		title={m.committeeDoesNotExist()}
		buttonText={m.back()}
		buttonLink="/app"
	/>
{/if}
