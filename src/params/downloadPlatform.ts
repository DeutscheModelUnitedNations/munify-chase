import type { ParamMatcher } from '@sveltejs/kit';
import { isDownloadPlatform } from '$lib/helpers/downloads';

export const match: ParamMatcher = isDownloadPlatform;
