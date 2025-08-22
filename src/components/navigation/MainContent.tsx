import React, { ReactNode } from 'react';
import { useSidebar } from './SidebarContext';

interface MainContentProps {
  children: ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  const { isSidebarOpen } = useSidebar();

  return (
    <div 
      className={`flex-1 min-h-screen bg-gray-900 pt-16 sm:pt-20 px-4 sm:px-6 overflow-y-auto transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'ml-64' : 'ml-20'
      }`}
    >
      {children}
    </div>
  );
};

export default MainContent;
