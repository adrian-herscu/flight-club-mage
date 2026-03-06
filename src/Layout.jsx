import { Link } from "wasp/client/router";
import { useAuth, logout } from "wasp/client/auth";
import { Outlet } from "react-router";
import "./Main.css";

export const Layout = () => {
  const { data: user } = useAuth();

  const displayName = user?.username || 'Student';

  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary-800 text-white p-4">
        <div className="container mx-auto px-4 py-2 flex justify-between">
          <Link to="/">
            <h1 className="text-xl2 font-semibold">flightClubMage</h1>
          </Link>
          { user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-600 border border-white/30 flex items-center justify-center text-sm font-semibold">
                {firstLetter}
              </div>
              <span>
                Hi, {displayName}!{' '}
                <button onClick={logout} className="text-xl2 underline">
                  (Log out)
                </button>
              </span>
            </div>
          ) : (
            <Link to="/login">
              <h1 className="text-xl2 underline">Log in</h1>
            </Link>
          )}
        </div>
      </header>
      <main className="container mx-auto px-4 py-2 grow">
        <Outlet />
      </main>
      <footer>
        <div className="container mx-auto p-4">
          <p className="text-center text-gray-500 text-sm">
            flightClubMage ~ Powered by Wasp
          </p>
        </div>
      </footer>
    </div>
  );
};