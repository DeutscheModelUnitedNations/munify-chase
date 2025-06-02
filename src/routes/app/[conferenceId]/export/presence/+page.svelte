<script lang="ts">
	import { graphql } from '$houdini';
	import type { PageData } from './$houdini';

	let { data }: { data: PageData } = $props();
	let conferenceTitleQuery = data.PresenceExportConferenceName;
	let loading = $state(false);

	const dataQuery = graphql(`
		query PresenceDataQuery($conferenceId: ID!) {
			findManyCommitteeMember(where: { representation: { conferenceId: $conferenceId } }) {
				id
				user {
					id
					userEmail
				}
				committeeId
				representation {
					id
					alpha3Code
					type
					name
				}
				presenceChangedTimestamps {
					id
					presentSetTo
					timestamp
				}
			}
		}
	`);

	async function download() {
		loading = true;

		const result = await dataQuery.fetch({
			variables: {
				conferenceId: data.conferenceId
			}
		});

		if (result.errors) {
			throw new Error(result.errors[0].message);
		}

		// TODO the file downloads could be refactored into a helper function
		// TODO maybe a schema export just like with the endpoints would make sense?
		const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
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

<!-- TODO styling and general concept of data export menu layouts -->
<button
	onclick={download}
	class="btn btn-square input-lg join-item m-5"
	aria-label="Clear selection"
>
	Download Delegator presence data
</button>
