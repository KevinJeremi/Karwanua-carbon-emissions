export function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Data Source */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Data Source:</span> NASA EarthData, Giovanni, POWER API
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#4CA771] transition-colors">
              About
            </a>
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#4CA771] transition-colors">
              API Docs
            </a>
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#4CA771] transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#4CA771] transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}