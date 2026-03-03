<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Modal from '$lib/components/Modal.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';

	interface CommitteeMemberOption {
		id: string;
		representation: {
			id: string;
			name: string | null;
			alpha2Code: string | null;
			alpha3Code: string | null;
			faIcon: string | null;
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
			faIcon: string | null;
		};
	}

	interface ConferenceUser {
		id: string;
		userEmail: string;
		conferenceUserType: string;
		committeeMember: { id: string } | null;
		conferenceMember: { id: string } | null;
	}

	type RoleType = 'ADMIN' | 'TEAM' | 'DELEGATE' | 'NON_STATE_ACTOR' | 'SPECTATOR';

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

	let selectedRole = $state<RoleType>('TEAM');
	let selectedCommitteeMemberId = $state<string | null>(null);
	let selectedConferenceMemberId = $state<string | null>(null);

	$effect(() => {
		if (user) {
			selectedRole = user.conferenceUserType as RoleType;
			selectedCommitteeMemberId = user.committeeMember?.id ?? null;
			selectedConferenceMemberId = user.conferenceMember?.id ?? null;
		}
	});

	function onRoleChange() {
		if (selectedRole !== 'DELEGATE') {
			selectedCommitteeMemberId = null;
		}
		if (selectedRole !== 'NON_STATE_ACTOR') {
			selectedConferenceMemberId = null;
		}
	}

	function handleSave() {
		onsave({
			conferenceUserType: selectedRole,
			committeeMemberId: selectedRole === 'DELEGATE' ? selectedCommitteeMemberId : null,
			conferenceMemberId: selectedRole === 'NON_STATE_ACTOR' ? selectedConferenceMemberId : null
		});
		open = false;
	}
</script>

<Modal bind:open>
	{#if user}
		<h3 class="mb-4 text-lg font-bold">{m.editUser()}</h3>
		<p class="text-base-content/70 mb-4 text-sm">{user.userEmail}</p>

		<div class="form-control mb-4">
			<label class="label" for="edit-role-select">
				<span class="label-text">{m.role()}</span>
			</label>
			<select
				id="edit-role-select"
				class="select select-bordered w-full"
				bind:value={selectedRole}
				onchange={onRoleChange}
			>
				<option value="ADMIN">{m.admin()}</option>
				<option value="TEAM">{m.teamMember()}</option>
				<option value="DELEGATE">{m.delegate()}</option>
				<option value="NON_STATE_ACTOR">{m.nonStateActor()}</option>
				<option value="SPECTATOR">{m.spectator()}</option>
			</select>
		</div>

		{#if selectedRole === 'DELEGATE'}
			<div class="form-control mb-4">
				<label class="label" for="edit-committee-member-select">
					<span class="label-text">{m.committeeMember()}</span>
				</label>
				<select
					id="edit-committee-member-select"
					class="select select-bordered w-full"
					bind:value={selectedCommitteeMemberId}
				>
					<option value={null}>{m.selectCommitteeMember()}</option>
					{#each committees as committee (committee.id)}
						<optgroup label="{committee.abbreviation} — {committee.name}">
							{#each committee.members as member (member.id)}
								{@const assignedCount = committeeMemberAssignmentCounts.get(member.id) ?? 0}
								<option value={member.id}>
									{member.representation.name ||
										getTranslatedCountryNameFromAlpha3Code(
											member.representation.alpha3Code
										)}{assignedCount > 0 ? ` (${m.assignedCount({ count: assignedCount })})` : ''}
								</option>
							{/each}
						</optgroup>
					{/each}
				</select>
			</div>
		{:else if selectedRole === 'NON_STATE_ACTOR'}
			<div class="form-control mb-4">
				<label class="label" for="edit-conference-member-select">
					<span class="label-text">{m.conferenceMembers()}</span>
				</label>
				<select
					id="edit-conference-member-select"
					class="select select-bordered w-full"
					bind:value={selectedConferenceMemberId}
				>
					<option value={null}>{m.selectConferenceMember()}</option>
					{#each conferenceMembers as member (member.id)}
						{@const assignedCount = conferenceMemberAssignmentCounts.get(member.id) ?? 0}
						<option value={member.id}>
							{member.representation.name ||
								getTranslatedCountryNameFromAlpha3Code(
									member.representation.alpha3Code
								)}{assignedCount > 0 ? ` (${m.assignedCount({ count: assignedCount })})` : ''}
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
