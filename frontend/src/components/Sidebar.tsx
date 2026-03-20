import { NavLink } from "react-router-dom";

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
}

export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const navItems = [
    { to: "/", icon: "fa-solid fa-home", label: "Dashboard" },
    { to: "/patients", icon: "fa-solid fa-users", label: "Patients" },
  ];

  return (
    <aside
      className={`
        fixed sm:static inset-y-0 left-0 z-40
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        sm:translate-x-0
        w-64 h-screen bg-[#0a192f] border-r border-gray-700
        flex flex-col
      `}
    >
      <div className="h-16 flex items-center px-6 border-b border-gray-700">
        <span className="text-xl font-bold text-white tracking-wide">
          Savant
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg
              ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`
            }
          >
            <i className={`${item.icon} w-5 text-center`} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}