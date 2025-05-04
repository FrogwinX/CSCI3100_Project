"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass, faXmark, faUser, faCog } from "@fortawesome/free-solid-svg-icons";
import { faComments, faPaperPlane, faBell, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { logout } from "@/utils/authentication";
import { useSession } from "@/hooks/useSession";
import UserAvatar from "@/components/users/UserAvatar";

export default function NavbarWithDrawer() {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const pathname = usePathname();
  const { session, refresh, unreadCount, refreshUnreadCount } = useSession();
  const router = useRouter();

  // Check if a path is active
  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await logout();
    // Refresh session to update the UI
    await refresh();
    // Redirect to login page
    router.push("/login");
  };

  const toggleSidebar = (): void => {
    setSidebarOpen((prev) => !prev);
    refreshUnreadCount(); // Refresh unread count when sidebar is opened
  };

  const toggleSearch = (): void => {
    setSearchOpen((prev) => !prev);
  };

  // Handle search submission
  const handleSearch = (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/forum/search-results?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      if (isSearchOpen) toggleSearch(); // Close mobile search bar after search
    }
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-md px-4 z-50 fixed top-0">
        {isSearchOpen ? (
          // Mobile Search UI - Replaces navbar content when active
          <form onSubmit={handleSearch} className="w-full flex items-center sm:hidden">
            <button type="button" onClick={toggleSearch} className="btn btn-ghost btn-circle mr-2 flex-none">
              <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>
            <div className="relative flex-1 h-10">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
              <input
                type="text"
                placeholder="Search FlowChat"
                className="w-full h-full rounded-full bg-base-200 pl-10 pr-4 border-base-300"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-ghost btn-circle ml-2">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>
        ) : (
          // Regular Navbar Content
          <>
            <div className="navbar-start">
              <button onClick={toggleSidebar} className="btn btn-ghost">
                <FontAwesomeIcon icon={faBars} size="2xl" />
              </button>
              <Link href="/">
                <div className="flex items-center mx-2 gap-2">
                  <div>
                    <Image
                      src={"/favicon.ico"}
                      alt="FlowChat Logo"
                      width={40}
                      height={40}
                      className="min-w-6 min-h-6"
                    />
                  </div>
                  <div className="hidden md:block text-2xl lg:text-3xl font-black tracking-tight">FlowChat</div>
                </div>
              </Link>
            </div>

            <div className="navbar-center">
              <form onSubmit={handleSearch} className="relative hidden sm:block w-full max-w-sm min-w-sm lg:min-w-lg h-10">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
                <input
                  type="text"
                  placeholder="Search FlowChat"
                  className="bg-base-300 w-full h-full rounded-full text-sm pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="hidden"></button>
              </form>
            </div>

            <div className="navbar-end">
              {/* Mobile Search Button*/}
              <button className="sm:hidden btn btn-ghost btn-circle" onClick={toggleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
              </button>

              {/* User Avatar */}
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                  <UserAvatar src={session.avatar!} size="md" />
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box shadow">
                  {session.isLoggedIn ? (
                    /* Logged in menu */
                    <>
                      <li>
                        <Link href="/profile">
                          <FontAwesomeIcon icon={faUser} />
                          Profile
                        </Link>
                      </li>
                      <div className="divider my-0"></div>
                      <li>
                        <button onClick={handleLogout}>Sign out</button>
                      </li>
                    </>
                  ) : (
                    /* Not logged in menu */
                    <>
                      <li>
                        <Link href="/login">Login</Link>
                      </li>
                      <li>
                        <Link href="/register">Register</Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add a spacer div to prevent content from hiding under the navbar */}
      <div className="h-16"></div>

      <aside
        className={`h-[calc(100vh-4rem)] shadow bg-base-100 fixed top-16 z-40 transition-transform duration-300 flex flex-col p-4 w-[85vw] sm:w-70 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex-grow overflow-y-auto">
          <ul className="menu bg-base-100 w-full space-y-3">
            <li>
              <details open>
                <summary className="flex gap-4">
                  <FontAwesomeIcon icon={faComments} size="xl" />
                  <span>Forum</span>
                </summary>
                <ul className="ml-2 mt-2 space-y-2">
                  <li>
                    <Link href="/forum/latest" className={isActive("/forum/latest") ? "bg-base-300 font-bold" : ""}>
                      Latest
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/forum/recommended"
                      className={isActive("/forum/recommended") ? "bg-base-300 font-bold" : ""}
                    >
                      Recommended
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/forum/following"
                      className={isActive("/forum/following") ? "bg-base-300 font-bold" : ""}
                    >
                      Following
                    </Link>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <Link
                href="/messages"
                className={`flex items-center gap-4 ${isActive("/direct-messages") ? "bg-base-300 font-bold" : ""}`}
              >
                <FontAwesomeIcon icon={faPaperPlane} size="xl" />
                <div className="indicator w-full">
                  {unreadCount > 0 && <span className="indicator-item badge badge-primary">{unreadCount}</span>}
                  <div className="">Direct Messages</div>
                </div>
              </Link>
            </li>

            <li>
              <Link
                href="/settings"
                className={`flex items-center gap-4 ${isActive("/settings") ? "bg-base-300 font-bold" : ""}`}
              >
                <FontAwesomeIcon icon={faCog} size="xl" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="mt-auto pt-4">
          <div className="divider m-0"></div>
          <ul className="menu bg-base-100 w-full space-y-3">
            <li>
              <a
                href="https://github.com/FrogwinX/CSCI3100_Project"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4"
              >
                <FontAwesomeIcon icon={faGithub} size="xl" />
                <span>Source</span>
              </a>
            </li>
            <li>
              <a href="mailto:contact@example.com?subject=Query%20About%20FlowChat" className="flex items-center gap-4">
                <FontAwesomeIcon icon={faEnvelope} size="xl" />
                <span>Contact</span>
              </a>
            </li>
          </ul>
          <footer className="footer footer-center text-base-content text-xs opacity-50 mt-4">
            <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
          </footer>
        </div>
      </aside>
    </>
  );
}
