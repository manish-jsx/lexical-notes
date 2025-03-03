'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' 
import EnhancedEditor from './EnhancedEditor'
// The next line can be uncommented if you want to try the polyfill approach:
// import '../lib/polyfills';

// Since we're having persistent issues with Lexical, let's use the SimpleEditor directly
// We can revisit the original Editor component later when dependency issues are resolved
export default function ClientOnlyEditor({ noteContent, onChange }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-white dark:bg-gray-800 rounded-lg">
        <div className="animate-pulse text-gray-500">Loading editor...</div>
      </div>
    );
  }
  
  return <EnhancedEditor noteContent={noteContent} onChange={onChange} />;
}
