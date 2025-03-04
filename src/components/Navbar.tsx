'use client';

import { FC } from 'react';
import Drawer from './Drawer';

interface NavbarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Navbar: FC<NavbarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div className="navbar bg-base-100 shadow-md h-16 flex items-center relative z-50">
      <Drawer isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <button
        onClick={toggleSidebar}
        className="btn btn-square btn-ghost z-50"
        style={{ marginLeft: '20px' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block h-6 w-6 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <img
        src="/flowchat_logo2.png"
        alt="FlowChat Logo"
        className="h-full w-auto max-h-16 ml-2"
      />

      <div className="flex-1 flex justify-center items-center">
        <div className="form-control relative" style={{ width: '634px', height: '48px' }}>
          <input
            type="text"
            placeholder="Search FlowChat"
            className="w-full h-full rounded-full pl-12 pr-4 border-base-300 focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ backgroundColor: '#EEEEEE' }}
          />
          <button
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-30 p-2 bg-transparent border-none outline-none cursor-pointer"
            onClick={() => console.log('Search button clicked')}
          >
            <img
              src="/searchBar.png"
              alt="Search Icon"
              className="h-5 w-5 pointer-events-none"
            />
          </button>
        </div>
      </div>

      <img
        src="/userIcon.png"
        alt="User Icon"
        className="h-full w-auto rounded-full mr-4"
      />
    </div>
  );
};

export default Navbar;