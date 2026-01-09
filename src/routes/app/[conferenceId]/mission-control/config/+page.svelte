<script lang="ts">
	import type { PageData } from './$houdini';
	import { m } from '$lib/paraglide/messages';
	import NavbarBurgerMenu from '$lib/components/NavbarBurgerMenu.svelte';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import { graphql } from '$houdini';

	let { data }: { data: PageData } = $props();

	let query = $derived(data?.ConferenceConfigQuery);
	let conference = $derived($query.data?.findFirstConference);
	let conferenceUsers = $derived(conference?.users ?? []);

	const menubarItems = [
		{
			faIcon: 'fa-rocket-launch',
			title: m.missionControl(),
			href: '..'
		}
	];

	// Form state
	let newEmail = $state('');
	let newRole = $state<'ADMIN' | 'TEAM' | 'SPECTATOR' | 'DELEGATE' | 'NON_STATE_ACTOR'>('TEAM');
	let isSubmitting = $state(false);

	const CreateConferenceUserMutation = graphql(`
		mutation CreateConferenceUser(
			$conferenceId: ID!
			$userEmail: String!
			$conferenceUserType: ConferenceUserTypeEnum!
		) {
			createConferenceUser(
				conferenceId: $conferenceId
				userEmail: $userEmail
				conferenceUserType: $conferenceUserType
			) {
				id
				userEmail
				conferenceUserType
			}
		}
	`);

	const DeleteConferenceUserMutation = graphql(`
		mutation DeleteConferenceUser($id: ID!) {
			deleteConferenceUser(id: $id)
		}
	`);

	const UpdateConferenceUserMutation = graphql(`
		mutation UpdateConferenceUser($id: ID!, $conferenceUserType: ConferenceUserTypeEnum!) {
			updateConferenceUser(id: $id, conferenceUserType: $conferenceUserType) {
				id
				userEmail
				conferenceUserType
			}
		}
	`);

	async function addMember() {
		if (!newEmail.trim() || !conference?.id) return;

		isSubmitting = true;
		try {
			await CreateConferenceUserMutation.mutate({
				conferenceId: conference.id,
				userEmail: newEmail.trim(),
				conferenceUserType: newRole
			});
			newEmail = '';
			// Refetch the query to get updated data
			await query.fetch();
		} catch (error) {
			console.error('Failed to add member:', error);
		} finally {
			isSubmitting = false;
		}
	}

	async function removeMember(id: string) {
		if (!confirm(m.confirmRemoveMember())) return;

		try {
			await DeleteConferenceUserMutation.mutate({ id });
			await query.fetch();
		} catch (error) {
			console.error('Failed to remove member:', error);
		}
	}

	async function updateMemberRole(
		id: string,
		newType: 'ADMIN' | 'TEAM' | 'SPECTATOR' | 'DELEGATE' | 'NON_STATE_ACTOR'
	) {
		try {
			await UpdateConferenceUserMutation.mutate({
				id,
				conferenceUserType: newType
			});
			await query.fetch();
		} catch (error) {
			console.error('Failed to update member:', error);
		}
	}

	function getRoleLabel(role: string): string {
		switch (role) {
			case 'ADMIN':
				return m.admin();
			case 'TEAM':
				return m.teamMember();
			case 'SPECTATOR':
				return m.spectator();
			case 'DELEGATE':
				return m.delegate();
			case 'NON_STATE_ACTOR':
				return m.nonStateActor();
			default:
				return role;
		}
	}
</script>

<svelte:head>
	<title>{m.configuration()} - MUNify CHASE</title>
</svelte:head>

<div class="navbar bg-base-100 shadow-sm">
	<h1 class="ml-4 flex-1 text-3xl font-bold">{m.configuration()}</h1>
	<div class="flex-none">
		<NavbarBurgerMenu items={menubarItems} />
	</div>
</div>

<div class="flex h-full w-full items-start justify-center p-6">
	<div class="flex w-full max-w-screen-lg flex-col gap-6">
		{#if conference}
			<h2 class="text-xl font-semibold">{conference.title}</h2>

			<BasicCard title={m.conferenceMembers()}>
				<!-- Member list -->
				<div class="overflow-x-auto">
					<table class="table w-full">
						<thead>
							<tr>
								<th>{m.email()}</th>
								<th>{m.role()}</th>
								<th class="w-24"></th>
							</tr>
						</thead>
						<tbody>
							{#if conferenceUsers.length === 0}
								<tr>
									<td colspan="3" class="text-base-content/60 text-center">
										{m.noMembers()}
									</td>
								</tr>
							{:else}
								{#each conferenceUsers as user (user.id)}
									<tr>
										<td>{user.userEmail}</td>
										<td>
											<select
												class="select select-bordered select-sm"
												value={user.conferenceUserType}
												onchange={(e) => updateMemberRole(user.id, e.currentTarget.value as any)}
											>
												<option value="ADMIN">{m.admin()}</option>
												<option value="TEAM">{m.teamMember()}</option>
												<option value="SPECTATOR">{m.spectator()}</option>
												<option value="DELEGATE">{m.delegate()}</option>
												<option value="NON_STATE_ACTOR">{m.nonStateActor()}</option>
											</select>
										</td>
										<td>
											<button
												class="btn btn-error btn-sm"
												onclick={() => removeMember(user.id)}
												aria-label={m.removeMember()}
											>
												<i class="fas fa-trash"></i>
											</button>
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>

				<!-- Add member form -->
				<div class="divider"></div>
				<form
					class="flex flex-wrap items-end gap-4"
					onsubmit={(e) => {
						e.preventDefault();
						addMember();
					}}
				>
					<div class="form-control flex-1">
						<label class="label" for="email-input">
							<span class="label-text">{m.email()}</span>
						</label>
						<input
							id="email-input"
							type="email"
							class="input input-bordered"
							placeholder="user@example.com"
							bind:value={newEmail}
							required
						/>
					</div>
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
					<button type="submit" class="btn btn-primary" disabled={isSubmitting || !newEmail.trim()}>
						{#if isSubmitting}
							<span class="loading loading-spinner loading-sm"></span>
						{:else}
							<i class="fas fa-plus"></i>
						{/if}
						{m.addMember()}
					</button>
				</form>
			</BasicCard>
		{:else}
			<div class="flex items-center justify-center">
				<span class="loading loading-spinner loading-lg"></span>
			</div>
		{/if}
	</div>
</div>
