<script lang="ts">
	import { onMount } from 'svelte';
	import 'vanilla-cookieconsent/dist/cookieconsent.css';
	import * as CookieConsent from 'vanilla-cookieconsent';
	import { m } from '#lib/paraglide/messages';

	onMount(() => {
		// The native app is no website, and a live demo embedded in the manual already
		// sits on a page that asked
		if ('__TAURI_INTERNALS__' in window || window.self !== window.top) return;

		CookieConsent.run({
			guiOptions: {
				consentModal: { layout: 'box', position: 'bottom right' },
				preferencesModal: { layout: 'box' }
			},
			categories: {
				necessary: {
					enabled: true,
					readOnly: true
				}
			},
			// Paraglide picks the language, the library only ever sees one
			language: {
				default: 'de',
				translations: {
					de: {
						consentModal: {
							title: m.cookieNoticeHeading(),
							description: m.cookieNoticeDescription(),
							acceptAllBtn: m.acceptAll(),
							acceptNecessaryBtn: m.rejectAll(),
							showPreferencesBtn: m.managePreferences()
						},
						preferencesModal: {
							title: m.managePreferences(),
							acceptAllBtn: m.acceptAll(),
							acceptNecessaryBtn: m.rejectAll(),
							savePreferencesBtn: m.save(),
							closeIconLabel: m.close(),
							sections: [
								{
									title: m.technicalNecessary(),
									description: m.technicalNecessaryDescription(),
									linkedCategory: 'necessary'
								}
							]
						}
					}
				}
			}
		});
	});
</script>

<style>
	/*
	 * DMUN corporate design on top of vanilla-cookieconsent. Every colour comes from the
	 * daisyUI theme tokens, so the banner follows light and dark like the rest of the app.
	 * Flat by instruction: no shadows, square panels, 2px radius only on buttons and
	 * toggles, a turquoise Akzentstreifen along the top edge.
	 */
	:global(html #cc-main) {
		--cc-font-family: var(--font-family-sans);
		--cc-modal-border-radius: var(--radius-box);
		--cc-btn-border-radius: var(--radius-field);
		--cc-pm-toggle-border-radius: var(--radius-field);
		--cc-modal-margin: 1rem;
		--cc-z-index: 2147483647;

		--cc-bg: var(--color-base-100);
		--cc-primary-color: var(--color-base-content);
		--cc-secondary-color: color-mix(in oklab, var(--color-base-content) 75%, transparent);
		--cc-link-color: var(--color-primary);
		--cc-separator-border-color: var(--color-base-300);
		--cc-overlay-bg: color-mix(in oklab, #1b1837 70%, transparent);

		--cc-btn-primary-bg: var(--color-primary);
		--cc-btn-primary-color: var(--color-primary-content);
		--cc-btn-primary-border-color: var(--color-primary);
		--cc-btn-primary-hover-bg: color-mix(in oklab, var(--color-primary) 85%, black);
		--cc-btn-primary-hover-color: var(--color-primary-content);
		--cc-btn-primary-hover-border-color: color-mix(in oklab, var(--color-primary) 85%, black);

		--cc-btn-secondary-bg: transparent;
		--cc-btn-secondary-color: var(--color-base-content);
		--cc-btn-secondary-border-color: var(--color-base-300);
		--cc-btn-secondary-hover-bg: var(--color-base-200);
		--cc-btn-secondary-hover-color: var(--color-base-content);
		--cc-btn-secondary-hover-border-color: var(--color-base-300);

		--cc-toggle-on-bg: var(--color-primary);
		--cc-toggle-off-bg: var(--color-base-300);
		--cc-toggle-on-knob-bg: var(--color-base-100);
		--cc-toggle-off-knob-bg: var(--color-base-100);
		--cc-toggle-enabled-icon-color: var(--color-primary);
		--cc-toggle-disabled-icon-color: var(--color-base-content);
		--cc-toggle-readonly-bg: color-mix(in oklab, var(--color-primary) 45%, var(--color-base-300));
		--cc-toggle-readonly-knob-bg: var(--color-base-100);
		--cc-toggle-readonly-knob-icon-color: var(--color-primary);

		--cc-section-category-border: var(--color-base-300);
		--cc-cookie-category-block-bg: var(--color-base-200);
		--cc-cookie-category-block-border: var(--color-base-300);
		--cc-cookie-category-block-hover-bg: var(--color-base-200);
		--cc-cookie-category-block-hover-border: var(--color-base-300);
		--cc-cookie-category-expanded-block-bg: var(--color-base-100);
		--cc-cookie-category-expanded-block-hover-bg: var(--color-base-200);

		--cc-footer-bg: var(--color-base-200);
		--cc-footer-color: var(--cc-secondary-color);
		--cc-footer-border-color: var(--color-base-300);
		--cc-webkit-scrollbar-bg: var(--color-base-300);
		--cc-webkit-scrollbar-hover-bg: color-mix(in oklab, var(--color-base-content) 40%, transparent);
	}

	:global(html #cc-main .cm),
	:global(html #cc-main .pm) {
		border: var(--border) solid var(--color-base-300);
		border-top: 4px solid var(--color-accent);
		box-shadow: none;
	}

	/* Outfit ships 200, 300, 400 and 700 only: headings and buttons are Bold, body Regular */
	:global(html #cc-main .cm__title),
	:global(html #cc-main .pm__title),
	:global(html #cc-main .pm__section-title) {
		font-weight: 700;
	}

	/* Headings in DMUN-Blau on white. On the dark ground they stay white */
	:global(html #cc-main .cm__title),
	:global(html #cc-main .pm__title) {
		color: var(--color-primary);
	}

	:global(html[data-theme='dark'] #cc-main .cm__title),
	:global(html[data-theme='dark'] #cc-main .pm__title) {
		color: var(--color-base-content);
	}

	@media (prefers-color-scheme: dark) {
		:global(:root:not([data-theme='light']) #cc-main .cm__title),
		:global(:root:not([data-theme='light']) #cc-main .pm__title) {
			color: var(--color-base-content);
		}
	}

	:global(html #cc-main .cm__btn),
	:global(html #cc-main .pm__btn) {
		font-weight: 700;
	}

	:global(html #cc-main .cm__btn:focus-visible),
	:global(html #cc-main .pm__btn:focus-visible) {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
</style>
