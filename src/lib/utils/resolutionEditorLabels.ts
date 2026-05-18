/**
 * i18n Adapter for the Resolution Editor Library
 *
 * Maps Paraglide messages to the library's ResolutionEditorLabels interface.
 */

import type { ResolutionEditorLabels } from '@deutschemodelunitednations/munify-resolution-editor/i18n';
import * as m from '$lib/paraglide/messages';

/**
 * Creates a ResolutionEditorLabels object from Paraglide messages.
 * Call this function to get the current language's labels.
 */
export function getResolutionLabels(): ResolutionEditorLabels {
	return {
		// Editor chrome
		resolutionEditor: m.resolutionEditor(),
		resolution: m.resolution(),
		resolutionPreview: m.resolutionPreview(),
		resolutionShowPreview: m.resolutionShowPreview(),
		resolutionHidePreview: m.resolutionHidePreview(),

		// Sections
		resolutionCommittee: m.resolutionCommittee(),
		resolutionPreambleClauses: m.resolutionPreambleClauses(),
		resolutionOperativeClauses: m.resolutionOperativeClauses(),
		resolutionSubClauses: m.resolutionSubClauses(),

		// Actions
		resolutionAddClause: m.resolutionAddClause(),
		resolutionAddFirstClause: m.resolutionAddFirstClause(),
		resolutionDeleteClause: m.resolutionDeleteClause(),
		resolutionDeleteBlock: m.resolutionDeleteBlock(),
		resolutionMoveUp: m.resolutionMoveUp(),
		resolutionMoveDown: m.resolutionMoveDown(),
		resolutionIndent: m.resolutionIndent(),
		resolutionOutdent: m.resolutionOutdent(),
		resolutionAddSubClause: m.resolutionAddSubClause(),
		resolutionAddSibling: m.resolutionAddSibling(),
		resolutionAddNested: m.resolutionAddNested(),
		resolutionAddContinuation: m.resolutionAddContinuation(),

		// Placeholders
		resolutionPreamblePlaceholder: m.resolutionPreamblePlaceholder(),
		resolutionOperativePlaceholder: m.resolutionOperativePlaceholder(),
		resolutionSubClausePlaceholder: m.resolutionSubClausePlaceholder(),
		resolutionContinuationPlaceholder: m.resolutionContinuationPlaceholder(),

		// Empty states
		resolutionNoPreambleClauses: m.resolutionNoPreambleClauses(),
		resolutionNoOperativeClauses: m.resolutionNoOperativeClauses(),
		resolutionNoClausesYet: m.resolutionNoClausesYet(),

		// Validation
		resolutionUnknownPhrase: m.resolutionUnknownPhrase(),

		// Phrase lookup
		phraseLookup: m.phraseLookup(),
		phraseLookupTitle: m.phraseLookupTitle(),
		phraseLookupSearch: m.phraseLookupSearch(),
		phraseLookupDisclaimer: m.phraseLookupDisclaimer(),
		phraseLookupNoResults: m.phraseLookupNoResults(),
		phraseCopied: m.phraseCopied(),
		copyFailed: m.copyFailed(),

		// Import - {count} interpolation is handled by the library
		resolutionImport: m.resolutionImport(),
		resolutionImportPreamble: m.resolutionImportPreamble(),
		resolutionImportOperative: m.resolutionImportOperative(),
		resolutionImportButton: m.resolutionImportButton({ count: '{count}' }),
		resolutionImportPreview: m.resolutionImportPreview({ count: '{count}' }),
		resolutionImportHintPreamble: m.resolutionImportHintPreamble(),
		resolutionImportHintOperative: m.resolutionImportHintOperative(),
		resolutionImportTipsTitle: m.resolutionImportTipsTitle(),
		resolutionImportTipsPreamble1: m.resolutionImportTipsPreamble1(),
		resolutionImportTipsPreamble2: m.resolutionImportTipsPreamble2(),
		resolutionImportTipsPreamble3: m.resolutionImportTipsPreamble3(),
		resolutionImportTipsOperative1: m.resolutionImportTipsOperative1(),
		resolutionImportTipsOperative2: m.resolutionImportTipsOperative2(),
		resolutionImportTipsOperative3: m.resolutionImportTipsOperative3(),
		resolutionImportTipsOperative4: m.resolutionImportTipsOperative4(),
		resolutionImportLLMTitle: m.resolutionImportLLMTitle(),
		resolutionImportLLMInstructions: m.resolutionImportLLMInstructions(),
		resolutionImportLLMCopyPrompt: m.resolutionImportLLMCopyPrompt(),
		resolutionImportLLMCopied: m.resolutionImportLLMCopied(),
		resolutionImportLLMPromptPreamble: m.resolutionImportLLMPromptPreamble(),
		resolutionImportLLMPromptOperative: m.resolutionImportLLMPromptOperative(),

		// Import full resolution / export
		resolutionExport: m.resolutionExport(),
		resolutionImportResolution: m.resolutionImportResolution(),
		resolutionImportResolutionHint: m.resolutionImportResolutionHint(),
		resolutionImportResolutionFile: m.resolutionImportResolutionFile(),
		resolutionImportResolutionButton: m.resolutionImportResolutionButton(),
		resolutionImportResolutionInvalid: m.resolutionImportResolutionInvalid(),
		resolutionImportResolutionWarnings: m.resolutionImportResolutionWarnings(),
		resolutionImportResolutionEmpty: m.resolutionImportResolutionEmpty(),

		// Preview metadata
		resolutionSponsoringDelegations: m.resolutionSponsoringDelegations(),
		resolutionAuthoringDelegation: m.resolutionAuthoringDelegation(),
		resolutionDisclaimer: m.resolutionDisclaimer({ conferenceName: '{conferenceName}' }),

		// Amendments
		amendmentProposed: m.amendmentProposed(),
		amendmentAdd: m.amendmentAdd(),
		amendmentDelete: m.amendmentDelete(),
		amendmentAlterText: m.amendmentAlterText(),
		amendmentAlterPosition: m.amendmentAlterPosition(),
		amendmentRejectedClause: m.amendmentRejectedClause(),

		// Common
		close: m.close(),
		cancel: m.cancel(),
		copy: m.copy()
	};
}

/**
 * Creates localized import button text with count interpolation.
 */
export function getImportButtonLabel(count: number): string {
	return m.resolutionImportButton({ count: count.toString() });
}

/**
 * Creates localized import preview text with count interpolation.
 */
export function getImportPreviewLabel(count: number): string {
	return m.resolutionImportPreview({ count: count.toString() });
}

/**
 * Creates localized disclaimer text with conference name interpolation.
 */
export function getDisclaimerText(conferenceName: string): string {
	return m.resolutionDisclaimer({ conferenceName });
}
