<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';
	import toast from 'svelte-french-toast';
	import { isTeam, type ResolutionViewer } from './paperContext';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import Combobox from '$lib/components/Combobox.svelte';
	import Fuse, { type IFuseOptions } from 'fuse.js';

	interface Props {
		amendmentId: string;
		committeeId: string;
		sponsoringOpen: boolean;
		viewer: ResolutionViewer;
		proposerMemberId: string | null | undefined;
		amendmentStatus: string | null | undefined;
	}

	let {
		amendmentId,
		committeeId,
		sponsoringOpen,
		viewer,
		proposerMemberId,
		amendmentStatus
	}: Props = $props();

	const sponsors = $derived(
		await client.liveQuery.amendmentSponsors({
			__args: { where: { amendment: { id: amendmentId } } },
			id: true,
			amendmentId: true,
			committeeMember: {
				id: true,
				representation: { name: true, alpha2Code: true, alpha3Code: true, faIcon: true, type: true }
			}
		})
	);

	const team = $derived(isTeam(viewer));
	const myMemberId = $derived(viewer.committeeMemberId ?? null);
	const isProposer = $derived(myMemberId != null && myMemberId === proposerMemberId);
	const iSponsor = $derived((sponsors ?? []).find((s) => s.committeeMember?.id === myMemberId));
	const sponsoringActive = $derived(
		amendmentStatus !== 'REJECTED' && amendmentStatus !== 'WITHDRAWN'
	);

	const sortedSponsors = $derived(
		[...(sponsors ?? [])].sort((a, b) => {
			const nameA =
				getTranslatedCountryNameFromAlpha3Code(a.committeeMember?.representation?.alpha3Code) ??
				a.committeeMember?.representation?.name ??
				'';
			const nameB =
				getTranslatedCountryNameFromAlpha3Code(b.committeeMember?.representation?.alpha3Code) ??
				b.committeeMember?.representation?.name ??
				'';
			return nameA.localeCompare(nameB);
		})
	);

	const members = $derived(
		await client.liveQuery.committeeMembers({
			__args: { where: { committee: { id: committeeId } } },
			id: true,
			representation: { name: true, alpha2Code: true, alpha3Code: true, faIcon: true, type: true }
		})
	);

	const getName = (member: (typeof members)[number] | undefined) =>
		getTranslatedCountryNameFromAlpha3Code(member?.representation?.alpha3Code) ??
		member?.representation?.name ??
		'';

	type FuseItem = (typeof members)[number] & { label: string };

	const fuseOptions: IFuseOptions<FuseItem> = {
		keys: ['label'],
		ignoreFieldNorm: true,
		ignoreDiacritics: true,
		shouldSort: true
	};

	const fuse = new Fuse<FuseItem>([], fuseOptions);

	const filterMembers = (allMembers: (typeof members)[number][], search: string) => {
		const notYetSponsor = (mem: (typeof members)[number]) =>
			!(sponsors ?? []).some((s) => s.committeeMember?.id === mem.id);
		if (search.length > 0) {
			fuse.setCollection(
				allMembers.filter(notYetSponsor).map((x) => ({ ...x, label: getName(x) }))
			);
			return fuse.search(search).map((r) => r.item);
		}
		return allMembers.filter(notYetSponsor).sort((a, b) => getName(a).localeCompare(getName(b)));
	};

	let pickValue = $state('');
	let busy = $state(false);

	async function add(committeeMemberId?: string) {
		busy = true;
		try {
			await client.mutate.addAmendmentSponsor({
				__args: { id: nanoid(), amendmentId, committeeMemberId },
				id: true,
				amendmentId: true,
				committeeMember: {
					id: true,
					representation: {
						name: true,
						alpha2Code: true,
						alpha3Code: true,
						faIcon: true,
						type: true
					}
				}
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed');
		} finally {
			busy = false;
		}
	}

	async function addByName() {
		const member = members.find((mem) => getName(mem) === pickValue);
		if (!member) return;
		await add(member.id);
		pickValue = '';
	}

	async function remove(id: string) {
		try {
			await client.mutate.removeAmendmentSponsor({ __args: { id } });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed');
		}
	}
</script>

<div class="border-base-200 mt-2 flex flex-col gap-2 border-t pt-2">
	{#if !sponsors?.length}
		<p class="text-base-content/50 text-xs">{m.noSponsorsYet()}</p>
	{:else}
		<ul class="space-y-1.5">
			{#each sortedSponsors as s (s.id)}
				<li class="flex items-center justify-between gap-2 text-xs">
					<div class="flex items-center gap-1.5">
						<Flag representation={s.committeeMember?.representation} size="xs" />
						<span>
							{getTranslatedCountryNameFromAlpha3Code(
								s.committeeMember?.representation?.alpha3Code
							) ??
								s.committeeMember?.representation?.name ??
								'?'}
						</span>
					</div>
					{#if team || s.committeeMember?.id === myMemberId}
						<button
							class="btn btn-ghost btn-xs"
							aria-label={m.delete()}
							onclick={() => remove(s.id)}
						>
							<i class="fas fa-xmark text-error"></i>
						</button>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}

	{#if !team && !isProposer && myMemberId && sponsoringOpen && sponsoringActive && !iSponsor}
		<button class="btn btn-outline btn-xs self-start" disabled={busy} onclick={() => add()}>
			<i class="fas fa-handshake"></i>
			{m.sponsorAmendment()}
		</button>
	{/if}

	{#if team}
		<Combobox
			bind:value={pickValue}
			options={members}
			filter={filterMembers}
			getStringValue={getName}
			getKey={(mem) => mem.id}
			placeholder={m.selectMember()}
			submit={addByName}
			triggerClass="btn btn-neutral btn-square btn-lg join-item"
		>
			{#snippet ListItem(option)}
				<Flag size="xs" representation={option.representation} />
				<span class="ml-2 flex-1">{getName(option)}</span>
			{/snippet}
			{#snippet AdditionalButtons()}
				<button
					class="btn btn-neutral btn-lg btn-square join-item"
					aria-label={m.addSponsor()}
					disabled={busy || !pickValue}
					onclick={addByName}
				>
					<i class="fas fa-plus"></i>
				</button>
			{/snippet}
		</Combobox>
	{/if}
</div>
