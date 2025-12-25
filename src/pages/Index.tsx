import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import VideoCard from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import func2url from "../../backend/func2url.json";

// Типы для видео, используемые в компоненте
interface Video {
  id: string;
  title: string;
  thumbnail: string;
  author: {
    name: string;
    avatar: string;
  };
  views: number;
  likes: number;
  dislikes: number;
  uploadedAt: Date;
  duration: number;
  isNsfw?: boolean;
  isNsfl?: boolean;
}

const categories = [
  { id: "all", name: "Все" },
  { id: "trending", name: "Популярное" },
  { id: "music", name: "Музыка" },
  { id: "gaming", name: "Игры" },
  { id: "news", name: "Новости" },
  { id: "entertainment", name: "Развлечения" },
  { id: "education", name: "Образование" },
  { id: "technology", name: "Технологии" },
  { id: "sports", name: "Спорт" },
  { id: "other", name: "Другое" },
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${func2url['get-videos']}?type=regular&category=${activeCategory}&limit=50`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка загрузки видео');
        }
        
        const processedVideos = data.videos.map((video: any) => ({
          id: video.id,
          title: video.title,
          thumbnail: video.thumbnail,
          author: video.author,
          views: video.views,
          likes: video.likes,
          dislikes: video.dislikes,
          uploadedAt: new Date(video.uploadedAt),
          duration: video.duration,
          isNsfw: video.isNsfw,
          isNsfl: video.isNsfl
        }));
        
        if (processedVideos.length === 0 && activeCategory === "all") {
          const now = new Date();
          const demoVideos = generateDemoVideos(now);
          setVideos(demoVideos);
        } else {
          setVideos(processedVideos);
        }
      } catch (err: any) {
        console.error('Error fetching videos:', err);
        setError(err.message || "Ошибка при загрузке видео");
        
        const now = new Date();
        const demoVideos = generateDemoVideos(now);
        setVideos(demoVideos);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [activeCategory]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        {/* Категории */}
        <div className="mb-6">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-2 pb-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category.id)}
                  className="rounded-full px-4"
                >
                  {category.name}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Содержимое */}
        <Tabs defaultValue="videos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="videos">Видео</TabsTrigger>
            <TabsTrigger value="shorts">Shorts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Попробовать снова</Button>
              </div>
            ) : videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    id={video.id}
                    title={video.title}
                    thumbnail={video.thumbnail}
                    author={video.author}
                    views={video.views}
                    likes={video.likes}
                    dislikes={video.dislikes}
                    uploadedAt={new Date(video.uploadedAt)}
                    duration={video.duration}
                    isNsfw={video.isNsfw}
                    isNsfl={video.isNsfl}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">
                  {activeCategory === "all" 
                    ? "Нет доступных видео. Загрузите свое первое видео!" 
                    : `Нет видео в категории "${categories.find(cat => cat.id === activeCategory)?.name}"`}
                </p>
                <Button asChild>
                  <Link to="/upload">Загрузить видео</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="shorts" className="space-y-6">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium mb-2">Shorts</h3>
              <p className="text-muted-foreground mb-4">
                Смотрите короткие вертикальные видео
              </p>
              <Button asChild>
                <Link to="/shorts">Смотреть Shorts</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Функция для создания демо-видео
const generateDemoVideos = (baseDate: Date): Video[] => {
  // Создаем даты для демо-видео (1, 3 и 5 дней назад)
  const date1 = new Date(baseDate);
  date1.setDate(baseDate.getDate() - 1);
  
  const date3 = new Date(baseDate);
  date3.setDate(baseDate.getDate() - 3);
  
  const date5 = new Date(baseDate);
  date5.setDate(baseDate.getDate() - 5);
  
  return [
    {
      id: "demo-video",
      title: "Introduction to AnnonTube - The Anonymous Video Platform",
      thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      author: {
        name: "AnnonTube Official",
        avatar: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      },
      views: 15423,
      likes: 3254,
      dislikes: 42,
      uploadedAt: date3,
      duration: 425 // 7:05
    },
    {
      id: "demo-video-2", // На эту страницу нельзя перейти, это только для отображения
      title: "Как использовать все возможности платформы",
      thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      author: {
        name: "AnnonTube Official",
        avatar: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      },
      views: 8743,
      likes: 1298,
      dislikes: 25,
      uploadedAt: date1,
      duration: 583 // 9:43
    },
    {
      id: "demo-video-3", // На эту страницу нельзя перейти, это только для отображения
      title: "Политика конфиденциальности и правила сообщества",
      thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      author: {
        name: "AnnonTube Official",
        avatar: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      },
      views: 5421,
      likes: 987,
      dislikes: 34,
      uploadedAt: date5,
      duration: 362 // 6:02
    }
  ];
};

export default Index;