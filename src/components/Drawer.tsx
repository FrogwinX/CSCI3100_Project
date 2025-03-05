'use client';

import Link from 'next/link';
import { FC, useState } from 'react';

interface DrawerProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Drawer: FC<DrawerProps> = ({ isOpen, toggleSidebar }) => {
  const [isForumOpen, setForumOpen] = useState<boolean>(false);

  const toggleForum = () => {
    setForumOpen((prev) => !prev);
  };

  return (
    <aside
      className={`w-64 bg-base-100 p-4 fixed top-16 left-0 z-40 transition-transform duration-300 flex flex-col justify-between ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <div>
        <nav>
          <ul className="space-y-2">
            <li>
              <button
                onClick={toggleForum}
                className="flex items-center w-full p-2 rounded-lg hover:bg-base-200 transition-colors"
              >
                <i className="fa-solid fa-comments h-5 w-5 mr-2 text-base-content"></i>
                Forum
                <i
                  className={`fa-solid fa-chevron-right h-5 w-5 ml-auto transition-transform duration-200 ${
                    isForumOpen ? 'rotate-90' : ''
                  }`}
                ></i>
              </button>
              {isForumOpen && (
                <ul className="pl-8 space-y-2 mt-2">
                  <li>
                    <Link
                      href="/latest"
                      className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
                    >
                      <i className="fa-solid fa-clock h-5 w-5 mr-2 text-base-content"></i>
                      Latest
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/popular"
                      className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
                    >
                      <i className="fa-solid fa-fire h-5 w-5 mr-2 text-base-content"></i>
                      Popular
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/following"
                      className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
                    >
                      <i className="fa-solid fa-users h-5 w-5 mr-2 text-base-content"></i>
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
                <i className="fa-solid fa-paper-plane h-5 w-5 mr-2 text-base-content"></i>
                Direct Messages
              </Link>
            </li>

            <li>
              <Link
                href="/notifications"
                className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
              >
                <i className="fa-solid fa-bell h-5 w-5 mr-2 text-base-content"></i>
                Notifications
              </Link>
            </li>

            <li>
              <Link
                href="/settings"
                className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
              >
                <i className="fa-solid fa-cog h-5 w-5 mr-2 text-base-content"></i>
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="text-sm text-base-content">
        <ul className="space-y-2 mb-4">
          <li>
            <Link
              href="/source"
              className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
            >
              <i className="fa-solid fa-code h-5 w-5 mr-2 text-base-content"></i>
              Source
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
            >
              <i className="fa-solid fa-envelope h-5 w-5 mr-2 text-base-content"></i>
              Contact
            </Link>
          </li>
        </ul>
        <p className="text-xs text-base-content/70">Copyright © 2025 All Rights Reserved</p>
      </div>
    </aside>
  );
};

export default Drawer;