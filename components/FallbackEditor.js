'use client'

import { useState, useEffect } from 'react'

export default function FallbackEditor({ noteContent, onChange }) {
  const [text, setText] = useState('')

  // Parse content from JSON if possible
  useEffect(() => {
    if (noteContent) {
      try {
        const parsedContent = JSON.parse(noteContent)
        // Try to extract text from Lexical JSON structure
        let extractedText = ''
        if (parsedContent.root?.children) {
          for (const child of parsedContent.root.children) {
            if (child.children) {
              for (const textNode of child.children) {
                if (textNode.text) {
                  extractedText += textNode.text + '\n'
                }
              }
            }
          }
        }
        setText(extractedText || 'Unable to parse content')
      } catch (e) {
        setText('Unable to parse note content')
      }
    }
  }, [noteContent])

  // Handle text change
  const handleTextChange = (e) => {
    const newText = e.target.value
    setText(newText)
    
    // Create a simple Lexical-like JSON structure for plain text
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
    }
    
    onChange(JSON.stringify(simpleJson))
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <p className="text-yellow-700">
          <strong>Note:</strong> Using basic editor mode. Some formatting features may be limited.
        </p>
      </div>
      <textarea
        className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        value={text}
        onChange={handleTextChange}
        placeholder="Type your note content here..."
      />
    </div>
  )
}
