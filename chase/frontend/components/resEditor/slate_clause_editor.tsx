import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import {
  Descendant,
  Editor,
  Element,
  Node,
  Text,
  Transforms,
  createEditor,
} from "slate";
import { withHistory } from "slate-history";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  useSlate,
} from "slate-react";
import { Toolbar } from "primereact/toolbar";
import Button from "../button";
import {
  faIndent,
  faList12,
  faOutdent,
  faSealExclamation,
} from "@fortawesome/pro-solid-svg-icons";
import useMousetrap from "mousetrap-react";
import {
  ListType,
  ListsEditor,
  ListsSchema,
  withLists,
} from "@prezly/slate-lists";
import { Type } from "./slate_types";
import { ResDelimiter } from "./clause";
import { render } from "react-dom";

const schema: ListsSchema = {
  isConvertibleToListTextNode(node: Node) {
    return Element.isElementType(node, Type.PARAGRAPH);
  },
  isDefaultTextNode(node: Node) {
    return Element.isElementType(node, Type.PARAGRAPH);
  },
  isListNode(node: Node, type?: ListType) {
    if (type === ListType.ORDERED) {
      return Element.isElementType(node, Type.ORDERED_LIST);
    }
    return Element.isElementType(node, Type.ORDERED_LIST);
  },
  isListItemNode(node: Node) {
    return Element.isElementType(node, Type.LIST_ITEM);
  },
  isListItemTextNode(node: Node) {
    return Element.isElementType(node, Type.LIST_ITEM_TEXT);
  },
  createDefaultTextNode(props = {}) {
    return { children: [{ text: "" }], ...props, type: Type.PARAGRAPH };
  },
  createListNode(type: ListType = ListType.ORDERED, props = {}) {
    const nodeType = Type.ORDERED_LIST;
    return { children: [{ text: "" }], ...props, type: nodeType };
  },
  createListItemNode(props = {}) {
    return { children: [{ text: "" }], ...props, type: Type.LIST_ITEM };
  },
  createListItemTextNode(props = {}) {
    return { children: [{ text: "" }], ...props, type: Type.LIST_ITEM_TEXT };
  },
};

/**
 * A component for viewing and editing clauses using Slate.js.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Descendant[]} props.content - The initial content of the editor.
 * @param {boolean} props.viewOnly - Whether the editor is in view-only mode.
 * @param {boolean} props.renderForResolution - Whether the editor is being rendered for resolution (also view-only).
 * @param {number} props.clauseNumber - The number of the clause.
 * @param {function} props.setContentFunction - A function to update the clause.
 * @returns {JSX.Element} The SlateClauseEditor component.
 */
export default function SlateClauseEditor({
  content,
  viewOnly,
  renderForResolution,
  clauseNumber,
  delimiter,
  setContentFunction,
}: {
  content?: Descendant[];
  viewOnly?: boolean;
  renderForResolution?: boolean;
  clauseNumber?: number;
  delimiter?: ResDelimiter;
  setContentFunction?: (content: Descendant[]) => void;
}) {
  const { LL, locale } = useI18nContext();
  const [editor] = useState<Editor>(
    withLists(schema)(withHistory(withReact(createEditor()))),
  );

  useEffect(() => {
    editor.children = content || [];
  }, [content]);

  /**
   * Renders a leaf node in the Slate editor.
   *
   * @param {object} props - The component props.
   * @param {object} props.leaf - The leaf node data.
   * @param {ReactNode} props.children - The content of the leaf node.
   * @param {object} props.attributes - The attributes to be applied to the rendered element.
   * @returns {ReactNode} The rendered leaf node.
   */
  const Leaf = ({ attributes, children, leaf, viewOnly }) => {
    if (leaf.clauseNumber) {
      return <span className="font-bold mr-6 lining-nums">{children}.</span>;
    }

    return (
      <span
        {...attributes}
        className={
          leaf.operator
            ? `italic ${viewOnly ? "" : "text-red-500 underline"}`
            : ""
        }
      >
        {children}
      </span>
    );
  };

  useEffect(() => {
    // Select the entire editor content
    Transforms.select(editor, []);
    Transforms.move(editor, { edge: "end" });
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf viewOnly={viewOnly || renderForResolution} {...props} />;
  }, []);

  /**
   * Renders the element based on its type.
   *
   * @param element - The element to be rendered.
   * @param attributes - The attributes to be applied to the element.
   * @param children - The children elements of the element.
   * @returns The rendered element.
   */
  const renderElement = useCallback(
    ({ element, attributes, children }: RenderElementProps) => {
      switch (element.type) {
        case Type.PARAGRAPH:
          return <p {...attributes}>{children}</p>;
        case Type.ORDERED_LIST:
          return <ol {...attributes}>{children}</ol>;
        case Type.LIST_ITEM:
          return <li {...attributes}>{children}</li>;
        case Type.LIST_ITEM_TEXT:
          return <div {...attributes}>{children}</div>;
        default:
          return <p {...attributes}>{children}</p>;
      }
    },
    [],
  );

  useEffect(() => {
    Transforms.removeNodes(editor, {
      at: [],
      match: (node) => Text.isText(node) && node.clauseNumber === true,
    });

    if (!clauseNumber) return;
    if (!renderForResolution && !viewOnly) return;
    if (!content || content.length === 0) return;

    Transforms.insertNodes(
      editor,
      [{ text: clauseNumber.toString(), clauseNumber: true }],
      { at: [0, 0] },
    );
  }, [clauseNumber, content]);

  useEffect(() => {
    if (!delimiter) return;
    if (!content || content.length === 0) return;

    Transforms.deselect(editor);
    Transforms.removeNodes(editor, {
      at: [],
      match: (node) => Text.isText(node) && node.delimiter === true,
    });
    Transforms.insertNodes(editor, [{ text: delimiter, delimiter: true }]);
  }, [delimiter, content]);

  /**
   * CustomEditor object provides utility functions for working with the editor.
   */
  const CustomEditor = {
    /**
     * Checks if the operator mark is active in the editor.
     * @param {Editor} editor - The Slate editor object.
     * @returns {boolean} - True if the operator mark is active, false otherwise.
     */
    isOperatorMarkActive(editor) {
      const marks = Editor.marks(editor);
      return marks ? marks.operator === true : false;
    },

    /**
     * Toggles the operator mark in the editor.
     * @param {Editor} editor - The Slate editor object.
     */
    toggleOperatorMark(editor) {
      const isActive = CustomEditor.isOperatorMarkActive(editor);
      if (isActive) {
        Editor.removeMark(editor, "operator");
      } else {
        Editor.addMark(editor, "operator", true);
      }
    },
  };

  useMousetrap("ctrl+b", () => {
    CustomEditor.toggleOperatorMark(editor);
  });

  return (
    <>
      <Slate
        editor={editor}
        initialValue={content || []}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            (op) => "set_selection" !== op.type,
          );
          if (isAstChange) {
            if (!setContentFunction) return;
            setContentFunction(value);
          }
        }}
      >
        {!viewOnly && !renderForResolution && (
          <EditorToolbar CustomEditor={CustomEditor} editor={editor} />
        )}
        <Editable
          className={
            renderForResolution
              ? "prose w-full font-times indent-10 max-w-full"
              : `w-full p-4 border rounded-md prose max-w-full ${
                  viewOnly ? "font-times indent-10" : ""
                }`
          }
          readOnly={viewOnly || renderForResolution}
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          placeholder={LL.resolutionEditor.editor.PLACEHOLDER()}
          renderPlaceholder={({ children, attributes }) => (
            <div {...attributes} className="py-4">
              {children}
            </div>
          )}
          autoFocus
        />
      </Slate>
    </>
  );
}

function EditorToolbar({
  CustomEditor,
  editor,
}: {
  CustomEditor: {
    isOperatorMarkActive: (editor: Editor) => boolean;
    toggleOperatorMark: (editor: Editor) => void;
  };
  editor: Editor;
}) {
  return (
    <Toolbar
      start={
        <div className="flex gap-2 flex-wrap">
          <Button
            label="Operator"
            faIcon={faSealExclamation}
            onClick={() => CustomEditor.toggleOperatorMark(editor)}
            severity={
              CustomEditor.isOperatorMarkActive(editor) ? "success" : "danger"
            }
            size="small"
          />
          <Button
            label="List"
            faIcon={faList12}
            onClick={() => {
              if (
                editor.selection &&
                ListsEditor.isListItemTextNode(
                  editor,
                  Node.parent(editor, editor.selection.anchor.path),
                )
              ) {
                ListsEditor.unwrapList(editor, editor.selection);
              } else if (editor.selection) {
                ListsEditor.wrapInList(
                  editor,
                  ListType.ORDERED,
                  editor.selection,
                );
              }
            }}
            size="small"
            severity={
              editor.selection &&
              ListsEditor.isListNode(
                editor,
                Node.get(editor, editor.selection.anchor.path),
              )
                ? "warning"
                : undefined
            }
          />
          <Button
            faIcon={faOutdent}
            onClick={() => {
              ListsEditor.decreaseDepth(editor, editor.selection);
            }}
            size="small"
            outlined
          />
          <Button
            faIcon={faIndent}
            onClick={() => {
              ListsEditor.increaseDepth(editor, editor.selection);
            }}
            size="small"
            outlined
          />
        </div>
      }
      className="mb-2"
    />
  );
}
