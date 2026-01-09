<script lang="ts">
	import type { PageData } from './$houdini';
	import { m } from '$lib/paraglide/messages';
	import NavbarBurgerMenu from '$lib/components/NavbarBurgerMenu.svelte';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import { cache, graphql } from '$houdini';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let query = $derived(data?.ConferenceConfigQuery);
	let conference = $derived(query ? $query.data?.findFirstConference : undefined);
	let conferenceUsers = $derived(
		[...(conference?.users ?? [])].sort((a, b) => a.userEmail.localeCompare(b.userEmail))
	);
	let currentUserEmail = $derived(data.user?.email);

	const menubarItems = [
		{
			faIcon: 'fa-rocket-launch',
			title: m.missionControl(),
			href: '..'
		}
	];

	// Form state
	let bulkEmails = $state('');
	let newRole = $state<'ADMIN' | 'TEAM' | 'SPECTATOR' | 'DELEGATE' | 'NON_STATE_ACTOR'>('TEAM');
	let isBulkSubmitting = $state(false);

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

	function isCurrentUser(email: string): boolean {
		return currentUserEmail === email;
	}

	function parseEmails(input: string): string[] {
		// Split by newlines, commas, or semicolons, then trim and filter empty
		return input
			.split(/[\n,;]+/)
			.map((email) => email.trim())
			.filter((email) => email.length > 0 && email.includes('@'));
	}

	async function addBulkMembers() {
		if (!conference?.id || !query) return;

		const emails = parseEmails(bulkEmails);
		if (emails.length === 0) return;

		isBulkSubmitting = true;
		try {
			for (const email of emails) {
				try {
					await CreateConferenceUserMutation.mutate({
						conferenceId: conference.id,
						userEmail: email,
						conferenceUserType: newRole
					});
				} catch (error) {
					console.error(`Failed to add member ${email}:`, error);
				}
			}
			bulkEmails = '';
		} finally {
			isBulkSubmitting = false;
			cache.markStale();
			await invalidateAll();
		}
	}

	async function removeMember(id: string) {
		if (!confirm(m.confirmRemoveMember()) || !query) return;

		try {
			await DeleteConferenceUserMutation.mutate({ id });
			cache.markStale();
			await invalidateAll();
		} catch (error) {
			console.error('Failed to remove member:', error);
		}
	}

	async function updateMemberRole(
		id: string,
		newType: 'ADMIN' | 'TEAM' | 'SPECTATOR' | 'DELEGATE' | 'NON_STATE_ACTOR'
	) {
		if (!query) return;
		try {
			await UpdateConferenceUserMutation.mutate({
				id,
				conferenceUserType: newType
			});
			cache.markStale();
			await invalidateAll();
		} catch (error) {
			console.error('Failed to update member:', error);
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
									{@const isSelf = isCurrentUser(user.userEmail)}
									<tr>
										<td>
											{user.userEmail}
											{#if isSelf}
												<span class="badge badge-sm ml-2">{m.you()}</span>
											{/if}
										</td>
										<td>
											<select
												class="select select-bordered select-sm"
												value={user.conferenceUserType}
												onchange={(e) => updateMemberRole(user.id, e.currentTarget.value as any)}
												disabled={isSelf}
												title={isSelf ? m.youCannotEditYourself() : ''}
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
												disabled={isSelf}
												title={isSelf ? m.youCannotEditYourself() : ''}
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

				<!-- Add members fieldset -->
				<fieldset class="fieldset bg-base-200 border-base-300 rounded-box mt-6 border p-4">
					<legend class="fieldset-legend px-2 text-sm font-semibold">{m.addMember()}</legend>
					<div class="flex flex-col gap-4">
						<textarea
							class="textarea textarea-bordered h-24 w-full"
							placeholder={m.bulkEmailPlaceholder()}
							bind:value={bulkEmails}
						></textarea>
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
									<i class="fas fa-plus"></i>
								{/if}
								{m.addMember()}
							</button>
						</div>
					</div>
				</fieldset>
			</BasicCard>
		{:else}
			<div class="flex items-center justify-center">
				<span class="loading loading-spinner loading-lg"></span>
			</div>
		{/if}
	</div>
</div>
