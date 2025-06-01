<script lang="ts">
	import { graphql } from '$houdini';
	import type { PageData } from './$houdini';

	let { data }: { data: PageData } = $props();
	let conferenceTitleQuery = data.PresenceExportConferenceName;
	let loading = $state(false);

	const dataQuery = graphql(`
		query PresenceDataQuery($conferenceId: ID!, $offset: Int, $limit: Int) {
			findManyPresenceChangedTimestamp(
				limit: $limit
				offset: $offset
				where: { committeeMember: { representation: { conference: { id: $conferenceId } } } }
			) {
				id
				presentSetTo
				timestamp
				committeeMember {
					id
					user {
						id
						userEmail
					}
					representation {
						id
						alpha2Code
						alpha3Code
					}
				}
			}
		}
	`);

	async function download() {
		loading = true;

		let returnedAmount = 1;
		let aggregatedData: any[] = [];
		let chunkSize = 100;

		while (returnedAmount > 0) {
			const result = await dataQuery.fetch({
				variables: {
					conferenceId: data.conferenceId,
					offset: aggregatedData.length,
					limit: chunkSize
				}
			});
			returnedAmount = result.data?.findManyPresenceChangedTimestamp.length || 0;
			aggregatedData = [
				...aggregatedData,
				...(result.data?.findManyPresenceChangedTimestamp || [])
			];
		}

		// TODO maybe a schema export just like with the endpoints would make sense?
		const blob = new Blob([JSON.stringify(aggregatedData, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${$conferenceTitleQuery.data?.findFirstConference.title || 'conference'}-presence-export.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		loading = false;
	}
</script>

<button onclick={download}> Download Delegator presence data </button>
