<script lang="ts">
  import { m } from '$lib/paraglide/messages';
  import Modal from './Modal.svelte';
  import CountryBadge from './CountryBadge.svelte';
  import WorldCountries from 'world-countries';

  interface ParsedCountry {
    alpha2Code: string;
    alpha3Code: string;
    name: string;
  }

  interface Props {
    open: boolean;
    onSubmit: (countries: ParsedCountry[]) => void;
  }

  let { open = $bindable(), onSubmit }: Props = $props();

  let inputText = $state('');

  // Derive parsed results from inputText — no $effect needed
  const parseResult = $derived.by(() => {
    const tokens = inputText
      .split(/[\n\r,;\s\t]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const countries: ParsedCountry[] = [];
    const unrecognized: string[] = [];
    const addedCodes = new Set<string>();

    for (const token of tokens) {
      const normalized = token.toLowerCase();

      if (addedCodes.has(normalized)) {
        continue;
      }

      let country: (typeof WorldCountries)[0] | undefined;

      if (token.length === 2) {
        country = WorldCountries.find((c) => c.cca2.toLowerCase() === normalized);
      } else if (token.length === 3) {
        country = WorldCountries.find((c) => c.cca3.toLowerCase() === normalized);
      }

      if (country) {
        countries.push({
          alpha2Code: country.cca2.toLowerCase(),
          alpha3Code: country.cca3.toLowerCase(),
          name: country.name.common
        });
        addedCodes.add(country.cca2.toLowerCase());
        addedCodes.add(country.cca3.toLowerCase());
      } else if (token.length >= 2 && token.length <= 3) {
        unrecognized.push(token.toUpperCase());
      }
    }

    return { countries, unrecognized: [...new Set(unrecognized)] };
  });

  const parsedCountries = $derived(parseResult.countries);
  const unrecognizedStrings = $derived(parseResult.unrecognized);

  // Clear input when modal is closed externally (ESC/backdrop)
  $effect(() => {
    if (!open) {
      inputText = '';
    }
  });

  function handleSubmit() {
    if (parsedCountries.length > 0) {
      onSubmit(parsedCountries);
      inputText = '';
      open = false;
    }
  }

  function handleClose() {
    inputText = '';
    open = false;
  }
</script>

<Modal bind:open>
  <h3 class="mb-4 text-lg font-bold">{m.addCountry()}</h3>

  <fieldset class="mb-4 fieldset w-full rounded-box border border-base-300 bg-base-200 p-4">
    <legend class="fieldset-legend">{m.enterCountryCodes()}</legend>
    <textarea
      id="country-codes-input"
      class="textarea h-32 w-full font-mono"
      bind:value={inputText}
      placeholder={m.countryCodesPlaceholder()}
    ></textarea>
    <p class="label break-words whitespace-normal">{m.countryCodesHelp()}</p>
  </fieldset>

  {#if parsedCountries.length > 0 || unrecognizedStrings.length > 0}
    <div class="divider"></div>

    <!-- Summary -->
    <div class="mb-4 flex flex-wrap gap-2">
      <div class="badge badge-primary">
        <i class="fa-duotone fa-check mr-1"></i>
        {m.countriesRecognized({ count: parsedCountries.length })}
      </div>
      {#if unrecognizedStrings.length > 0}
        <div class="badge badge-warning">
          <i class="fa-duotone fa-question mr-1"></i>
          {m.codesUnrecognized({ count: unrecognizedStrings.length })}
        </div>
      {/if}
    </div>

    <!-- Parsed countries preview -->
    {#if parsedCountries.length > 0}
      <div class="mb-4">
        <h4 class="mb-2 text-sm font-semibold">{m.parsedCountries()}</h4>
        <div class="flex max-h-48 flex-wrap gap-1 overflow-y-auto">
          {#each parsedCountries as country}
            <CountryBadge
              alpha2Code={country.alpha2Code}
              alpha3Code={country.alpha3Code}
              name={country.name}
            />
          {/each}
        </div>
      </div>
    {/if}

    <!-- Unrecognized strings -->
    {#if unrecognizedStrings.length > 0}
      <div class="mb-4">
        <h4 class="mb-2 text-sm font-semibold text-warning">{m.unrecognizedCodes()}</h4>
        <div class="flex flex-wrap gap-1">
          {#each unrecognizedStrings as code}
            <div class="badge badge-outline font-mono badge-warning">{code}</div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}

  <!-- Actions -->
  <div class="modal-action">
    <button class="btn" onclick={handleClose}>
      {m.abort()}
    </button>
    <button class="btn btn-primary" onclick={handleSubmit} disabled={parsedCountries.length === 0}>
      <i class="fa-solid fa-plus mr-1"></i>
      {m.addCountriesCount({ count: parsedCountries.length })}
    </button>
  </div>
</Modal>
