'use client'

import { useState, useEffect, useCallback } from 'react'
import { useEditor } from '../lib/EditorContext'
import ClientOnlyEditor from './ClientOnlyEditor'
import NoteList from './NoteList'
import Button from './ui/Button'
import { PlusIcon, TrashIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export default function NoteTaking() {
  const { editor, setEditor } = useEditor()
  const [notes, setNotes] = useState([])
  const [currentNoteId, setCurrentNoteId] = useState(null)
  const [editorState, setEditorState] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes')
    const parsedNotes = savedNotes ? JSON.parse(savedNotes) : []
    setNotes(parsedNotes)
    
    // Set the first note as current if there's any
    if (parsedNotes.length > 0 && !currentNoteId) {
      setCurrentNoteId(parsedNotes[0].id)
    }
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  // Create a new note - improved for 1.1.0
  const handleCreateNewNote = useCallback(() => {
    // Updated empty state format for 1.1.0
    let jsonString = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';
    
    // Use editor if available to get current state (unchanged approach works with 1.1.0)
    if (editor) {
      try {
        const editorState = editor.getEditorState();
        jsonString = JSON.stringify(editorState.toJSON());
      } catch (error) {
        console.error("Error getting editor state:", error);
      }
    }
    
    const newNote = {
      id: Date.now().toString(),
      title: `Note ${notes.length + 1}`,
      content: jsonString,
      createdAt: new Date().toISOString()
    };
    
    setNotes(prev => [...prev, newNote]);
    setCurrentNoteId(newNote.id);
  }, [editor, notes.length]);
  
  // Save the current note - this approach still works in 1.1.0
  const handleSaveNote = useCallback(() => {
    if (!currentNoteId || !editor) return
    
    const editorState = editor.getEditorState()
    const jsonString = JSON.stringify(editorState.toJSON())
    
    setNotes(prev => prev.map(note => {
      if (note.id === currentNoteId) {
        return {
          ...note,
          content: jsonString,
          updatedAt: new Date().toISOString()
        }
      }
      return note
    }))
  }, [currentNoteId, editor])
  
  // Delete the current note
  const handleDeleteNote = useCallback(() => {
    if (!currentNoteId) return
    
    const confirmDelete = window.confirm("Are you sure you want to delete this note?")
    if (!confirmDelete) return
    
    const updatedNotes = notes.filter(note => note.id !== currentNoteId)
    setNotes(updatedNotes)
    setCurrentNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null)
  }, [currentNoteId, notes])
  
  // Handle editor changes - updated with debounce save for 1.1.0
  const handleEditorChange = useCallback((state) => {
    setEditorState(state)
    
    // Auto-save with debounce
    const saveTimeout = setTimeout(() => {
      if (currentNoteId && editor) {
        const editorState = editor.getEditorState()
        const jsonString = JSON.stringify(editorState.toJSON())
        
        setNotes(prev => prev.map(note => {
          if (note.id === currentNoteId) {
            return {
              ...note,
              content: jsonString,
              updatedAt: new Date().toISOString()
            }
          }
          return note
        }))
      }
    }, 1000) // 1 second debounce
    
    return () => clearTimeout(saveTimeout)
  }, [currentNoteId, editor])

  // Get current note content
  const currentNote = notes.find(note => note.id === currentNoteId)
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm dark:bg-gray-800 dark:border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="flex items-center space-x-2">
              <DocumentTextIcon className="h-8 w-8 text-primary-600" />
              <span>Lexical Notes</span>
            </h1>
            
            <div className="hidden sm:flex space-x-2">
              <Button
                onClick={handleCreateNewNote}
                className="flex items-center space-x-1"
              >
                <PlusIcon className="h-5 w-5" />
                <span>New Note</span>
              </Button>
              
              <Button
                onClick={handleSaveNote}
                disabled={!currentNoteId}
                variant="secondary"
              >
                Save
              </Button>
              
              <Button
                onClick={handleDeleteNote}
                disabled={!currentNoteId}
                variant="danger"
                className="flex items-center space-x-1"
              >
                <TrashIcon className="h-5 w-5" />
                <span>Delete</span>
              </Button>
            </div>
            
            <div className="sm:hidden">
              <Button onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? 'Hide Notes' : 'Show Notes'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile action buttons */}
      <div className="sm:hidden bg-gray-50 dark:bg-gray-900 px-4 py-2 flex space-x-2 overflow-x-auto">
        <Button
          onClick={handleCreateNewNote}
          size="sm"
          className="flex items-center space-x-1"
        >
          <PlusIcon className="h-4 w-4" />
          <span>New</span>
        </Button>
        
        <Button
          onClick={handleSaveNote}
          disabled={!currentNoteId}
          variant="secondary"
          size="sm"
        >
          Save
        </Button>
        
        <Button
          onClick={handleDeleteNote}
          disabled={!currentNoteId}
          variant="danger"
          size="sm"
        >
          Delete
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row h-full gap-6">
          {/* Sidebar with notes list */}
          {sidebarOpen && (
            <div className="sm:w-1/3 lg:w-1/4">
              <h2 className="text-xl font-semibold mb-4">Your Notes ({notes.length})</h2>
              <NoteList
                notes={notes}
                currentNoteId={currentNoteId}
                onSelectNote={setCurrentNoteId}
              />
            </div>
          )}
          
          {/* Main editor area */}
          <div className={`flex-1 ${!currentNoteId ? 'flex items-center justify-center' : ''}`}>
            {currentNoteId ? (
              <div className="card h-full">
                <h2 className="text-2xl font-bold mb-4">
                  {currentNote?.title || 'Untitled Note'}
                </h2>
                <ClientOnlyEditor
                  noteContent={currentNote?.content}
                  onChange={handleEditorChange}
                />
              </div>
            ) : (
              <div className="text-center p-12">
                <DocumentTextIcon className="h-16 w-16 mx-auto text-gray-400" />
                <h2 className="mt-4 text-xl font-semibold">No Note Selected</h2>
                <p className="mt-2 text-gray-500">
                  Select a note from the sidebar or create a new one.
                </p>
                <Button 
                  onClick={handleCreateNewNote} 
                  className="mt-6"
                >
                  Create New Note
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500 dark:bg-gray-800 dark:border-gray-700">
        <p>Built with Next.js and Lexical Editor</p>
      </footer>
    </div>
  )
}
