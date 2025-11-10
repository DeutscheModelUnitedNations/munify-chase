<script lang="ts">
import { graphql } from "$houdini";
import { m } from "$lib/paraglide/messages";

interface Props {
  conferenceTitle?: string;
  conferenceId?: string;
}

const { conferenceTitle, conferenceId }: Props = $props();

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
					alpha2Code
					faIcon
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
  if (!conferenceId) {
    loading = false;
    throw new Error("No conference ID provided");
  }

  const result = await dataQuery.fetch({
    variables: {
      conferenceId,
    },
  });

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  // TODO the file downloads could be refactored into a helper function
  // TODO maybe a schema export just like with the endpoints would make sense?
  const blob = new Blob(
    [JSON.stringify(result.data?.findManyCommitteeMember, null, 2)],
    {
      type: "application/json",
    },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${conferenceTitle || "conference"}-presence-export.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  loading = false;
}
</script>

<li>
	<button onclick={download} class="" aria-label="Download Delegator presence data">
		<i class="fa-duotone fa-download w-6 text-center"></i>
		{m.downloadPresenceData()}
	</button>
</li>
