<script lang="ts">
  import toast from 'svelte-french-toast';
  import { m } from '$lib/paraglide/messages';
  import { promiseToastStrings } from '$lib/utils/toast';
  import { client } from '$lib/api/rumbleClient/client';

  interface Props {
    memberIds: string[];
  }

  const { memberIds }: Props = $props();

  const setAllPresence = (present: boolean) => {
    toast.promise(
      client.mutate.setPresenceForCommitteeMembers({
        __args: {
          ids: memberIds,
          present
        },
        id: true,
        present: true
      }),
      promiseToastStrings(m.presence(), 'update')
    );
  };
</script>

<button class="btn btn-outline btn-success" onclick={() => setAllPresence(true)}>
  <i class="fas fa-person-to-portal mr-2"></i>
  {m.setAllPresent()}
</button>
<button class="btn btn-outline btn-error" onclick={() => setAllPresence(false)}>
  <i class="fas fa-person-from-portal mr-2"></i>
  {m.setAllAbsent()}
</button>
