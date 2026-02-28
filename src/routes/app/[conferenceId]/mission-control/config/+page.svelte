<script lang="ts">
  import { page } from '$app/state';
  import { m } from '$lib/paraglide/messages';
  import NavbarBurgerMenu from '$lib/components/NavbarBurgerMenu.svelte';
  import BasicCard from '$lib/components/BasicCard.svelte';
  import { client, type ConferenceusertypeEnum } from '$lib/api/rumbleClient/client';
  import toast from 'svelte-french-toast';
  import { promiseToastStrings } from '$lib/utils/toast';

  const conference = await client.liveQuery.conference({
    __args: {
      id: page.params.conferenceId!
    },
    id: true,
    title: true
  });

  const users = await client.liveQuery.conferenceUsers({
    __args: {
      where: { conferenceId: page.params.conferenceId! }
    },
    id: true,
    userEmail: true,
    conferenceUserType: true
  });

  const me = await client.query.me({
    email: true
  });

  const currentUserRole = $derived(users?.find((u) => u.userEmail === me?.email));
  const isAdmin = $derived(currentUserRole?.conferenceUserType === 'ADMIN');
  const conferenceUsers = $derived(
    [...(users ?? [])].sort((a, b) => a.userEmail.localeCompare(b.userEmail))
  );

  const menubarItems = [
    {
      faIcon: 'fa-rocket-launch',
      title: m.missionControl(),
      href: '..'
    }
  ];

  // Form state
  let bulkEmails = $state('');
  let newRole = $state<ConferenceusertypeEnum>('TEAM');
  let isBulkSubmitting = $state(false);

  function isCurrentUser(email: string): boolean {
    return me?.email === email;
  }

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function parseEmails(input: string): string[] {
    return input
      .split(/[\n,;]+/)
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email.length > 0 && isValidEmail(email));
  }

  async function addBulkMembers() {
    if (!conference?.id) return;

    const emails = parseEmails(bulkEmails);
    if (emails.length === 0) return;

    isBulkSubmitting = true;
    try {
      for (const email of emails) {
        await toast.promise(
          client.mutate.createConferenceUser({
            __args: {
              conferenceId: conference.id,
              userEmail: email,
              conferenceUserType: newRole
            },
            id: true,
            userEmail: true,
            conferenceUserType: true
          }),
          promiseToastStrings(m.member(), 'add')
        );
      }
      bulkEmails = '';
    } finally {
      isBulkSubmitting = false;
    }
  }

  async function removeMember(id: string) {
    if (!confirm(m.confirmRemoveMember())) return;

    await toast.promise(
      client.mutate.deleteConferenceUser({
        __args: { id },
        id: true
      }),
      promiseToastStrings(m.member(), 'delete')
    );
  }

  async function updateMemberRole(id: string, newType: ConferenceusertypeEnum) {
    await toast.promise(
      client.mutate.updateConferenceUser({
        __args: {
          id,
          conferenceUserType: newType
        },
        id: true,
        conferenceUserType: true
      }),
      promiseToastStrings(m.member(), 'update')
    );
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
    {#if !isAdmin}
      <div class="alert alert-error">
        <i class="fas fa-exclamation-triangle"></i>
        <span>{m.notAuthorized()}</span>
      </div>
    {:else if conference}
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
                  <td colspan="3" class="text-center text-base-content/60">
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
                        <span class="ml-2 badge badge-sm">{m.you()}</span>
                      {/if}
                    </td>
                    <td>
                      <select
                        class="select-bordered select select-sm"
                        value={user.conferenceUserType}
                        onchange={(e) =>
                          updateMemberRole(
                            user.id,
                            e.currentTarget.value as ConferenceusertypeEnum
                          )}
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
                        class="btn btn-sm btn-error"
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
        <fieldset class="mt-6 fieldset rounded-box border border-base-300 bg-base-200 p-4">
          <legend class="fieldset-legend px-2 text-sm font-semibold">{m.addMember()}</legend>
          <div class="flex flex-col gap-4">
            <textarea
              class="textarea-bordered textarea h-24 w-full"
              placeholder={m.bulkEmailPlaceholder()}
              bind:value={bulkEmails}
            ></textarea>
            <div class="flex flex-wrap items-end gap-4">
              <div class="form-control">
                <label class="label" for="role-select">
                  <span class="label-text">{m.role()}</span>
                </label>
                <select id="role-select" class="select-bordered select" bind:value={newRole}>
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
                  <span class="loading loading-sm loading-spinner"></span>
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
        <span class="loading loading-lg loading-spinner"></span>
      </div>
    {/if}
  </div>
</div>
