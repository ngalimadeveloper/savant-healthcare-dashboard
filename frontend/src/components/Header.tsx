
import { NavLink } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 flex items-center px-6 bg-white border-b border-gray-200">
      <button
        onClick={onMenuClick}
        className="sm:hidden text-gray-600 hover:text-gray-900"
      >
        <i className="fa-solid fa-bars text-xl" />
      </button>

      <nav className="hidden sm:flex items-center gap-2 ml-4">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg text-sm font-medium ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/patients"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg text-sm font-medium ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`
          }
        >
          Manage Patients
        </NavLink>
      </nav>
    </header>
  );
}