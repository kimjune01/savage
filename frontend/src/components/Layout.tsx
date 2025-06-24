import { Outlet, Link, useLocation } from 'react-router-dom';
import { Palette, Zap, BarChart3 } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  const navigation = [
    { name: 'Generate', href: '/', icon: Palette },
    { name: 'Icon Set', href: '/icon-set', icon: Zap },
    { name: 'Analyze', href: '/analyze', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Savage SVG
              </span>
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/50'
                        : 'text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}