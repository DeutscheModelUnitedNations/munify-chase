<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import { page } from '$app/state';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import { locales } from '$lib/paraglide/runtime';

	const user = await getCurrentUser();
	const isGlobalAdminUser = (await client.query.isGlobalAdmin()) as unknown as boolean;
	// The shared Pi kiosk account (`service_user`) can end up here if someone
	// signs into a regular browser with it by mistake — it has no conference
	// memberships, so it's never `authorized` below, but it deserves a more
	// actionable message than the generic permission error.
	const isKioskUser = (await client.query.isDisplayKiosk()) as unknown as boolean;

	// This page manages every conference's displays from one place, so
	// "can see a row" (ability-filtered on the query below) isn't enough —
	// someone with no admin/team role anywhere shouldn't land on the page
	// shell at all. The device list itself is still ability-filtered
	// server-side regardless, this just avoids exposing the management UI
	// to plain participants.
	//
	// Filtered client-side rather than via a `where: { OR: [...] } }` arg:
	// unlike the server-side ability-builder DSL (Drizzle relational
	// filters), the GraphQL `where` input generated for conferenceUser has
	// no AND/OR/NOT combinators and no `in` on the enum field — only exact
	// per-field equality. Same approach as the launcher page.
	const myConferenceRoles =
		isGlobalAdminUser || isKioskUser
			? []
			: await client.liveQuery.conferenceUsers({
					__args: { where: { user: { id: user.id } } },
					id: true,
					conferenceUserType: true
				});
	const authorized =
		isGlobalAdminUser ||
		(myConferenceRoles ?? []).some(
			(cu) => cu.conferenceUserType === 'ADMIN' || cu.conferenceUserType === 'TEAM'
		);

	const focusId = page.url.searchParams.get('focus');

	const localeLabels: Record<string, string> = { de: 'Deutsch', en: 'English', pt: 'Português' };

	// Native, always-current IANA zone list — no hardcoded list to maintain.
	// Not supported in some very old browsers; the select just shows the
	// current/empty option then, since staff use this page on their own
	// up-to-date browser, not the kiosk appliance.
	const timezones: string[] = (() => {
		try {
			return Intl.supportedValuesOf('timeZone');
		} catch {
			return [];
		}
	})();

	const devices = await client.liveQuery.displayDevices({
		id: true,
		name: true,
		revoked: true,
		conferenceId: true,
		committeeId: true,
		lastSeenAt: true,
		locale: true,
		timezone: true,
		conference: { id: true, title: true },
		committee: { id: true, abbreviation: true }
	});

	const conferences = await client.liveQuery.conferences({
		id: true,
		title: true,
		committees: { id: true, name: true, abbreviation: true }
	});

	type Draft = {
		name: string;
		conferenceId: string;
		committeeId: string;
		locale: (typeof locales)[number] | '';
		timezone: string;
	};
	let drafts = $state<Record<string, Draft>>({});

	// Seed an editable draft for every device id once it appears. Done in an
	// effect (not during render) so we never mutate $state while deriving.
	$effect(() => {
		for (const d of devices ?? []) {
			if (!drafts[d.id]) {
				drafts[d.id] = {
					name: d.name ?? '',
					conferenceId: d.conferenceId ?? '',
					committeeId: d.committeeId ?? '',
					locale: d.locale ?? '',
					timezone: d.timezone ?? ''
				};
			}
		}
	});

	function committeesFor(conferenceId: string) {
		return (conferences ?? []).find((c) => c.id === conferenceId)?.committees ?? [];
	}

	let busy = $state<string | null>(null);

	async function save(id: string) {
		const d = drafts[id];
		if (!d) return;
		busy = id;
		try {
			await client.mutate.assignDisplayDevice({
				__args: {
					id,
					name: d.name.trim() === '' ? null : d.name.trim(),
					// Conference (re)assignment is a global-admin-only action (the
					// select is disabled for everyone else); omitting the arg
					// entirely — rather than resending the unchanged value —
					// keeps conference admins/team members from tripping the
					// server-side guard on every unrelated settings save.
					...(isGlobalAdminUser
						? { conferenceId: d.conferenceId === '' ? null : d.conferenceId }
						: {}),
					committeeId: d.committeeId === '' ? null : d.committeeId,
					locale: d.locale === '' ? null : d.locale,
					timezone: d.timezone === '' ? null : d.timezone
				},
				id: true
			});
		} finally {
			busy = null;
		}
	}

	async function setRevoked(id: string, revoked: boolean) {
		busy = id;
		try {
			await client.mutate.setDisplayDeviceRevoked({
				__args: { id, revoked },
				id: true,
				revoked: true
			});
		} finally {
			busy = null;
		}
	}

	function fmtLastSeen(d: Date | string | null | undefined): string {
		if (!d) return m.displaysNeverSeen();
		const date = typeof d === 'string' ? new Date(d) : d;
		return date.toLocaleString();
	}
</script>

<svelte:head>
	<title>{m.displaysManage()} - MUNify CHASE</title>
</svelte:head>

{#if authorized}
	<div class="bg-base-200 min-h-screen p-4 sm:p-8">
		<div class="mx-auto w-full max-w-5xl">
			<h1 class="mb-2 text-3xl font-bold tracking-tight">{m.displaysManage()}</h1>
			<p class="text-base-content/60 mb-6 text-sm">{m.displaysAdminOnlyHint()}</p>

			{#if (devices ?? []).length === 0}
				<div class="card bg-base-100 p-10 text-center shadow-sm">
					<i class="fa-duotone fa-display text-base-content/30 mb-3 text-5xl"></i>
					<p class="text-base-content/70 m-0">{m.displaysEmpty()}</p>
				</div>
			{:else}
				<div class="card bg-base-100 overflow-x-auto p-0 shadow-sm">
					<table class="table">
						<thead>
							<tr>
								<th>{m.displaysColDevice()}</th>
								<th>{m.displaysColAssignment()}</th>
								<th>{m.displaysColLastSeen()}</th>
								<th class="text-right">{m.displaysColStatus()}</th>
							</tr>
						</thead>
						<tbody>
							{#each devices ?? [] as d (d.id)}
								{@const draft = drafts[d.id]}
								{#if draft}
									<tr class={d.id === focusId ? 'bg-warning/10' : ''}>
										<td class="align-top">
											<input
												class="input input-sm input-bordered w-44"
												placeholder={m.displaysNamePlaceholder()}
												bind:value={draft.name}
											/>
											<div class="text-base-content/50 mt-1 font-mono text-xs">{d.id}</div>
										</td>
										<td class="align-top">
											<div class="flex flex-col gap-2">
												<select
													class="select select-sm select-bordered w-56"
													bind:value={draft.conferenceId}
													onchange={() => (draft.committeeId = '')}
													disabled={!isGlobalAdminUser}
													title={isGlobalAdminUser ? '' : m.displaysConferenceAdminOnly()}
												>
													<option value="">{m.displaysSelectConference()}</option>
													{#each conferences ?? [] as c (c.id)}
														<option value={c.id}>{c.title}</option>
													{/each}
												</select>
												<select
													class="select select-sm select-bordered w-56"
													bind:value={draft.committeeId}
													disabled={draft.conferenceId === ''}
												>
													<option value="">{m.displaysAllCommittees()}</option>
													{#each committeesFor(draft.conferenceId) as cm (cm.id)}
														<option value={cm.id}>{cm.abbreviation} — {cm.name}</option>
													{/each}
												</select>
												<select
													class="select select-sm select-bordered w-56"
													bind:value={draft.locale}
												>
													<option value="">{m.displaysDefaultLanguage()}</option>
													{#each locales as l (l)}
														<option value={l}>{localeLabels[l] ?? l}</option>
													{/each}
												</select>
												<select
													class="select select-sm select-bordered w-56"
													bind:value={draft.timezone}
												>
													<option value="">{m.displaysDefaultTimezone()}</option>
													{#each timezones as tz (tz)}
														<option value={tz}>{tz}</option>
													{/each}
												</select>
												<button
													class="btn btn-sm btn-primary w-28"
													disabled={busy === d.id}
													onclick={() => save(d.id)}
												>
													{m.displaysSave()}
												</button>
											</div>
										</td>
										<td class="align-top text-sm">{fmtLastSeen(d.lastSeenAt)}</td>
										<td class="align-top text-right">
											{#if d.revoked}
												<span class="badge badge-error mb-2">{m.displaysStatusRevoked()}</span>
												<br />
												<button
													class="btn btn-xs btn-ghost"
													disabled={busy === d.id}
													onclick={() => setRevoked(d.id, false)}
												>
													{m.displaysRestore()}
												</button>
											{:else}
												<span class="badge badge-success mb-2">{m.displaysStatusActive()}</span>
												<br />
												<button
													class="btn btn-xs btn-ghost text-error"
													disabled={busy === d.id}
													onclick={() => setRevoked(d.id, true)}
												>
													{m.displaysRevoke()}
												</button>
											{/if}
										</td>
									</tr>
								{/if}
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>
{:else if isKioskUser}
	<div class="bg-base-200 flex min-h-screen flex-col items-center justify-center gap-4 p-8">
		<i class="fa-duotone fa-display text-base-content/40 text-7xl"></i>
		<h1 class="m-0 text-3xl font-bold">{m.displaysKioskAccountHeadline()}</h1>
		<p class="text-base-content/70 m-0 max-w-md text-center">{m.displaysKioskAccountBody()}</p>
	</div>
{:else}
	<div class="bg-base-200 flex min-h-screen flex-col items-center justify-center gap-4 p-8">
		<i class="fa-duotone fa-lock text-base-content/40 text-7xl"></i>
		<h1 class="m-0 text-3xl font-bold">{m.displaysPermissionDeniedHeadline()}</h1>
		<p class="text-base-content/70 m-0 max-w-md text-center">{m.displaysPermissionDeniedBody()}</p>
	</div>
{/if}
