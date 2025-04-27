import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Upload,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  FilmIcon,
  User,
  Sun,
  Moon,
  Video
} from "lucide-react";
import { useTheme } from "next-themes";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/" className="flex items-center gap-2">
            <Video className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">АнонТуб</span>
          </Link>
          
          <form onSubmit={handleSearch} className="hidden md:flex relative">
            <Input
              type="search"
              placeholder="Поиск видео..."
              className="w-full md:w-[300px] pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </form>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="hidden md:flex">
            <Link 
              to="/" 
              className={location.pathname === "/" ? "text-green-600" : ""}
            >
              <Home className="h-5 w-5" />
            </Link>
          </Button>
          
          <Button asChild variant="ghost" size="icon" className="hidden md:flex">
            <Link 
              to="/shorts" 
              className={location.pathname.includes("/shorts") ? "text-green-600" : ""}
            >
              <FilmIcon className="h-5 w-5" />
            </Link>
          </Button>

          <Button asChild variant="ghost" size="icon" className="hidden md:flex">
            <Link 
              to="/upload"
              className={location.pathname === "/upload" ? "text-green-600" : ""}
            >
              <Upload className="h-5 w-5" />
            </Link>
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden md:flex"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button variant="ghost" onClick={() => navigate("/search")} size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="User" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Профиль</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Настройки</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Выйти</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="md:hidden">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Поиск видео..."
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </form>
            
            <div className="space-y-2">
              <Button 
                asChild 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/" className="flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  <span>Главная</span>
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/shorts" className="flex items-center">
                  <FilmIcon className="h-5 w-5 mr-2" />
                  <span>Shorts</span>
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/upload" className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  <span>Загрузить</span>
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/settings" className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  <span>Настройки</span>
                </Link>
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  setIsMenuOpen(false);
                }}
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-5 w-5 mr-2" />
                    <span>Светлая тема</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5 mr-2" />
                    <span>Темная тема</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
