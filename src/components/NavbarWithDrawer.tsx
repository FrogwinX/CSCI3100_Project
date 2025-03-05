'use client';

import Link from 'next/link';
import { FC, useState } from 'react';

interface NavbarProps {
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
}

const NavbarWithDrawer: FC<NavbarProps> = () => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isForumOpen, setForumOpen] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleForum = () => {
    setForumOpen((prev) => !prev);
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-md h-16 flex items-center fixed top-0 left-0 right-0 z-50">
        <div className="navbar-start">
          <button
            onClick={toggleSidebar}
            className="btn btn-square btn-ghost z-50 flex items-center justify-center"
            style={{ marginLeft: '20px' }}
          >
            <i
              className="fa-solid fa-bars h-6 w-6 text-base-content"
              style={{ transform: 'translateY(5px)', color: '#000' }}
            ></i>
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
              <i
                className="fa-solid fa-magnifying-glass h-5 w-5 text-base-content"
                style={{ transform: 'translateY(2px)', color: '#000' }}
              ></i>
            </button>
          </div>
        </div>

        <div className="navbar-end mr-4">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full flex items-center justify-center bg-base-200">
                <i
                  className="fa-solid fa-user h-6 w-6 text-base-content"
                  style={{ transform: 'translateY(8px)', color: '#000' }}
                ></i>
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a href="/logout">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <aside
        className={`w-64 bg-base-100 p-4 fixed top-16 left-0 z-40 transition-transform duration-300 flex flex-col justify-between ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ height: 'calc(100vh - 64px)' }}
      >
        <div>

          <nav>
            <ul className="menu space-y-2">
              <li>
                <button
                  onClick={toggleForum}
                  className="flex items-center w-full p-2 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <i className="fa-solid fa-comments h-5 w-5 mr-2 text-base-content" style={{ color: '#000' }}></i>
                  Forum
                  <i
                    className={`fa-solid fa-chevron-right h-5 w-5 ml-auto transition-transform duration-200 ${
                      isForumOpen ? 'rotate-90' : ''
                    }`}
                    style={{ color: '#000' }}
                  ></i>
                </button>
                {isForumOpen && (
                  <ul className="pl-8 space-y-2 mt-2">
                    <li>
                      <Link
                        href="/latest"
                        className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
                      >
                        <i className="fa-solid fa-clock h-5 w-5 mr-2 text-base-content" style={{ color: '#000' }}></i>
                        Latest
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/popular"
                        className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
                      >
                        <i className="fa-solid fa-fire h-5 w-5 mr-2 text-base-content" style={{ color: '#000' }}></i>
                        Popular
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/following"
                        className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
                      >
                        <i className="fa-solid fa-users h-5 w-5 mr-2 text-base-content" style={{ color: '#000' }}></i>
                        Following
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <Link
                  href="/direct-messages"
                  className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <i className="fa-solid fa-paper-plane h-5 w-5 mr-2 text-base-content" style={{ color: '#000' }}></i>
                  Direct Messages
                </Link>
              </li>

              <li>
                <Link
                  href="/notifications"
                  className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <i className="fa-solid fa-bell h-5 w-5 mr-2 text-base-content" style={{ color: '#000' }}></i>
                  Notifications
                </Link>
              </li>

              <li>
                <Link
                  href="/settings"
                  className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <i className="fa-solid fa-cog h-5 w-5 mr-2 text-base-content" style={{ color: '#000' }}></i>
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="text-sm text-base-content">
          <ul className="menu space-y-2 mb-4">
            <li>
              <Link
                href="/source"
                className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
              >
                <i className="fa-solid fa-code h-5 w-5 mr-2 text-base-content" style={{ color: '#000' }}></i>
                Source
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
              >
                <i className="fa-solid fa-envelope h-5 w-5 mr-2 text-base-content" style={{ color: '#000' }}></i>
                Contact
              </Link>
            </li>
          </ul>
          <p className="text-xs text-base-content/70">Copyright © 2025 All Rights Reserved</p>
        </div>
      </aside>
    </>
  );
};

export default NavbarWithDrawer;