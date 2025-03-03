'use client'

import { useState, useRef } from 'react'
import SimpleDropdown from '../ui/SimpleDropdown';

const ToolbarButton = ({ active, onClick, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-2 py-1 rounded ${
      active 
        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' 
        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
    title={title}
  >
    {children}
  </button>
);

export default function EditorToolbar({ 
  onFormatText, 
  onSetHeading,
  onSetAlignment,
  onInsertList,
  onIndent,
  onOutdent,
  onInsertLink,
  onInsertCodeBlock,
  onInsertQuote,
  activeFormats = {},
}) {
  const headingOptions = [
    { label: 'Normal Text', value: 'paragraph' },
    { label: 'Heading 1', value: 'h1' },
    { label: 'Heading 2', value: 'h2' },
    { label: 'Heading 3', value: 'h3' },
  ];

  const currentHeadingOption = headingOptions.find(option => 
    option.value === (activeFormats.heading || 'paragraph')
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-t-lg overflow-x-auto relative z-40">
      <div className="flex flex-wrap gap-1 items-center">
        {/* Heading selector - Using SimpleDropdown */}
        <SimpleDropdown
          label={currentHeadingOption?.label || 'Normal Text'}
          options={headingOptions}
          onSelect={onSetHeading}
          activeOption={activeFormats.heading}
        />
        
        <div className="h-6 border-r border-gray-300 dark:border-gray-600 mx-1"></div>
        
        {/* Text formatting */}
        <ToolbarButton 
          active={activeFormats.bold} 
          onClick={() => onFormatText('bold')}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </ToolbarButton>
        
        <ToolbarButton 
          active={activeFormats.italic} 
          onClick={() => onFormatText('italic')}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </ToolbarButton>
        
        <ToolbarButton 
          active={activeFormats.underline} 
          onClick={() => onFormatText('underline')}
          title="Underline (Ctrl+U)"
        >
          <span className="underline">U</span>
        </ToolbarButton>
        
        <ToolbarButton 
          active={activeFormats.strikethrough} 
          onClick={() => onFormatText('strikethrough')}
          title="Strikethrough"
        >
          <span className="line-through">S</span>
        </ToolbarButton>
        
        <div className="h-6 border-r border-gray-300 dark:border-gray-600 mx-1"></div>
        
        {/* Alignment */}
        <ToolbarButton 
          active={activeFormats.alignment === 'left'} 
          onClick={() => onSetAlignment('left')}
          title="Align Left"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h16" />
          </svg>
        </ToolbarButton>
        
        <ToolbarButton 
          active={activeFormats.alignment === 'center'} 
          onClick={() => onSetAlignment('center')}
          title="Align Center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M7 12h10M4 18h16" />
          </svg>
        </ToolbarButton>
        
        <ToolbarButton 
          active={activeFormats.alignment === 'right'} 
          onClick={() => onSetAlignment('right')}
          title="Align Right"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M10 12h10M4 18h16" />
          </svg>
        </ToolbarButton>
        
        <div className="h-6 border-r border-gray-300 dark:border-gray-600 mx-1"></div>
        
        {/* Lists */}
        <ToolbarButton 
          active={activeFormats.list === 'bullet'} 
          onClick={() => onInsertList('bullet')}
          title="Bullet List"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            <circle cx="2" cy="6" r="1" fill="currentColor" />
            <circle cx="2" cy="12" r="1" fill="currentColor" />
            <circle cx="2" cy="18" r="1" fill="currentColor" />
          </svg>
        </ToolbarButton>
        
        <ToolbarButton 
          active={activeFormats.list === 'number'} 
          onClick={() => onInsertList('number')}
          title="Numbered List"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            <text x="1.5" y="7" fontSize="6" fill="currentColor">1</text>
            <text x="1.5" y="13" fontSize="6" fill="currentColor">2</text>
            <text x="1.5" y="19" fontSize="6" fill="currentColor">3</text>
          </svg>
        </ToolbarButton>
        
        <ToolbarButton 
          onClick={onIndent}
          title="Indent"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </ToolbarButton>
        
        <ToolbarButton 
          onClick={onOutdent}
          title="Outdent"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </ToolbarButton>
        
        <div className="h-6 border-r border-gray-300 dark:border-gray-600 mx-1"></div>
        
        {/* Special content */}
        <ToolbarButton 
          active={activeFormats.link} 
          onClick={onInsertLink}
          title="Insert Link"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.102 1.101" />
          </svg>
        </ToolbarButton>
        
        <ToolbarButton 
          active={activeFormats.codeBlock} 
          onClick={onInsertCodeBlock}
          title="Insert Code Block"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </ToolbarButton>
        
        <ToolbarButton 
          active={activeFormats.quote} 
          onClick={onInsertQuote}
          title="Insert Quote Block"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </ToolbarButton>
      </div>
    </div>
  );
}
