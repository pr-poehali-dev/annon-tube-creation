
import { useState } from "react";
import { useTheme } from "next-themes";
import { 
  Sun, 
  Moon, 
  Languages, 
  EyeOff,
  Eye,
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

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("en");
  const [showNSFW, setShowNSFW] = useState(false);
  const [showNSFL, setShowNSFL] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" }
  ];

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    // В реальном приложении здесь будет логика смены языка
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="language">Language</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>
                  Customize how AnnonTube looks for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Choose theme</Label>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      className={theme === "light" ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={() => handleThemeChange("light")}
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                      {theme === "light" && <Check className="ml-2 h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      className={theme === "dark" ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={() => handleThemeChange("dark")}
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                      {theme === "dark" && <Check className="ml-2 h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      className={theme === "system" ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={() => handleThemeChange("system")}
                    >
                      System
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
                <CardTitle>Content Preferences</CardTitle>
                <CardDescription>
                  Manage what type of content you want to see in recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="show-nsfw">Show NSFW content</Label>
                    <p className="text-sm text-muted-foreground">
                      Not Safe For Work: Adult content that may be inappropriate in public
                    </p>
                  </div>
                  <Switch
                    id="show-nsfw"
                    checked={showNSFW}
                    onCheckedChange={setShowNSFW}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="show-nsfl">Show NSFL content</Label>
                    <p className="text-sm text-muted-foreground">
                      Not Safe For Life: Extremely graphic or disturbing content
                    </p>
                  </div>
                  <Switch
                    id="show-nsfl"
                    checked={showNSFL}
                    onCheckedChange={setShowNSFL}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle>Language Settings</CardTitle>
                <CardDescription>
                  Choose your preferred language for the interface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-xs">
                  <Label htmlFor="language-select" className="mb-2 block">
                    Interface Language
                  </Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language-select" className="w-full">
                      <SelectValue placeholder="Select language" />
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
