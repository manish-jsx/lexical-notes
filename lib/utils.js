import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility function to merge Tailwind CSS classes
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Format date for display
export function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric', 
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Generate excerpt from content
export function generateExcerpt(content, maxLength = 50) {
  if (!content) return ''
  
  try {
    const parsedContent = JSON.parse(content)
    
    // Try to extract text from Lexical JSON structure
    let textContent = ''
    if (parsedContent.root?.children) {
      for (const child of parsedContent.root.children) {
        if (child.children) {
          for (const textNode of child.children) {
            if (textNode.text) {
              textContent += textNode.text + ' '
            }
          }
        }
      }
    }
    
    if (textContent) {
      return textContent.length > maxLength 
        ? textContent.substring(0, maxLength) + '...'
        : textContent
    }
    
    return 'No content'
  } catch (error) {
    return 'Unable to parse content'
  }
}
