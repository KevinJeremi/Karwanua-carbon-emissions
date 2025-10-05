import { Search } from "lucide-react";

interface NavbarProps {
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

export default function Navbar({ currentPage = "dashboard", onPageChange }: NavbarProps) {
  const handlePageClick = (page: string) => {
    if (onPageChange) {
      onPageChange(page);
    } else if (page === "analytics") {
      window.showAnalytics && window.showAnalytics();
    } else if (page === "dashboard") {
      window.location.reload();
    }
  };

  return (
    <nav className="flex items-center justify-between px-4 py-4 text-white">
      <div className="flex items-center space-x-3">
        <div className="w-3 h-3 bg-greenish-light rounded-full animate-pulse"></div>
        <h1 className="font-bold text-xl">greenish</h1>
      </div>
      <ul className="hidden md:flex space-x-8 text-sm">
        <li 
          className={`cursor-pointer transition-colors ${
            currentPage === "dashboard" 
              ? "font-semibold text-white" 
              : "text-white/70 hover:text-white"
          }`}
          onClick={() => handlePageClick("dashboard")}
        >
          Dashboard
        </li>
        <li 
          className={`cursor-pointer transition-colors ${
            currentPage === "analytics" 
              ? "font-semibold text-white" 
              : "text-white/70 hover:text-white"
          }`}
          onClick={() => handlePageClick("analytics")}
        >
          Analytics
        </li>
        <li className="cursor-pointer text-white/70 hover:text-white transition-colors">Management</li>
        <li className="cursor-pointer text-white/70 hover:text-white transition-colors">Task History</li>
      </ul>
      <div className="flex items-center space-x-3">
        <div className="bg-white/10 rounded-full px-3 py-2 flex items-center gap-2 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none text-sm placeholder-white/60 w-32"
          />
        </div>
        <div className="w-8 h-8 bg-white/20 rounded-full hover:bg-white/30 transition-colors cursor-pointer"></div>
      </div>
    </nav>
  );
}