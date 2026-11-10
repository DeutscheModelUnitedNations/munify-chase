<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import { client } from '#lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '#lib/utils/toast';
	import EditConferenceUserModal from './EditConferenceUserModal.svelte';
	import UserRow from './UserRow.svelte';
	import SortableHeaderCell from './SortableHeaderCell.svelte';
	import TablePagination from './TablePagination.svelte';
	import AddMembersForm from './AddMembersForm.svelte';
	import {
		assignmentCounts,
		assignmentRepresentation,
		committeeText,
		representationName,
		roleLabel,
		matchesSearch,
		userDisplayName,
		type ConferenceUserRow,
		type RoleType
	} from './conferenceUsers';
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
						icon: string | null;
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
					icon: string | null;
				};
			}[];
		};
		currentUserEmail: string | undefined;
	}

	let { conference, currentUserEmail }: Props = $props();

	let conferenceUsers = $derived(conference.users ?? []);

	// Modal state
	let editModalOpen = $state(false);
	let editingUser = $state<ConferenceUserRow | null>(null);

	// Table state
	let sorting = $state<SortingState>([]);
	let globalFilter = $state('');
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });

	let committeeMemberAssignmentCounts = $derived(
		assignmentCounts(conferenceUsers.map((u) => u.committeeMember?.id))
	);
	let conferenceMemberAssignmentCounts = $derived(
		assignmentCounts(conferenceUsers.map((u) => u.conferenceMember?.id))
	);

	function assignmentText(user: ConferenceUserRow) {
		const representation = assignmentRepresentation(user);
		return representation ? representationName(representation) : '';
	}

	const globalFilterFn: FilterFn<Features, ConferenceUserRow> = (row, _columnId, filterValue) => {
		const user = row.original;
		return matchesSearch({
			search: String(filterValue),
			texts: [
				user.userEmail,
				userDisplayName(user),
				roleLabel(user.conferenceUserType),
				assignmentText(user),
				committeeText(user)
			]
		});
	};

	const columnLabels: Record<string, () => string> = {
		userEmail: m.email,
		name: m.name,
		conferenceUserType: m.role,
		committee: m.committee,
		assignment: m.assignment
	};

	function columnLabel(columnId: string) {
		return columnLabels[columnId]?.() ?? '';
	}

	const columns: ColumnDef<Features, ConferenceUserRow>[] = [
		{ accessorKey: 'userEmail', header: 'Email' },
		{ id: 'name', accessorFn: (row) => userDisplayName(row), header: 'Name' },
		{ accessorKey: 'conferenceUserType', header: 'Role' },
		{ id: 'committee', accessorFn: (row) => committeeText(row) },
		{ id: 'assignment', accessorFn: (row) => assignmentText(row), enableSorting: false },
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
		conferenceUserType: RoleType;
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
							<SortableHeaderCell
								label={columnLabel(header.id)}
								sorted={header.column.getIsSorted()}
								canSort={header.column.getCanSort()}
								isPlaceholder={header.isPlaceholder}
								onclick={header.column.getToggleSortingHandler()}
							/>
						{/each}
					</tr>
				{/each}
			</thead>
			<tbody>
				{#each table.getRowModel().rows as row (row.id)}
					{@const user = row.original}
					<UserRow
						{user}
						isSelf={currentUserEmail === user.userEmail}
						onEdit={() => openEditModal(user)}
						onRemove={() => removeMember(user.id)}
					/>
				{:else}
					<tr>
						<td colspan={columns.length} class="text-base-content/60 text-center">
							{m.noMembers()}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if table.getPageCount() > 1}
		<TablePagination
			pageIndex={pagination.pageIndex}
			pageSize={pagination.pageSize}
			pageCount={table.getPageCount()}
			rowCount={table.getFilteredRowModel().rows.length}
			canPrevious={table.getCanPreviousPage()}
			canNext={table.getCanNextPage()}
			onPage={(index) => table.setPageIndex(index)}
		/>
	{/if}

	<AddMembersForm conferenceId={conference.id} />
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
