'use client'

import { useState, useEffect } from 'react'
import { useEditor } from '../lib/EditorContext'

export default function SimpleEditor({ noteContent, onChange }) {
  const [text, setText] = useState('')
  const { setEditor } = useEditor()
  
  // Create a simple editor API that mimics the Lexical interface
  useEffect(() => {
    const simpleEditorAPI = {
      getEditorState: () => ({
        toJSON: () => ({
          root: {
            children: [
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: "normal",
                    style: "",
                    text: text,
                    type: "text",
                    version: 1
                  }
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "paragraph",
                version: 1
              }
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "root",
            version: 1
          }
        })
      }),
      parseEditorState: (json) => {
        try {
          const parsed = typeof json === 'string' ? JSON.parse(json) : json;
          return {
            toJSON: () => parsed
          };
        } catch (e) {
          console.error('Failed to parse editor state', e);
          return {
            toJSON: () => ({})
          };
        }
      },
      setEditorState: (state) => {
        try {
          const json = typeof state === 'string' ? JSON.parse(state) : state.toJSON();
          let content = '';
          
          // Try to extract text from Lexical JSON
          if (json.root?.children) {
            for (const child of json.root.children) {
              if (child.children) {
                for (const textNode of child.children) {
                  if (textNode.text) {
                    content += textNode.text + '\n';
                  }
                }
              }
            }
          }
          
          setText(content.trim());
        } catch (e) {
          console.error('Failed to set editor state', e);
        }
      }
    };
    
    // Register our simple editor with the context
    setEditor(simpleEditorAPI);
    
    // Flag that will prevent the fallback from showing
    if (typeof window !== 'undefined') {
      window.LexicalEditorLoaded = true;
    }
  }, [text, setEditor]);
  
  // Parse initial content
  useEffect(() => {
    if (noteContent) {
      try {
        const parsed = JSON.parse(noteContent);
        let content = '';
        
        if (parsed.root?.children) {
          for (const child of parsed.root.children) {
            if (child.children) {
              for (const textNode of child.children) {
                if (textNode.text) {
                  content += textNode.text + '\n';
                }
              }
            }
          }
        }
        
        setText(content.trim());
      } catch (e) {
        console.error('Failed to parse note content', e);
      }
    }
  }, [noteContent]);
  
  // Handle text change
  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    
    // Create a simple Lexical-like JSON structure
    const simpleJson = {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: newText,
                type: "text",
                version: 1
              }
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1
          }
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1
      }
    };
    
    onChange(JSON.stringify(simpleJson));
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-t-lg flex items-center gap-2">
        <button className="px-3 py-1 bg-white dark:bg-gray-600 rounded shadow-sm">Normal Text</button>
        <button className="px-2 py-1 hover:bg-white/50 dark:hover:bg-gray-600/50 rounded">
          <strong>B</strong>
        </button>
        <button className="px-2 py-1 hover:bg-white/50 dark:hover:bg-gray-600/50 rounded">
          <em>I</em>
        </button>
        <button className="px-2 py-1 hover:bg-white/50 dark:hover:bg-gray-600/50 rounded">
          <span className="underline">U</span>
        </button>
      </div>
      <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-b-lg bg-white dark:bg-gray-800">
        <textarea
          value={text}
          onChange={handleChange}
          className="w-full h-full p-4 resize-none border-0 focus:ring-0 focus:outline-none bg-transparent"
          placeholder="Start typing your note here..."
        />
      </div>
    </div>
  );
}
