<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	const __test_data = [
		{
			id: '1',
			name: 'Committee 1',
			abbreviation: 'C1',
			status: 'FORMAL',
			statusHeadline: undefined,
			statusUntil: '2023-12-31T23:59:59Z',
			stateOfDebate: 'Allgemeine Debatte',
			activeAgendaItem: {
				title: 'Umgang mit Müll'
			}
		},
		{
			id: '2',
			name: 'Committee 2',
			abbreviation: 'C2',
			status: 'FORMAL',
			statusHeadline: undefined,
			statusUntil: '2023-11-30T23:59:59Z',
			stateOfDebate: 'Allgemeine Debatte',
			activeAgendaItem: {
				title: 'Umgang mit Müll'
			}
		},
		{
			id: '3',
			name: 'Committee 3',
			abbreviation: 'C3',
			status: 'FORMAL',
			statusHeadline: undefined,
			statusUntil: '2023-10-31T23:59:59Z',
			stateOfDebate: 'Allgemeine Debatte',
			activeAgendaItem: {
				title: 'Umgang mit Müll'
			}
		},
		{
			id: '4',
			name: 'Committee 4',
			abbreviation: 'C4',
			status: 'FORMAL',
			statusHeadline: undefined,
			statusUntil: '2024-01-15T23:59:59Z',
			stateOfDebate: 'Allgemeine Debatte',
			activeAgendaItem: {
				title: 'Umgang mit Müll'
			}
		},
		{
			id: '5',
			name: 'Committee 5',
			abbreviation: 'C5',
			status: 'FORMAL',
			statusHeadline: undefined,
			statusUntil: '2023-09-30T23:59:59Z',
			stateOfDebate: 'Allgemeine Debatte',
			activeAgendaItem: {
				title: 'Umgang mit Müll'
			}
		},
		{
			id: '6',
			name: 'Committee 6',
			abbreviation: 'C6',
			status: 'FORMAL',
			statusHeadline: undefined,
			statusUntil: '2023-08-31T23:59:59Z',
			stateOfDebate: 'Allgemeine Debatte',
			activeAgendaItem: {
				title: 'Umgang mit Müll'
			}
		},
		{
			id: '7',
			name: 'Committee 7',
			abbreviation: 'C7',
			status: 'FORMAL',
			statusHeadline: undefined,
			statusUntil: '2023-07-31T23:59:59Z',
			stateOfDebate: 'Allgemeine Debatte',
			activeAgendaItem: {
				title: 'Umgang mit Müll'
			}
		},
		{
			id: '8',
			name: 'Committee 8',
			abbreviation: 'C8',
			status: 'FORMAL',
			statusHeadline: undefined,
			statusUntil: '2023-06-30T23:59:59Z',
			stateOfDebate: 'Allgemeine Debatte',
			activeAgendaItem: {
				title: 'Umgang mit Müll'
			}
		},
		{
			id: '9',
			name: 'Committee 9',
			abbreviation: 'C9',
			status: 'FORMAL',
			statusHeadline: undefined,
			statusUntil: '2023-05-31T23:59:59Z',
			stateOfDebate: 'Allgemeine Debatte',
			activeAgendaItem: {
				title: 'Umgang mit Müll'
			}
		},
		{
			id: '10',
			name: 'Committee 10',
			abbreviation: 'C10',
			status: 'FORMAL',
			statusHeadline: undefined,
			statusUntil: '2023-04-30T23:59:59Z',
			stateOfDebate: 'Allgemeine Debatte',
			activeAgendaItem: {
				title: 'Umgang mit Müll'
			}
		}
	];
</script>

<div class="flex h-full w-full flex-wrap gap-4 p-4">
	{#each __test_data as committee}
		<div class="card bg-base-200 relative min-w-md flex-1 shadow-sm">
			<div class="card-body">
				<h2 class="card-title text-4xl">
					{committee.abbreviation}
				</h2>
				<p>{committee.status}</p>
				<p>{committee.stateOfDebate}</p>
				<p>{committee.activeAgendaItem.title}</p>
			</div>
		</div>
	{/each}
</div>
