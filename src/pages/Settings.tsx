
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { 
  Sun, 
  Moon, 
  Languages, 
  Check 
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<string>("en");
  const [showNSFW, setShowNSFW] = useState(false);
  const [showNSFL, setShowNSFL] = useState(false);

  // Prevent hydration mismatch by only rendering client-side
  useEffect(() => {
    setMounted(true);
    
    // Load saved preferences from localStorage
    const savedLanguage = localStorage.getItem("preferred-language");
    const savedShowNSFW = localStorage.getItem("show-nsfw") === "true";
    const savedShowNSFL = localStorage.getItem("show-nsfl") === "true";
    
    if (savedLanguage) setLanguage(savedLanguage);
    setShowNSFW(savedShowNSFW);
    setShowNSFL(savedShowNSFL);
  }, []);

  const languages = [
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" }
  ];

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem("preferred-language", value);
    
    // Simulate language change
    document.documentElement.lang = value;
    toast.success(`Язык интерфейса изменен на ${languages.find(l => l.code === value)?.name || value}`);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast.success(`Тема оформления изменена на ${
      newTheme === "light" ? "светлую" : 
      newTheme === "dark" ? "темную" : "системную"
    }`);
  };
  
  const handleNSFWChange = (checked: boolean) => {
    setShowNSFW(checked);
    localStorage.setItem("show-nsfw", String(checked));
    toast.success(checked 
      ? "NSFW контент будет отображаться в рекомендациях" 
      : "NSFW контент скрыт из рекомендаций");
  };
  
  const handleNSFLChange = (checked: boolean) => {
    setShowNSFL(checked);
    localStorage.setItem("show-nsfl", String(checked));
    toast.success(checked 
      ? "NSFL контент будет отображаться в рекомендациях" 
      : "NSFL контент скрыт из рекомендаций");
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return <div className="min-h-screen bg-background"></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Настройки</h1>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="appearance">Внешний вид</TabsTrigger>
            <TabsTrigger value="content">Контент</TabsTrigger>
            <TabsTrigger value="language">Язык</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Настройки темы</CardTitle>
                <CardDescription>
                  Настройте внешний вид AnnonTube по своему вкусу
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Выберите тему</Label>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      className={theme === "light" ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={() => handleThemeChange("light")}
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      Светлая
                      {theme === "light" && <Check className="ml-2 h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      className={theme === "dark" ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={() => handleThemeChange("dark")}
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      Темная
                      {theme === "dark" && <Check className="ml-2 h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      className={theme === "system" ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={() => handleThemeChange("system")}
                    >
                      Системная
                      {theme === "system" && <Check className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Настройки контента</CardTitle>
                <CardDescription>
                  Управляйте типами контента, которые будут отображаться в рекомендациях
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="show-nsfw">Показывать NSFW контент</Label>
                    <p className="text-sm text-muted-foreground">
                      Not Safe For Work: Контент для взрослых, который может быть неуместен в общественных местах
                    </p>
                  </div>
                  <Switch
                    id="show-nsfw"
                    checked={showNSFW}
                    onCheckedChange={handleNSFWChange}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="show-nsfl">Показывать NSFL контент</Label>
                    <p className="text-sm text-muted-foreground">
                      Not Safe For Life: Крайне графический или тревожный контент
                    </p>
                  </div>
                  <Switch
                    id="show-nsfl"
                    checked={showNSFL}
                    onCheckedChange={handleNSFLChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle>Настройки языка</CardTitle>
                <CardDescription>
                  Выберите предпочитаемый язык интерфейса
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-xs">
                  <Label htmlFor="language-select" className="mb-2 block">
                    Язык интерфейса
                  </Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language-select" className="w-full">
                      <SelectValue placeholder="Выберите язык" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center">
                            <span>{lang.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
