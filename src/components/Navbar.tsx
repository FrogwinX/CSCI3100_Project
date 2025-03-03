'use client';

import { useState } from 'react';
import Drawer from './Drawer'; // 引入 Drawer 組件

const Navbar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex items-center" style={{ backgroundColor: '#F8F8F8', height: '70px', width: '100%' }}>
      {/* Drawer 組件 */}
      <Drawer isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* 主目錄按鈕 */}
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

      {/* 專案圖標 */}
      <img
        src="/flowchat_logo2.png"
        alt="FlowChat Logo"
        style={{ height: '100%', width: 'auto', maxHeight: '70px' }} // 確保最大高度與 navbar 一致
        className="ml-2"
      />

      {/* 搜索欄 */}
      <input
        type="text"
        placeholder="Search FlowChat"
        className="flex-1 mx-4 p-2 border rounded"
        style={{ height: '50%', maxHeight: '56px' }} // 限制搜索欄的高度
      />

      {/* 用戶圖標 */}
      <img
        src="/user_icon.png"
        alt="User Icon"
        style={{ height: '100%', width: 'auto', borderRadius: '50%', marginRight: '20px' }} 
      />
    </div>
  );
};

export default Navbar;