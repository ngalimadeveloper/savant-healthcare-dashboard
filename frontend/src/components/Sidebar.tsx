import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
}

export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const location = useLocation();
  const isManagePatientsPage = location.pathname === "/patients";
  const isPatientViewPage =
    location.pathname.startsWith("/patients/") && location.pathname !== "/patients";

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
          Savant Health
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {isManagePatientsPage && (
          <Link
            to="/patients?add=true"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border font-medium bg-blue-600/20 text-blue-300 border-blue-500/30 hover:bg-blue-600/30"
          >
            <i className="fa-solid fa-user-plus w-5 text-center" />
            <span>Add Patient</span>
          </Link>
        )}

        {isPatientViewPage && (
          <>
            <Link
              to={`${location.pathname}?action=add-note`}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg border font-medium bg-blue-600/20 text-blue-300 border-blue-500/30 hover:bg-blue-600/30"
            >
              <i className="fa-solid fa-note-sticky w-5 text-center" />
              <span>Add Note</span>
            </Link>

            <Link
              to={`${location.pathname}?action=edit`}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg border font-medium bg-blue-600/20 text-blue-300 border-blue-500/30 hover:bg-blue-600/30"
            >
              <i className="fa-solid fa-pen w-5 text-center" />
              <span>Edit Patient</span>
            </Link>

            <Link
              to={`${location.pathname}?action=delete`}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg border font-medium bg-red-600/10 text-red-300 border-red-500/30 hover:bg-red-600/20"
            >
              <i className="fa-solid fa-trash w-5 text-center" />
              <span>Delete Patient</span>
            </Link>
          </>
        )}

        {!isManagePatientsPage && !isPatientViewPage && (
          <p className="text-sm text-gray-400 px-3">No actions on this page.</p>
        )}
      </nav>
    </aside>
  );
}