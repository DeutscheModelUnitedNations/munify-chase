<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import Modal from '#lib/components/Modal.svelte';
	import CommitteeSeatSelect from './CommitteeSeatSelect.svelte';
	import {
		seatOptionLabel,
		userEditForm,
		userEditResult,
		withRoleAssignment,
		type RoleType,
		type UserEditForm
	} from './conferenceUsers';

	interface CommitteeMemberOption {
		id: string;
		representation: {
			id: string;
			name: string | null;
			alpha2Code: string | null;
			alpha3Code: string | null;
			icon: string | null;
		};
	}

	interface CommitteeWithMembers {
		id: string;
		name: string;
		abbreviation: string;
		members: CommitteeMemberOption[];
	}

	interface ConferenceMemberOption {
		id: string;
		representation: {
			id: string;
			name: string | null;
			alpha3Code: string | null;
			type: string;
			icon: string | null;
		};
	}

	interface ConferenceUser {
		id: string;
		userEmail: string;
		name: string | null;
		conferenceUserType: string;
		committeeMember: { id: string } | null;
		conferenceMember: { id: string } | null;
	}

	interface Props {
		open: boolean;
		user: ConferenceUser | null;
		committees: CommitteeWithMembers[];
		conferenceMembers: ConferenceMemberOption[];
		committeeMemberAssignmentCounts: Map<string, number>;
		conferenceMemberAssignmentCounts: Map<string, number>;
		onsave: (data: {
			conferenceUserType: RoleType;
			committeeMemberId: string | null;
			conferenceMemberId: string | null;
			name: string | null;
		}) => void;
	}

	let {
		open = $bindable(),
		user,
		committees,
		conferenceMembers,
		committeeMemberAssignmentCounts,
		conferenceMemberAssignmentCounts,
		onsave
	}: Props = $props();

	let form = $state<UserEditForm>({
		role: 'TEAM',
		committeeMemberId: null,
		conferenceMemberId: null,
		name: ''
	});

	$effect(() => {
		if (user) form = userEditForm(user);
	});

	function conferenceSeatLabel(member: ConferenceMemberOption) {
		return seatOptionLabel({
			representation: member.representation,
			assigned: conferenceMemberAssignmentCounts.get(member.id) ?? 0
		});
	}

	function handleSave() {
		onsave(userEditResult(form));
		open = false;
	}
</script>

<Modal bind:open>
	{#if user}
		<h3 class="mb-4 text-lg font-bold">{m.editUser()}</h3>
		<p class="text-base-content/70 mb-4 text-sm">{user.userEmail}</p>

		<div class="form-control mb-4">
			<label class="label" for="edit-name-input">
				<span class="label-text">{m.name()}</span>
			</label>
			<input
				id="edit-name-input"
				type="text"
				class="input input-bordered w-full"
				bind:value={form.name}
				placeholder={user.userEmail}
			/>
		</div>

		<div class="form-control mb-4">
			<label class="label" for="edit-role-select">
				<span class="label-text">{m.role()}</span>
			</label>
			<select
				id="edit-role-select"
				class="select select-bordered w-full"
				bind:value={form.role}
				onchange={() => (form = withRoleAssignment(form))}
			>
				<option value="ADMIN">{m.admin()}</option>
				<option value="TEAM">{m.teamMember()}</option>
				<option value="DELEGATE">{m.delegate()}</option>
				<option value="NON_STATE_ACTOR">{m.nonStateActor()}</option>
				<option value="SPECTATOR">{m.spectator()}</option>
			</select>
		</div>

		{#if form.role === 'DELEGATE'}
			<CommitteeSeatSelect
				bind:value={form.committeeMemberId}
				{committees}
				assignmentCounts={committeeMemberAssignmentCounts}
			/>
		{:else if form.role === 'NON_STATE_ACTOR'}
			<div class="form-control mb-4">
				<label class="label" for="edit-conference-member-select">
					<span class="label-text">{m.conferenceMembers()}</span>
				</label>
				<select
					id="edit-conference-member-select"
					class="select select-bordered w-full"
					bind:value={form.conferenceMemberId}
				>
					<option value={null}>{m.selectConferenceMember()}</option>
					{#each conferenceMembers as member (member.id)}
						<option value={member.id}>
							{conferenceSeatLabel(member)}
						</option>
					{/each}
				</select>
			</div>
		{:else}
			<p class="text-base-content/60 mb-4 text-sm italic">{m.noAssignmentNeeded()}</p>
		{/if}

		<div class="modal-action">
			<button class="btn" onclick={() => (open = false)}>{m.abort()}</button>
			<button class="btn btn-primary" onclick={handleSave}>{m.save()}</button>
		</div>
	{/if}
</Modal>
