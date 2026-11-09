<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { seatOptionLabel } from './conferenceUsers';

	interface Props {
		/** The selected committee seat, `null` for none */
		value: string | null;
		committees: {
			id: string;
			name: string;
			abbreviation: string;
			members: {
				id: string;
				representation: { name: string | null; alpha3Code: string | null };
			}[];
		}[];
		/** How many users each seat is assigned to */
		assignmentCounts: Map<string, number>;
	}

	let { value = $bindable(), committees, assignmentCounts }: Props = $props();

	function seatLabel(member: Props['committees'][number]['members'][number]) {
		return seatOptionLabel({
			representation: member.representation,
			assigned: assignmentCounts.get(member.id) ?? 0
		});
	}
</script>

<div class="form-control mb-4">
	<label class="label" for="edit-committee-member-select">
		<span class="label-text">{m.committeeMember()}</span>
	</label>
	<select id="edit-committee-member-select" class="select select-bordered w-full" bind:value>
		<option value={null}>{m.selectCommitteeMember()}</option>
		{#each committees as committee (committee.id)}
			<optgroup label="{committee.abbreviation} — {committee.name}">
				{#each committee.members as member (member.id)}
					<option value={member.id}>{seatLabel(member)}</option>
				{/each}
			</optgroup>
		{/each}
	</select>
</div>
