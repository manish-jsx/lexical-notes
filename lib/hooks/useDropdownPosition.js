import { useState, useEffect, useCallback } from 'react';

export default function useDropdownPosition() {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  
  const updatePosition = useCallback(() => {
    if (!referenceElement || !popperElement) return;
    
    const refRect = referenceElement.getBoundingClientRect();
    const dropdownWidth = popperElement.offsetWidth;
    
    // Position below the reference element
    const top = refRect.bottom + window.scrollY;
    
    // Center the dropdown or align left if it would overflow the screen
    let left = refRect.left + window.scrollX;
    
    // Adjust if it would go off-screen
    const rightEdge = left + dropdownWidth;
    const windowWidth = window.innerWidth;
    if (rightEdge > windowWidth) {
      left = Math.max(10, windowWidth - dropdownWidth - 10);
    }
    
    setPosition({ top, left });
  }, [referenceElement, popperElement]);
  
  useEffect(() => {
    if (referenceElement && popperElement) {
      updatePosition();
      
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [referenceElement, popperElement, updatePosition]);
  
  return {
    position,
    setReferenceElement,
    setPopperElement,
  };
}
