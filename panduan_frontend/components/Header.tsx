import { Bell, Globe, Calendar, Settings, Sun, Moon, User } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface HeaderProps {
  isDark: boolean;
  toggleDarkMode: () => void;
}

export function Header({ isDark, toggleDarkMode }: HeaderProps) {
  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Logo and App Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#4CA771] rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">Karwanua</span>
        </div>

        {/* Center: Navigation Menu */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-[#4CA771] font-medium">Dashboard</a>
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-[#4CA771] transition-colors">Datasets</a>
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-[#4CA771] transition-colors">Insights</a>
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-[#4CA771] transition-colors">Reports</a>
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-[#4CA771] transition-colors">Settings</a>
        </nav>

        {/* Right: User Controls */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
              3
            </Badge>
          </Button>

          {/* Dark Mode Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* User Avatar */}
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}