import { createContext, useContext, useState } from 'react';

// Create a context to store the editor instance
const EditorContext = createContext(null);

export function EditorProvider({ children }) {
  const [editor, setEditor] = useState(null);
  
  return (
    <EditorContext.Provider value={{ editor, setEditor }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  return useContext(EditorContext);
}
