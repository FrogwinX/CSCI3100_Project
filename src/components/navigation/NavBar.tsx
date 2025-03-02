"use client";

import { useAuth } from "@/hooks/useAuth";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <div className="btn btn-ghost text-xl">FlowChat</div>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="bg-neutral-content rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-lg font-bold">
                {user ? user.name.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
