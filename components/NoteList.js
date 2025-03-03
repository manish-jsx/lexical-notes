'use client'

import { generateExcerpt, formatDate, cn } from '../lib/utils'

export default function NoteList({ notes, currentNoteId, onSelectNote }) {
  if (!notes.length) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-sm dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No notes yet</p>
        <p className="text-sm">Create your first note to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 overflow-y-auto max-h-[70vh]">
      {notes.map(note => (
        <div
          key={note.id}
          onClick={() => onSelectNote(note.id)}
          className={cn(
            "p-4 rounded-lg cursor-pointer transition-all",
            "border border-gray-200 dark:border-gray-700",
            "hover:bg-gray-50 dark:hover:bg-gray-700/50",
            currentNoteId === note.id 
              ? "bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800"
              : "bg-white dark:bg-gray-800"
          )}
        >
          <h3 className="font-medium mb-1 truncate">{note.title}</h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
            {generateExcerpt(note.content)}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              {note.updatedAt 
                ? `Updated: ${formatDate(note.updatedAt)}` 
                : `Created: ${formatDate(note.createdAt)}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
