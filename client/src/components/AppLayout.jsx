import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function AppLayout() {
  const { user, isLoading, logout } = useAuth0();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <header>
        <h1>NEU TODOs App</h1>
        <nav>
          <ul>
            <li>
              <Link to="/app/layout">Profile</Link>
            </li>
            <li>
              <Link to="/app/layout/todos">TODOs</Link>
            </li>
            <li>
              <Link to="/app/layout/debugger">Auth Debugger</Link>
            </li>
            <li>
              <button
                className="exit-button"
                onClick={() =>
                  logout({ returnTo: window.location.origin })
                }
              >
                Log Out
              </button>
            </li>
          </ul>
        </nav>
        <div>
          Welcome{" "}
          <span role="heading" aria-level="2">
            👋 {user.name}
          </span>{" "}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

