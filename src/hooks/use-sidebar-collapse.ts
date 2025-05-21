
import { useState, useEffect } from 'react';

export function useSidebarCollapse() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // You can add localStorage persistence if needed
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);
  
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  };
  
  return { isCollapsed, toggleSidebar };
}
