'use client';

import Link from 'next/link';

const Drawer = ({ isOpen, toggleSidebar }) => {
  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-[#F8F8F8] h-screen p-4 absolute z-10">
      <h1 className="text-xl font-bold mb-4">FlowChat</h1>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/forum" className="block p-2 rounded hover:bg-gray-200">Forum</Link>
          </li>
          <li>
            <Link href="/latest" className="block p-2 rounded hover:bg-gray-200">Latest</Link>
          </li>
          <li>
            <Link href="/popular" className="block p-2 rounded hover:bg-gray-200">Popular</Link>
          </li>
          <li>
            <Link href="/following" className="block p-2 rounded hover:bg-gray-200">Following</Link>
          </li>
          <li>
            <Link href="/direct-messages" className="block p-2 rounded hover:bg-gray-200">Direct Messages</Link>
          </li>
          <li>
            <Link href="/notifications" className="block p-2 rounded hover:bg-gray-200">Notifications</Link>
          </li>
          <li>
            <Link href="/settings" className="block p-2 rounded hover:bg-gray-200">Settings</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Drawer;