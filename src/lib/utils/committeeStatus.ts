import type { CommitteestatusEnum } from '$lib/api/rumbleClient/client';
import * as m from '$lib/paraglide/messages.js';

export function translateCommitteeStatusText(
  category: CommitteestatusEnum,
  overwriteText?: string
): string {
  if (overwriteText) return overwriteText;
  switch (category) {
    case 'FORMAL':
      return m.formalDebate();
    case 'INFORMAL':
      return m.informalCaucus();
    case 'PAUSE':
      return m.pause();
    case 'SUSPENSION':
      return m.suspension();
    default:
      return '';
  }
}

export function getCommitteeStatusIcon(category: CommitteestatusEnum) {
  switch (category) {
    case 'FORMAL':
      return 'podium';
    case 'INFORMAL':
      return 'comments';
    case 'PAUSE':
      return 'mug-hot';
    case 'SUSPENSION':
      return 'forward-step';
    default:
      return 'question';
  }
}

export function getCommitteeStatusBackground(category: CommitteestatusEnum) {
  switch (category) {
    case 'FORMAL':
      return 'bg-base-200';
    case 'INFORMAL':
      return 'bg-error';
    case 'PAUSE':
      return 'bg-warning';
    case 'SUSPENSION':
      return 'bg-info';
    default:
      return undefined;
  }
}
