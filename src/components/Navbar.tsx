
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, Upload, Settings, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="mt-6 space-y-1">
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link to="/">
                    <span>Главная</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link to="/trending">
                    <span>В тренде</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link to="/subscriptions">
                    <span>Подписки</span>
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-green-600">Annon</span>
            <span>Tube</span>
          </Link>
        </div>
        
        <form onSubmit={handleSearch} className="hidden md:flex items-center w-full max-w-lg mx-4">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Поиск видео..."
              className="w-full pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Поиск</span>
            </Button>
          </div>
        </form>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Переключить тему</span>
          </Button>
          
          <Button asChild variant="ghost" size="icon">
            <Link to="/settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Настройки</span>
            </Link>
          </Button>
          
          <Button asChild variant="default" className="hidden sm:flex bg-green-600 hover:bg-green-700">
            <Link to="/upload">
              <Upload className="h-4 w-4 mr-2" />
              <span>Загрузить</span>
            </Link>
          </Button>
          
          <form onSubmit={handleSearch} className="md:hidden">
            <Button type="submit" variant="ghost" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Поиск</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
