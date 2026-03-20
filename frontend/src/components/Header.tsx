
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
    </header>
  );
}