import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { Bell, Search, Menu, ChevronDown } from "lucide-react";

export function Header({ onOpenSidebar }) {
=======
import { Bell, Search, Menu, ChevronDown, LogOut } from "lucide-react";

export function Header({ onOpenSidebar, onLogout }) {
>>>>>>> ffc9429 (initial frontend commit)
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden" 
          onClick={onOpenSidebar}
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </Button>

        <div className="flex items-center gap-1.5 ml-2 lg:ml-0">
          <span className="font-bold text-gray-900 text-base sm:text-lg">Pharmacy </span>
          <span className="hidden sm:inline font-semibold text-gray-800 text-lg">Inventory</span>
        </div>

        <div className="hidden md:flex flex-1 max-w-50 mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input 
              type="search"
              placeholder="Search..." 
              className="w-full h-8 pl-8 pr-4 bg-gray-50 border-none rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
<<<<<<< HEAD
=======
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="hidden sm:flex items-center gap-1.5 text-gray-500 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>

>>>>>>> ffc9429 (initial frontend commit)
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
          </Button>
          
          <div className="flex items-center gap-2 border-l pl-4">
            <img 
<<<<<<< HEAD
              src="" 
=======
              src="https://api.dicebear.com/9.x/initials/svg?seed=Inventory" 
>>>>>>> ffc9429 (initial frontend commit)
              className="h-8 w-8 rounded-full object-cover border"
              alt="User"
            />
            <ChevronDown className="hidden sm:block h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> ffc9429 (initial frontend commit)
