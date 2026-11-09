<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import Flag from '#lib/components/Flag.svelte';
	import RowActions from './RowActions.svelte';
	import {
		assignmentRepresentation,
		isAssignableRole,
		representationName,
		roleBadgeClass,
		roleLabel,
		userDisplayName,
		type ConferenceUserRow
	} from './conferenceUsers';

	interface Props {
		user: ConferenceUserRow;
		isSelf: boolean;
		onEdit: () => void;
		onRemove: () => void;
	}
	let { user, isSelf, onEdit, onRemove }: Props = $props();

	let representation = $derived(assignmentRepresentation(user));
</script>

<tr>
	<td>
		{user.userEmail}
		{#if isSelf}
			<span class="badge badge-sm ml-2">{m.you()}</span>
		{/if}
	</td>
	<td>{userDisplayName(user) || '—'}</td>
	<td>
		<span class="badge {roleBadgeClass(user.conferenceUserType)}">
			{roleLabel(user.conferenceUserType)}
		</span>
	</td>
	<td>
		{#if user.committeeMember?.committee}
			{user.committeeMember.committee.abbreviation}
		{:else}
			<span class="text-base-content/30">&mdash;</span>
		{/if}
	</td>
	<td>
		{#if representation}
			<div class="flex items-center gap-2">
				<Flag {representation} size="xs" />
				<span>{representationName(representation)}</span>
			</div>
		{:else if isAssignableRole(user.conferenceUserType)}
			<span class="text-base-content/40 italic">{m.unassigned()}</span>
		{:else}
			<span class="text-base-content/30">&mdash;</span>
		{/if}
	</td>
	<td>
		<RowActions
			{onEdit}
			onDelete={onRemove}
			deleteLabel={m.removeMember()}
			lockedReason={isSelf ? m.youCannotEditYourself() : null}
		/>
	</td>
</tr>
