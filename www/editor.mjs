import { cobalt } from "thememirror";

import { EditorState } from "@codemirror/state";
import { highlightSelectionMatches } from "@codemirror/search";
import {
  indentWithTab,
  history,
  defaultKeymap,
  historyKeymap,
} from "@codemirror/commands";
import {
  foldGutter,
  indentOnInput,
  indentUnit,
  bracketMatching,
  foldKeymap,
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language";
import {
  closeBrackets,
  autocompletion,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import {
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
  keymap,
  EditorView,
} from "@codemirror/view";

// Language
import { StreamLanguage } from "@codemirror/language";
import { lua } from "@codemirror/legacy-modes/mode/lua";
import { javascript } from "@codemirror/lang-javascript";

import { tcl } from "@codemirror/legacy-modes/mode/tcl";

function createEditorState(initialContents, options = {}) {
  let extensions = [
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    indentUnit.of("    "),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
      indentWithTab,
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
    ]),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    cobalt,
  ];

  if (options.js) {
    extensions.push(javascript());
    extensions.push(lineNumbers());
  }

  if (options.lua) {
    extensions.push(StreamLanguage.define(lua));
    extensions.push(lineNumbers());
  }

  if (options.tcl) {
    extensions.push(StreamLanguage.define(tcl));
    extensions.push(lineNumbers());
  }

  return EditorState.create({
    doc: initialContents,
    extensions,
  });
}

function createEditorView(state, parent) {
  return new EditorView({ state, parent });
}

export { createEditorState, createEditorView };
