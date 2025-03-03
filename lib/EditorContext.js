'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create a context to store the editor instance
const EditorContext = createContext(null);

export function EditorProvider({ children }) {
  const [editor, setEditor] = useState(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  
  // Enhanced editor setup for 1.1.0
  const initializeEditor = useCallback((lexicalEditor) => {
    setEditor(lexicalEditor);
    setIsEditorReady(true);
    console.log("Editor initialized and ready");
  }, []);
  
  // Debug log when editor changes
  useEffect(() => {
    console.log("Editor context updated:", editor ? "initialized" : "null");
  }, [editor]);
  
  return (
    <EditorContext.Provider value={{ 
      editor, 
      setEditor: initializeEditor, 
      isEditorReady 
    }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  return useContext(EditorContext);
}
