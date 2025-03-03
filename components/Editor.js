'use client'

import { useEffect, useRef } from 'react'
import { LexicalEditor, EditorToolbar } from 'lexical-editor-easy'
import { useEditor } from '../lib/EditorContext'

// Signal that the Lexical editor has loaded successfully
if (typeof window !== 'undefined') {
  window.LexicalEditorLoaded = true;
}

const editorConfig = {
  namespace: 'note-editor',
  onError: (error) => console.error(error),
  theme: {
    text: {
      bold: 'font-bold',
      italic: 'italic',
      underline: 'underline',
      underlineStrikethrough: 'underline line-through',
      strikethrough: 'line-through',
    },
    paragraph: 'mb-2',
    heading: {
      h1: 'text-3xl font-bold mb-3 mt-6',
      h2: 'text-2xl font-bold mb-2 mt-5',
      h3: 'text-xl font-bold mb-1 mt-4',
    },
    list: {
      ul: 'list-disc ml-6 mb-2',
      ol: 'list-decimal ml-6 mb-2',
      listitem: 'mb-1'
    },
    quote: 'border-l-4 border-gray-300 pl-4 py-2 italic mb-4 text-gray-600 dark:text-gray-300',
    link: 'text-primary-600 underline dark:text-primary-400',
    code: 'bg-gray-100 px-2 py-1 rounded font-mono text-sm dark:bg-gray-800',
    codeHighlight: {
      keyword: 'text-purple-500',
      function: 'text-blue-500',
      string: 'text-green-500',
    }
  },
  editorState: undefined,
  // New features in 1.1.0
  autoFocus: true,
  plugins: []
}

export default function Editor({ noteContent, onChange }) {
  const { editor, setEditor } = useEditor()
  const editorInitializedRef = useRef(false)

  // Handle editor initialization with improved approach for 1.1.0
  const handleEditorInit = (lexicalEditor) => {
    if (!editorInitializedRef.current) {
      console.log("Editor initialized:", lexicalEditor)
      setEditor(lexicalEditor)
      editorInitializedRef.current = true
    }
  }

  // Improved way to handle content changes in 1.1.0
  useEffect(() => {
    if (editor && noteContent) {
      try {
        const editorState = editor.parseEditorState(noteContent)
        editor.setEditorState(editorState)
      } catch (error) {
        console.error("Error loading note:", error)
      }
    }
  }, [noteContent, editor])

  return (
    <div className="flex flex-col h-full">
      {/* Use improved toolbar in 1.1.0 with more options */}
      <EditorToolbar
        editor={editor}
        className="sticky top-0 z-10 bg-white border-b dark:bg-gray-800 dark:border-gray-700 p-2 rounded-t-lg"
        defaultFontSize="16px"
        defaultFontFamily="Inter"
        showHeadings
        showFormatting
        showAlignment
        showLists
        showIndent
        showLink
      />
      <div className="flex-1 overflow-auto p-4 bg-white dark:bg-gray-800 rounded-b-lg">
        <LexicalEditor
          config={editorConfig}
          onInit={handleEditorInit}
          onChange={onChange}
          className="min-h-[500px] editor-content focus:outline-none"
          // New props in 1.1.0
          placeholder="Start typing your note..."
          contentEditableClassName="outline-none min-h-[500px] py-2"
        />
      </div>
    </div>
  )
}
