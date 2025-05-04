import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import Code from '@tiptap/extension-code';
import Link from '@tiptap/extension-link';
import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import OrderedList from '@tiptap/extension-ordered-list';
import Image from '@tiptap/extension-image';
import History from '@tiptap/extension-history';
import Dropcursor from '@tiptap/extension-dropcursor';

export const extensions = [
	Document,
	Paragraph,
	Text,
	Bold,
	Italic,
	Strike,
	Code,
	Underline,
	Heading,
	Link,
	Blockquote,
	BulletList,
	ListItem,
	HorizontalRule,
	OrderedList,
	Image.configure({
		allowBase64: true,
		inline: true
	}),
	History,
	Dropcursor
];
