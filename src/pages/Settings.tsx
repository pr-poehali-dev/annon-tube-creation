
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { 
  Sun, 
  Moon, 
  Languages, 
  Check,
  User,
  Globe,
  Heart,
  Camera,
  Calendar,
  Upload
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface UserProfile {
  username: string;
  displayName: string;
  email: string;
  bio: string;
  website: string;
  avatar: string;
  country: string;
  interests: string[];
  age: number;
  isPrivate: boolean;
}

const defaultProfile: UserProfile = {
  username: "anon_user",
  displayName: "Анонимный пользователь",
  email: "user@example.com",
  bio: "",
  website: "",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  country: "Россия",
  interests: [],
  age: 0,
  isPrivate: false
};

const countries = [
  "Россия", "Украина", "Беларусь", "Казахстан", "США", "Великобритания", 
  "Германия", "Франция", "Италия", "Испания", "Канада", "Китай", "Япония"
];

const popularInterests = [
  "Программирование", "Кино", "Музыка", "Фотография", "Спорт", 
  "Путешествия", "Кулинария", "Игры", "Книги", "Искусство"
];

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<string>("ru");
  const [showNSFW, setShowNSFW] = useState(false);
  const [showNSFL, setShowNSFL] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [interestInput, setInterestInput] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Prevent hydration mismatch by only rendering client-side
  useEffect(() => {
    setMounted(true);
    
    // Load saved preferences from localStorage
    const savedLanguage = localStorage.getItem("preferred-language");
    const savedShowNSFW = localStorage.getItem("show-nsfw") === "true";
    const savedShowNSFL = localStorage.getItem("show-nsfl") === "true";
    const savedProfile = localStorage.getItem("user-profile");
    
    if (savedLanguage) setLanguage(savedLanguage);
    setShowNSFW(savedShowNSFW);
    setShowNSFL(savedShowNSFL);
    
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
      } catch (error) {
        console.error("Ошибка при загрузке профиля:", error);
      }
    }
  }, []);

  const languages = [
    { code: "ru", name: "Русский" },
    { code: "en", name: "English" },
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

  const handleProfileChange = (field: keyof UserProfile, value: string | boolean | number | string[]) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error("Пожалуйста, выберите изображение");
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Размер файла не должен превышать 5MB");
      return;
    }
    
    setAvatarFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarPreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const addInterest = () => {
    if (!interestInput.trim()) return;
    
    // Check if interest already exists
    if (profile.interests.includes(interestInput.trim())) {
      toast.error("Это увлечение уже добавлено");
      return;
    }
    
    // Add interest to the list
    handleProfileChange('interests', [...profile.interests, interestInput.trim()]);
    setInterestInput("");
  };

  const removeInterest = (interest: string) => {
    handleProfileChange('interests', profile.interests.filter(i => i !== interest));
  };

  const saveProfile = () => {
    // Save the profile to localStorage
    localStorage.setItem("user-profile", JSON.stringify({
      ...profile,
      avatar: avatarPreview || profile.avatar, // Update avatar if a new one is selected
    }));
    
    toast.success("Профиль успешно сохранен");
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

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="appearance">Внешний вид</TabsTrigger>
            <TabsTrigger value="content">Контент</TabsTrigger>
            <TabsTrigger value="language">Язык</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Настройки профиля</CardTitle>
                <CardDescription>
                  Управляйте своим профилем и персональной информацией
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Аватар */}
                  <div className="flex flex-col items-center space-y-4 md:w-1/3">
                    <Avatar className="w-32 h-32 border-2 border-primary">
                      <AvatarImage src={avatarPreview || profile.avatar} />
                      <AvatarFallback>{profile.displayName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center">
                      <Label htmlFor="avatar" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Изменить аватар
                      </Label>
                      <Input 
                        id="avatar" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarChange}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Рекомендуемый размер: 400x400 пикселей
                      </p>
                    </div>
                  </div>

                  {/* Основная информация */}
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Никнейм</Label>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="username"
                            value={profile.username}
                            onChange={(e) => handleProfileChange('username', e.target.value)}
                            placeholder="Ваш уникальный никнейм"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Отображаемое имя</Label>
                        <Input 
                          id="displayName"
                          value={profile.displayName}
                          onChange={(e) => handleProfileChange('displayName', e.target.value)}
                          placeholder="Имя, которое будет видно другим пользователям"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          placeholder="Ваш email адрес"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="age">Возраст</Label>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="age"
                            type="number"
                            min="0"
                            max="120"
                            value={profile.age || ""}
                            onChange={(e) => handleProfileChange('age', parseInt(e.target.value) || 0)}
                            placeholder="Ваш возраст"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country">Страна</Label>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <Select 
                            value={profile.country} 
                            onValueChange={(value) => handleProfileChange('country', value)}
                          >
                            <SelectTrigger id="country">
                              <SelectValue placeholder="Выберите страну" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="website">Веб-сайт</Label>
                        <Input 
                          id="website"
                          value={profile.website}
                          onChange={(e) => handleProfileChange('website', e.target.value)}
                          placeholder="Ваш веб-сайт или соцсеть"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">О себе</Label>
                      <Textarea 
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => handleProfileChange('bio', e.target.value)}
                        placeholder="Расскажите немного о себе"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Увлечения */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Увлечения
                  </Label>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.interests.map((interest) => (
                      <div 
                        key={interest} 
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1"
                      >
                        <span>{interest}</span>
                        <button 
                          onClick={() => removeInterest(interest)}
                          className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {profile.interests.length === 0 && (
                      <p className="text-sm text-muted-foreground italic">Добавьте ваши увлечения, чтобы найти единомышленников</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input 
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      placeholder="Добавьте увлечение"
                      onKeyDown={(e) => e.key === 'Enter' && addInterest()}
                    />
                    <Button onClick={addInterest}>Добавить</Button>
                  </div>
                  
                  {/* Популярные увлечения */}
                  <div className="mt-2">
                    <Label className="text-sm mb-1 block">Популярные увлечения</Label>
                    <div className="flex flex-wrap gap-2">
                      {popularInterests.map((interest) => (
                        <button
                          key={interest}
                          onClick={() => {
                            if (!profile.interests.includes(interest)) {
                              handleProfileChange('interests', [...profile.interests, interest]);
                            }
                          }}
                          disabled={profile.interests.includes(interest)}
                          className={`text-xs px-2 py-1 rounded-full ${
                            profile.interests.includes(interest) 
                              ? 'bg-primary/50 text-primary-foreground cursor-not-allowed opacity-50' 
                              : 'bg-muted hover:bg-muted/80 cursor-pointer'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Приватность */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="privacy">Приватный профиль</Label>
                    <p className="text-sm text-muted-foreground">
                      Ограничивает доступ к вашему профилю только для подписчиков
                    </p>
                  </div>
                  <Switch
                    id="privacy"
                    checked={profile.isPrivate}
                    onCheckedChange={(checked) => handleProfileChange('isPrivate', checked)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveProfile} className="bg-green-600 hover:bg-green-700">
                  Сохранить изменения
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

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
