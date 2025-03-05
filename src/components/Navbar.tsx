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
      <div className="navbar-start">
        <button
          onClick={toggleSidebar}
          className="btn btn-square btn-ghost z-50 flex items-center justify-center"
          style={{ marginLeft: '20px' }}
        >
          <i className="fa-solid fa-bars h-6 w-6 text-base-content" style={{ transform: 'translateY(5px)' }}></i>
        </button>
        <div className="ml-2 flex items-center">
          <img
            src="/flowchat_logo2.png"
            alt="FlowChat Logo"
            className="h-full w-auto max-h-16 ml-2"
          />
        </div>
      </div>

      <div className="navbar-center">
        <div className="form-control relative" style={{ width: '634px', height: '48px' }}>
          <input
            type="text"
            placeholder="Search FlowChat"
            className="w-full h-full rounded-full pl-12 pr-4 border-base-300 focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ backgroundColor: '#E5E7EB' }}
          />
          <button
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-30 p-2 bg-transparent border-none outline-none cursor-pointer flex items-center justify-center"
            onClick={() => console.log('Search button clicked')}
          >
            <i className="fa-solid fa-magnifying-glass h-5 w-5 text-base-content"></i>
          </button>
        </div>
      </div>

      <div className="navbar-end mr-4">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full flex items-center justify-center bg-base-200">
            <i className="fa-solid fa-user h-6 w-6 text-base-content" style={{ transform: 'translateY(7px)' }}></i>
            </div>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <a href="/logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>

      <Drawer isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default Navbar;