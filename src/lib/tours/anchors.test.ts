import { tourAnchorsSuite } from '@deutschemodelunitednations/docs-kit/testing';

// Fails when a component loses a `data-tour` anchor that a tour still points at,
// so tours can't silently break when the UI changes.
tourAnchorsSuite();
