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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-5 w-5 mr-2 text-base-content"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
                Forum
                <svg
                  className={`h-5 w-5 ml-auto transition-transform duration-200 ${
                    isForumOpen ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              {isForumOpen && (
                <ul className="pl-8 space-y-2 mt-2">
                  <li>
                    <Link
                      href="/latest"
                      className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
                    >
                      <svg
                        className="h-5 w-5 mr-2 text-base-content"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Latest
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/popular"
                      className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
                    >
                      <svg
                        className="h-5 w-5 mr-2 text-base-content"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 11l7-7 7 7M5 19l7-7 7 7"
                        />
                      </svg>
                      Popular
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/following"
                      className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
                    >
                      <svg
                        className="h-5 w-5 mr-2 text-base-content"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
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
                <svg
                  className="h-5 w-5 mr-2 text-base-content"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
                Direct Messages
              </Link>
            </li>

            <li>
              <Link
                href="/notifications"
                className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
              >
                <svg
                  className="h-5 w-5 mr-2 text-base-content"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                Notifications
              </Link>
            </li>

            <li>
              <Link
                href="/settings"
                className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
              >
                <svg
                  className="h-5 w-5 mr-2 text-base-content"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
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
              <svg
                className="h-5 w-5 mr-2 text-base-content"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              Source
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="flex items-center p-2 rounded-lg hover:bg-base-200 transition-colors"
            >
              <svg
                className="h-5 w-5 mr-2 text-base-content"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
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