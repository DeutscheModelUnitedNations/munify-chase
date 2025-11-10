<script lang="ts">
import toast from "svelte-french-toast";
import { graphql } from "$houdini";
import { m } from "$lib/paraglide/messages";
import { promiseToastStrings } from "$lib/utils/toast";
import { SetPresenceMutation } from "./presenceMutations";

interface Props {
  memberIds: string[];
}

const { memberIds }: Props = $props();

const setAllPresence = (present: boolean) => {
  toast.promise(
    SetPresenceMutation.mutate({
      memberIds,
      present,
    }),
    promiseToastStrings(m.presence(), "update"),
  );
};
</script>

<button class="btn btn-success btn-outline" onclick={() => setAllPresence(true)}>
	<i class="fas fa-person-to-portal mr-2"></i>
	{m.setAllPresent()}
</button>
<button class="btn btn-error btn-outline" onclick={() => setAllPresence(false)}>
	<i class="fas fa-person-from-portal mr-2"></i>
	{m.setAllAbsent()}
</button>
