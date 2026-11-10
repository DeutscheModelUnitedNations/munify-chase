<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { client } from '#lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '#lib/utils/toast';
	import { parseEmails, type RoleType } from './conferenceUsers';

	interface Props {
		conferenceId: string;
	}
	let { conferenceId }: Props = $props();

	let bulkEmails = $state('');
	let newRole = $state<RoleType>('TEAM');
	let isBulkSubmitting = $state(false);

	async function addBulkMembers() {
		const emails = parseEmails(bulkEmails);
		if (emails.length === 0) return;

		isBulkSubmitting = true;
		try {
			for (const email of emails) {
				await toast.promise(
					client.mutate.createConferenceUser({
						__args: { conferenceId, userEmail: email, conferenceUserType: newRole },
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
</script>

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
					<i aria-hidden="true" class="ph-fill ph-plus"></i>
				{/if}
				{m.addMember()}
			</button>
		</div>
	</div>
</fieldset>
