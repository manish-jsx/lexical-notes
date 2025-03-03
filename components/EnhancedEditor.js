'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useEditor } from '../lib/EditorContext'
import EditorToolbar from './editor/EditorToolbar'

// Helper to create unique IDs for elements
const generateId = () => `_${Math.random().toString(36).substr(2, 9)}`;

export default function EnhancedEditor({ noteContent, onChange }) {
  const [content, setContent] = useState([{ id: generateId(), type: 'paragraph', text: '', formats: {} }]);
  const [activeFormats, setActiveFormats] = useState({});
  const { setEditor } = useEditor();
  const editorRef = useRef(null);
  const selectionRef = useRef({ start: 0, end: 0, blockIndex: 0 });

  // Create a Lexical-like editor API
  useEffect(() => {
    const enhancedEditorAPI = {
      getEditorState: () => ({
        toJSON: () => {
          // Convert our content structure to Lexical-compatible JSON
          return {
            root: {
              children: content.map(block => {
                const baseBlock = {
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  version: 1,
                };
                
                if (block.type === 'paragraph') {
                  return {
                    ...baseBlock,
                    type: "paragraph",
                    children: [{
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: block.text || "",
                      type: "text",
                      version: 1
                    }]
                  };
                } else if (block.type === 'heading') {
                  return {
                    ...baseBlock,
                    type: block.format || "h1",
                    children: [{
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: block.text || "",
                      type: "text",
                      version: 1
                    }]
                  };
                } else if (block.type === 'list-item') {
                  return {
                    ...baseBlock,
                    type: block.format === 'bullet' ? "ul" : "ol",
                    children: [{
                      type: "listitem",
                      value: 1,
                      children: [{
                        text: block.text || "",
                        type: "text"
                      }]
                    }]
                  };
                } else if (block.type === 'quote') {
                  return {
                    ...baseBlock,
                    type: "quote",
                    children: [{
                      text: block.text || "",
                      type: "text"
                    }]
                  };
                } else if (block.type === 'code') {
                  return {
                    ...baseBlock,
                    type: "code",
                    children: [{
                      text: block.text || "",
                      type: "text"
                    }]
                  };
                }
                
                return {
                  ...baseBlock,
                  type: "paragraph", 
                  children: [{
                    text: block.text || "",
                    type: "text"
                  }]
                };
              })
            }
          };
        }
      }),
      
      parseEditorState: (json) => {
        try {
          const parsed = typeof json === 'string' ? JSON.parse(json) : json;
          
          // Convert Lexical JSON to our content structure
          if (parsed.root?.children) {
            const newContent = parsed.root.children.map(block => {
              const id = generateId();
              
              if (block.type === 'paragraph') {
                return {
                  id,
                  type: 'paragraph',
                  text: block.children?.[0]?.text || '',
                  formats: {}
                };
              } else if (['h1', 'h2', 'h3'].includes(block.type)) {
                return {
                  id,
                  type: 'heading',
                  format: block.type,
                  text: block.children?.[0]?.text || '',
                  formats: {}
                };
              } else if (block.type === 'ul') {
                return {
                  id,
                  type: 'list-item',
                  format: 'bullet',
                  text: block.children?.[0]?.children?.[0]?.text || '',
                  formats: {}
                };
              } else if (block.type === 'ol') {
                return {
                  id,
                  type: 'list-item',
                  format: 'number',
                  text: block.children?.[0]?.children?.[0]?.text || '',
                  formats: {}
                };
              } else if (block.type === 'quote') {
                return {
                  id,
                  type: 'quote',
                  text: block.children?.[0]?.text || '',
                  formats: {}
                };
              } else if (block.type === 'code') {
                return {
                  id,
                  type: 'code',
                  text: block.children?.[0]?.text || '',
                  formats: {}
                };
              }
              
              // Default to paragraph if type is unknown
              return {
                id,
                type: 'paragraph',
                text: block.children?.[0]?.text || '',
                formats: {}
              };
            });
            
            setContent(newContent.length > 0 ? newContent : [{ id: generateId(), type: 'paragraph', text: '', formats: {} }]);
          }
          
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
          
          // Parse the JSON and update content state
          if (json.root?.children) {
            const newContent = json.root.children.map(block => {
              const id = generateId();
              
              if (block.type === 'paragraph') {
                return {
                  id,
                  type: 'paragraph',
                  text: block.children?.[0]?.text || '',
                  formats: {}
                };
              } else if (['h1', 'h2', 'h3'].includes(block.type)) {
                return {
                  id,
                  type: 'heading',
                  format: block.type,
                  text: block.children?.[0]?.text || '',
                  formats: {}
                };
              } else if (block.type === 'ul') {
                return {
                  id,
                  type: 'list-item',
                  format: 'bullet',
                  text: block.children?.[0]?.children?.[0]?.text || '',
                  formats: {}
                };
              } else if (block.type === 'ol') {
                return {
                  id,
                  type: 'list-item',
                  format: 'number',
                  text: block.children?.[0]?.children?.[0]?.text || '',
                  formats: {}
                };
              } else if (block.type === 'quote') {
                return {
                  id, 
                  type: 'quote',
                  text: block.children?.[0]?.text || '',
                  formats: {}
                };
              } else if (block.type === 'code') {
                return {
                  id,
                  type: 'code',
                  text: block.children?.[0]?.text || '',
                  formats: {}
                };
              }
              
              return {
                id,
                type: 'paragraph',
                text: block.children?.[0]?.text || '',
                formats: {}
              };
            });
            
            setContent(newContent.length > 0 ? newContent : [{ id: generateId(), type: 'paragraph', text: '', formats: {} }]);
          }
        } catch (e) {
          console.error('Failed to set editor state', e);
        }
      }
    };
    
    // Register our enhanced editor with the context
    setEditor(enhancedEditorAPI);
    
    // Flag that will prevent the fallback from showing
    if (typeof window !== 'undefined') {
      window.LexicalEditorLoaded = true;
    }
  }, [content, setEditor]);
  
  // Parse initial content
  useEffect(() => {
    if (noteContent) {
      try {
        const parsed = JSON.parse(noteContent);
        
        if (parsed.root?.children) {
          const newContent = parsed.root.children.map(block => {
            const id = generateId();
            
            if (block.type === 'paragraph') {
              return {
                id,
                type: 'paragraph',
                text: block.children?.[0]?.text || '',
                formats: {}
              };
            } else if (['h1', 'h2', 'h3'].includes(block.type)) {
              return {
                id,
                type: 'heading',
                format: block.type,
                text: block.children?.[0]?.text || '',
                formats: {}
              };
            } else if (block.type === 'ul') {
              return {
                id,
                type: 'list-item',
                format: 'bullet',
                text: block.children?.[0]?.children?.[0]?.text || '',
                formats: {}
              };
            } else if (block.type === 'ol') {
              return {
                id,
                type: 'list-item',
                format: 'number',
                text: block.children?.[0]?.children?.[0]?.text || '',
                formats: {}
              };
            } else if (block.type === 'quote') {
              return {
                id,
                type: 'quote',
                text: block.children?.[0]?.text || '',
                formats: {}
              };
            } else if (block.type === 'code') {
              return {
                id,
                type: 'code',
                text: block.children?.[0]?.text || '',
                formats: {}
              };
            }
            
            // Default to paragraph
            return {
              id, 
              type: 'paragraph',
              text: block.children?.[0]?.text || '',
              formats: {}
            };
          });
          
          setContent(newContent.length > 0 ? newContent : [{ id: generateId(), type: 'paragraph', text: '', formats: {} }]);
        }
      } catch (e) {
        console.error('Failed to parse note content', e);
        setContent([{ id: generateId(), type: 'paragraph', text: '', formats: {} }]);
      }
    }
  }, [noteContent]);
  
  // Handle content change and update the parent
  const handleContentChange = useCallback((newContent) => {
    setContent(newContent);
    
    // Create JSON representation
    const jsonContent = {
      root: {
        children: newContent.map(block => {
          const baseBlock = {
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
          };
          
          if (block.type === 'paragraph') {
            return {
              ...baseBlock,
              type: "paragraph",
              children: [{
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: block.text || "",
                type: "text",
                version: 1
              }]
            };
          } else if (block.type === 'heading') {
            return {
              ...baseBlock,
              type: block.format || "h1",
              children: [{
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: block.text || "",
                type: "text",
                version: 1
              }]
            };
          } else if (block.type === 'list-item') {
            return {
              ...baseBlock,
              type: block.format === 'bullet' ? "ul" : "ol",
              children: [{
                type: "listitem",
                value: 1,
                children: [{
                  text: block.text || "",
                  type: "text"
                }]
              }]
            };
          } else if (block.type === 'quote') {
            return {
              ...baseBlock,
              type: "quote",
              children: [{
                text: block.text || "",
                type: "text"
              }]
            };
          } else if (block.type === 'code') {
            return {
              ...baseBlock,
              type: "code",
              children: [{
                text: block.text || "",
                type: "text"
              }]
            };
          }
          
          return {
            ...baseBlock,
            type: "paragraph", 
            children: [{
              text: block.text || "",
              type: "text"
            }]
          };
        }),
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1
      }
    };
    
    onChange(JSON.stringify(jsonContent));
  }, [onChange]);
  
  // Handle text changes for a specific block
  const handleBlockTextChange = useCallback((id, newText) => {
    const newContent = content.map(block => 
      block.id === id ? { ...block, text: newText } : block
    );
    
    handleContentChange(newContent);
  }, [content, handleContentChange]);
  
  // Toolbar handlers
  const handleSetHeading = useCallback((headingType) => {
    const blockIndex = selectionRef.current.blockIndex;
    if (blockIndex >= 0 && blockIndex < content.length) {
      const newContent = [...content];
      
      if (headingType === 'paragraph') {
        newContent[blockIndex] = {
          ...newContent[blockIndex],
          type: 'paragraph'
        };
      } else {
        newContent[blockIndex] = {
          ...newContent[blockIndex],
          type: 'heading',
          format: headingType
        };
      }
      
      handleContentChange(newContent);
    }
  }, [content, handleContentChange]);
  
  const handleFormatText = useCallback((format) => {
    // In a real implementation, this would format selected text
    // For our simple editor, we'll just toggle the format for the active block
    const blockIndex = selectionRef.current.blockIndex;
    if (blockIndex >= 0 && blockIndex < content.length) {
      const newContent = [...content];
      const block = newContent[blockIndex];
      
      newContent[blockIndex] = {
        ...block,
        formats: {
          ...block.formats,
          [format]: !block.formats[format]
        }
      };
      
      handleContentChange(newContent);
      
      // Update active formats
      setActiveFormats(prevFormats => ({
        ...prevFormats,
        [format]: !prevFormats[format]
      }));
    }
  }, [content, handleContentChange]);
  
  const handleSetAlignment = useCallback((alignment) => {
    const blockIndex = selectionRef.current.blockIndex;
    if (blockIndex >= 0 && blockIndex < content.length) {
      const newContent = [...content];
      const block = newContent[blockIndex];
      
      newContent[blockIndex] = {
        ...block,
        formats: {
          ...block.formats,
          alignment
        }
      };
      
      handleContentChange(newContent);
      
      // Update active formats
      setActiveFormats(prevFormats => ({
        ...prevFormats,
        alignment
      }));
    }
  }, [content, handleContentChange]);
  
  const handleInsertList = useCallback((listType) => {
    const blockIndex = selectionRef.current.blockIndex;
    if (blockIndex >= 0 && blockIndex < content.length) {
      const newContent = [...content];
      const block = newContent[blockIndex];
      
      // Toggle list type off if already active
      if (block.type === 'list-item' && block.format === listType) {
        newContent[blockIndex] = {
          ...block,
          type: 'paragraph',
          format: undefined
        };
      } else {
        newContent[blockIndex] = {
          ...block,
          type: 'list-item',
          format: listType
        };
      }
      
      handleContentChange(newContent);
      
      // Update active formats
      setActiveFormats(prevFormats => ({
        ...prevFormats,
        list: block.type === 'list-item' && block.format === listType ? undefined : listType
      }));
    }
  }, [content, handleContentChange]);
  
  const handleIndent = useCallback(() => {
    const blockIndex = selectionRef.current.blockIndex;
    if (blockIndex >= 0 && blockIndex < content.length) {
      const newContent = [...content];
      const block = newContent[blockIndex];
      
      newContent[blockIndex] = {
        ...block,
        formats: {
          ...block.formats,
          indent: (block.formats.indent || 0) + 1
        }
      };
      
      handleContentChange(newContent);
    }
  }, [content, handleContentChange]);
  
  const handleOutdent = useCallback(() => {
    const blockIndex = selectionRef.current.blockIndex;
    if (blockIndex >= 0 && blockIndex < content.length) {
      const newContent = [...content];
      const block = newContent[blockIndex];
      const currentIndent = block.formats.indent || 0;
      
      if (currentIndent > 0) {
        newContent[blockIndex] = {
          ...block,
          formats: {
            ...block.formats,
            indent: currentIndent - 1
          }
        };
        
        handleContentChange(newContent);
      }
    }
  }, [content, handleContentChange]);
  
  const handleInsertLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (!url) return;
    
    const linkText = window.prompt('Enter link text:', url);
    if (!linkText) return;
    
    const blockIndex = selectionRef.current.blockIndex;
    if (blockIndex >= 0 && blockIndex < content.length) {
      const newContent = [...content];
      const block = newContent[blockIndex];
      
      // Insert link by appending to the current block text (simplistic approach)
      const linkMarkup = `[${linkText}](${url})`;
      newContent[blockIndex] = {
        ...block,
        text: block.text + ' ' + linkMarkup,
        formats: {
          ...block.formats,
          link: true
        }
      };
      
      handleContentChange(newContent);
      
      // Update active formats
      setActiveFormats(prevFormats => ({
        ...prevFormats,
        link: true
      }));
    }
  }, [content, handleContentChange]);
  
  const handleInsertCodeBlock = useCallback(() => {
    const blockIndex = selectionRef.current.blockIndex;
    if (blockIndex >= 0 && blockIndex < content.length) {
      const newContent = [...content];
      const block = newContent[blockIndex];
      
      // Convert current block to code block or back to paragraph
      if (block.type === 'code') {
        newContent[blockIndex] = {
          ...block,
          type: 'paragraph'
        };
      } else {
        newContent[blockIndex] = {
          ...block,
          type: 'code'
        };
      }
      
      handleContentChange(newContent);
      
      // Update active formats
      setActiveFormats(prevFormats => ({
        ...prevFormats,
        codeBlock: block.type !== 'code'
      }));
    }
  }, [content, handleContentChange]);
  
  const handleInsertQuote = useCallback(() => {
    const blockIndex = selectionRef.current.blockIndex;
    if (blockIndex >= 0 && blockIndex < content.length) {
      const newContent = [...content];
      const block = newContent[blockIndex];
      
      // Convert current block to quote block or back to paragraph
      if (block.type === 'quote') {
        newContent[blockIndex] = {
          ...block,
          type: 'paragraph'
        };
      } else {
        newContent[blockIndex] = {
          ...block,
          type: 'quote'
        };
      }
      
      handleContentChange(newContent);
      
      // Update active formats
      setActiveFormats(prevFormats => ({
        ...prevFormats,
        quote: block.type !== 'quote'
      }));
    }
  }, [content, handleContentChange]);
  
  // Track the currently focused block
  const handleBlockFocus = useCallback((index) => {
    selectionRef.current.blockIndex = index;
    
    // Update active formats based on the focused block
    const block = content[index];
    setActiveFormats({
      heading: block.type === 'heading' ? block.format : undefined,
      bold: block.formats.bold || false,
      italic: block.formats.italic || false,
      underline: block.formats.underline || false,
      strikethrough: block.formats.strikethrough || false,
      alignment: block.formats.alignment || 'left',
      list: block.type === 'list-item' ? block.format : undefined,
      codeBlock: block.type === 'code',
      quote: block.type === 'quote',
    });
  }, [content]);
  
  // Render text blocks with formatting
  const renderBlock = useCallback((block, index) => {
    const baseClassName = "w-full px-4 py-2 mb-2 outline-none focus:ring-1 focus:ring-primary-300 rounded";
    let blockStyle = {};
    
    // Apply text alignment
    if (block.formats.alignment) {
      blockStyle.textAlign = block.formats.alignment;
    }
    
    // Apply indentation
    if (block.formats.indent) {
      blockStyle.marginLeft = `${block.formats.indent * 2}rem`;
    }
    
    // Different styling based on block type
    if (block.type === 'paragraph') {
      return (
        <div key={block.id} className="mb-2" style={blockStyle}>
          <textarea
            value={block.text}
            onChange={(e) => handleBlockTextChange(block.id, e.target.value)}
            onFocus={() => handleBlockFocus(index)}
            className={`${baseClassName} ${block.formats.bold ? 'font-bold' : ''} ${block.formats.italic ? 'italic' : ''} ${block.formats.underline ? 'underline' : ''} ${block.formats.strikethrough ? 'line-through' : ''}`}
            placeholder="Type here..."
            rows={2}
          />
        </div>
      );
    } else if (block.type === 'heading') {
      let headingClassName = baseClassName;
      
      if (block.format === 'h1') headingClassName += ' text-3xl font-bold';
      else if (block.format === 'h2') headingClassName += ' text-2xl font-bold';
      else if (block.format === 'h3') headingClassName += ' text-xl font-bold';
      
      return (
        <div key={block.id} className="mb-4" style={blockStyle}>
          <textarea
            value={block.text}
            onChange={(e) => handleBlockTextChange(block.id, e.target.value)}
            onFocus={() => handleBlockFocus(index)}
            className={`${headingClassName} ${block.formats.bold ? 'font-bold' : ''} ${block.formats.italic ? 'italic' : ''} ${block.formats.underline ? 'underline' : ''} ${block.formats.strikethrough ? 'line-through' : ''}`}
            placeholder={`${block.format.toUpperCase()} Heading...`}
            rows={1}
          />
        </div>
      );
    } else if (block.type === 'list-item') {
      const listSymbol = block.format === 'bullet' ? '•' : `${index + 1}.`;
      
      return (
        <div key={block.id} className="mb-2 flex" style={blockStyle}>
          <div className="w-6 flex-shrink-0 text-center">{listSymbol}</div>
          <textarea
            value={block.text}
            onChange={(e) => handleBlockTextChange(block.id, e.target.value)}
            onFocus={() => handleBlockFocus(index)}
            className={`${baseClassName} flex-grow ${block.formats.bold ? 'font-bold' : ''} ${block.formats.italic ? 'italic' : ''} ${block.formats.underline ? 'underline' : ''} ${block.formats.strikethrough ? 'line-through' : ''}`}
            placeholder="List item..."
            rows={1}
          />
        </div>
      );
    } else if (block.type === 'quote') {
      return (
        <div key={block.id} className="mb-4" style={blockStyle}>
          <textarea
            value={block.text}
            onChange={(e) => handleBlockTextChange(block.id, e.target.value)}
            onFocus={() => handleBlockFocus(index)}
            className={`${baseClassName} pl-4 border-l-4 border-gray-300 italic text-gray-600 dark:text-gray-300 ${block.formats.bold ? 'font-bold' : ''} ${block.formats.strikethrough ? 'line-through' : ''}`}
            placeholder="Quote..."
            rows={2}
          />
        </div>
      );
    } else if (block.type === 'code') {
      return (
        <div key={block.id} className="mb-4" style={blockStyle}>
          <textarea
            value={block.text}
            onChange={(e) => handleBlockTextChange(block.id, e.target.value)}
            onFocus={() => handleBlockFocus(index)}
            className={`${baseClassName} font-mono text-sm bg-gray-100 dark:bg-gray-800 p-4`}
            placeholder="Code block..."
            rows={4}
          />
        </div>
      );
    }
    
    // Default case
    return (
      <div key={block.id} className="mb-2" style={blockStyle}>
        <textarea
          value={block.text}
          onChange={(e) => handleBlockTextChange(block.id, e.target.value)}
          onFocus={() => handleBlockFocus(index)}
          className={baseClassName}
          placeholder="Type here..."
          rows={2}
        />
      </div>
    );
  }, [content, handleBlockFocus, handleBlockTextChange]);
  
  // Add new paragraph block
  const handleAddBlock = useCallback(() => {
    const newBlock = { 
      id: generateId(), 
      type: 'paragraph', 
      text: '', 
      formats: {} 
    };
    
    setContent([...content, newBlock]);
    
    // Focus on the new block
    setTimeout(() => {
      selectionRef.current.blockIndex = content.length;
      setActiveFormats({});
    }, 0);
  }, [content]);
  
  return (
    <div className="flex flex-col h-full">
      <div className="relative z-40">
        <EditorToolbar
          onFormatText={handleFormatText}
          onSetHeading={handleSetHeading}
          onSetAlignment={handleSetAlignment}
          onInsertList={handleInsertList}
          onIndent={handleIndent}
          onOutdent={handleOutdent}
          onInsertLink={handleInsertLink}
          onInsertCodeBlock={handleInsertCodeBlock}
          onInsertQuote={handleInsertQuote}
          activeFormats={activeFormats}
        />
      </div>
      
      <div 
        className="flex-1 overflow-auto p-4 bg-white dark:bg-gray-800 rounded-b-lg relative z-30"
        ref={editorRef}
      >
        {content.map(renderBlock)}
        
        <button 
          onClick={handleAddBlock}
          className="w-full py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg mt-2"
        >
          + Add paragraph
        </button>
      </div>
    </div>
  );
}