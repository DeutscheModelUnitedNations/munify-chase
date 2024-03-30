import React, { useState, useCallback, useMemo } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { Descendant, Editor, Element, Node, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Slate, Editable, withReact, RenderElementProps } from "slate-react";
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
import SmallInfoCard from "../small_info_card";
import { checkValidOperators } from "@/misc/res_parser";

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
    if (type === ListType.UNORDERED) {
      return Element.isElementType(node, Type.UNORDERED_LIST);
    }
    return (
      Element.isElementType(node, Type.ORDERED_LIST) ||
      Element.isElementType(node, Type.UNORDERED_LIST)
    );
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
  createListNode(type: ListType = ListType.UNORDERED, props = {}) {
    const nodeType =
      type === ListType.ORDERED ? Type.ORDERED_LIST : Type.UNORDERED_LIST;
    return { children: [{ text: "" }], ...props, type: nodeType };
  },
  createListItemNode(props = {}) {
    return { children: [{ text: "" }], ...props, type: Type.LIST_ITEM };
  },
  createListItemTextNode(props = {}) {
    return { children: [{ text: "" }], ...props, type: Type.LIST_ITEM_TEXT };
  },
};

export default function SlateClauseEditor({
  content,
  viewOnly,
  setContentFunction,
}: {
  content?: Descendant[];
  viewOnly?: boolean;
  setContentFunction?: (content: Descendant[]) => void;
}) {
  const { LL, locale } = useI18nContext();
  const [editor] = useState<Editor>(
    withLists(schema)(withHistory(withReact(createEditor()))),
  );
  const [validOperator, setValidOperator] = useState<boolean>(false);

  const initialValue = useMemo(
    () =>
      content || [
        { type: Type.PARAGRAPH, children: [{ text: "Hello world!" }] },
      ],
    [],
  );

  const renderLeaf = useCallback((props) => {
    return <Leaf viewOnly={viewOnly} {...props} />;
  }, []);

  const renderElement = useCallback(
    ({ element, attributes, children }: RenderElementProps) => {
      switch (element.type) {
        case Type.PARAGRAPH:
          return <p {...attributes}>{children}</p>;
        case Type.ORDERED_LIST:
          return <ol {...attributes}>{children}</ol>;
        case Type.UNORDERED_LIST:
          return (
            <ul {...attributes} className="list-lower-alpha">
              {children}
            </ul>
          );
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

  const CustomEditor = {
    isOperatorMarkActive(editor) {
      const marks = Editor.marks(editor);
      return marks ? marks.operator === true : false;
    },

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
        initialValue={initialValue}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            (op) => "set_selection" !== op.type,
          );
          if (isAstChange) {
            setContentFunction(value);
            setValidOperator(checkValidOperators(value, "operativeClauses"));
          }
        }}
      >
        {!viewOnly && (
          <Toolbar
            start={
              <div className="flex gap-2 flex-wrap">
                <Button
                  label="Operator"
                  faIcon={faSealExclamation}
                  onClick={() => CustomEditor.toggleOperatorMark(editor)}
                  severity="danger"
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
                    } else {
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
        )}
        <Editable
          className={`w-full p-4 border rounded-md prose ${
            viewOnly ? "font-times indent-10" : ""
          }`}
          readOnly={viewOnly}
          renderLeaf={renderLeaf}
          renderElement={renderElement}
        />
      </Slate>
      {!validOperator && (
        <SmallInfoCard icon={faSealExclamation} className="mt-2">
          Operator missing
        </SmallInfoCard>
      )}
    </>
  );
}

const Leaf = (props) => {
  return (
    <span
      {...props.attributes}
      className={
        props.leaf.operator
          ? `italic ${props.viewOnly ? "" : "text-red-500 underline"}`
          : ""
      }
    >
      {props.children}
    </span>
  );
};
