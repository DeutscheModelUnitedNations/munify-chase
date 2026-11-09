import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

export const extensions = [
	// StarterKit bundles all the basics the whiteboard uses (marks, headings, lists,
	// links, quotes, undo history). The ones it never offered stay off.
	StarterKit.configure({
		codeBlock: false,
		gapcursor: false,
		hardBreak: false,
		listKeymap: false,
		trailingNode: false
	}),
	Image.configure({
		allowBase64: true
	})
];
