<script lang="ts">
  import { m } from '$lib/paraglide/messages';
  import { configPublic } from '$lib/config/public';
</script>

{#if configPublic.PUBLIC_CONTACT_EMAIL}
  <div
    class="mx-4 flex flex-col items-center gap-6 rounded-box border border-base-300 bg-base-100 p-4 py-20 shadow-lg lg:p-20"
  >
    <h1
      class="text-center font-serif text-3xl leading-tight font-bold text-slate-900 lg:text-4xl dark:text-white"
    >
      {m.homeContactTitle()}
    </h1>
    <p
      class="text-md max-w-3xl text-center leading-normal text-slate-900 lg:text-lg dark:text-white"
    >
      {m.homeContactText()}
    </p>
    <a class="btn mt-2 btn-primary" href="mailto:{configPublic.PUBLIC_CONTACT_EMAIL}">
      <i class="fas fa-envelope mr-2"></i>
      {m.homeContactButton()}
    </a>
    <pre class="text-center text-xs text-base-content/50">{configPublic.PUBLIC_CONTACT_EMAIL}</pre>
  </div>
{/if}
