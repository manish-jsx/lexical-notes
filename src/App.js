import React, { useState, useEffect, useCallback } from 'react';
import { LexicalEditor } from 'lexical-editor-easy';
import { useEditor } from './EditorInstance';
import './App.css';

// Default configuration for the Lexical Editor
const editorConfig = {
  namespace: 'note-editor',
  onError: (error) => console.error(error),
  theme: {
    text: {
      bold: 'font-bold',
      italic: 'italic',
      underline: 'underline',
    },
    paragraph: 'mb-2',
    heading: {
      h1: 'text-3xl font-bold mb-3',
      h2: 'text-2xl font-bold mb-2',
      h3: 'text-xl font-bold mb-1',
    }
  }
};

function App() {
  const { editor, setEditor } = useEditor();
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  
  const [currentNoteId, setCurrentNoteId] = useState(null);
  
  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);
  
  // Create a new note
  const handleCreateNewNote = useCallback(() => {
    if (!editor) return;
    
    const editorState = editor.getEditorState();
    const jsonString = JSON.stringify(editorState.toJSON());
    
    const newNote = {
      id: Date.now().toString(),
      title: `Note ${notes.length + 1}`,
      content: jsonString,
      createdAt: new Date().toISOString()
    };
    
    setNotes([...notes, newNote]);
    setCurrentNoteId(newNote.id);
  }, [editor, notes]);
  
  // Save the current note
  const handleSaveNote = useCallback(() => {
    if (!currentNoteId || !editor) return;
    
    const editorState = editor.getEditorState();
    const jsonString = JSON.stringify(editorState.toJSON());
    
    const updatedNotes = notes.map(note => {
      if (note.id === currentNoteId) {
        return {
          ...note,
          content: jsonString,
          updatedAt: new Date().toISOString()
        };
      }
      return note;
    });
    
    setNotes(updatedNotes);
  }, [currentNoteId, editor, notes]);
  
  // Delete the current note
  const handleDeleteNote = useCallback(() => {
    if (!currentNoteId) return;
    
    const updatedNotes = notes.filter(note => note.id !== currentNoteId);
    setNotes(updatedNotes);
    setCurrentNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
  }, [currentNoteId, notes]);
  
  // Handle editor initialization
  const handleEditorInitialize = useCallback((lexicalEditor) => {
    setEditor(lexicalEditor);
  }, [setEditor]);
  
  // Load the selected note into the editor
  useEffect(() => {
    const currentNote = notes.find(note => note.id === currentNoteId);
    if (currentNote && editor && currentNote.content) {
      try {
        const editorState = editor.parseEditorState(currentNote.content);
        editor.setEditorState(editorState);
      } catch (error) {
        console.error("Error loading note:", error);
      }
    }
  }, [currentNoteId, editor, notes]);
  
  return (
    <div className="App">
      <header>
        <h1>Lexical Note Taking App</h1>
      </header>
      
      <div className="note-actions">
        <button onClick={handleCreateNewNote}>New Note</button>
        <button onClick={handleSaveNote} disabled={!currentNoteId}>Save Note</button>
        <button 
          className="delete" 
          onClick={handleDeleteNote} 
          disabled={!currentNoteId}
        >
          Delete Note
        </button>
      </div>
      
      <div className="notes-container">
        <div className="note-list">
          <h3>Your Notes ({notes.length})</h3>
          {notes.map(note => (
            <div 
              key={note.id}
              className={`note-item ${currentNoteId === note.id ? 'active' : ''}`}
              onClick={() => setCurrentNoteId(note.id)}
            >
              {note.title}
            </div>
          ))}
          {notes.length === 0 && <p>No notes yet. Create your first note!</p>}
        </div>
        
        <div className="editor-container">
          <LexicalEditor
            config={editorConfig}
            onInit={handleEditorInitialize}
          />
        </div>
      </div>
    </div>
  );
}

export default App;