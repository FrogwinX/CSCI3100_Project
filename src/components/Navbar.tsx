'use client';

import { useState } from 'react';
import Drawer from './Drawer';

const Navbar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex items-center" style={{ backgroundColor: '#FFFFFF', height: '70px', width: '100%' }}>
      <Drawer isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center"
        style={{ width: '50px', height: '50px', marginLeft: '20px' }}
      >
        <img
          src="/mainMenu.png"
          alt="Main Menu"
          style={{ height: '100%', width: 'auto' }}
        />
      </button>

      <img
        src="/flowchat_logo2.png"
        alt="FlowChat Logo"
        style={{ height: '100%', width: 'auto', maxHeight: '70px' }}
        className="ml-2"
      />

<div className="flex justify-center" style={{ flex: 1, justifyContent: 'center' }}>
        <div
          style={{
            width: '634px',
            height: '48px',
            backgroundColor: '#EEEEEE',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            padding: '0 10px',
          }}
        >
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginRight: '10px',
            }}
            onClick={() => {
              console.log('Search button clicked');
            }}
          >
            <img
              src="/searchBar.png"
              alt="Search Icon"
              style={{ height: '24px', width: '24px' }} 
            />
          </button>
          <input
            type="text"
            placeholder="Search FlowChat"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              height: '100%',
              borderRadius: '16px',
              padding: '0 10px',
            }}
          />
        </div>
      </div>

      <img
        src="/userIcon.png"
        alt="User Icon"
        style={{ height: '100%', width: 'auto', borderRadius: '50%', marginRight: '20px' }} 
      />
    </div>
  );
};

export default Navbar;