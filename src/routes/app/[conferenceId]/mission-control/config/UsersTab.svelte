<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import { client } from '#lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '#lib/utils/toast';
	import EditConferenceUserModal from './EditConferenceUserModal.svelte';
	import Flag from '#lib/components/Flag.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '#lib/utils/nationTranslationHelper.svelte';
	import {
		columnFilteringFeature,
		constructTable,
		createFilteredRowModel,
		createPaginatedRowModel,
		createSortedRowModel,
		globalFilteringFeature,
		rowPaginationFeature,
		rowSortingFeature,
		sortFn_alphanumeric,
		sortFn_basic,
		sortFn_text,
		tableFeatures,
		type ColumnDef,
		type SortingState,
		type PaginationState,
		type Updater,
		type FilterFn
	} from '@tanstack/table-core';
	import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings';

	// TanStack Table only provides the features registered here. 'auto' sorting picks
	// among the registered sort functions, so register the ones it uses for text columns.
	// Without a framework adapter the table needs the plain store reactivity bindings.
	const features = tableFeatures({
		coreReactivityFeature: storeReactivityBindings(),
		columnFilteringFeature,
		globalFilteringFeature,
		rowSortingFeature,
		rowPaginationFeature,
		filteredRowModel: createFilteredRowModel(),
		sortedRowModel: createSortedRowModel(),
		paginatedRowModel: createPaginatedRowModel(),
		sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text, basic: sortFn_basic }
	});
	type Features = typeof features;

	interface Props {
		conference: {
			id: string;
			users: ConferenceUserRow[];
			committees: {
				id: string;
				name: string;
				abbreviation: string;
				members: {
					id: string;
					representation: {
						id: string;
						name: string | null;
						alpha2Code: string | null;
						alpha3Code: string | null;
						faIcon: string | null;
					};
				}[];
			}[];
			members: {
				id: string;
				representation: {
					id: string;
					name: string | null;
					alpha3Code: string | null;
					type: string;
					faIcon: string | null;
				};
			}[];
		};
		currentUserEmail: string | undefined;
	}

	interface ConferenceUserRow {
		id: string;
		userEmail: string;
		name: string | null;
		conferenceUserType: string;
		user: { givenName: string; familyName: string } | null;
		committeeMember: {
			id: string;
			representation: {
				id: string;
				name: string | null;
				alpha2Code: string | null;
				alpha3Code: string | null;
				faIcon: string | null;
			};
			committee: { id: string; name: string; abbreviation: string };
		} | null;
		conferenceMember: {
			id: string;
			representation: {
				id: string;
				name: string | null;
				alpha3Code: string | null;
				type: string;
				faIcon: string | null;
			};
		} | null;
	}

	let { conference, currentUserEmail }: Props = $props();

	let conferenceUsers = $derived(conference.users ?? []);

	// Form state
	let bulkEmails = $state('');
	let newRole = $state<'ADMIN' | 'TEAM' | 'SPECTATOR' | 'DELEGATE' | 'NON_STATE_ACTOR'>('TEAM');
	let isBulkSubmitting = $state(false);

	// Modal state
	let editModalOpen = $state(false);
	let editingUser = $state<ConferenceUserRow | null>(null);

	// Table state
	let sorting = $state<SortingState>([]);
	let globalFilter = $state('');
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });

	let committeeMemberAssignmentCounts = $derived(
		conferenceUsers.reduce((map, u) => {
			if (u.committeeMember?.id)
				map.set(u.committeeMember.id, (map.get(u.committeeMember.id) ?? 0) + 1);
			return map;
		}, new Map<string, number>())
	);

	let conferenceMemberAssignmentCounts = $derived(
		conferenceUsers.reduce((map, u) => {
			if (u.conferenceMember?.id)
				map.set(u.conferenceMember.id, (map.get(u.conferenceMember.id) ?? 0) + 1);
			return map;
		}, new Map<string, number>())
	);

	const roleBadgeClass: Record<string, string> = {
		ADMIN: 'badge-error',
		TEAM: 'badge-warning',
		DELEGATE: 'badge-primary',
		NON_STATE_ACTOR: 'badge-secondary',
		SPECTATOR: 'badge-ghost'
	};

	const roleLabel: Record<string, () => string> = {
		ADMIN: () => m.admin(),
		TEAM: () => m.teamMember(),
		DELEGATE: () => m.delegate(),
		NON_STATE_ACTOR: () => m.nonStateActor(),
		SPECTATOR: () => m.spectator()
	};

	function getAssignmentText(user: ConferenceUserRow): string | null {
		if (user.conferenceUserType === 'DELEGATE' && user.committeeMember?.representation) {
			const rep = user.committeeMember.representation;
			return rep.name || getTranslatedCountryNameFromAlpha3Code(rep.alpha3Code);
		}
		if (user.conferenceUserType === 'NON_STATE_ACTOR' && user.conferenceMember?.representation) {
			const rep = user.conferenceMember.representation;
			return rep.name || getTranslatedCountryNameFromAlpha3Code(rep.alpha3Code);
		}
		return null;
	}

	function getAssignmentRepresentation(user: ConferenceUserRow) {
		if (user.conferenceUserType === 'DELEGATE' && user.committeeMember?.representation) {
			return user.committeeMember.representation;
		}
		if (user.conferenceUserType === 'NON_STATE_ACTOR' && user.conferenceMember?.representation) {
			return user.conferenceMember.representation;
		}
		return undefined;
	}

	function isAssignableRole(role: string): boolean {
		return role === 'DELEGATE' || role === 'NON_STATE_ACTOR';
	}

	function getCommitteeText(user: ConferenceUserRow): string {
		return user.committeeMember?.committee?.abbreviation ?? '';
	}

	function getUserDisplayName(user: ConferenceUserRow): string {
		// conferenceUser.name (admin-edited) wins over the OIDC-derived display name
		if (user.name) return user.name;
		const given = user.user?.givenName ?? '';
		const family = user.user?.familyName ?? '';
		const full = `${given} ${family}`.trim();
		return full || '';
	}

	const globalFilterFn: FilterFn<Features, ConferenceUserRow> = (row, _columnId, filterValue) => {
		const search = (filterValue as string).toLowerCase();
		const user = row.original;
		return (
			user.userEmail.toLowerCase().includes(search) ||
			getUserDisplayName(user).toLowerCase().includes(search) ||
			(roleLabel[user.conferenceUserType]?.() ?? user.conferenceUserType)
				.toLowerCase()
				.includes(search) ||
			(getAssignmentText(user) ?? '').toLowerCase().includes(search) ||
			getCommitteeText(user).toLowerCase().includes(search)
		);
	};

	const columns: ColumnDef<Features, ConferenceUserRow>[] = [
		{ accessorKey: 'userEmail', header: 'Email' },
		{ id: 'name', accessorFn: (row) => getUserDisplayName(row), header: 'Name' },
		{ accessorKey: 'conferenceUserType', header: 'Role' },
		{ id: 'committee', accessorFn: (row) => getCommitteeText(row) },
		{ id: 'assignment', accessorFn: (row) => getAssignmentText(row) ?? '', enableSorting: false },
		{ id: 'actions', enableSorting: false }
	];

	function handleSortingChange(updater: Updater<SortingState>) {
		sorting = typeof updater === 'function' ? updater(sorting) : updater;
	}

	function handleGlobalFilterChange(updater: Updater<string>) {
		globalFilter = typeof updater === 'function' ? updater(globalFilter) : updater;
		pagination = { ...pagination, pageIndex: 0 };
	}

	function handlePaginationChange(updater: Updater<PaginationState>) {
		pagination = typeof updater === 'function' ? updater(pagination) : updater;
	}

	function getVisiblePages(current: number, total: number): (number | 'ellipsis')[] {
		if (total <= 7) return Array.from({ length: total }, (_, i) => i);
		const pages: (number | 'ellipsis')[] = [0];
		const start = Math.max(1, current - 1);
		const end = Math.min(total - 2, current + 1);
		if (start > 1) pages.push('ellipsis');
		for (let i = start; i <= end; i++) pages.push(i);
		if (end < total - 2) pages.push('ellipsis');
		pages.push(total - 1);
		return pages;
	}

	// Sorting, search and paging live in this component's state, so the table is rebuilt
	// from it whenever one of them or the data changes
	let table = $derived(
		constructTable({
			features,
			data: conferenceUsers as ConferenceUserRow[],
			columns,
			state: { sorting, globalFilter, pagination },
			onSortingChange: handleSortingChange,
			onGlobalFilterChange: handleGlobalFilterChange,
			onPaginationChange: handlePaginationChange,
			globalFilterFn
		})
	);

	function isCurrentUser(email: string): boolean {
		return currentUserEmail === email;
	}

	function isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function parseEmails(input: string): string[] {
		return input
			.split(/[\n,;]+/)
			.map((email) => email.trim().toLowerCase())
			.filter((email) => email.length > 0 && isValidEmail(email));
	}

	async function addBulkMembers() {
		if (!conference?.id) return;

		const emails = parseEmails(bulkEmails);
		if (emails.length === 0) return;

		isBulkSubmitting = true;
		try {
			for (const email of emails) {
				await toast.promise(
					client.mutate.createConferenceUser({
						__args: {
							conferenceId: conference.id,
							userEmail: email,
							conferenceUserType: newRole
						},
						id: true
					}),
					promiseToastStrings(m.member(), 'add')
				);
			}
			bulkEmails = '';
		} finally {
			isBulkSubmitting = false;
		}
	}

	async function removeMember(id: string) {
		if (!confirm(m.confirmRemoveMember())) return;

		await toast.promise(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- rumble generator types delete mutations as plain `Boolean` instead of callable functions
			(client.mutate.deleteConferenceUser as any)({ __args: { id } } as any),
			promiseToastStrings(m.member(), 'delete')
		);
	}

	function openEditModal(user: ConferenceUserRow) {
		editingUser = user;
		editModalOpen = true;
	}

	async function handleEditSave(saveData: {
		conferenceUserType: 'ADMIN' | 'TEAM' | 'DELEGATE' | 'NON_STATE_ACTOR' | 'SPECTATOR';
		committeeMemberId: string | null;
		conferenceMemberId: string | null;
		name: string | null;
	}) {
		if (!editingUser) return;

		await toast.promise(
			client.mutate.updateConferenceUser({
				__args: {
					id: editingUser.id,
					conferenceUserType: saveData.conferenceUserType,
					committeeMemberId: saveData.committeeMemberId,
					conferenceMemberId: saveData.conferenceMemberId,
					name: saveData.name ?? ''
				},
				id: true
			}),
			promiseToastStrings(m.member(), 'update')
		);
	}
</script>

<BasicCard title={m.conferenceMembers()}>
	<!-- Search input -->
	<div class="mb-4">
		<input
			type="text"
			class="input input-bordered w-full max-w-xs"
			placeholder={m.searchUsers()}
			value={globalFilter}
			oninput={(e) => handleGlobalFilterChange(e.currentTarget.value)}
		/>
	</div>

	<!-- TanStack Table -->
	<div class="overflow-x-auto">
		<table class="table w-full">
			<thead>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<tr>
						{#each headerGroup.headers as header (header.id)}
							<th
								class={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
								onclick={header.column.getToggleSortingHandler()}
							>
								{#if !header.isPlaceholder}
									<div class="flex items-center gap-1">
										{#if header.id === 'userEmail'}
											{m.email()}
										{:else if header.id === 'name'}
											{m.name()}
										{:else if header.id === 'conferenceUserType'}
											{m.role()}
										{:else if header.id === 'committee'}
											{m.committee()}
										{:else if header.id === 'assignment'}
											{m.assignment()}
										{/if}
										{#if header.column.getIsSorted() === 'asc'}
											<i class="fas fa-sort-up text-xs"></i>
										{:else if header.column.getIsSorted() === 'desc'}
											<i class="fas fa-sort-down text-xs"></i>
										{:else if header.column.getCanSort()}
											<i class="fas fa-sort text-base-content/30 text-xs"></i>
										{/if}
									</div>
								{/if}
							</th>
						{/each}
					</tr>
				{/each}
			</thead>
			<tbody>
				{#if table.getRowModel().rows.length === 0}
					<tr>
						<td colspan={columns.length} class="text-base-content/60 text-center">
							{m.noMembers()}
						</td>
					</tr>
				{:else}
					{#each table.getRowModel().rows as row (row.id)}
						{@const user = row.original}
						{@const isSelf = isCurrentUser(user.userEmail)}
						<tr>
							<!-- Email -->
							<td>
								{user.userEmail}
								{#if isSelf}
									<span class="badge badge-sm ml-2">{m.you()}</span>
								{/if}
							</td>
							<!-- Name -->
							<td>
								{getUserDisplayName(user) || '—'}
							</td>
							<!-- Role badge -->
							<td>
								<span class="badge {roleBadgeClass[user.conferenceUserType] ?? 'badge-ghost'}">
									{roleLabel[user.conferenceUserType]?.() ?? user.conferenceUserType}
								</span>
							</td>
							<!-- Committee -->
							<td>
								{#if user.committeeMember?.committee}
									{user.committeeMember.committee.abbreviation}
								{:else}
									<span class="text-base-content/30">&mdash;</span>
								{/if}
							</td>
							<!-- Assignment -->
							<td>
								{#if getAssignmentRepresentation(user)}
									<div class="flex items-center gap-2">
										<Flag representation={getAssignmentRepresentation(user)} size="xs" />
										<span>{getAssignmentText(user)}</span>
									</div>
								{:else if isAssignableRole(user.conferenceUserType)}
									<span class="text-base-content/40 italic">{m.unassigned()}</span>
								{:else}
									<span class="text-base-content/30">&mdash;</span>
								{/if}
							</td>
							<!-- Actions -->
							<td>
								<div class="flex gap-1">
									<button
										class="btn btn-ghost btn-sm"
										onclick={() => openEditModal(user)}
										aria-label={m.edit()}
										disabled={isSelf}
										title={isSelf ? m.youCannotEditYourself() : m.edit()}
									>
										<i class="fas fa-pen text-sm"></i>
									</button>
									<button
										class="btn btn-ghost btn-sm text-error"
										onclick={() => removeMember(user.id)}
										aria-label={m.removeMember()}
										disabled={isSelf}
										title={isSelf ? m.youCannotEditYourself() : m.removeMember()}
									>
										<i class="fas fa-trash text-sm"></i>
									</button>
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	<!-- Pagination -->
	{#if table.getPageCount() > 1}
		<div class="mt-4 flex items-center justify-between">
			<span class="text-base-content/60 text-sm">
				{pagination.pageIndex * pagination.pageSize + 1}–{Math.min(
					(pagination.pageIndex + 1) * pagination.pageSize,
					table.getFilteredRowModel().rows.length
				)} / {table.getFilteredRowModel().rows.length}
			</span>
			<div class="join">
				<button
					class="join-item btn btn-sm"
					onclick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
					aria-label={m.back()}
				>
					<i class="fas fa-chevron-left"></i>
				</button>
				{#each getVisiblePages(pagination.pageIndex, table.getPageCount()) as item, i (item === 'ellipsis' ? `ellipsis-${i}` : item)}
					{#if item === 'ellipsis'}
						<span class="join-item btn btn-sm btn-disabled">…</span>
					{:else}
						<button
							class="join-item btn btn-sm"
							class:btn-active={pagination.pageIndex === item}
							onclick={() => table.setPageIndex(item)}
						>
							{item + 1}
						</button>
					{/if}
				{/each}
				<button
					class="join-item btn btn-sm"
					onclick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
					aria-label={m.forward()}
				>
					<i class="fas fa-chevron-right"></i>
				</button>
			</div>
		</div>
	{/if}

	<!-- Add members fieldset -->
	<fieldset class="fieldset bg-base-200 border-base-300 rounded-box mt-6 border p-4">
		<legend class="fieldset-legend px-2 text-sm font-semibold">{m.addMember()}</legend>
		<div class="flex flex-col gap-4">
			<textarea
				class="textarea textarea-bordered h-24 w-full"
				placeholder={m.bulkEmailPlaceholder()}
				bind:value={bulkEmails}></textarea>
			<div class="flex flex-wrap items-end gap-4">
				<div class="form-control">
					<label class="label" for="role-select">
						<span class="label-text">{m.role()}</span>
					</label>
					<select id="role-select" class="select select-bordered" bind:value={newRole}>
						<option value="ADMIN">{m.admin()}</option>
						<option value="TEAM">{m.teamMember()}</option>
						<option value="SPECTATOR">{m.spectator()}</option>
						<option value="DELEGATE">{m.delegate()}</option>
						<option value="NON_STATE_ACTOR">{m.nonStateActor()}</option>
					</select>
				</div>
				<button
					type="button"
					class="btn btn-primary"
					onclick={addBulkMembers}
					disabled={isBulkSubmitting || !bulkEmails.trim()}
				>
					{#if isBulkSubmitting}
						<span class="loading loading-spinner loading-sm"></span>
					{:else}
						<i class="fas fa-plus"></i>
					{/if}
					{m.addMember()}
				</button>
			</div>
		</div>
	</fieldset>
</BasicCard>

<EditConferenceUserModal
	bind:open={editModalOpen}
	user={editingUser}
	committees={conference.committees ?? []}
	conferenceMembers={conference.members ?? []}
	{committeeMemberAssignmentCounts}
	{conferenceMemberAssignmentCounts}
	onsave={handleEditSave}
/>
