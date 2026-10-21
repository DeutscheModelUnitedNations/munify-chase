<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { registerCommands } from '$lib/commands/registry.svelte';
	import { nanoid } from '$lib/helpers/nanoid';
	import Kbd from '$lib/components/Kbd.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import { m } from '$lib/paraglide/messages';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import { promiseToastStrings } from '$lib/utils/toast';
	import {
		isPendingForSeat,
		isRequestTypeAvailable,
		manualRequestSeatArgs,
		seatAfterEnter,
		typeEnterAction,
		type PendingSeatRequest,
		type SeatKind
	} from '$lib/helpers/requests';
	import Fuse, { type IFuseOptions } from 'fuse.js';
	import toast from 'svelte-french-toast';

	type Representation = {
		name?: string | null;
		alpha2Code?: string | null;
		alpha3Code?: string | null;
		faIcon?: string | null;
		type?: string | null;
	};

	type MemberLike = {
		id: string;
		present?: boolean;
		representation?: Representation | null;
	};

	type RequestTypeLike = {
		id: string;
		name: string;
		faIcon?: string | null;
		priority: number;
		delegatesOnly: boolean;
	};

	interface Props {
		committeeId: string;
		committeeMembers: MemberLike[];
		conferenceMembers: MemberLike[];
		requestTypes: RequestTypeLike[];
		pending: PendingSeatRequest[];
	}

	let { committeeId, committeeMembers, conferenceMembers, requestTypes, pending }: Props = $props();

	// The same split into delegations and NSAs the speakers list makes
	type Seat = MemberLike & { kind: SeatKind };

	let seats = $derived<Seat[]>([
		...committeeMembers.map((x) => ({ ...x, kind: 'committeeMember' as const })),
		...conferenceMembers.map((x) => ({ ...x, kind: 'conferenceMember' as const }))
	]);

	const getName = (seat: MemberLike | undefined) =>
		seat?.representation?.name
			? seat.representation.name
			: getTranslatedCountryNameFromAlpha3Code(seat?.representation?.alpha3Code);

	let seatSearch = $state('');
	let typeSearch = $state('');
	let selectedSeatId = $state<string>();
	let selectedTypeId = $state<string>();
	let seatInput = $state<HTMLInputElement>();
	let typeInput = $state<HTMLInputElement>();

	let selectedSeat = $derived(seats.find((x) => x.id === selectedSeatId));

	const fuseOptions = {
		ignoreFieldNorm: true,
		ignoreDiacritics: true,
		shouldSort: true
	} satisfies IFuseOptions<unknown>;
	const seatFuse = new Fuse<Seat & { label: string }>([], { ...fuseOptions, keys: ['label'] });
	const typeFuse = new Fuse<RequestTypeLike>([], { ...fuseOptions, keys: ['name'] });

	let filteredSeats = $derived.by(() => {
		if (seatSearch.length === 0) {
			return [...seats].sort((a, b) => getName(a).localeCompare(getName(b)));
		}
		seatFuse.setCollection(seats.map((x) => ({ ...x, label: getName(x) })));
		return seatFuse.search(seatSearch).map((result) => result.item);
	});

	let sortedTypes = $derived([...requestTypes].sort((a, b) => a.priority - b.priority));
	let pickableTypes = $derived(
		sortedTypes.filter((rt) => isRequestTypeAvailable(selectedSeat?.kind, rt))
	);
	let selectedType = $derived(pickableTypes.find((rt) => rt.id === selectedTypeId));

	// Without a search the types keep the Admins' order
	let filteredTypes = $derived.by(() => {
		if (typeSearch.length === 0) return pickableTypes;
		typeFuse.setCollection(pickableTypes);
		return typeFuse.search(typeSearch).map((result) => result.item);
	});

	const isPending = (requestTypeId: string) =>
		!!selectedSeat && isPendingForSeat(pending, selectedSeat, requestTypeId);

	let alreadyPending = $derived(!!selectedType && isPending(selectedType.id));
	let canAdd = $derived(!!selectedSeat && !!selectedType && !alreadyPending);

	let emptyTypesMessage = $derived(
		sortedTypes.length === 0
			? m.noRequestTypesForChairs()
			: pickableTypes.length === 0
				? m.noRequestTypesForSeat()
				: m.noResults()
	);

	function reset() {
		selectedSeatId = undefined;
		selectedTypeId = undefined;
		seatSearch = '';
		typeSearch = '';
		seatInput?.focus();
	}

	async function addRequest() {
		if (!canAdd || !selectedSeat || !selectedType) return;
		const seat = selectedSeat;
		await toast.promise(
			client.mutate.createManualRequest({
				__args: {
					id: nanoid(),
					committeeId,
					requestTypeId: selectedType.id,
					...manualRequestSeatArgs(seat)
				},
				id: true
			}),
			promiseToastStrings(getName(seat), 'add')
		);
		reset();
	}

	// Keyboard flow: Alt+R, a few letters of the delegation, Enter, a few letters of
	// the type, Enter, Enter
	function onSeatKeydown(e: KeyboardEvent) {
		if (e.key !== 'Enter') return;
		selectedSeatId = seatAfterEnter(seatSearch, selectedSeatId, filteredSeats[0]?.id);
		typeInput?.focus();
	}

	function onTypeKeydown(e: KeyboardEvent) {
		if (e.key !== 'Enter') return;
		const next = typeEnterAction({
			canAdd,
			search: typeSearch,
			selectedId: selectedTypeId,
			bestMatch: filteredTypes[0]
		});
		if ('select' in next) selectedTypeId = next.select;
		else addRequest();
	}

	registerCommands(() => [
		{
			id: 'requests.add',
			title: m.addRequest,
			group: 'page',
			icon: 'hand',
			shortcut: 'alt+r',
			run: () => seatInput?.focus()
		}
	]);

	const itemClass = (selected: boolean) =>
		`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors ${
			selected ? 'bg-primary text-primary-content' : 'hover:bg-base-200'
		}`;
</script>

{#snippet seatItem(seat: Seat)}
	<li>
		<button
			type="button"
			class={itemClass(seat.id === selectedSeatId)}
			aria-pressed={seat.id === selectedSeatId}
			onclick={() => (selectedSeatId = seat.id)}
		>
			<Flag size="xs" representation={seat.representation} />
			<span class="flex-1 truncate">{getName(seat)}</span>
			{#if seat.present === false}
				<i class="fa-duotone fa-user-xmark opacity-60"></i>
			{/if}
		</button>
	</li>
{/snippet}

{#snippet typeItem(rt: RequestTypeLike)}
	<li>
		<button
			type="button"
			class={itemClass(rt.id === selectedTypeId)}
			aria-pressed={rt.id === selectedTypeId}
			onclick={() => (selectedTypeId = rt.id)}
		>
			<i class="fas fa-{(rt.faIcon ?? 'fa-flag').replace('fa-', '')} w-5 text-center"></i>
			<span class="flex-1 truncate">{rt.name}</span>
			{#if isPending(rt.id)}
				<span class="badge badge-ghost badge-sm">{m.requestAlreadyPending()}</span>
			{/if}
		</button>
	</li>
{/snippet}

<div class="flex flex-col gap-3" data-tour="requests.add">
	<div class="grid gap-4 md:grid-cols-2">
		<div class="flex min-w-0 flex-col gap-2">
			<label class="input w-full">
				<i class="fas fa-magnifying-glass opacity-50"></i>
				<input
					type="search"
					placeholder={m.searchDelegation()}
					bind:value={seatSearch}
					bind:this={seatInput}
					onkeydown={onSeatKeydown}
				/>
				<Kbd hotkey="alt+r" />
			</label>
			<ul class="border-base-300 rounded-box h-72 overflow-y-auto border p-1">
				{#each filteredSeats as seat (seat.id)}
					{@render seatItem(seat)}
				{:else}
					<li class="text-base-content/60 px-3 py-6 text-center text-sm">{m.noResults()}</li>
				{/each}
			</ul>
		</div>

		<div class="flex min-w-0 flex-col gap-2">
			<label class="input w-full">
				<i class="fas fa-magnifying-glass opacity-50"></i>
				<input
					type="search"
					placeholder={m.searchRequestTypes()}
					bind:value={typeSearch}
					bind:this={typeInput}
					onkeydown={onTypeKeydown}
				/>
			</label>
			<ul class="border-base-300 rounded-box h-72 overflow-y-auto border p-1">
				{#each filteredTypes as rt (rt.id)}
					{@render typeItem(rt)}
				{:else}
					<li class="text-base-content/60 px-3 py-6 text-center text-sm">{emptyTypesMessage}</li>
				{/each}
			</ul>
		</div>
	</div>

	<div class="flex flex-wrap items-center justify-end gap-3">
		<p class="text-base-content/60 flex-1 text-sm">
			{#if alreadyPending}
				{m.requestAlreadyPending()}
			{:else if !canAdd}
				{m.selectDelegationForRequest()}
			{/if}
		</p>
		<button type="button" class="btn btn-primary" disabled={!canAdd} onclick={addRequest}>
			<i class="fas fa-plus"></i>
			{m.addRequest()}
		</button>
	</div>
</div>
