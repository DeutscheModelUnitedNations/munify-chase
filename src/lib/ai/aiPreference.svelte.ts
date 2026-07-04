import { browser } from '$app/environment';
import type { AiMode } from './call';

export type AiPreference = 'backend' | 'local' | 'off';

const STORAGE_ONBOARDED = 'chase:ai:onboarded';
const STORAGE_MODE = 'chase:ai:mode';
const STORAGE_MODEL_TIER = 'chase:ai:model-tier';

let _onboarded = $state(false);
let _preference = $state<AiPreference>('local');
/** null = auto-detect; 0 = fastest … 3 = best quality */
let _modelTier = $state<number | null>(null);

export function initAiPreference(): void {
	if (!browser) return;
	_onboarded = localStorage.getItem(STORAGE_ONBOARDED) === 'true';
	const storedMode = localStorage.getItem(STORAGE_MODE) as AiPreference | null;
	if (storedMode) _preference = storedMode;
	const storedTier = localStorage.getItem(STORAGE_MODEL_TIER);
	_modelTier = storedTier !== null ? Number(storedTier) : null;
}

export function getAiOnboarded(): boolean {
	return _onboarded;
}

export function getAiPreference(): AiPreference {
	return _preference;
}

export function getLocalModelTier(): number | null {
	return _modelTier;
}

export function setAiPreference(mode: AiPreference, modelTier?: number | null): void {
	_preference = mode;
	_onboarded = true;
	if (modelTier !== undefined) _modelTier = modelTier;
	if (!browser) return;
	localStorage.setItem(STORAGE_MODE, mode);
	localStorage.setItem(STORAGE_ONBOARDED, 'true');
	if (modelTier !== undefined) {
		if (modelTier === null) {
			localStorage.removeItem(STORAGE_MODEL_TIER);
		} else {
			localStorage.setItem(STORAGE_MODEL_TIER, String(modelTier));
		}
	}
}

/** Maps user preference to the AiMode used by callAI. Only valid when preference !== 'off'. */
export function preferenceToMode(pref: AiPreference): AiMode {
	return pref === 'backend' ? 'online' : 'offline';
}
